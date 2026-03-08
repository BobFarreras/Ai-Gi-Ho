// src/services/game/match/progression/create-match-progression-service.ts - Fábrica de persistencia post-duelo desacoplada por modo de combate.
import { IMatchMode } from "@/core/entities/match";
import { IMatchProgressionService } from "@/services/game/match/progression/IMatchProgressionService";
import { RemoteMatchProgressionService } from "@/services/game/match/progression/RemoteMatchProgressionService";
import { TutorialMatchProgressionService } from "@/services/game/match/progression/TutorialMatchProgressionService";

const remoteService = new RemoteMatchProgressionService();
const tutorialService = new TutorialMatchProgressionService();

export function createMatchProgressionService(mode: IMatchMode): IMatchProgressionService {
  if (mode === "TUTORIAL") return tutorialService;
  return remoteService;
}
