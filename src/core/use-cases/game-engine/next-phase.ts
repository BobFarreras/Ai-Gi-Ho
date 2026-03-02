import { IBoardEntity } from "../../entities/IPlayer";
import { GameState, TurnPhase } from "./types";

const PHASES: TurnPhase[] = ["DRAW", "MAIN_1", "BATTLE", "MAIN_2", "END"];

function resetEntitiesForNewTurn(entities: IBoardEntity[]): IBoardEntity[] {
  return entities.map((entity) => ({
    ...entity,
    hasAttackedThisTurn: false,
    isNewlySummoned: false,
  }));
}

export function nextPhase(state: GameState): GameState {
  const currentIndex = PHASES.indexOf(state.phase);

  if (state.phase === "END") {
    const nextActivePlayerId = state.activePlayerId === state.playerA.id ? state.playerB.id : state.playerA.id;

    return {
      ...state,
      turn: state.turn + 1,
      phase: "DRAW",
      activePlayerId: nextActivePlayerId,
      hasNormalSummonedThisTurn: false,
      playerA: {
        ...state.playerA,
        currentEnergy: state.playerA.maxEnergy,
        activeEntities: resetEntitiesForNewTurn(state.playerA.activeEntities),
      },
      playerB: {
        ...state.playerB,
        currentEnergy: state.playerB.maxEnergy,
        activeEntities: resetEntitiesForNewTurn(state.playerB.activeEntities),
      },
    };
  }

  return {
    ...state,
    phase: PHASES[currentIndex + 1],
  };
}
