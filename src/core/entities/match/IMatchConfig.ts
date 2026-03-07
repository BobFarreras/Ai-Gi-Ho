// src/core/entities/match/IMatchConfig.ts - Configuración mínima para construir un controller de match desacoplado.
import { GameState } from "@/core/use-cases/game-engine/state/types";
import { IMatchActionRequest } from "@/core/entities/match/IMatchActionRequest";
import { IMatchMode } from "@/core/entities/match/IMatchMode";

export interface IMatchConfig {
  mode: IMatchMode;
  seed: string;
  initialStateFactory: () => GameState;
  actionResolver?: (state: GameState, action: IMatchActionRequest) => GameState | Promise<GameState>;
}
