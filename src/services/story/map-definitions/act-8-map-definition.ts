// src/services/story/map-definitions/act-8-map-definition.ts - Nodos virtuales del Acto 8 (La Singularidad).
// El acto se juega en el overworld; aquí solo viven los nodos VIRTUALES que las rutas del servidor necesitan
// resolver por id (eventos, llaves, placas, terminales y recompensas). Los duelos viven en la BD.
import {
  IStoryActMapDefinition,
  IStoryMapVirtualNodeDefinition,
} from "@/services/story/map-definitions/story-map-definition-types";

function v(
  input: Omit<
    IStoryMapVirtualNodeDefinition,
    "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href"
  > &
    Partial<
      Pick<
        IStoryMapVirtualNodeDefinition,
        "chapter" | "difficulty" | "isBossDuel" | "rewardNexus" | "rewardPlayerExperience" | "opponentName" | "href"
      >
    >,
): IStoryMapVirtualNodeDefinition {
  return {
    chapter: 8,
    difficulty: "MYTHIC",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "La Entidad",
    href: "#",
    ...input,
  };
}

/** Acto 8 — La Singularidad. Posiciones nominales (el overworld no las usa; van por contrato del tipo). */
export const storyAct8MapDefinition: IStoryActMapDefinition = {
  act: 8,
  nodes: [],
  virtualNodes: [
    // Intro del acto (primer paso), justo antes de que se materialice el Coro.
    v({ id: "story-ch8-event-intro", duelIndex: 801, nodeType: "EVENT", title: "La Singularidad", unlockRequirementNodeId: null, position: { x: 200, y: 200 } }),
    // Escena firma: los cuatro jefes anteriores se funden. Narrativa pura, sin combate detrás.
    v({ id: "story-ch8-event-choir", duelIndex: 802, nodeType: "EVENT", title: "El Coro", unlockRequirementNodeId: null, position: { x: 400, y: 200 } }),
    // Se pisa al cruzar la boca del pozo, con los cuatro pedestales ya encendidos.
    v({ id: "story-ch8-event-descent", duelIndex: 803, nodeType: "EVENT", title: "El Descenso", unlockRequirementNodeId: null, position: { x: 600, y: 200 } }),
    // Al fondo del pozo, con las tres fases vencidas: el cierre de la campaña.
    v({ id: "story-ch8-event-epilogue", duelIndex: 804, nodeType: "EVENT", title: "Epílogo", unlockRequirementNodeId: null, position: { x: 800, y: 200 } }),
    v({ id: "story-ch8-cache-candy", duelIndex: 805, nodeType: "REWARD_OBJECT", title: "USB Raro", rewardObjectType: "LEVEL_CANDY", rewardObjectId: "candy-usb-raro-1", rewardObjectQuantity: 1, unlockRequirementNodeId: null, position: { x: 200, y: 400 } }),
    v({ id: "story-ch8-card-annihilator", duelIndex: 806, nodeType: "REWARD_CARD", title: "ChatGPT Annihilator", rewardCardId: "entity-chatgpt-annihilator", unlockRequirementNodeId: null, position: { x: 400, y: 400 } }),
  ],
};
