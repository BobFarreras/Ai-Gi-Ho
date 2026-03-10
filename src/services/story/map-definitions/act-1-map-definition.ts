// src/services/story/map-definitions/act-1-map-definition.ts - Definición visual editable del acto 1 del mapa Story.
import {
  IStoryActMapDefinition,
  IStoryMapVirtualNodeDefinition,
} from "@/services/story/map-definitions/story-map-definition-types";

function v(input: Omit<IStoryMapVirtualNodeDefinition, "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href"> & Partial<Pick<IStoryMapVirtualNodeDefinition, "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href">>): IStoryMapVirtualNodeDefinition {
  return {
    chapter: 1,
    difficulty: "ROOKIE",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "Sistema",
    href: "#",
    ...input,
  };
}

/**
 * Acto 1 en formato árbol con rutas opcionales y solo una reconexión al camino principal.
 */
export const storyAct1MapDefinition: IStoryActMapDefinition = {
  act: 1,
  nodes: [
    { id: "story-ch1-duel-1", unlockRequirementNodeId: "story-ch1-path-blank-1", position: { x: 1000, y: 1480 } },
    { id: "story-ch1-duel-2", unlockRequirementNodeId: "story-ch1-hub-rejoin-alpha", position: { x: 980, y: 940 } },
    { id: "story-ch1-duel-3", unlockRequirementNodeId: "story-ch1-duel-2", position: { x: 980, y: 610 } },
  ],
  virtualNodes: [
    v({ id: "story-ch1-player-start", duelIndex: 90, nodeType: "MOVE", title: "Plataforma Inicial", unlockRequirementNodeId: null, position: { x: 1000, y: 1780 } }),
    v({ id: "story-ch1-path-blank-1", duelIndex: 91, nodeType: "MOVE", title: "Pasarela Vacía", unlockRequirementNodeId: "story-ch1-player-start", position: { x: 1000, y: 1620 } }),

    v({ id: "story-ch1-event-briefing", duelIndex: 101, nodeType: "EVENT", title: "Terminal de Briefing", opponentName: "Canal de Mando", unlockRequirementNodeId: "story-ch1-duel-1", position: { x: 720, y: 1320 } }),
    v({ id: "story-ch1-event-scout-a", duelIndex: 102, nodeType: "EVENT", title: "Nodo de Rastreo", unlockRequirementNodeId: "story-ch1-event-briefing", position: { x: 650, y: 1180 } }),
    v({ id: "story-ch1-reward-cache-a", duelIndex: 103, nodeType: "REWARD_NEXUS", title: "Cache A", rewardNexus: 120, unlockRequirementNodeId: "story-ch1-event-scout-a", position: { x: 760, y: 1050 } }),
    v({ id: "story-ch1-event-link-a", duelIndex: 104, nodeType: "EVENT", title: "Canal A", unlockRequirementNodeId: "story-ch1-reward-cache-a", position: { x: 860, y: 990 } }),
    v({ id: "story-ch1-hub-rejoin-alpha", duelIndex: 105, nodeType: "EVENT", title: "Hub Alpha", rewardPlayerExperience: 30, unlockRequirementNodeId: "story-ch1-event-link-a", position: { x: 930, y: 960 } }),

    v({ id: "story-ch1-event-market", duelIndex: 106, nodeType: "EVENT", title: "Puerto Negro", unlockRequirementNodeId: "story-ch1-duel-1", position: { x: 1290, y: 1320 } }),
    v({ id: "story-ch1-reward-card-beta", duelIndex: 107, nodeType: "REWARD_CARD", title: "Bóveda Beta", rewardPlayerExperience: 80, unlockRequirementNodeId: "story-ch1-event-market", position: { x: 1370, y: 1190 } }),
    v({ id: "story-ch1-event-archive-beta", duelIndex: 108, nodeType: "EVENT", title: "Archivo Beta", unlockRequirementNodeId: "story-ch1-reward-card-beta", position: { x: 1310, y: 1060 } }),
    v({ id: "story-ch1-reward-nexus-beta", duelIndex: 109, nodeType: "REWARD_NEXUS", title: "Tesoro Beta", rewardNexus: 150, unlockRequirementNodeId: "story-ch1-event-archive-beta", position: { x: 1210, y: 980 } }),
  ],
};
