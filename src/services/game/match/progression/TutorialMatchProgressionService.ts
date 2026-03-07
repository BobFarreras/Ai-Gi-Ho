// src/services/game/match/progression/TutorialMatchProgressionService.ts - Implementación sin persistencia para tutorial, manteniendo interfaz común.
import { IAppliedCardExperienceResult } from "@/core/use-cases/progression/ApplyBattleCardExperienceUseCase";
import { IMatchProgressionService } from "@/services/game/match/progression/IMatchProgressionService";

export class TutorialMatchProgressionService implements IMatchProgressionService {
  public async applyBattleCardExperience(): Promise<IAppliedCardExperienceResult[]> {
    return [];
  }
}
