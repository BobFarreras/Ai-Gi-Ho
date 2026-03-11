// src/components/hub/story/internal/scene/state/resolve-story-scene-can-move.test.ts - Prueba reglas de habilitación del botón de movimiento Story.
import { describe, expect, it } from "vitest";
import { resolveStorySceneCanMove } from "./resolve-story-scene-can-move";
import { IStoryMapNodeRuntime } from "@/services/story/story-map-runtime-data";

function createNode(overrides: Partial<IStoryMapNodeRuntime>): IStoryMapNodeRuntime {
  return {
    id: "story-node",
    chapter: 1,
    duelIndex: 1,
    title: "Nodo",
    opponentName: "Sistema",
    nodeType: "DUEL",
    difficulty: "STANDARD",
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    isBossDuel: false,
    isCompleted: false,
    isUnlocked: true,
    href: "#",
    unlockRequirementNodeId: null,
    ...overrides,
  };
}

describe("resolveStorySceneCanMove", () => {
  it("permite moverse a una plataforma vacía completada aunque fuera virtual", () => {
    const canMove = resolveStorySceneCanMove({
      selectedNode: createNode({
        id: "story-ch1-reward-nexus-beta",
        nodeType: "REWARD_NEXUS",
        isVirtualNode: true,
        isCompleted: true,
      }),
      currentNodeId: "story-ch1-duel-1",
      isInteracting: false,
      isDialogOpen: false,
    });
    expect(canMove).toBe(true);
  });

  it("bloquea movimiento si el nodo seleccionado es el actual", () => {
    const canMove = resolveStorySceneCanMove({
      selectedNode: createNode({ id: "story-ch1-path-blank-1", nodeType: "MOVE" }),
      currentNodeId: "story-ch1-path-blank-1",
      isInteracting: false,
      isDialogOpen: false,
    });
    expect(canMove).toBe(false);
  });
});
