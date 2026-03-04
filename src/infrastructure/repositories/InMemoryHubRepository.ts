// src/infrastructure/repositories/InMemoryHubRepository.ts - Repositorio temporal en memoria para poblar el dashboard central.
import { IHubSection } from "@/core/entities/hub/IHubSection";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";
import { IHubRepository } from "@/core/repositories/IHubRepository";

const HUB_SECTIONS: ReadonlyArray<Omit<IHubSection, "isLocked" | "lockReason">> = [
  { id: "market", type: "MARKET", title: "Mercado", description: "Compra sobres, cartas y mejoras.", href: "/hub/market" },
  { id: "home", type: "HOME", title: "Mi Home", description: "Gestiona mazos, perfil y ajustes.", href: "/hub/home" },
  {
    id: "training",
    type: "TRAINING",
    title: "Entrenamiento",
    description: "Aprende reglas y domina tácticas.",
    href: "/hub/training",
  },
  { id: "story", type: "STORY", title: "Historia", description: "Progresa por capítulos y consigue medallas.", href: "/hub/story" },
  {
    id: "multiplayer",
    type: "MULTIPLAYER",
    title: "Multijugador",
    description: "Lucha contra otros duelistas en línea.",
    href: "/hub/multiplayer",
  },
];

const DEFAULT_PROGRESS: IPlayerHubProgress = {
  playerId: "local-player",
  medals: 0,
  storyChapter: 1,
  hasCompletedTutorial: false,
};

export class InMemoryHubRepository implements IHubRepository {
  constructor(private readonly progress: IPlayerHubProgress = DEFAULT_PROGRESS) {}

  async getPlayerProgress(playerId: string): Promise<IPlayerHubProgress> {
    return {
      ...this.progress,
      playerId,
    };
  }

  async getSections(): Promise<IHubSection[]> {
    return HUB_SECTIONS.map((section) => ({
      ...section,
      isLocked: false,
      lockReason: null,
    }));
  }
}
