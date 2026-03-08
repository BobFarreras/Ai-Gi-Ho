// src/components/game/board/hooks/internal/board-state/useBoardTurnControls.ts - Centraliza controles de fase, timer y resolución de acciones pendientes del jugador.
import { MutableRefObject, useCallback } from "react";
import { ICard } from "@/core/entities/ICard";
import { GameEngine, GameState } from "@/core/use-cases/GameEngine";
import { useAutoAdvanceBattle } from "./useAutoAdvanceBattle";
import { useAdvancePhaseGuard } from "./useAdvancePhaseGuard";

interface IUseBoardTurnControlsParams {
  gameState: GameState;
  gameStateRef: MutableRefObject<GameState>;
  selectedCard: ICard | null;
  winnerPlayerId: string | "DRAW" | null;
  isAnimating: boolean;
  isPlayerTurn: boolean;
  isAutoPhaseEnabled: boolean;
  isTurnHelpEnabled: boolean;
  assertPlayerTurn: () => boolean;
  applyTransition: (transition: (state: GameState) => GameState) => GameState | null;
  clearSelection: () => void;
  clearError: () => void;
  disableTurnHelp: () => void;
  setActiveAttackerId: (value: string | null) => void;
  setPlayingCard: (card: ICard | null) => void;
}

interface IUseBoardTurnControlsResult {
  advancePhase: () => void;
  confirmAdvancePhase: (disableHelp: boolean) => void;
  cancelAdvancePhase: () => void;
  pendingAdvanceWarning: "MAIN_SKIP_ACTIONS" | "BATTLE_SKIP_ATTACKS" | null;
  resolvePendingTurnAction: (selectedId: string) => void;
  handleTimerExpired: () => void;
  resolvePendingHandDiscard: (cardId: string) => void;
  setSelectedEntityToAttack: () => void;
  canSetSelectedEntityToAttack: boolean;
}

export function useBoardTurnControls({
  gameState,
  gameStateRef,
  selectedCard,
  winnerPlayerId,
  isAnimating,
  isPlayerTurn,
  isAutoPhaseEnabled,
  isTurnHelpEnabled,
  assertPlayerTurn,
  applyTransition,
  clearSelection,
  clearError,
  disableTurnHelp,
  setActiveAttackerId,
  setPlayingCard,
}: IUseBoardTurnControlsParams): IUseBoardTurnControlsResult {
  const selectedDefenseEntity = selectedCard
    ? gameState.playerA.activeEntities.find(
        (entity) => entity.card.id === selectedCard.id && (entity.mode === "DEFENSE" || entity.mode === "SET") && !entity.hasAttackedThisTurn,
      ) ?? null
    : null;
  const canSetSelectedEntityToAttack = Boolean(selectedDefenseEntity) && !winnerPlayerId && !isAnimating && isPlayerTurn && gameState.phase === "BATTLE" && gameState.pendingTurnAction?.playerId !== gameState.playerA.id;

  const resolvePendingTurnAction = useCallback(
    (selectedId: string) => {
      if (isAnimating || !assertPlayerTurn()) return;
      const nextState = applyTransition((state) => GameEngine.resolvePendingTurnAction(state, state.playerA.id, selectedId));
      if (!nextState) return;
      clearSelection();
      clearError();
    },
    [applyTransition, assertPlayerTurn, clearError, clearSelection, isAnimating],
  );

  const executeAdvancePhase = useCallback(() => {
    if (winnerPlayerId || isAnimating || !assertPlayerTurn()) return;
    const nextState = applyTransition((state) => GameEngine.nextPhase(state));
    if (!nextState) return;
    clearSelection();
    clearError();
  }, [applyTransition, assertPlayerTurn, clearError, clearSelection, isAnimating, winnerPlayerId]);
  const { advancePhase, confirmAdvancePhase, cancelAdvancePhase, pendingAdvanceWarning } = useAdvancePhaseGuard({
    gameState,
    winnerPlayerId,
    isAnimating,
    isTurnHelpEnabled,
    assertPlayerTurn,
    executeAdvancePhase,
    disableTurnHelp,
  });

  useAutoAdvanceBattle({ gameState, gameStateRef, winnerPlayerId, isAnimating, isPlayerTurn, isAutoPhaseEnabled, advancePhase: executeAdvancePhase });

  const handleTimerExpired = useCallback(() => {
    const currentState = gameStateRef.current;
    const hasWinnerNow = currentState.playerA.healthPoints <= 0 || currentState.playerB.healthPoints <= 0;
    if (hasWinnerNow || currentState.activePlayerId !== currentState.playerA.id || isAnimating) return;
    const pendingAction = currentState.pendingTurnAction;
    if (pendingAction?.playerId === currentState.playerA.id) {
      if (pendingAction.type === "DISCARD_FOR_HAND_LIMIT") {
        const leftmostCard = currentState.playerA.hand[0];
        if (leftmostCard) resolvePendingTurnAction(leftmostCard.runtimeId ?? leftmostCard.id);
        return;
      }
      if (pendingAction.type === "SELECT_FUSION_MATERIALS") {
        const available = currentState.playerA.activeEntities
          .map((entity) => entity.instanceId)
          .filter((instanceId) => !pendingAction.selectedMaterialInstanceIds.includes(instanceId));
        const autoPick = available.slice(0, 2 - pendingAction.selectedMaterialInstanceIds.length);
        autoPick.forEach((instanceId) => resolvePendingTurnAction(instanceId));
        return;
      }
      return;
    }
    executeAdvancePhase();
  }, [executeAdvancePhase, gameStateRef, isAnimating, resolvePendingTurnAction]);

  const resolvePendingHandDiscard = useCallback(
    (cardId: string) => {
      if (gameState.pendingTurnAction?.playerId !== gameState.playerA.id || gameState.pendingTurnAction.type !== "DISCARD_FOR_HAND_LIMIT") {
        return;
      }
      resolvePendingTurnAction(cardId);
    },
    [gameState.pendingTurnAction, gameState.playerA.id, resolvePendingTurnAction],
  );
  const setSelectedEntityToAttack = useCallback(() => {
    if (!canSetSelectedEntityToAttack || !selectedDefenseEntity || !assertPlayerTurn()) return;
    const nextState = applyTransition((state) =>
      GameEngine.changeEntityMode(state, state.playerA.id, selectedDefenseEntity.instanceId, "ATTACK"),
    );
    if (!nextState) return;
    setActiveAttackerId(selectedDefenseEntity.instanceId);
    setPlayingCard(null);
    clearError();
  }, [applyTransition, assertPlayerTurn, canSetSelectedEntityToAttack, clearError, selectedDefenseEntity, setActiveAttackerId, setPlayingCard]);

  return {
    advancePhase,
    confirmAdvancePhase,
    cancelAdvancePhase,
    pendingAdvanceWarning,
    resolvePendingTurnAction,
    handleTimerExpired,
    resolvePendingHandDiscard,
    setSelectedEntityToAttack,
    canSetSelectedEntityToAttack,
  };
}
