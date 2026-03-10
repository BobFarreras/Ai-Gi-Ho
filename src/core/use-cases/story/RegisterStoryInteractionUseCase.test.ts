// src/core/use-cases/story/RegisterStoryInteractionUseCase.test.ts - Verifica persistencia de eventos narrativos de interacción Story.
import { describe, expect, it, vi } from "vitest";
import { RegisterStoryInteractionUseCase } from "@/core/use-cases/story/RegisterStoryInteractionUseCase";
import { IPlayerStoryWorldRepository } from "@/core/repositories/IPlayerStoryWorldRepository";

describe("RegisterStoryInteractionUseCase", () => {
  it("guarda evento INTERACTION en historial del jugador", async () => {
    const appendHistoryEvents = vi.fn(async () => undefined);
    const repository: IPlayerStoryWorldRepository = {
      getCurrentNodeIdByPlayerId: async () => null,
      saveCurrentNodeId: async () => undefined,
      listHistoryByPlayerId: async () => [],
      appendHistoryEvents,
    };
    const useCase = new RegisterStoryInteractionUseCase(repository);

    await useCase.execute({
      playerId: "player-1",
      nodeId: "story-ch1-event-briefing",
      details: "Interacción narrativa completada.",
      nowIso: "2026-03-10T12:00:00.000Z",
    });

    expect(appendHistoryEvents).toHaveBeenCalledTimes(1);
    const payload = appendHistoryEvents.mock.calls[0]?.[1]?.[0];
    expect(payload?.kind).toBe("INTERACTION");
    expect(payload?.nodeId).toBe("story-ch1-event-briefing");
  });
});
