// src/core/services/hub/HubService.ts - Orquesta datos del dashboard central y aplica normalización de desbloqueos.
import { IHubSection } from "@/core/entities/hub/IHubSection";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";
import { IHubRepository } from "@/core/repositories/IHubRepository";

export interface IHubDashboard {
  progress: IPlayerHubProgress;
  sections: IHubSection[];
}

export class HubService {
  constructor(private readonly hubRepository: IHubRepository) {}

  async getDashboard(playerId: string): Promise<IHubDashboard> {
    const [progress, sections] = await Promise.all([
      this.hubRepository.getPlayerProgress(playerId),
      this.hubRepository.getSections(playerId),
    ]);

    return {
      progress,
      sections: sections.map((section) => this.resolveSectionLock(section, progress)),
    };
  }

  private resolveSectionLock(section: IHubSection, progress: IPlayerHubProgress): IHubSection {
    if (section.type === "MULTIPLAYER" && !progress.hasCompletedTutorial) {
      return {
        ...section,
        isLocked: true,
        lockReason: "Completa el entrenamiento para desbloquear multijugador.",
      };
    }

    return section;
  }
}
