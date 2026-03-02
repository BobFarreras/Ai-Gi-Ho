import { IPlayer } from "../../entities/IPlayer";
import { assignPlayers, getPlayerPair } from "./player-utils";
import { GameState } from "./types";

export function resolveExecution(state: GameState, playerId: string, executionInstanceId: string): GameState {
  const { player, opponent, isPlayerA } = getPlayerPair(state, playerId);

  const executionEntity = player.activeExecutions.find((entity) => entity.instanceId === executionInstanceId);

  if (!executionEntity) {
    throw new Error("La ejecución no existe en el tablero.");
  }

  if (!executionEntity.card.effect) {
    throw new Error("Esta carta no tiene un efecto programado.");
  }

  const effect = executionEntity.card.effect;
  let newPlayerHealth = player.healthPoints;
  let newOpponentHealth = opponent.healthPoints;

  switch (effect.action) {
    case "DAMAGE":
      if (effect.target === "OPPONENT") {
        newOpponentHealth = Math.max(0, opponent.healthPoints - effect.value);
      }
      if (effect.target === "PLAYER") {
        newPlayerHealth = Math.max(0, player.healthPoints - effect.value);
      }
      break;
    case "HEAL":
      if (effect.target === "PLAYER") {
        newPlayerHealth = Math.min(player.maxHealthPoints, player.healthPoints + effect.value);
      }
      break;
    default:
      break;
  }

  const updatedPlayer: IPlayer = {
    ...player,
    healthPoints: newPlayerHealth,
    activeExecutions: player.activeExecutions.filter((entity) => entity.instanceId !== executionInstanceId),
    graveyard: [...player.graveyard, executionEntity.card],
  };

  const updatedOpponent: IPlayer = {
    ...opponent,
    healthPoints: newOpponentHealth,
  };

  return assignPlayers(state, updatedPlayer, updatedOpponent, isPlayerA);
}
