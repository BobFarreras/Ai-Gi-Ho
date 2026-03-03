import { IPlayer } from "@/core/entities/IPlayer";
import { GameRuleError } from "@/core/errors/GameRuleError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import { applyExecutionEffect } from "@/core/use-cases/game-engine/actions/internal/execution-effects";
import { appendExecutionResolutionLogs } from "@/core/use-cases/game-engine/actions/internal/execution-logging";
import { resolveTrapTrigger } from "@/core/use-cases/game-engine/effects/resolve-trap-trigger";
import { assignPlayers, getPlayerPair } from "@/core/use-cases/game-engine/state/player-utils";
import { GameState } from "@/core/use-cases/game-engine/state/types";

export function resolveExecution(state: GameState, playerId: string, executionInstanceId: string): GameState {
  let withTrapResolution = state;
  const initialPair = getPlayerPair(state, playerId);
  withTrapResolution = resolveTrapTrigger(withTrapResolution, initialPair.opponent.id, "ON_OPPONENT_EXECUTION_ACTIVATED");
  const { player, opponent, isPlayerA } = getPlayerPair(withTrapResolution, playerId);

  const executionEntity = player.activeExecutions.find((entity) => entity.instanceId === executionInstanceId);

  if (!executionEntity) {
    throw new NotFoundError("La ejecución no existe en el tablero.");
  }

  if (!executionEntity.card.effect) {
    throw new GameRuleError("Esta carta no tiene un efecto programado.");
  }
  if (executionEntity.card.type !== "EXECUTION") {
    throw new ValidationError("Solo las ejecuciones activadas pueden resolverse con esta acción.");
  }

  const effect = executionEntity.card.effect;
  const effectResult = applyExecutionEffect(player, opponent, effect);
  let updatedPlayer: IPlayer = effectResult.player;

  updatedPlayer = {
    ...updatedPlayer,
    activeExecutions: updatedPlayer.activeExecutions.filter((entity) => entity.instanceId !== executionInstanceId),
    graveyard: [...updatedPlayer.graveyard, executionEntity.card],
  };

  const updatedOpponent: IPlayer = {
    ...effectResult.opponent,
  };

  const withPlayers = assignPlayers(withTrapResolution, updatedPlayer, updatedOpponent, isPlayerA);
  return appendExecutionResolutionLogs({
    state: withPlayers,
    playerId,
    executionCardId: executionEntity.card.id,
    damageTargetPlayerId: effectResult.damageTargetPlayerId,
    damageAmount: effectResult.damageAmount,
    healApplied: effectResult.healApplied,
    buffStat: effectResult.buff.stat,
    buffAmount: effectResult.buff.amount,
    buffEntityIds: effectResult.buff.entityIds,
  });
}
