// src/core/use-cases/story/RegisterStoryInteractionUseCase.ts - Registra eventos narrativos de interacción Story sin alterar cursor de navegación.
import { IPlayerStoryHistoryEvent } from "@/core/entities/story/IPlayerStoryHistoryEvent";
import { IPlayerStoryWorldRepository } from "@/core/repositories/IPlayerStoryWorldRepository";

interface IRegisterStoryInteractionInput {
  playerId: string;
  nodeId: string;
  details: string;
  nowIso: string;
}

/**
 * Persiste una interacción de nodo Story como evento auditable en historial.
 */
export class RegisterStoryInteractionUseCase {
  constructor(private readonly storyWorldRepository: IPlayerStoryWorldRepository) {}

  async execute(input: IRegisterStoryInteractionInput): Promise<void> {
    const event: IPlayerStoryHistoryEvent = {
      eventId: `interaction-${input.nodeId}-${input.nowIso}`,
      playerId: input.playerId,
      nodeId: input.nodeId,
      kind: "INTERACTION",
      details: input.details,
      createdAtIso: input.nowIso,
    };
    await this.storyWorldRepository.appendHistoryEvents(input.playerId, [event]);
  }
}
