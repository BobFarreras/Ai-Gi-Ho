import { ICombatLogEvent } from "@/core/entities/ICombatLog";
import { IPlayer } from "@/core/entities/IPlayer";

export type TurnPhase = "MAIN_1" | "BATTLE";

export type PendingTurnActionType = "SACRIFICE_ENTITY_FOR_DRAW" | "DISCARD_FOR_HAND_LIMIT" | "SELECT_FUSION_MATERIALS";

interface IBasePendingTurnAction {
  playerId: string;
}

export interface ISacrificeEntityPendingTurnAction extends IBasePendingTurnAction {
  type: "SACRIFICE_ENTITY_FOR_DRAW";
}

export interface IDiscardForHandLimitPendingTurnAction extends IBasePendingTurnAction {
  type: "DISCARD_FOR_HAND_LIMIT";
}

export interface ISelectFusionMaterialsPendingTurnAction extends IBasePendingTurnAction {
  type: "SELECT_FUSION_MATERIALS";
  fusionCardId?: string;
  fusionFromExecutionInstanceId?: string;
  fusionFromExecutionRecipeId?: string;
  mode: "ATTACK" | "DEFENSE";
  selectedMaterialInstanceIds: string[];
}

export type IPendingTurnAction =
  | ISacrificeEntityPendingTurnAction
  | IDiscardForHandLimitPendingTurnAction
  | ISelectFusionMaterialsPendingTurnAction;

export interface GameState {
  playerA: IPlayer;
  playerB: IPlayer;
  activePlayerId: string;
  startingPlayerId: string;
  turn: number;
  phase: TurnPhase;
  hasNormalSummonedThisTurn: boolean;
  pendingTurnAction?: IPendingTurnAction | null;
  combatLog: ICombatLogEvent[];
}
