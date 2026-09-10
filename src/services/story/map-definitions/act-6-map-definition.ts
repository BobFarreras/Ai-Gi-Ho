// src/services/story/map-definitions/act-6-map-definition.ts - Nodos virtuales del Acto 6 (La Red Abierta).
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
    chapter: 6,
    difficulty: "ELITE",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "Leviatán del Borde",
    href: "#",
    ...input,
  };
}

/** Acto 6 — La Red Abierta. Posiciones nominales (el overworld no las usa; van por contrato del tipo). */
export const storyAct6MapDefinition: IStoryActMapDefinition = {
  act: 6,
  nodes: [],
  virtualNodes: [
    // Intro del acto: salta al PRIMER paso del jugador, no por trigger de suelo.
    v({ id: "story-ch6-event-intro", duelIndex: 601, nodeType: "EVENT", title: "La Red Abierta", unlockRequirementNodeId: null, position: { x: 200, y: 200 } }),
    // Consola del hub: explica por qué el cielo está abierto y qué dejó La Entidad al pasar.
    v({ id: "story-ch6-event-trail", duelIndex: 602, nodeType: "EVENT", title: "El Rastro", unlockRequirementNodeId: null, position: { x: 400, y: 200 } }),
    // Las tres llaves de router. Cada una exige su región ganada; las tres abren la boca oeste.
    v({ id: "story-ch6-key-north", duelIndex: 603, nodeType: "EVENT", title: "Llave de Router: Norte", unlockRequirementNodeId: null, position: { x: 600, y: 200 } }),
    v({ id: "story-ch6-key-east", duelIndex: 604, nodeType: "EVENT", title: "Llave de Router: Este", unlockRequirementNodeId: null, position: { x: 800, y: 200 } }),
    v({ id: "story-ch6-key-south", duelIndex: 605, nodeType: "EVENT", title: "Llave de Router: Sur", unlockRequirementNodeId: null, position: { x: 1000, y: 200 } }),
    // Escena firma: cinco copias te rodean. Al cerrarla arranca duel-4 (Enjambre Mayor).
    v({ id: "story-ch6-event-swarm", duelIndex: 606, nodeType: "EVENT", title: "El Enjambre", unlockRequirementNodeId: null, position: { x: 200, y: 400 } }),
    // Terminal de código (SUBMISSION): baja la barrera de la cámara del Leviatán.
    v({ id: "story-ch6-edge-terminal", duelIndex: 607, nodeType: "EVENT", title: "Terminal del Borde", unlockRequirementNodeId: null, position: { x: 400, y: 400 } }),
    // Lo que confiesa el Leviatán al caer: le están fabricando un cuerpo. Abre el Acto 7.
    v({ id: "story-ch6-event-foundry", duelIndex: 608, nodeType: "EVENT", title: "La Fundición", unlockRequirementNodeId: null, position: { x: 600, y: 400 } }),
    v({ id: "story-ch6-cache-usb", duelIndex: 609, nodeType: "REWARD_OBJECT", title: "USB Raro", rewardObjectType: "LEVEL_CANDY", rewardObjectId: "candy-usb-raro-1", rewardObjectQuantity: 1, unlockRequirementNodeId: null, position: { x: 200, y: 600 } }),
    v({ id: "story-ch6-card-edge", duelIndex: 610, nodeType: "REWARD_CARD", title: "Cloudflare", rewardCardId: "entity-cloudflare", unlockRequirementNodeId: null, position: { x: 400, y: 600 } }),
  ],
};
