// src/services/story/map-definitions/act-7-map-definition.ts - Nodos virtuales del Acto 7 (La Fundición Cuántica).
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
    chapter: 7,
    difficulty: "BOSS",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "Prototipo Cero",
    href: "#",
    ...input,
  };
}

/** Acto 7 — La Fundición Cuántica. Posiciones nominales (el overworld no las usa; van por contrato del tipo). */
export const storyAct7MapDefinition: IStoryActMapDefinition = {
  act: 7,
  nodes: [],
  virtualNodes: [
    // Intro del acto (primer paso): la cadena en marcha vista desde la planta más alta.
    v({ id: "story-ch7-event-intro", duelIndex: 701, nodeType: "EVENT", title: "La Fundición Cuántica", unlockRequirementNodeId: null, position: { x: 200, y: 200 } }),
    // Puzzle de caja de la planta 4: la placa abre la compuerta de la escalera.
    v({ id: "story-ch7-plate-1", duelIndex: 702, nodeType: "EVENT", title: "Placa de la Planta 4", unlockRequirementNodeId: null, position: { x: 400, y: 200 } }),
    // Las dos posiciones de la palanca de la pasarela de bajada (invertir arriba, restaurar abajo).
    v({ id: "story-ch7-belt-switch", duelIndex: 703, nodeType: "EVENT", title: "Palanca de la Pasarela", unlockRequirementNodeId: null, position: { x: 600, y: 200 } }),
    v({ id: "story-ch7-belt-switch-bottom", duelIndex: 704, nodeType: "EVENT", title: "Palanca de Retorno", unlockRequirementNodeId: null, position: { x: 800, y: 200 } }),
    // Escena firma: dos rivales se disputan la carta recién forjada. Al cerrarla, duel-3 (Alquimista).
    v({ id: "story-ch7-event-casting", duelIndex: 705, nodeType: "EVENT", title: "La Colada", unlockRequirementNodeId: null, position: { x: 200, y: 400 } }),
    // Midutech está vivo y trabaja aquí. No como jefe: como empleado.
    v({ id: "story-ch7-event-employee", duelIndex: 706, nodeType: "EVENT", title: "El Empleado", unlockRequirementNodeId: null, position: { x: 400, y: 400 } }),
    // El Prototipo Cero abre los ojos. Cierre del acto.
    v({ id: "story-ch7-event-awakening", duelIndex: 707, nodeType: "EVENT", title: "El Despertar", unlockRequirementNodeId: null, position: { x: 600, y: 400 } }),
    v({ id: "story-ch7-cache-atk", duelIndex: 708, nodeType: "REWARD_OBJECT", title: "Núcleo Overclock", rewardObjectType: "CARD_UPGRADE", rewardObjectId: "item-nucleo-overclock", rewardObjectQuantity: 1, unlockRequirementNodeId: null, position: { x: 200, y: 600 } }),
    v({ id: "story-ch7-card-superc", duelIndex: 709, nodeType: "REWARD_CARD", title: "Super C", rewardCardId: "fusion-super-c", unlockRequirementNodeId: null, position: { x: 400, y: 600 } }),
  ],
};
