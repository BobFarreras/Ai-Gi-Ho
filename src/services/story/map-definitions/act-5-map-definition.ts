// src/services/story/map-definitions/act-5-map-definition.ts - Nodos virtuales del Acto 5 (Core Invertido).
// El acto se juega en el overworld; aquí solo viven los nodos VIRTUALES que las rutas del servidor necesitan
// resolver por id: las dos placas del puzzle simétrico, los tres sellos del atrio, los eventos narrativos y
// las recompensas. Los duelos reales (story-ch5-duel-N) viven en la BD, no aquí.
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
    chapter: 5,
    difficulty: "ELITE",
    isBossDuel: false,
    rewardNexus: 0,
    rewardPlayerExperience: 0,
    opponentName: "El Reflejo",
    href: "#",
    ...input,
  };
}

/** Acto 5 — Core Invertido. Posiciones nominales (el overworld no las usa; van por contrato del tipo). */
export const storyAct5MapDefinition: IStoryActMapDefinition = {
  act: 5,
  nodes: [],
  virtualNodes: [
    // Intro del acto: se dispara al PRIMER paso del jugador (no por trigger de suelo), como en los Actos 3 y 4.
    v({ id: "story-ch5-event-intro", duelIndex: 501, nodeType: "EVENT", title: "El Core Invertido", unlockRequirementNodeId: null, position: { x: 200, y: 200 } }),
    // Puzzle simétrico: cada placa se marca interactuada al tener la caja encima y PERSISTE (anti soft-lock).
    // La compuerta del atrio exige las dos: no basta con resolver un ala.
    v({ id: "story-ch5-plate-left", duelIndex: 502, nodeType: "EVENT", title: "Placa del Ala Izquierda", unlockRequirementNodeId: null, position: { x: 400, y: 200 } }),
    v({ id: "story-ch5-plate-right", duelIndex: 503, nodeType: "EVENT", title: "Placa del Ala Derecha", unlockRequirementNodeId: null, position: { x: 600, y: 200 } }),
    // Escena firma: el doble que te imita. Al cerrarla arranca duel-4 (Verso).
    v({ id: "story-ch5-event-mirror", duelIndex: 504, nodeType: "EVENT", title: "El Reflejo", unlockRequirementNodeId: null, position: { x: 800, y: 200 } }),
    // Los tres sellos del atrio: consolas que hay que leer para abrir la puerta del trono.
    v({ id: "story-ch5-seal-1", duelIndex: 505, nodeType: "EVENT", title: "Primer Sello", unlockRequirementNodeId: null, position: { x: 200, y: 400 } }),
    v({ id: "story-ch5-seal-2", duelIndex: 506, nodeType: "EVENT", title: "Segundo Sello", unlockRequirementNodeId: null, position: { x: 400, y: 400 } }),
    v({ id: "story-ch5-seal-3", duelIndex: 507, nodeType: "EVENT", title: "Tercer Sello", unlockRequirementNodeId: null, position: { x: 600, y: 400 } }),
    // El trono está vacío: la revelación del acto.
    v({ id: "story-ch5-event-empty-throne", duelIndex: 508, nodeType: "EVENT", title: "El Trono Vacío", unlockRequirementNodeId: null, position: { x: 800, y: 400 } }),
    // La fuga: se pisa al salir, ya con El Reflejo vencido. Abre el Acto 6.
    v({ id: "story-ch5-event-escape", duelIndex: 509, nodeType: "EVENT", title: "La Fuga", unlockRequirementNodeId: null, position: { x: 1000, y: 400 } }),
    // Recompensas del atrio.
    v({ id: "story-ch5-card-mirror", duelIndex: 510, nodeType: "REWARD_CARD", title: "Inyección Espejo", rewardCardId: "trap-mirror-buff-injection", unlockRequirementNodeId: null, position: { x: 200, y: 600 } }),
    v({ id: "story-ch5-cache-usb", duelIndex: 511, nodeType: "REWARD_OBJECT", title: "USB Raro", rewardObjectType: "LEVEL_CANDY", rewardObjectId: "candy-usb-raro-1", rewardObjectQuantity: 1, unlockRequirementNodeId: null, position: { x: 400, y: 600 } }),
  ],
};
