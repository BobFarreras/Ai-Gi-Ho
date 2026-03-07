// src/services/game/match/progression/RemoteMatchProgressionService.ts - Implementa persistencia remota de EXP post-duelo mediante API del juego.
import { ICardExperienceEvent } from "@/core/services/progression/card-experience-rules";
import { applyBattleCardExperienceAction } from "@/services/game/apply-battle-card-experience-action";
import { IMatchProgressionService } from "@/services/game/match/progression/IMatchProgressionService";

export class RemoteMatchProgressionService implements IMatchProgressionService {
  public async applyBattleCardExperience(battleId: string, events: ICardExperienceEvent[]) {
    return applyBattleCardExperienceAction(battleId, events);
  }
}
