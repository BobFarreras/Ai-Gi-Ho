// src/core/services/tutorial/resolve-tutorial-map-state.test.ts - Verifica desbloqueo secuencial y compatibilidad legacy del mapa tutorial.
import { describe, expect, it } from "vitest";
import { resolveTutorialMapState } from "@/core/services/tutorial/resolve-tutorial-map-state";
import { resolveTutorialNodeCatalog } from "@/core/services/tutorial/resolve-tutorial-node-catalog";

describe("resolveTutorialMapState", () => {
  it("deja solo el primer nodo disponible cuando no hay progreso", () => {
    const runtime = resolveTutorialMapState({
      catalog: resolveTutorialNodeCatalog(),
      hasCompletedLegacyTutorial: false,
      completedNodeIds: [],
    });
    expect(runtime[0]?.state).toBe("AVAILABLE");
    expect(runtime.slice(1).every((node) => node.state === "LOCKED")).toBe(true);
  });

  it("marca todos los nodos completados en migración legacy", () => {
    const runtime = resolveTutorialMapState({
      catalog: resolveTutorialNodeCatalog(),
      hasCompletedLegacyTutorial: true,
    });
    expect(runtime.every((node) => node.state === "COMPLETED")).toBe(true);
  });
});
