import { GameEngine, GameState } from "@/core/use-cases/GameEngine";
import { createPlayerDeckA, createPlayerDeckB } from "./initialDeckFactory";

export function createInitialBoardState(): GameState {
  const baseState = GameEngine.createInitialGameState({
    playerA: {
      id: "p1",
      name: "Neo (Tú)",
      deck: createPlayerDeckA(),
    },
    playerB: {
      id: "p2",
      name: "Agente Smith",
      deck: createPlayerDeckB(),
    },
    starterPlayerId: "p1",
    openingHandSize: 4,
  });

  return baseState;
}
