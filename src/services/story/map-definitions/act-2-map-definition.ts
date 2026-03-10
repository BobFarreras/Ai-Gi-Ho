// src/services/story/map-definitions/act-2-map-definition.ts - Definición visual editable del acto 2 del mapa Story.
import { IStoryActMapDefinition } from "@/services/story/map-definitions/story-map-definition-types";

/**
 * Layout del Acto 2 con ligera bifurcación visual para anticipar mapa semi-abierto.
 */
export const storyAct2MapDefinition: IStoryActMapDefinition = {
  act: 2,
  nodes: [
    {
      id: "story-ch2-duel-1",
      unlockRequirementNodeId: "story-ch1-duel-3",
      position: { x: 860, y: 640 },
    },
    {
      id: "story-ch2-duel-2",
      unlockRequirementNodeId: "story-ch2-duel-1",
      position: { x: 1140, y: 420 },
    },
  ],
};
