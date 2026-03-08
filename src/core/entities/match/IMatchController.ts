// src/core/entities/match/IMatchController.ts - Interfaz del runtime de combate reutilizable por training, story, tutorial y multiplayer.
import { GameState } from "@/core/use-cases/game-engine/state/types";
import { IMatchActionRequest } from "@/core/entities/match/IMatchActionRequest";
import { IMatchMode } from "@/core/entities/match/IMatchMode";

export interface IMatchController {
  readonly mode: IMatchMode;
  readonly seed: string;
  initialize: () => Promise<GameState>;
  getSnapshot: () => GameState;
  dispatch: (action: IMatchActionRequest) => Promise<GameState>;
  reset: () => Promise<GameState>;
}
