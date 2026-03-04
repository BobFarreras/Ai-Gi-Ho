// src/core/repositories/IHubRepository.ts - Contrato de acceso a progreso y secciones del mundo central.
import { IHubSection } from "@/core/entities/hub/IHubSection";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";

export interface IHubRepository {
  getPlayerProgress(playerId: string): Promise<IPlayerHubProgress>;
  getSections(playerId: string): Promise<IHubSection[]>;
}
