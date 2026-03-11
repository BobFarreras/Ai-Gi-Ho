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
    { id: "story-ch1-duel-1", unlockRequirementNodeId: "story-ch1-path-blank-1", position: { x: 520, y: 980 } },
    { id: "story-ch1-duel-2", unlockRequirementNodeId: "story-ch1-reward-card-beta", position: { x: 1560, y: 980 } },
    { id: "story-ch1-duel-3", unlockRequirementNodeId: "story-ch1-event-link-a", position: { x: 2340, y: 980 } },
  ],
  virtualNodes: [
    v({ id: "story-ch1-player-start", duelIndex: 90, nodeType: "MOVE", title: "Plataforma Inicial", unlockRequirementNodeId: null, position: { x: 140, y: 980 } }),
    v({ id: "story-ch1-path-blank-1", duelIndex: 91, nodeType: "MOVE", title: "Pasarela Vacía", unlockRequirementNodeId: "story-ch1-player-start", position: { x: 330, y: 980 } }),
    v({ id: "story-ch1-reward-card-beta", duelIndex: 107, nodeType: "REWARD_CARD", title: "Bóveda Beta", rewardPlayerExperience: 80, unlockRequirementNodeId: "story-ch1-duel-1", position: { x: 780, y: 980 } }),
    v({ id: "story-ch1-reward-nexus-beta", duelIndex: 109, nodeType: "REWARD_NEXUS", title: "Tesoro Beta", rewardNexus: 150, unlockRequirementNodeId: "story-ch1-reward-card-beta", position: { x: 1040, y: 980 } }),
    v({ id: "story-ch1-reward-cache-a", duelIndex: 103, nodeType: "REWARD_CARD", title: "Cache A", rewardPlayerExperience: 60, unlockRequirementNodeId: "story-ch1-reward-nexus-beta", position: { x: 1300, y: 980 } }),
    v({ id: "story-ch1-event-briefing", duelIndex: 101, nodeType: "EVENT", title: "Terminal de Briefing", opponentName: "Canal de Mando", unlockRequirementNodeId: "story-ch1-duel-2", position: { x: 1820, y: 980 } }),
    v({ id: "story-ch1-event-link-a", duelIndex: 104, nodeType: "MOVE", title: "Pasarela Alta", unlockRequirementNodeId: "story-ch1-event-briefing", position: { x: 2080, y: 980 } }),
    v({ id: "story-ch1-hub-rejoin-alpha", duelIndex: 105, nodeType: "MOVE", title: "Plataforma Final", rewardPlayerExperience: 30, unlockRequirementNodeId: "story-ch1-duel-3", position: { x: 2600, y: 980 } }),
  ],
  platforms: [
    { id: "act1-p-1", position: { x: 140, y: 980 }, size: 170, style: "METAL" },
    { id: "act1-p-2", position: { x: 330, y: 980 }, size: 170, style: "METAL" },
    { id: "act1-p-3", position: { x: 520, y: 980 }, size: 170, style: "NEON" },
    { id: "act1-p-4", position: { x: 780, y: 980 }, size: 170, style: "RUIN" },
    { id: "act1-p-5", position: { x: 1040, y: 980 }, size: 170, style: "NEON" },
    { id: "act1-p-6", position: { x: 1300, y: 980 }, size: 170, style: "RUIN" },
    { id: "act1-p-7", position: { x: 1560, y: 980 }, size: 170, style: "NEON" },
    { id: "act1-p-8", position: { x: 1820, y: 980 }, size: 170, style: "METAL" },
    { id: "act1-p-9", position: { x: 2080, y: 980 }, size: 170, style: "METAL" },
    { id: "act1-p-10", position: { x: 2340, y: 980 }, size: 170, style: "RUIN" },
    { id: "act1-p-11", position: { x: 2600, y: 980 }, size: 170, style: "METAL" },
  ],
};
