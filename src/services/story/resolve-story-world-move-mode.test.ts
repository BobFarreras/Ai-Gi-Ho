// src/services/story/resolve-story-world-move-mode.test.ts - Verifica reglas de movimiento secuencial y retroceso en mapa Story.
import { describe, expect, it } from "vitest";
import { resolveStoryWorldMoveMode } from "@/services/story/resolve-story-world-move-mode";

describe("resolveStoryWorldMoveMode", () => {
  it("permite retroceso cuando el nodo ya fue visitado", () => {
    const result = resolveStoryWorldMoveMode({
      targetNodeId: "story-ch1-path-blank-1",
      currentNodeId: "story-ch1-reward-nexus-beta",
      visitedNodeIds: ["story-ch1-path-blank-1", "story-ch1-duel-1"],
      completedNodeIds: ["story-ch1-duel-1"],
      interactedNodeIds: [],
    });
    expect(result).toEqual({ mode: "VISITED", isAllowed: true, validationMessage: null });
  });

  it("bloquea salto hacia duelo visual si no viene del nodo anterior", () => {
    const result = resolveStoryWorldMoveMode({
      targetNodeId: "story-ch1-duel-1",
      currentNodeId: "story-ch1-player-start",
      visitedNodeIds: [],
      completedNodeIds: [],
      interactedNodeIds: [],
    });
    expect(result.mode).toBe("VISUAL");
    expect(result.isAllowed).toBe(false);
  });

  it("permite avanzar a nodo visual cuando se respeta secuencia", () => {
    const result = resolveStoryWorldMoveMode({
      targetNodeId: "story-ch1-duel-1",
      currentNodeId: "story-ch1-path-blank-1",
      visitedNodeIds: [],
      completedNodeIds: [],
      interactedNodeIds: [],
    });
    expect(result).toEqual({ mode: "VISUAL", isAllowed: true, validationMessage: null });
  });
});
