// src/components/game/board/hooks/internal/board-state/useAdvancePhaseGuard.ts - Encapsula confirmaciones de avance de fase y preferencia de ayuda persistente.
import { useCallback, useState } from "react";
import { GameState } from "@/core/use-cases/GameEngine";
import { resolveAdvanceWarning } from "./turn-guard";

interface IUseAdvancePhaseGuardParams {
  gameState: GameState;
  winnerPlayerId: string | "DRAW" | null;
  isAnimating: boolean;
  isTurnHelpEnabled: boolean;
  assertPlayerTurn: () => boolean;
  executeAdvancePhase: () => void;
  disableTurnHelp: () => void;
}

export function useAdvancePhaseGuard({
  gameState,
  winnerPlayerId,
  isAnimating,
  isTurnHelpEnabled,
  assertPlayerTurn,
  executeAdvancePhase,
  disableTurnHelp,
}: IUseAdvancePhaseGuardParams) {
  const [pendingAdvanceWarning, setPendingAdvanceWarning] = useState<"MAIN_SKIP_ACTIONS" | "BATTLE_SKIP_ATTACKS" | null>(null);
  const advancePhase = useCallback(() => {
    if (winnerPlayerId || isAnimating || !assertPlayerTurn()) return;
    if (!isTurnHelpEnabled) {
      executeAdvancePhase();
      return;
    }
    const warning = resolveAdvanceWarning(gameState);
    if (!warning) {
      executeAdvancePhase();
      return;
    }
    setPendingAdvanceWarning(warning);
  }, [assertPlayerTurn, executeAdvancePhase, gameState, isAnimating, isTurnHelpEnabled, winnerPlayerId]);
  const confirmAdvancePhase = useCallback(
    (shouldDisableHelp: boolean) => {
      if (shouldDisableHelp) disableTurnHelp();
      setPendingAdvanceWarning(null);
      executeAdvancePhase();
    },
    [disableTurnHelp, executeAdvancePhase],
  );
  const cancelAdvancePhase = useCallback(() => setPendingAdvanceWarning(null), []);

  return { advancePhase, confirmAdvancePhase, cancelAdvancePhase, pendingAdvanceWarning };
}
