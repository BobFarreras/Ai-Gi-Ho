// src/services/story/overworld/act-7-overworld-tilemap.ts - Acto 7 "La Fundición Cuántica": ambiente FORGE
// (ámbar y magma) y el único mapa de la campaña que se juega HACIA ABAJO — se entra por la planta más alta y se
// desciende, planta a planta, hasta el sótano donde despierta el Prototipo Cero. Las cintas de la cadena de
// montaje son el obstáculo recurrente: una va en contra y no se baja hasta invertirla.
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import { validateOverworldTilemap } from "@/services/story/overworld/validate-tilemap";
import { GROUND_TILE, OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";
import {
  buildVoidLayers,
  buildWall,
  carveCorridor,
  fillRoom,
  markSolid,
  placeBelt,
  placeStructure,
} from "@/services/story/overworld/tilemap-build-kit";

const MAP_WIDTH = 44;
const MAP_HEIGHT = 72;

// Avatares reutilizados del roster existente (editables desde el panel admin).
const OPERARIO = "/assets/story/opponents/opp-ch4-soldado-terminal/avatar-Soldado-terminal.webp";
const ALQUIMISTA = "/assets/story/opponents/opp-ch1-jaku/avatar-Jaku.webp";
const MIDUTECH = "/assets/story/opponents/opp-ch1-midutech/avatar-Midutech.webp";
const PROTOTIPO = "/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp";
const ATK_AUGMENT = "/assets/items/item-nucleo-overclock.webp";
const CARD_SUPER_C = "/assets/renders/super-c.webp";

/**
 * ESCENA FIRMA "La Colada". Ante la boca de la cadena, la máquina escupe una carta sobre la cinta y dos
 * rivales se la disputan por encima sin verte… hasta que los dos giran la cabeza a la vez.
 */
export const CASTING_SCENE_TRIGGER_ID = "story-ch7-event-casting";
/** Duelo que arranca al cerrar la escena: el Alquimista, que es quien decide qué se fabrica. */
export const CASTING_SCENE_DUEL_ID = "story-ch7-duel-3";
/** Fila de la CADENA (cinta que corre hacia la derecha) y casillas de los dos rivales, justo debajo. */
export const CASTING_LINE_TILE_Y = 22;
export const CASTING_ALQUIMISTA_TILE = { tileX: 18, tileY: 23 } as const;
export const CASTING_MIDUTECH_TILE = { tileX: 26, tileY: 23 } as const;
/**
 * Los dos también existen como ATREZZO: se ven discutiendo desde que se asoma uno a la planta, en vez de
 * materializarse de golpe. Al arrancar la escena se ocultan y toman el relevo los NPCs guionizados.
 */
export const CASTING_SCENERY_ALQUIMISTA_ID = "story-ch7-npc-casting-alquimista";
export const CASTING_SCENERY_MIDUTECH_ID = "story-ch7-npc-casting-midutech";

/** La pasarela de bajada entre la planta 3 y la planta 2: nace EN CONTRA (sube) y hay que invertirla. */
const DESCENT_BELT_RECT = { x0: 22, y0: 29, x1: 22, y1: 33 } as const;

/** Portal al Acto 8, al fondo del sótano. */
export const ACT_8_PORTAL_ID = "story-ch7-transition-to-act8";

/**
 * Acto 7 — La Fundición Cuántica. Cuatro plantas de arriba abajo más el sótano del Prototipo.
 */
export function buildAct7OverworldTilemap(): IOverworldTilemap {
  const map = buildVoidLayers(MAP_WIDTH, MAP_HEIGHT);

  // ── Plantas (de la más alta a la más baja) ────────────────────────────────
  fillRoom(map, { x0: 6, y0: 3, x1: 38, y1: 14 }); //  planta 4: entrada y servicios
  fillRoom(map, { x0: 6, y0: 18, x1: 38, y1: 29 }); // planta 3: la cadena y la escena de la Colada
  fillRoom(map, { x0: 6, y0: 33, x1: 38, y1: 44 }); // planta 2: Midutech Compilado
  fillRoom(map, { x0: 6, y0: 48, x1: 38, y1: 60 }); // planta 1: la fundición apagada (laberinto de chasis)
  fillRoom(map, { x0: 12, y0: 64, x1: 32, y1: 69 }); // sótano: el Prototipo Cero

  // ── Escaleras (corredores de una casilla entre plantas) ───────────────────
  carveCorridor(map, { x: 22, y: 14 }, { x: 22, y: 18 }); // planta 4 -> 3
  carveCorridor(map, { x: 22, y: 29 }, { x: 22, y: 33 }); // planta 3 -> 2 (la pasarela en contra)
  carveCorridor(map, { x: 22, y: 44 }, { x: 22, y: 48 }); // planta 2 -> 1 (con compuerta post-Midutech)
  carveCorridor(map, { x: 22, y: 60 }, { x: 22, y: 64 }); // planta 1 -> sótano

  // ── Planta 4: dos cintas cruzadas. No bloquean, desordenan: cruzar la sala en línea recta no funciona.
  for (let tileX = 10; tileX <= 20; tileX++) placeBelt(map, tileX, 9, GROUND_TILE.BELT_RIGHT);
  for (let tileX = 24; tileX <= 34; tileX++) placeBelt(map, tileX, 12, GROUND_TILE.BELT_LEFT);
  // Y un puzzle de caja: empujar la caja a la derecha sobre la placa abre la compuerta de la escalera.
  // (La caja viaja por suelo firme, no por la cinta: la fila 7 está libre a propósito.)

  // ── Planta 3: LA CADENA. Una cinta larga que corre hacia la derecha, con la máquina en su boca.
  // Hueco en x=22: la boca de salida de la máquina, y de paso la única casilla de la cadena que se puede
  // cruzar sin que te arrastre. La escalera baja justo por ahí.
  for (let tileX = 14; tileX <= 30; tileX++) {
    if (tileX !== 22) placeBelt(map, tileX, CASTING_LINE_TILE_Y, GROUND_TILE.BELT_RIGHT);
  }
  placeStructure(map, 12, CASTING_LINE_TILE_Y, OVERLAY_TILE.CARD_FORGE);
  placeStructure(map, 13, CASTING_LINE_TILE_Y, OVERLAY_TILE.CARD_FORGE_RIGHT);

  // ── La pasarela de bajada nace EN CONTRA (empuja hacia arriba): sin invertirla no se baja a la planta 2.
  for (let tileY = DESCENT_BELT_RECT.y0; tileY <= DESCENT_BELT_RECT.y1; tileY++) {
    placeBelt(map, DESCENT_BELT_RECT.x0, tileY, GROUND_TILE.BELT_UP);
  }

  // ── Planta 1: la fundición apagada. Cuatro hileras de chasis muertos: hay que serpentear.
  for (const [rowY, gapX] of [[51, 12], [54, 32], [57, 16]] as Array<[number, number]>) {
    buildWall(map, { x0: 6, y0: rowY, x1: 38, y1: rowY }, OVERLAY_TILE.SERVER_RACK, { x: gapX, y: rowY });
  }

  // ── Atrezzo de fundición: unidades de refrigeración a reventar y pilones de colada ────
  for (const [x, y] of [[8, 4], [36, 4], [8, 13], [36, 13]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.COOLING_UNIT);
  }
  for (const [x, y] of [[8, 19], [36, 19], [8, 28], [36, 28]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.DATA_PYLON);
  }
  for (const [x, y] of [[8, 34], [36, 34], [8, 43], [36, 43]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.SERVER_RACK);
  }
  for (const [x, y] of [[14, 65], [30, 65]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.HOLO_SCREEN);
  }

  // ── Casillas sólidas ───────────────────────────────────────────────────────
  markSolid(map, 10, 4, "market");
  markSolid(map, 12, 4, "arsenal");
  markSolid(map, 16, 4, "teleport");
  // Caja y placa se pisan (empujar / pisar), sólo el botón de reinicio es sólido.
  markSolid(map, 24, 5, "box-reset-planta4");
  markSolid(map, 22, 13, "duel-1"); // Operario, en la boca de la escalera
  markSolid(map, 8, 20, "reward-atk"); // callejón de la planta 3
  markSolid(map, 30, 27, "duel-2"); // Operario, guardando el interruptor
  markSolid(map, 34, 27, "belt-switch");
  // Los dos NPCs de atrezzo de la Colada NO se marcan sólidos: la cinemática traza el camino del
  // Alquimista con un BFS que arranca en su propia casilla, y sobre celda bloqueada no habría camino.
  markSolid(map, 22, 40, "duel-4"); // Midutech: Compilado
  markSolid(map, 34, 36, "reward-card");
  markSolid(map, 10, 50, "belt-switch-bottom"); // gemelo: devuelve la pasarela para poder subir
  markSolid(map, 22, 67, "duel-5"); // Prototipo Cero

  return validateOverworldTilemap({
    schemaVersion: 2,
    id: "act-7",
    act: 7,
    ambient: "FORGE",
    tileSize: 52,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    layers: { ground: map.ground, overlay: map.overlay },
    collision: map.collision,
    objects: [
      // ── Servicios + retorno al Acto 6 ─────────────────────────────────────
      { id: "story-a7-market", kind: "MARKET", tileX: 10, tileY: 4, sprite: "market", trigger: "ADJACENT_ACTION" },
      { id: "story-a7-arsenal", kind: "ARSENAL", tileX: 12, tileY: 4, sprite: "arsenal", trigger: "ADJACENT_ACTION" },
      { id: "story-a7-teleport-hub", kind: "TELEPORT", tileX: 16, tileY: 4, sprite: "teleport", trigger: "ADJACENT_ACTION" },
      { id: "story-ch7-transition-to-act6", kind: "WARP", tileX: 34, tileY: 4, sprite: "portal", trigger: "STEP_ON", warp: { toMapId: "act-6", toSpawnId: "spawn-entry", direction: "backward" } },

      // ── Planta 4: puzzle de caja + compuerta de la escalera ───────────────
      { id: "story-ch7-box-1", kind: "BOX", tileX: 26, tileY: 7, sprite: "box", trigger: "ADJACENT_ACTION" },
      { id: "story-ch7-plate-1", kind: "PLATE", tileX: 30, tileY: 7, sprite: "plate", trigger: "ADJACENT_ACTION" },
      { id: "story-a7-box-reset", kind: "BOX_RESET", tileX: 24, tileY: 5, sprite: "reset", trigger: "ADJACENT_ACTION" },
      { id: "story-a7-gate-floor3", kind: "GATE", tileX: 22, tileY: 15, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch7-plate-1", "story-ch7-duel-1"] },

      // ── Rivales ───────────────────────────────────────────────────────────
      { id: "story-ch7-duel-1", kind: "DUEL", tileX: 22, tileY: 13, sprite: "operario", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/7/duel/1", imageSrc: OPERARIO, facing: "DOWN", visionRange: 3 },
      { id: "story-ch7-duel-2", kind: "DUEL", tileX: 30, tileY: 27, sprite: "operario", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/7/duel/2", imageSrc: OPERARIO, facing: "RIGHT", visionRange: 3 },
      // duel-3 (Alquimista): nodo FANTASMA de la escena de la Colada. Su casilla nominal es donde acaba la
      // escena, pegado al jugador (su atrezzo ocupa la suya y dos objetos no comparten celda).
      { id: CASTING_SCENE_DUEL_ID, kind: "DUEL", tileX: CASTING_ALQUIMISTA_TILE.tileX + 1, tileY: CASTING_ALQUIMISTA_TILE.tileY, sprite: "alquimista", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/7/duel/3", imageSrc: ALQUIMISTA, facing: "UP", hidden: true },
      { id: "story-ch7-duel-4", kind: "DUEL", tileX: 22, tileY: 40, sprite: "midutech", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/7/duel/4", imageSrc: MIDUTECH, facing: "DOWN", visionRange: 3, visionRect: { x0: 14, y0: 36, x1: 30, y1: 43 } },
      { id: "story-ch7-duel-5", kind: "BOSS", tileX: 22, tileY: 67, sprite: "prototipo", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/7/duel/5", imageSrc: PROTOTIPO, facing: "DOWN", visionRange: 3, visionRect: { x0: 12, y0: 64, x1: 32, y1: 69 } },

      // ── ATREZZO de la Colada: los dos ya están discutiendo antes de que salte la escena ──
      { id: CASTING_SCENERY_ALQUIMISTA_ID, kind: "NPC", tileX: CASTING_ALQUIMISTA_TILE.tileX, tileY: CASTING_ALQUIMISTA_TILE.tileY, sprite: "alquimista", trigger: "ADJACENT_ACTION", imageSrc: ALQUIMISTA, facing: "UP" },
      { id: CASTING_SCENERY_MIDUTECH_ID, kind: "NPC", tileX: CASTING_MIDUTECH_TILE.tileX, tileY: CASTING_MIDUTECH_TILE.tileY, sprite: "midutech", trigger: "ADJACENT_ACTION", imageSrc: MIDUTECH, facing: "UP" },

      // ── La pasarela en contra: dos posiciones de la misma palanca ─────────
      // El de la planta 3 la INVIERTE (se baja); el gemelo de la planta 1 la RESTAURA (se sube). Siempre hay
      // uno alcanzable, así que no hay forma de quedarse encerrado abajo.
      { id: "story-ch7-belt-switch", kind: "SWITCH", tileX: 34, tileY: 27, sprite: "switch", trigger: "ADJACENT_ACTION", beltToggleRect: DESCENT_BELT_RECT, beltToggleMode: "INVERT", gateRequiredNodeIds: ["story-ch7-duel-2"] },
      { id: "story-ch7-belt-switch-bottom", kind: "SWITCH", tileX: 10, tileY: 50, sprite: "switch", trigger: "ADJACENT_ACTION", beltToggleRect: DESCENT_BELT_RECT, beltToggleMode: "RESTORE" },

      // ── Compuerta post-Midutech: sella la bajada a la planta 1 ────────────
      { id: "story-a7-gate-floor1", kind: "GATE", tileX: 22, tileY: 46, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch7-duel-4"] },

      // ── Recompensas ───────────────────────────────────────────────────────
      { id: "story-ch7-cache-atk", kind: "REWARD_OBJECT", tileX: 8, tileY: 20, sprite: "atk-augment", trigger: "ADJACENT_ACTION", imageSrc: ATK_AUGMENT },
      { id: "story-ch7-card-superc", kind: "REWARD_CARD", tileX: 34, tileY: 36, sprite: "card", trigger: "ADJACENT_ACTION", imageSrc: CARD_SUPER_C, gateRequiredNodeIds: [CASTING_SCENE_DUEL_ID] },

      // ── Eventos ───────────────────────────────────────────────────────────
      // La escena de la Colada: trigger en el descansillo de la planta 3, con la cadena a la vista.
      { id: CASTING_SCENE_TRIGGER_ID, kind: "EVENT", tileX: 22, tileY: 20, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // Midutech, vivo y de empleado. Se lee antes de encararse con él.
      { id: "story-ch7-event-employee", kind: "EVENT", tileX: 22, tileY: 36, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // El Prototipo abre los ojos: cierre del acto.
      { id: "story-ch7-event-awakening", kind: "EVENT", tileX: 22, tileY: 65, sprite: "hidden", trigger: "STEP_ON", hidden: true },

      // ── Portal al Acto 8 ──────────────────────────────────────────────────
      { id: ACT_8_PORTAL_ID, kind: "WARP", tileX: 26, tileY: 68, sprite: "portal", trigger: "STEP_ON", gateRequiredNodeIds: ["story-ch7-duel-5"], warp: { toMapId: "act-8", toSpawnId: "spawn-entry", direction: "forward" } },
    ],
    spawns: [{ id: "spawn-entry", tileX: 22, tileY: 5, facing: "DOWN" }],
    defaultSpawnId: "spawn-entry",
  });
}
