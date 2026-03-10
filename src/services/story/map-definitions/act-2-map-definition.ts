// src/services/story/map-definitions/act-2-map-definition.ts - Definición visual editable del acto 2 del mapa Story.
import {
  IStoryActMapDefinition,
  IStoryMapVirtualNodeDefinition,
} from "@/services/story/map-definitions/story-map-definition-types";

function v(input: Omit<IStoryMapVirtualNodeDefinition, "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href"> & Partial<Pick<IStoryMapVirtualNodeDefinition, "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href">>): IStoryMapVirtualNodeDefinition {
  return {
    chapter: 2,
    difficulty: "STANDARD",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "Sistema",
    href: "#",
    ...input,
  };
}

/**
 * Acto 2 con ramas profundas, un único punto de reconvergencia y subrutas opcionales sin retorno.
 */
export const storyAct2MapDefinition: IStoryActMapDefinition = {
  act: 2,
  nodes: [
    { id: "story-ch2-duel-1", unlockRequirementNodeId: "story-ch1-duel-3", position: { x: 860, y: 500 } },
    { id: "story-ch2-duel-2", unlockRequirementNodeId: "story-ch2-hub-omega-alpha", position: { x: 1120, y: 220 } },
  ],
  virtualNodes: [
    v({ id: "story-ch2-event-signal", duelIndex: 201, nodeType: "EVENT", title: "Señal Fantasma", unlockRequirementNodeId: "story-ch2-duel-1", position: { x: 620, y: 430 } }),
    v({ id: "story-ch2-event-signal-2", duelIndex: 202, nodeType: "EVENT", title: "Eco de Firewall", unlockRequirementNodeId: "story-ch2-event-signal", position: { x: 540, y: 340 } }),
    v({ id: "story-ch2-reward-card", duelIndex: 203, nodeType: "REWARD_CARD", title: "Alijo de Carta", rewardPlayerExperience: 120, unlockRequirementNodeId: "story-ch2-event-signal-2", position: { x: 640, y: 250 } }),
    v({ id: "story-ch2-event-move-a", duelIndex: 204, nodeType: "MOVE", title: "Plataforma Delta", unlockRequirementNodeId: "story-ch2-reward-card", position: { x: 780, y: 240 } }),
    v({ id: "story-ch2-hub-omega-alpha", duelIndex: 205, nodeType: "EVENT", title: "Hub Omega Alpha", difficulty: "ELITE", rewardPlayerExperience: 50, unlockRequirementNodeId: "story-ch2-event-move-a", position: { x: 940, y: 250 } }),

    v({ id: "story-ch2-event-breach", duelIndex: 206, nodeType: "EVENT", title: "Brecha Lateral", unlockRequirementNodeId: "story-ch2-duel-1", position: { x: 1240, y: 430 } }),
    v({ id: "story-ch2-reward-nexus", duelIndex: 207, nodeType: "REWARD_NEXUS", title: "Contador Nexus", rewardNexus: 260, unlockRequirementNodeId: "story-ch2-event-breach", position: { x: 1360, y: 340 } }),
    v({ id: "story-ch2-event-breach-2", duelIndex: 208, nodeType: "EVENT", title: "Pulso Inverso", difficulty: "ELITE", unlockRequirementNodeId: "story-ch2-reward-nexus", position: { x: 1270, y: 250 } }),
    v({ id: "story-ch2-event-archive-omega", duelIndex: 209, nodeType: "EVENT", title: "Archivo Omega", difficulty: "ELITE", unlockRequirementNodeId: "story-ch2-event-breach-2", position: { x: 1390, y: 170 } }),
    v({ id: "story-ch2-reward-final-cache", duelIndex: 210, nodeType: "REWARD_CARD", title: "Cache Final", rewardPlayerExperience: 170, unlockRequirementNodeId: "story-ch2-event-archive-omega", position: { x: 1510, y: 120 } }),
  ],
};
