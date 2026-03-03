import { IBoardEntity } from "@/core/entities/IPlayer";
import { GameEngine } from "@/core/use-cases/GameEngine";
import { sleep } from "../sleep";
import { addRevealedId, findReactiveTrap, removeRevealedId } from "../trapPreview";
import { PLAYER_POST_RESOLUTION_MS, PLAYER_TRAP_PREVIEW_MS } from "./constants";
import { IUsePlayerActionsParams } from "./types";

interface IHandleOpponentEntityClickParams extends Pick<
  IUsePlayerActionsParams,
  | "activeAttackerId"
  | "applyTransition"
  | "clearSelection"
  | "gameState"
  | "setActiveAttackerId"
  | "setIsAnimating"
  | "setRevealedEntities"
> {
  entity: IBoardEntity | null;
}

export async function handleOpponentEntityClick({
  entity,
  activeAttackerId,
  applyTransition,
  clearSelection,
  gameState,
  setActiveAttackerId,
  setIsAnimating,
  setRevealedEntities,
}: IHandleOpponentEntityClickParams): Promise<"handled" | "pass"> {
  if (!activeAttackerId) {
    if (entity) return "pass";
    return "handled";
  }

  setIsAnimating(true);
  const attackerId = activeAttackerId;
  const targetId = entity?.instanceId;
  clearSelection();

  if (entity && (entity.mode === "DEFENSE" || entity.mode === "SET") && targetId) {
    setRevealedEntities((previous) => addRevealedId(previous, targetId));
    await sleep(800);
  }

  const reactiveTrap = findReactiveTrap(gameState, gameState.playerB.id, "ON_OPPONENT_ATTACK_DECLARED");
  if (reactiveTrap) {
    setRevealedEntities((previous) => addRevealedId(previous, reactiveTrap.instanceId));
    setActiveAttackerId(reactiveTrap.instanceId);
    await sleep(PLAYER_TRAP_PREVIEW_MS);
    setActiveAttackerId(attackerId);
  }

  applyTransition((state) => GameEngine.executeAttack(state, state.playerA.id, attackerId, targetId));
  if (targetId) {
    setRevealedEntities((previous) => removeRevealedId(previous, targetId));
  }
  if (reactiveTrap) {
    await sleep(PLAYER_POST_RESOLUTION_MS);
    setRevealedEntities((previous) => removeRevealedId(previous, reactiveTrap.instanceId));
  }
  setActiveAttackerId(null);
  setIsAnimating(false);
  return "handled";
}
