// src/components/game/board/hooks/internal/player-actions/handleOwnEntityClick.ts - Gestiona clics sobre entidades propias según fase, acciones pendientes y animaciones.
import { IBoardEntity } from "@/core/entities/IPlayer";
import { GameEngine } from "@/core/use-cases/GameEngine";
import { sleep } from "../sleep";
import { addRevealedId, findReactiveTrap, removeRevealedId } from "../trapPreview";
import { PLAYER_POST_RESOLUTION_MS, PLAYER_TRAP_PREVIEW_MS } from "./constants";
import { IUsePlayerActionsParams } from "./types";

interface IHandleOwnEntityClickParams extends Pick<
  IUsePlayerActionsParams,
  | "activeAttackerId"
  | "applyTransition"
  | "clearSelection"
  | "gameState"
  | "pendingFusionSummon"
  | "pendingEntityReplacement"
  | "setActiveAttackerId"
  | "setIsAnimating"
  | "setLastError"
  | "setPendingEntityReplacement"
  | "setPendingFusionSummon"
  | "setPlayingCard"
  | "setRevealedEntities"
  | "setSelectedCard"
> {
  /** Entidad seleccionada por el jugador; `null` si se pulsa una celda vacía. */
  entity: IBoardEntity | null;
}

/**
 * Orquesta la interacción del jugador sobre su propio campo.
 * @param params Dependencias de estado/UI y la entidad objetivo del clic.
 * @returns `handled` si la interacción se consumió en este flujo; `pass` para delegar.
 */
export async function handleOwnEntityClick({
  entity,
  activeAttackerId,
  applyTransition,
  clearSelection,
  gameState,
  pendingFusionSummon,
  pendingEntityReplacement,
  setActiveAttackerId,
  setIsAnimating,
  setLastError,
  setPendingEntityReplacement,
  setPendingFusionSummon,
  setPlayingCard,
  setRevealedEntities,
  setSelectedCard,
}: IHandleOwnEntityClickParams): Promise<"handled" | "pass"> {
  if (!entity) return "pass";

  // Flujo de reemplazo obligatorio cuando la zona de entidades está llena.
  if (pendingEntityReplacement) {
    const replacedState = applyTransition((state) =>
      GameEngine.playCardWithEntityReplacement(
        state,
        state.playerA.id,
        pendingEntityReplacement.cardId,
        pendingEntityReplacement.mode,
        entity.instanceId,
      ),
    );
    if (replacedState) {
      setPendingEntityReplacement(null);
      clearSelection();
    }
    return "handled";
  }

  // Flujo legacy de selección manual para fusión directa desde carta FUSION en mano.
  if (pendingFusionSummon) {
    if (pendingFusionSummon.materials.includes(entity.instanceId)) {
      setPendingFusionSummon({
        ...pendingFusionSummon,
        materials: pendingFusionSummon.materials.filter((id) => id !== entity.instanceId),
      });
      return "handled";
    }
    const nextMaterials = [...pendingFusionSummon.materials, entity.instanceId].slice(0, 2);
    if (nextMaterials.length < 2) {
      setPendingFusionSummon({ ...pendingFusionSummon, materials: nextMaterials });
      return "handled";
    }
    const fusedState = applyTransition((state) =>
      GameEngine.fuseCards(state, state.playerA.id, pendingFusionSummon.cardId, [nextMaterials[0], nextMaterials[1]], pendingFusionSummon.mode),
    );
    if (fusedState) {
      setPendingFusionSummon(null);
      clearSelection();
    }
    return "handled";
  }

  // Flujo de selección de materiales controlado por pendingTurnAction en motor.
  if (gameState.pendingTurnAction?.playerId === gameState.playerA.id && gameState.pendingTurnAction.type === "SELECT_FUSION_MATERIALS") {
    applyTransition((state) => GameEngine.resolvePendingTurnAction(state, state.playerA.id, entity.instanceId));
    return "handled";
  }

  // Activación de ejecución propia con ventana breve para trampa reactiva rival.
  if (entity.card.type === "EXECUTION" && entity.mode === "SET") {
    setIsAnimating(true);
    const activated = applyTransition((state) => GameEngine.changeEntityMode(state, state.playerA.id, entity.instanceId, "ACTIVATE"));
    if (!activated) {
      setIsAnimating(false);
      return "handled";
    }
    clearSelection();
    await sleep(1500);
    const reactiveTrap = findReactiveTrap(gameState, gameState.playerB.id, "ON_OPPONENT_EXECUTION_ACTIVATED");
    if (reactiveTrap) {
      setRevealedEntities((previous) => addRevealedId(previous, reactiveTrap.instanceId));
      setActiveAttackerId(reactiveTrap.instanceId);
      await sleep(PLAYER_TRAP_PREVIEW_MS);
    }
    applyTransition((state) => GameEngine.resolveExecution(state, state.playerA.id, entity.instanceId));
    if (reactiveTrap) {
      await sleep(PLAYER_POST_RESOLUTION_MS);
      setRevealedEntities((previous) => removeRevealedId(previous, reactiveTrap.instanceId));
    }
    setActiveAttackerId(null);
    setIsAnimating(false);
    return "handled";
  }

  // Fuera de combate, el clic solo previsualiza selección de carta.
  if (gameState.phase !== "BATTLE") {
    setSelectedCard(entity.card);
    return "handled";
  }

  // En combate: doble clic sobre el mismo atacante cambia a defensa.
  if (entity.mode !== "ATTACK" || entity.hasAttackedThisTurn) return "handled";
  if (activeAttackerId === entity.instanceId) {
    const changedState = applyTransition((state) => GameEngine.changeEntityMode(state, state.playerA.id, entity.instanceId, "DEFENSE"));
    if (changedState) {
      setActiveAttackerId(null);
      setSelectedCard(entity.card);
    }
    return "handled";
  }
  setActiveAttackerId((previous) => (previous === entity.instanceId ? null : entity.instanceId));
  setSelectedCard(entity.card);
  setPlayingCard(null);
  setLastError(null);
  return "handled";
}
