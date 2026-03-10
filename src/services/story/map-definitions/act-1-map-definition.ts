// src/services/story/map-definitions/act-1-map-definition.ts - Definición visual editable del acto 1 del mapa Story.
import { IStoryActMapDefinition } from "@/services/story/map-definitions/story-map-definition-types";

/**
 * Layout del Acto 1. Mantiene ids de BD para desacoplar diseño visual del motor.
 */
export const storyAct1MapDefinition: IStoryActMapDefinition = {
  act: 1,
  nodes: [
    { id: "story-ch1-duel-1", position: { x: 1000, y: 1650 } },
    {
      id: "story-ch1-duel-2",
      unlockRequirementNodeId: "story-ch1-duel-1",
      position: { x: 1000, y: 1320 },
    },
    {
      id: "story-ch1-duel-3",
      unlockRequirementNodeId: "story-ch1-duel-2",
      position: { x: 1000, y: 980 },
    },
  ],
};
