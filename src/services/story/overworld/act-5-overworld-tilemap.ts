// src/services/story/overworld/act-5-overworld-tilemap.ts - Acto 5 "Core Invertido": el único mapa CLARO del
// juego (ambiente MIRROR, un negativo fotográfico del resto de la campaña). Flujo: entrada → sala de espejos con
// dos alas simétricas (un puzzle de caja+placa en cada una, las dos obligatorias) → escena del Reflejo →
// atrio de los tres sellos → trono vacío y jefe. Rivales: Eco (x3), Verso (jefe intermedio) y El Reflejo (jefe).
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import { validateOverworldTilemap } from "@/services/story/overworld/validate-tilemap";
import { OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";
import {
  buildVoidLayers,
  buildWall,
  carveCorridor,
  fillRoom,
  markSolid,
  placeStructure,
} from "@/services/story/overworld/tilemap-build-kit";

const MAP_WIDTH = 48;
const MAP_HEIGHT = 64;

// Avatares reutilizados del roster existente (no se genera arte nuevo; se cambian desde el panel admin).
const ECO = "/assets/story/opponents/opp-ch1-soldier-act01/avatar-Soldado-act01.webp";
const VERSO = "/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp";
const REFLEJO = "/assets/story/opponents/opp-ch1-apprentice/avatar-GenNvim.webp";
const USB = "/assets/items/candy-usb-raro.webp";
// Carta de recompensa del atrio: la trampa del espejo, que es justo lo que hace el Core con el jugador.
const CARD_MIRROR_INJECTION = "/assets/renders/traps/trap-mirror-buff-injection.webp";

/**
 * ESCENA FIRMA "El Reflejo". Sala larga y simétrica partida por una línea de espejos (muro de pantallas con un
 * hueco central). Al pisar el trigger, al otro lado aparece un doble que repite tus pasos con retraso… hasta
 * que da uno que tú no has dado. Entonces se revela Verso, que estaba detrás.
 */
export const MIRROR_SCENE_TRIGGER_ID = "story-ch5-event-mirror";
/** Duelo que arranca al cerrar la escena (nodo fantasma: no ocupa casilla, aparece guionizado). */
export const MIRROR_SCENE_DUEL_ID = "story-ch5-duel-4";
/** Casilla del DOBLE, al otro lado de la línea de espejos, enfrentado al jugador. */
export const MIRROR_DOUBLE_TILE = { tileX: 24, tileY: 26 } as const;
/** Casilla del trigger: en el eje de simetría, con el doble a la vista. */
export const MIRROR_TRIGGER_TILE = { tileX: 24, tileY: 30 } as const;
/** Fila del muro de espejos y hueco central por el que se cruza (y por el que baja el doble). */
const MIRROR_LINE_TILE_Y = 28;
const MIRROR_GAP_X0 = 23;
const MIRROR_GAP_X1 = 25;

/** Portal al Acto 6, al fondo del trono. Sólo se abre tras vencer a El Reflejo. */
export const ACT_6_PORTAL_ID = "story-ch5-transition-to-act6";

/**
 * Acto 5 — Core Invertido. Mapa vertical: se sube desde la entrada (abajo) hasta el trono (arriba), pasando por
 * tres etapas obligatorias (las dos placas, la escena del Reflejo y los tres sellos del atrio).
 */
export function buildAct5OverworldTilemap(): IOverworldTilemap {
  const map = buildVoidLayers(MAP_WIDTH, MAP_HEIGHT);

  // ── Salas ──────────────────────────────────────────────────────────────────
  fillRoom(map, { x0: 17, y0: 55, x1: 31, y1: 61 }); // entrada (servicios + retorno al Acto 4)
  fillRoom(map, { x0: 22, y0: 37, x1: 26, y1: 51 }); // espina central de la sala de espejos
  fillRoom(map, { x0: 5, y0: 39, x1: 19, y1: 48 }); //  ala izquierda (placa A)
  fillRoom(map, { x0: 29, y0: 39, x1: 43, y1: 48 }); // ala derecha (placa B)
  fillRoom(map, { x0: 14, y0: 23, x1: 34, y1: 33 }); // sala del Reflejo
  fillRoom(map, { x0: 12, y0: 8, x1: 36, y1: 21 }); //  atrio de los tres sellos
  fillRoom(map, { x0: 18, y0: 2, x1: 30, y1: 6 }); //   trono vacío

  // ── Corredores (una casilla: cada uno es un cuello de botella real) ────────
  carveCorridor(map, { x: 24, y: 51 }, { x: 24, y: 55 }); // entrada -> espina
  carveCorridor(map, { x: 19, y: 44 }, { x: 22, y: 44 }); // espina -> ala izquierda
  carveCorridor(map, { x: 26, y: 44 }, { x: 29, y: 44 }); // espina -> ala derecha
  carveCorridor(map, { x: 24, y: 33 }, { x: 24, y: 37 }); // espina -> sala del Reflejo (con compuerta)
  carveCorridor(map, { x: 24, y: 19 }, { x: 24, y: 23 }); // sala del Reflejo -> atrio
  carveCorridor(map, { x: 24, y: 6 }, { x: 24, y: 8 }); //   atrio -> trono (con compuerta)

  // ── La línea de espejos: muro de pantallas que parte la sala en dos mitades idénticas, con un único hueco
  // en el eje. El doble vive arriba, el jugador llega por abajo, y la simetría es lo que hace legible la escena.
  buildWall(map, { x0: 14, y0: MIRROR_LINE_TILE_Y, x1: MIRROR_GAP_X0 - 1, y1: MIRROR_LINE_TILE_Y }, OVERLAY_TILE.HOLO_SCREEN);
  buildWall(map, { x0: MIRROR_GAP_X1 + 1, y0: MIRROR_LINE_TILE_Y, x1: 34, y1: MIRROR_LINE_TILE_Y }, OVERLAY_TILE.HOLO_SCREEN);

  // ── Atrezzo: el Core repite lo que ya has visto, en negativo. Pilones y racks en espejo a ambos lados.
  for (const [x, y] of [[18, 40], [18, 47], [30, 40], [30, 47]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.DATA_PYLON);
  }
  for (const [x, y] of [[6, 40], [6, 47], [42, 40], [42, 47]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.SERVER_RACK);
  }
  for (const [x, y] of [[13, 9], [35, 9], [13, 20], [35, 20]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.COOLING_UNIT);
  }
  // El trono: dos pilones flanqueando el asiento. Está vacío, y esa es toda la revelación del acto.
  placeStructure(map, 22, 2, OVERLAY_TILE.DATA_PYLON);
  placeStructure(map, 26, 2, OVERLAY_TILE.DATA_PYLON);

  // ── Casillas sólidas (se interactúa desde el lado) ─────────────────────────
  markSolid(map, 20, 60, "market");
  markSolid(map, 22, 60, "arsenal");
  markSolid(map, 28, 60, "teleport");
  markSolid(map, 24, 53, "duel-1"); // Eco: chokepoint del corredor de entrada
  // Las cajas y las placas NO son sólidas: la caja se empuja sobre suelo caminable y la placa se pisa.
  markSolid(map, 11, 46, "box-reset-left");
  markSolid(map, 37, 46, "box-reset-right");
  markSolid(map, 14, 19, "seal-1");
  markSolid(map, 34, 19, "seal-2");
  markSolid(map, 24, 16, "seal-3");
  markSolid(map, 13, 10, "reward-card");
  markSolid(map, 35, 10, "reward-usb");
  markSolid(map, 24, 3, "duel-5"); // El Reflejo, en el trono vacío

  return validateOverworldTilemap({
    schemaVersion: 2,
    id: "act-5",
    act: 5,
    ambient: "MIRROR",
    tileSize: 52,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    layers: { ground: map.ground, overlay: map.overlay },
    collision: map.collision,
    objects: [
      // ── Servicios + retorno al Acto 4 ─────────────────────────────────────
      { id: "story-a5-market", kind: "MARKET", tileX: 20, tileY: 60, sprite: "market", trigger: "ADJACENT_ACTION" },
      { id: "story-a5-arsenal", kind: "ARSENAL", tileX: 22, tileY: 60, sprite: "arsenal", trigger: "ADJACENT_ACTION" },
      { id: "story-a5-teleport-hub", kind: "TELEPORT", tileX: 28, tileY: 60, sprite: "teleport", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-transition-to-act4", kind: "WARP", tileX: 18, tileY: 57, sprite: "portal", trigger: "STEP_ON", warp: { toMapId: "act-4", toSpawnId: "spawn-entry", direction: "backward" } },

      // ── Rivales ───────────────────────────────────────────────────────────
      // duel-1: Eco planta cara en el único corredor de entrada. No se esquiva.
      { id: "story-ch5-duel-1", kind: "DUEL", tileX: 24, tileY: 53, sprite: "eco", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/5/duel/1", imageSrc: ECO, facing: "DOWN", visionRange: 3 },
      // duel-2 / duel-3: los Ecos de las alas PATRULLAN (no son sólidos: un rival sólido paseando podría sellar
      // el paso a la placa). El reto es cruzar su fila cuando el haz mira al otro lado.
      { id: "story-ch5-duel-2", kind: "DUEL", tileX: 14, tileY: 44, sprite: "eco", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/5/duel/2", imageSrc: ECO, facing: "LEFT", visionRange: 3, patrolAxis: "V", patrolLength: 3, patrolSweep: true },
      { id: "story-ch5-duel-3", kind: "DUEL", tileX: 34, tileY: 44, sprite: "eco", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/5/duel/3", imageSrc: ECO, facing: "RIGHT", visionRange: 3, patrolAxis: "V", patrolLength: 3, patrolSweep: true },
      // duel-4 (Verso): nodo FANTASMA. No se dibuja ni ocupa casilla; existe sólo para el combate que lanza la
      // escena del Reflejo. Su casilla nominal es donde acaba la escena, pegado al jugador.
      { id: MIRROR_SCENE_DUEL_ID, kind: "DUEL", tileX: MIRROR_TRIGGER_TILE.tileX, tileY: MIRROR_TRIGGER_TILE.tileY - 1, sprite: "verso", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/5/duel/4", imageSrc: VERSO, facing: "DOWN", hidden: true },
      // duel-5: El Reflejo, sentado en un trono que no es suyo. Domina la sala entera (visionRect).
      { id: "story-ch5-duel-5", kind: "BOSS", tileX: 24, tileY: 3, sprite: "reflejo", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/5/duel/5", imageSrc: REFLEJO, facing: "DOWN", visionRange: 3, visionRect: { x0: 18, y0: 2, x1: 30, y1: 5 } },

      // ── Puzzle simétrico: DOS cajas, DOS placas, las dos obligatorias ──────
      // Es la lectura del acto hecha mecánica: la misma solución, ejecutada en espejo a los dos lados.
      { id: "story-ch5-box-left", kind: "BOX", tileX: 9, tileY: 44, sprite: "box", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-plate-left", kind: "PLATE", tileX: 6, tileY: 44, sprite: "plate", trigger: "ADJACENT_ACTION" },
      { id: "story-a5-box-reset-left", kind: "BOX_RESET", tileX: 11, tileY: 46, sprite: "reset", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-box-right", kind: "BOX", tileX: 39, tileY: 44, sprite: "box", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-plate-right", kind: "PLATE", tileX: 42, tileY: 44, sprite: "plate", trigger: "ADJACENT_ACTION" },
      { id: "story-a5-box-reset-right", kind: "BOX_RESET", tileX: 37, tileY: 46, sprite: "reset", trigger: "ADJACENT_ACTION" },
      // La compuerta del atrio exige LAS DOS placas: no basta con hacer un ala.
      { id: "story-a5-gate-mirror", kind: "GATE", tileX: 24, tileY: 36, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch5-plate-left", "story-ch5-plate-right"] },

      // ── Los tres sellos del atrio (consolas): abren la puerta del trono ────
      { id: "story-ch5-seal-1", kind: "EVENT", tileX: 14, tileY: 19, sprite: "console", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-seal-2", kind: "EVENT", tileX: 34, tileY: 19, sprite: "console", trigger: "ADJACENT_ACTION" },
      { id: "story-ch5-seal-3", kind: "EVENT", tileX: 24, tileY: 16, sprite: "console", trigger: "ADJACENT_ACTION" },
      { id: "story-a5-gate-throne", kind: "GATE", tileX: 24, tileY: 7, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch5-seal-1", "story-ch5-seal-2", "story-ch5-seal-3", MIRROR_SCENE_DUEL_ID] },

      // ── Recompensas del atrio (en los nichos de las esquinas altas) ───────
      { id: "story-ch5-card-mirror", kind: "REWARD_CARD", tileX: 13, tileY: 10, sprite: "card", trigger: "ADJACENT_ACTION", imageSrc: CARD_MIRROR_INJECTION },
      { id: "story-ch5-cache-usb", kind: "REWARD_OBJECT", tileX: 35, tileY: 10, sprite: "usb-raro", trigger: "ADJACENT_ACTION", imageSrc: USB },

      // ── Eventos ───────────────────────────────────────────────────────────
      // E2 (escena firma): trigger oculto en el eje de simetría, con el doble ya a la vista al otro lado.
      { id: MIRROR_SCENE_TRIGGER_ID, kind: "EVENT", tileX: MIRROR_TRIGGER_TILE.tileX, tileY: MIRROR_TRIGGER_TILE.tileY, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // E3: el trono está vacío. Se pisa justo antes de encararse con El Reflejo.
      { id: "story-ch5-event-empty-throne", kind: "EVENT", tileX: 24, tileY: 5, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // E4: la fuga. Se pisa al salir hacia el portal, ya con El Reflejo vencido.
      { id: "story-ch5-event-escape", kind: "EVENT", tileX: 28, tileY: 3, sprite: "hidden", trigger: "STEP_ON", hidden: true, gateRequiredNodeIds: ["story-ch5-duel-5"] },

      // ── Portal al Acto 6 ──────────────────────────────────────────────────
      { id: ACT_6_PORTAL_ID, kind: "WARP", tileX: 28, tileY: 2, sprite: "portal", trigger: "STEP_ON", gateRequiredNodeIds: ["story-ch5-duel-5"], warp: { toMapId: "act-6", toSpawnId: "spawn-entry", direction: "forward" } },
    ],
    spawns: [{ id: "spawn-entry", tileX: 24, tileY: 59, facing: "UP" }],
    defaultSpawnId: "spawn-entry",
  });
}
