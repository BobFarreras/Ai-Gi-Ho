// src/components/hub/story/story-circuit-layout.test.ts - Verifica prioridad de posición explícita y segmentos en layout Story.
import { describe, expect, it } from "vitest";
import {
  buildStoryNodePositionMap,
  resolveStoryPathSegments,
} from "@/components/hub/story/story-circuit-layout";
import { IStoryMapNodeRuntime } from "@/services/story/story-map-runtime-data";

function buildNode(id: string, unlockRequirementNodeId: string | null, position?: { x: number; y: number }): IStoryMapNodeRuntime {
  return {
    id,
    chapter: 1,
    duelIndex: 1,
    title: id,
    opponentName: "Opponent",
    nodeType: "DUEL",
    difficulty: "ROOKIE",
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    isBossDuel: false,
    isCompleted: false,
    isUnlocked: true,
    unlockRequirementNodeId,
    href: "/hub/story/chapter/1/duel/1",
    position,
  };
}

describe("buildStoryNodePositionMap", () => {
  it("prioriza coordenadas explícitas del runtime", () => {
    const nodes = [buildNode("story-ch1-duel-1", null, { x: 1500, y: 1400 })];

    const positionMap = buildStoryNodePositionMap(nodes);

    expect(positionMap["story-ch1-duel-1"]).toEqual({ x: 1500, y: 1400 });
  });

  it("genera segmentos usando dependencias del grafo", () => {
    const nodes = [
      buildNode("story-ch1-duel-1", null, { x: 1000, y: 1200 }),
      buildNode("story-ch1-duel-2", "story-ch1-duel-1", { x: 1000, y: 900 }),
    ];

    const positionMap = buildStoryNodePositionMap(nodes);
    const segments = resolveStoryPathSegments(nodes, positionMap);

    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ from: { x: 1000, y: 1200 }, to: { x: 1000, y: 900 } });
  });
});
