// src/services/game/match/progression/create-match-progression-service.test.ts - Verifica selección de servicio de progresión post-duelo según modo.
import { describe, expect, it, vi } from "vitest";
import { createMatchProgressionService } from "@/services/game/match/progression/create-match-progression-service";
import { RemoteMatchProgressionService } from "@/services/game/match/progression/RemoteMatchProgressionService";

describe("create-match-progression-service", () => {
  it("usa servicio remoto para training/story/multiplayer", () => {
    expect(createMatchProgressionService("TRAINING")).toBeInstanceOf(RemoteMatchProgressionService);
    expect(createMatchProgressionService("STORY")).toBeInstanceOf(RemoteMatchProgressionService);
    expect(createMatchProgressionService("MULTIPLAYER")).toBeInstanceOf(RemoteMatchProgressionService);
  });

  it("usa servicio tutorial sin persistencia", async () => {
    const service = createMatchProgressionService("TUTORIAL");
    const result = await service.applyBattleCardExperience("battle-test", []);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });

  it("mantiene contrato async estable", async () => {
    const service = createMatchProgressionService("TUTORIAL");
    await expect(service.applyBattleCardExperience("battle-test", [])).resolves.toEqual([]);
    expect(vi.isMockFunction(service.applyBattleCardExperience)).toBe(false);
  });
});
