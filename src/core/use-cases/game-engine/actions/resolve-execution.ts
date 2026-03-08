// src/core/use-cases/game-engine/actions/resolve-execution.ts - Resuelve ejecuciones activas, incluyendo trampas reactivas y flujo de fusión.
import { IPlayer } from "@/core/entities/IPlayer";
import { GameRuleError } from "@/core/errors/GameRuleError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import { applyExecutionEffect } from "@/core/use-cases/game-engine/actions/internal/execution-effects";
import { appendExecutionResolutionLogs } from "@/core/use-cases/game-engine/actions/internal/execution-logging";
import { resolveTrapTrigger } from "@/core/use-cases/game-engine/effects/resolve-trap-trigger";
import { startFusionSummonFromExecution } from "@/core/use-cases/game-engine/fusion/start-fusion-summon-from-execution";
import { appendCombatLogEvent } from "@/core/use-cases/game-engine/logging/combat-log";
import { assignPlayers, getPlayerPair } from "@/core/use-cases/game-engine/state/player-utils";
import { GameState } from "@/core/use-cases/game-engine/state/types";

function suspendFusionExecutionUntilMaterials(
  state: GameState,
  playerId: string,
  player: IPlayer,
  opponent: IPlayer,
  isPlayerA: boolean,
  executionInstanceId: string,
): GameState {
  const executionEntity = player.activeExecutions.find((entity) => entity.instanceId === executionInstanceId);
  if (!executionEntity) {
    throw new NotFoundError("La ejecución no existe en el tablero.");
  }
  const updatedPlayer: IPlayer = {
    ...player,
    activeExecutions: player.activeExecutions.map((entity) =>
      entity.instanceId === executionInstanceId ? { ...entity, mode: "SET" } : entity,
    ),
  };
  const withPlayers = assignPlayers(state, updatedPlayer, opponent, isPlayerA);
  return appendCombatLogEvent(withPlayers, playerId, "MANDATORY_ACTION_RESOLVED", {
    type: "FUSION_WAITING_MATERIALS",
    executionCardId: executionEntity.card.id,
  });
}

function resolveFusionExecution(
  withTrapResolution: GameState,
  playerId: string,
  player: IPlayer,
  opponent: IPlayer,
  isPlayerA: boolean,
  executionInstanceId: string,
  recipeId: string,
): GameState {
  if (player.activeEntities.length < 2) {
    return suspendFusionExecutionUntilMaterials(withTrapResolution, playerId, player, opponent, isPlayerA, executionInstanceId);
  }
  return startFusionSummonFromExecution(withTrapResolution, playerId, executionInstanceId, recipeId);
}

function appendExecutionResultLogs(
  withPlayers: GameState,
  playerId: string,
  executionCardId: string,
  effectResult: ReturnType<typeof applyExecutionEffect>,
): GameState {
  return appendExecutionResolutionLogs({
    state: withPlayers,
    playerId,
    executionCardId,
    damageTargetPlayerId: effectResult.damageTargetPlayerId,
    damageAmount: effectResult.damageAmount,
    healApplied: effectResult.healApplied,
    buffStat: effectResult.buff.stat,
    buffAmount: effectResult.buff.amount,
    buffEntityIds: effectResult.buff.entityIds,
  });
}

/**
 * Resuelve una carta de ejecución en estado ACTIVATE para el jugador indicado.
 * @param state Estado actual del duelo.
 * @param playerId Jugador activo que intenta resolver la ejecución.
 * @param executionInstanceId Instancia concreta en la zona de ejecuciones.
 * @returns Nuevo estado tras aplicar trampas, efecto y logs.
 * @throws NotFoundError Si la ejecución no existe en tablero.
 * @throws GameRuleError Si la carta no tiene efecto definido.
 * @throws ValidationError Si la instancia no corresponde a una ejecución válida.
 */
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
  if (effect.action === "FUSION_SUMMON") {
    return resolveFusionExecution(withTrapResolution, playerId, player, opponent, isPlayerA, executionInstanceId, effect.recipeId);
  }
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
  return appendExecutionResultLogs(withPlayers, playerId, executionEntity.card.id, effectResult);
}
