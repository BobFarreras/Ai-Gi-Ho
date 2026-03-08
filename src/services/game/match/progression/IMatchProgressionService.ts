// src/services/game/match/progression/IMatchProgressionService.ts - Contrato de aplicación para persistencia post-duelo según modo de combate.
import { ICardExperienceEvent } from "@/core/services/progression/card-experience-rules";
import { IAppliedCardExperienceResult } from "@/core/use-cases/progression/ApplyBattleCardExperienceUseCase";

export interface IMatchProgressionService {
  applyBattleCardExperience: (battleId: string, events: ICardExperienceEvent[]) => Promise<IAppliedCardExperienceResult[]>;
}
