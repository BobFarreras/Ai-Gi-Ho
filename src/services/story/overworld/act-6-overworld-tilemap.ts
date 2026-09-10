// src/services/story/overworld/act-6-overworld-tilemap.ts - Acto 6 "La Red Abierta": ambiente CLOUD (azul de
// cielo abierto) y, por primera vez en la campaña, un mapa ANCHO y NO LINEAL. Un hub central con cuatro bocas:
// tres regiones que se pueden hacer en el orden que se quiera (norte, este, sur), cada una con su llave de
// router, y una cuarta —el oeste— que sólo se abre con las tres. Allí esperan el terminal y el Leviatán.
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import { validateOverworldTilemap } from "@/services/story/overworld/validate-tilemap";
import { GROUND_TILE, OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";
import {
  buildVoidLayers,
  carveCorridor,
  fillRoom,
  markSolid,
  placeBelt,
  placeStructure,
} from "@/services/story/overworld/tilemap-build-kit";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 48;

// Avatares reutilizados del roster existente (se cambian desde el panel admin cuando haya arte propio).
const NIMBUS = "/assets/story/opponents/opp-ch3-soldado-laptop/avatar-Soldado-laptop.webp";
const ENJAMBRE = "/assets/story/opponents/opp-ch1-soldier-act01/avatar-Soldado-act01.webp";
const ENJAMBRE_MAYOR = "/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp";
const LEVIATAN = "/assets/story/opponents/opp-ch1-guill/avatar-Guill.webp";
const USB = "/assets/items/candy-usb-raro.webp";
const CARD_CLOUDFLARE = "/assets/renders/cloudflare.webp";

/**
 * ESCENA FIRMA "El Enjambre". En una plaza abierta sin paredes, cinco copias degradadas de La Entidad entran
 * ANDANDO desde cinco bocas a la vez y te rodean sin tocarte. Cuatro se apagan; la quinta se queda.
 */
export const SWARM_SCENE_TRIGGER_ID = "story-ch6-event-swarm";
/** Duelo que arranca al cerrar la escena (nodo fantasma: no ocupa casilla). */
export const SWARM_SCENE_DUEL_ID = "story-ch6-duel-4";
/** Centro de la plaza: donde se planta el jugador y alrededor de donde se cierra el círculo. */
export const SWARM_CENTER_TILE = { tileX: 30, tileY: 41 } as const;
/**
 * Las cinco bocas de la plaza (de dónde entra cada copia) y su casilla final del círculo. Entran andando
 * desde el borde: nadie se materializa de la nada, que es lo que hace que dé mal cuerpo.
 */
export const SWARM_ENTRY_TILES = [
  { from: { tileX: 30, tileY: 37 }, to: { tileX: 30, tileY: 39 } },
  { from: { tileX: 22, tileY: 37 }, to: { tileX: 28, tileY: 40 } },
  { from: { tileX: 38, tileY: 37 }, to: { tileX: 32, tileY: 40 } },
  { from: { tileX: 22, tileY: 45 }, to: { tileX: 28, tileY: 42 } },
  { from: { tileX: 38, tileY: 45 }, to: { tileX: 32, tileY: 42 } },
] as const;

/** Portal al Acto 7, al fondo de la cámara del Leviatán. */
export const ACT_7_PORTAL_ID = "story-ch6-transition-to-act7";

/**
 * Acto 6 — La Red Abierta. Hub central, tres regiones libres y una cuarta cerrada con tres llaves.
 */
export function buildAct6OverworldTilemap(): IOverworldTilemap {
  const map = buildVoidLayers(MAP_WIDTH, MAP_HEIGHT);

  // ── Plataformas flotantes (aquí el suelo es HIERBA: la red pública está viva, no es un sótano) ─────
  fillRoom(map, { x0: 26, y0: 20, x1: 34, y1: 28 }, GROUND_TILE.GRASS); // hub de routers
  fillRoom(map, { x0: 22, y0: 2, x1: 38, y1: 12 }, GROUND_TILE.GRASS); //  región NORTE
  fillRoom(map, { x0: 44, y0: 16, x1: 58, y1: 32 }, GROUND_TILE.GRASS); // región ESTE (los flujos)
  fillRoom(map, { x0: 20, y0: 36, x1: 40, y1: 46 }, GROUND_TILE.GRASS); // región SUR (la plaza del Enjambre)
  fillRoom(map, { x0: 2, y0: 16, x1: 16, y1: 32 }, GROUND_TILE.GRASS); //  región OESTE (terminal)
  fillRoom(map, { x0: 2, y0: 4, x1: 16, y1: 12 }, GROUND_TILE.GRASS); //   cámara del Leviatán

  // ── Flujos de datos entre plataformas (los corredores son puentes de una casilla) ──────────────────
  carveCorridor(map, { x: 30, y: 12 }, { x: 30, y: 20 }); // hub -> norte
  carveCorridor(map, { x: 34, y: 24 }, { x: 44, y: 24 }); // hub -> este
  carveCorridor(map, { x: 30, y: 28 }, { x: 30, y: 36 }); // hub -> sur
  carveCorridor(map, { x: 16, y: 24 }, { x: 26, y: 24 }); // hub -> oeste (con la compuerta de las 3 llaves)
  carveCorridor(map, { x: 9, y: 12 }, { x: 9, y: 16 }); //  oeste -> cámara del Leviatán (con compuerta)

  // ── Los FLUJOS de la región este: una cinta que sube por el borde de la plataforma hasta el nicho de
  // la carta. No es un candado, es una corriente: te lleva, y volver es cosa tuya.
  for (let tileY = 30; tileY >= 22; tileY--) placeBelt(map, 51, tileY, GROUND_TILE.BELT_UP);

  // ── Atrezzo: antenas y balizas. En la red abierta no hay racks: hay pilones de datos a la intemperie.
  for (const [x, y] of [[23, 3], [37, 3], [23, 11], [37, 11]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.DATA_PYLON);
  }
  for (const [x, y] of [[46, 18], [56, 18], [46, 30], [56, 30]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.DATA_PYLON);
  }
  for (const [x, y] of [[4, 18], [14, 18], [4, 30], [14, 30]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.COOLING_UNIT);
  }
  for (const [x, y] of [[4, 5], [14, 5]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.HOLO_SCREEN);
  }

  // ── Casillas sólidas ───────────────────────────────────────────────────────
  markSolid(map, 27, 27, "market");
  markSolid(map, 29, 27, "arsenal");
  markSolid(map, 33, 27, "teleport");
  markSolid(map, 30, 8, "duel-1"); //  Nimbus, en el centro de la región norte
  markSolid(map, 24, 4, "key-north");
  markSolid(map, 50, 24, "duel-2"); // Nimbus, cortando la plataforma este
  markSolid(map, 51, 18, "key-east");
  markSolid(map, 24, 44, "duel-3"); // Enjambre, guardando la llave sur
  markSolid(map, 22, 44, "key-south");
  markSolid(map, 6, 24, "terminal");
  markSolid(map, 9, 6, "duel-5"); //  Leviatán del Borde
  markSolid(map, 36, 6, "reward-usb");
  markSolid(map, 51, 20, "reward-card"); // al final de la corriente

  return validateOverworldTilemap({
    schemaVersion: 2,
    id: "act-6",
    act: 6,
    ambient: "CLOUD",
    tileSize: 52,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    layers: { ground: map.ground, overlay: map.overlay },
    collision: map.collision,
    objects: [
      // ── Servicios + retorno al Acto 5 ─────────────────────────────────────
      { id: "story-a6-market", kind: "MARKET", tileX: 27, tileY: 27, sprite: "market", trigger: "ADJACENT_ACTION" },
      { id: "story-a6-arsenal", kind: "ARSENAL", tileX: 29, tileY: 27, sprite: "arsenal", trigger: "ADJACENT_ACTION" },
      { id: "story-a6-teleport-hub", kind: "TELEPORT", tileX: 33, tileY: 27, sprite: "teleport", trigger: "ADJACENT_ACTION" },
      { id: "story-ch6-transition-to-act5", kind: "WARP", tileX: 27, tileY: 21, sprite: "portal", trigger: "STEP_ON", warp: { toMapId: "act-5", toSpawnId: "spawn-entry", direction: "backward" } },

      // ── Rivales de las tres regiones libres ───────────────────────────────
      { id: "story-ch6-duel-1", kind: "DUEL", tileX: 30, tileY: 8, sprite: "nimbus", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/6/duel/1", imageSrc: NIMBUS, facing: "DOWN", visionRange: 3, visionRect: { x0: 26, y0: 5, x1: 34, y1: 11 } },
      { id: "story-ch6-duel-2", kind: "DUEL", tileX: 50, tileY: 24, sprite: "nimbus", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/6/duel/2", imageSrc: NIMBUS, facing: "LEFT", visionRange: 3 },
      { id: "story-ch6-duel-3", kind: "DUEL", tileX: 24, tileY: 44, sprite: "enjambre", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/6/duel/3", imageSrc: ENJAMBRE, facing: "RIGHT", visionRange: 3 },
      // duel-4: nodo FANTASMA de la escena del Enjambre (aparece guionizado, no ocupa casilla).
      { id: SWARM_SCENE_DUEL_ID, kind: "DUEL", tileX: SWARM_CENTER_TILE.tileX, tileY: SWARM_CENTER_TILE.tileY - 2, sprite: "enjambre-mayor", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/6/duel/4", imageSrc: ENJAMBRE_MAYOR, facing: "DOWN", hidden: true },
      // duel-5: el Leviatán domina su cámara entera. Al entrar, combate garantizado.
      { id: "story-ch6-duel-5", kind: "BOSS", tileX: 9, tileY: 6, sprite: "leviatan", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/6/duel/5", imageSrc: LEVIATAN, facing: "DOWN", visionRange: 3, visionRect: { x0: 3, y0: 4, x1: 15, y1: 11 } },

      // ── Las tres llaves de router (consolas). Cada una exige haber ganado su región ────
      { id: "story-ch6-key-north", kind: "EVENT", tileX: 24, tileY: 4, sprite: "console", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch6-duel-1"] },
      { id: "story-ch6-key-east", kind: "EVENT", tileX: 51, tileY: 18, sprite: "console", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch6-duel-2"] },
      { id: "story-ch6-key-south", kind: "EVENT", tileX: 22, tileY: 44, sprite: "console", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch6-duel-3"] },
      // La cuarta boca del hub: cerrada hasta tener las tres llaves. Es lo único lineal del acto.
      { id: "story-a6-gate-west", kind: "GATE", tileX: 20, tileY: 24, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch6-key-north", "story-ch6-key-east", "story-ch6-key-south"] },

      // ── Terminal de código + compuerta del Leviatán ───────────────────────
      { id: "story-ch6-edge-terminal", kind: "SUBMISSION", tileX: 6, tileY: 24, sprite: "terminal", trigger: "ADJACENT_ACTION" },
      { id: "story-a6-gate-leviathan", kind: "GATE", tileX: 9, tileY: 14, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch6-edge-terminal", SWARM_SCENE_DUEL_ID] },

      // ── Recompensas ───────────────────────────────────────────────────────
      { id: "story-ch6-cache-usb", kind: "REWARD_OBJECT", tileX: 36, tileY: 6, sprite: "usb-raro", trigger: "ADJACENT_ACTION", imageSrc: USB },
      { id: "story-ch6-card-edge", kind: "REWARD_CARD", tileX: 51, tileY: 20, sprite: "card", trigger: "ADJACENT_ACTION", imageSrc: CARD_CLOUDFLARE },

      // ── Eventos ───────────────────────────────────────────────────────────
      { id: SWARM_SCENE_TRIGGER_ID, kind: "EVENT", tileX: SWARM_CENTER_TILE.tileX, tileY: SWARM_CENTER_TILE.tileY, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // El rastro de La Entidad: se lee al llegar al hub, y explica por qué el cielo está abierto.
      { id: "story-ch6-event-trail", kind: "EVENT", tileX: 30, tileY: 22, sprite: "console", trigger: "ADJACENT_ACTION" },
      // Lo que confiesa el Leviatán al caer: se están fabricando un cuerpo. Abre el Acto 7.
      { id: "story-ch6-event-foundry", kind: "EVENT", tileX: 12, tileY: 5, sprite: "hidden", trigger: "STEP_ON", hidden: true, gateRequiredNodeIds: ["story-ch6-duel-5"] },

      // ── Portal al Acto 7 ──────────────────────────────────────────────────
      { id: ACT_7_PORTAL_ID, kind: "WARP", tileX: 14, tileY: 4, sprite: "portal", trigger: "STEP_ON", gateRequiredNodeIds: ["story-ch6-duel-5"], warp: { toMapId: "act-7", toSpawnId: "spawn-entry", direction: "forward" } },
    ],
    spawns: [{ id: "spawn-entry", tileX: 30, tileY: 26, facing: "UP" }],
    defaultSpawnId: "spawn-entry",
  });
}
