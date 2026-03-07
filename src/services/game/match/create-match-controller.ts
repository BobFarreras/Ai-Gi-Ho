// src/services/game/match/create-match-controller.ts - Fábrica de controllers de match para centralizar construcción por modo.
import { IMatchConfig, IMatchController } from "@/core/entities/match";
import { LocalMatchController } from "@/services/game/match/LocalMatchController";

export function createMatchController(config: IMatchConfig): IMatchController {
  return new LocalMatchController(config);
}
