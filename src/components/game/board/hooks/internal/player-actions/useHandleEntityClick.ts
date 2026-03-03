import { useCallback } from "react";
import { IUsePlayerActionsParams } from "./types";
import { handleOwnEntityClick } from "./handleOwnEntityClick";
import { handleOpponentEntityClick } from "./handleOpponentEntityClick";

type IHandleEntityClickParams = Pick<
  IUsePlayerActionsParams,
  | "activeAttackerId"
  | "applyTransition"
  | "assertPlayerTurn"
  | "clearError"
  | "clearSelection"
  | "gameState"
  | "isAnimating"
  | "pendingEntityReplacement"
  | "pendingFusionSummon"
  | "resolvePendingTurnAction"
  | "setActiveAttackerId"
  | "setIsAnimating"
  | "setLastError"
  | "setPendingEntityReplacement"
  | "setPendingFusionSummon"
  | "setPlayingCard"
  | "setRevealedEntities"
  | "setSelectedCard"
>;

export function useHandleEntityClick(params: IHandleEntityClickParams) {
  return useCallback(
    async (entity: IUsePlayerActionsParams["gameState"]["playerA"]["activeEntities"][number] | null, isOpponent: boolean, event: React.MouseEvent) => {
      event.stopPropagation();
      if (params.isAnimating || !params.assertPlayerTurn()) return;

      if (params.gameState.pendingTurnAction?.playerId === params.gameState.playerA.id) {
        if (!isOpponent && entity) {
          params.resolvePendingTurnAction(entity.instanceId);
          return;
        }
        params.setLastError({ code: "GAME_RULE_ERROR", message: "Debes resolver la acción obligatoria antes de jugar." });
        return;
      }

      params.clearError();
      if (!isOpponent) {
        const result = await handleOwnEntityClick({
          entity,
          activeAttackerId: params.activeAttackerId,
          applyTransition: params.applyTransition,
          clearSelection: params.clearSelection,
          gameState: params.gameState,
          pendingFusionSummon: params.pendingFusionSummon,
          pendingEntityReplacement: params.pendingEntityReplacement,
          setActiveAttackerId: params.setActiveAttackerId,
          setIsAnimating: params.setIsAnimating,
          setLastError: params.setLastError,
          setPendingEntityReplacement: params.setPendingEntityReplacement,
          setPendingFusionSummon: params.setPendingFusionSummon,
          setPlayingCard: params.setPlayingCard,
          setRevealedEntities: params.setRevealedEntities,
          setSelectedCard: params.setSelectedCard,
        });
        if (result === "handled") return;
      }

      const result = await handleOpponentEntityClick({
        entity,
        activeAttackerId: params.activeAttackerId,
        applyTransition: params.applyTransition,
        clearSelection: params.clearSelection,
        gameState: params.gameState,
        setActiveAttackerId: params.setActiveAttackerId,
        setIsAnimating: params.setIsAnimating,
        setRevealedEntities: params.setRevealedEntities,
      });
      if (result === "handled") return;

      if (entity) params.setSelectedCard(entity.card);
    },
    [params],
  );
}
