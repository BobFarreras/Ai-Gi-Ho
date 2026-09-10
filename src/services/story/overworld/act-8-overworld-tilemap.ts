// src/services/story/overworld/act-8-overworld-tilemap.ts - Acto 8 "La Singularidad": ambiente SINGULARITY
// (violeta saturado) y el mapa más PEQUEÑO de la campaña a propósito — un anillo cuadrado con cuatro pedestales
// y, en el centro, un pozo de una sola casilla de ancho. No hay laberinto ni puzzle: el acto entero es una
// escalera de duelos, y el pozo del final no deja salir entre fases porque cada rival tapona el paso.
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import { validateOverworldTilemap } from "@/services/story/overworld/validate-tilemap";
import { OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";
import {
  buildVoidLayers,
  buildWall,
  carveThroughWall,
  fillRoom,
  markSolid,
  placeStructure,
} from "@/services/story/overworld/tilemap-build-kit";

const MAP_WIDTH = 40;
const MAP_HEIGHT = 40;

// Los cuatro ecos reutilizan la cara del jefe al que evocan. La Entidad usa el sprite ROJO del jugador: el
// cierre de la campaña es contra una copia de ti, que es de lo que iba todo desde el Acto 5.
const CORO_KERNEL = "/assets/story/opponents/opp-ch1-apprentice/avatar-GenNvim.webp";
const CORO_MAREA = "/assets/story/opponents/opp-ch1-guill/avatar-Guill.webp";
const CORO_MOLDE = "/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp";
const CORO_ESPEJO = "/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp";
const ENTIDAD = "/assets/story/player/bob-rojo.webp";
// ChatGPT Annihilator comparte el render de ChatGPT en el catálogo (011): mismo arte, otra carta.
const CARD_ANNIHILATOR = "/assets/renders/chatgpt.webp";
const CANDY = "/assets/items/candy-usb-raro.webp";

/**
 * ESCENA FIRMA "El Coro". Nada más entrar, antes de poder moverte, los cuatro jefes de los actos anteriores se
 * materializan en los cuatro pedestales, dicen media línea cada uno —la frase sólo se entiende leyendo las
 * cuatro seguidas— y se apagan del más lejano al más cercano. En el centro no aparece nada. Esa es la amenaza.
 *
 * A diferencia de las escenas firma de los Actos 5-7, esta NO desemboca en combate: es narrativa pura.
 */
export const CHOIR_SCENE_TRIGGER_ID = "story-ch8-event-choir";
/** Casillas donde se materializa cada eco: delante de su pedestal, no encima (el pedestal es el rival). */
export const CHOIR_STAND_TILES = [
  { tileX: 20, tileY: 8 }, //  norte  — Kernel
  { tileX: 30, tileY: 20 }, // este   — Marea
  { tileX: 20, tileY: 29 }, // sur    — Molde
  { tileX: 10, tileY: 20 }, // oeste  — Espejo
] as const;

/** El pozo central: una sola casilla de ancho, con las tres fases de La Entidad escalonadas dentro. */
const SHAFT_TILE_X = 20;
const SHAFT_TOP_TILE_Y = 12;
const SHAFT_BOTTOM_TILE_Y = 26;

/**
 * Acto 8 — La Singularidad. Cierra la campaña: no hay portal de salida, hay epílogo.
 */
export function buildAct8OverworldTilemap(): IOverworldTilemap {
  const map = buildVoidLayers(MAP_WIDTH, MAP_HEIGHT);

  // La plaza entera, y encima un bloque macizo en el centro con un pozo tallado: el resultado es un ANILLO
  // por el que se rodea, con una única boca hacia dentro.
  fillRoom(map, { x0: 4, y0: 4, x1: 35, y1: 35 });
  buildWall(map, { x0: 14, y0: 10, x1: 26, y1: 26 }, OVERLAY_TILE.SERVER_RACK);
  carveThroughWall(map, { x: SHAFT_TILE_X, y: SHAFT_TOP_TILE_Y }, { x: SHAFT_TILE_X, y: SHAFT_BOTTOM_TILE_Y });

  // ── Atrezzo: cuatro pilones marcando los ejes y pantallas en las esquinas del anillo ──
  for (const [x, y] of [[6, 6], [33, 6], [6, 33], [33, 33]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.HOLO_SCREEN);
  }
  for (const [x, y] of [[12, 6], [28, 6], [12, 33], [28, 33]] as Array<[number, number]>) {
    placeStructure(map, x, y, OVERLAY_TILE.DATA_PYLON);
  }

  // ── Casillas sólidas ───────────────────────────────────────────────────────
  markSolid(map, 12, 34, "market");
  markSolid(map, 14, 34, "arsenal");
  markSolid(map, 18, 34, "teleport");
  markSolid(map, 20, 7, "duel-1"); //  pedestal norte
  markSolid(map, 31, 20, "duel-2"); // pedestal este
  markSolid(map, 20, 30, "duel-3"); // pedestal sur
  markSolid(map, 9, 20, "duel-4"); //  pedestal oeste
  markSolid(map, 5, 5, "reward-candy");
  markSolid(map, 34, 5, "reward-card");
  // Las tres fases de La Entidad, escalonadas dentro del pozo. Cada una tapona el paso a la siguiente: aquí
  // "no se puede salir entre fases" no es una regla escrita, es la geometría.
  markSolid(map, SHAFT_TILE_X, 24, "duel-5");
  markSolid(map, SHAFT_TILE_X, 19, "duel-6");
  markSolid(map, SHAFT_TILE_X, 14, "duel-7");

  return validateOverworldTilemap({
    schemaVersion: 2,
    id: "act-8",
    act: 8,
    ambient: "SINGULARITY",
    tileSize: 52,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    layers: { ground: map.ground, overlay: map.overlay },
    collision: map.collision,
    objects: [
      // ── Servicios + retorno al Acto 7 ─────────────────────────────────────
      { id: "story-a8-market", kind: "MARKET", tileX: 12, tileY: 34, sprite: "market", trigger: "ADJACENT_ACTION" },
      { id: "story-a8-arsenal", kind: "ARSENAL", tileX: 14, tileY: 34, sprite: "arsenal", trigger: "ADJACENT_ACTION" },
      { id: "story-a8-teleport-hub", kind: "TELEPORT", tileX: 18, tileY: 34, sprite: "teleport", trigger: "ADJACENT_ACTION" },
      { id: "story-ch8-transition-to-act7", kind: "WARP", tileX: 28, tileY: 34, sprite: "portal", trigger: "STEP_ON", warp: { toMapId: "act-7", toSpawnId: "spawn-entry", direction: "backward" } },

      // ── El Coro: cuatro pedestales, cuatro duelos, en el orden que quieras ─
      { id: "story-ch8-duel-1", kind: "DUEL", tileX: 20, tileY: 7, sprite: "coro-kernel", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/1", imageSrc: CORO_KERNEL, facing: "DOWN", visionRange: 3 },
      { id: "story-ch8-duel-2", kind: "DUEL", tileX: 31, tileY: 20, sprite: "coro-marea", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/2", imageSrc: CORO_MAREA, facing: "LEFT", visionRange: 3 },
      { id: "story-ch8-duel-3", kind: "DUEL", tileX: 20, tileY: 30, sprite: "coro-molde", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/3", imageSrc: CORO_MOLDE, facing: "UP", visionRange: 3 },
      { id: "story-ch8-duel-4", kind: "DUEL", tileX: 9, tileY: 20, sprite: "coro-espejo", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/4", imageSrc: CORO_ESPEJO, facing: "RIGHT", visionRange: 3 },

      // ── La boca del pozo: se abre con los cuatro pedestales encendidos ────
      { id: "story-a8-gate-shaft", kind: "GATE", tileX: SHAFT_TILE_X, tileY: SHAFT_BOTTOM_TILE_Y, sprite: "gate", trigger: "ADJACENT_ACTION", gateRequiredNodeIds: ["story-ch8-duel-1", "story-ch8-duel-2", "story-ch8-duel-3", "story-ch8-duel-4"] },

      // ── Las tres fases. Cada una exige la anterior: no hay atajo ni orden alternativo ──
      { id: "story-ch8-duel-5", kind: "BOSS", tileX: SHAFT_TILE_X, tileY: 24, sprite: "entidad", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/5", imageSrc: ENTIDAD, facing: "DOWN", visionRange: 2 },
      { id: "story-ch8-duel-6", kind: "BOSS", tileX: SHAFT_TILE_X, tileY: 19, sprite: "entidad", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/6", imageSrc: ENTIDAD, facing: "DOWN", visionRange: 2, gateRequiredNodeIds: ["story-ch8-duel-5"] },
      { id: "story-ch8-duel-7", kind: "BOSS", tileX: SHAFT_TILE_X, tileY: 14, sprite: "entidad", trigger: "ADJACENT_ACTION", duelHref: "/hub/story/chapter/8/duel/7", imageSrc: ENTIDAD, facing: "DOWN", visionRange: 2, gateRequiredNodeIds: ["story-ch8-duel-6"] },

      // ── Recompensas del anillo ────────────────────────────────────────────
      { id: "story-ch8-cache-candy", kind: "REWARD_OBJECT", tileX: 5, tileY: 5, sprite: "usb-raro", trigger: "ADJACENT_ACTION", imageSrc: CANDY },
      { id: "story-ch8-card-annihilator", kind: "REWARD_CARD", tileX: 34, tileY: 5, sprite: "card", trigger: "ADJACENT_ACTION", imageSrc: CARD_ANNIHILATOR },

      // ── Eventos ───────────────────────────────────────────────────────────
      // El Coro: se pisa al entrar, antes de poder hacer nada. Narrativa pura, sin combate detrás.
      { id: CHOIR_SCENE_TRIGGER_ID, kind: "EVENT", tileX: 20, tileY: 32, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // El descenso al punto: se pisa al cruzar la boca del pozo, con los cuatro ecos ya apagados.
      { id: "story-ch8-event-descent", kind: "EVENT", tileX: SHAFT_TILE_X, tileY: 25, sprite: "hidden", trigger: "STEP_ON", hidden: true },
      // Epílogo: al fondo del pozo, con las tres fases vencidas. Cierre de la campaña.
      { id: "story-ch8-event-epilogue", kind: "EVENT", tileX: SHAFT_TILE_X, tileY: SHAFT_TOP_TILE_Y, sprite: "hidden", trigger: "STEP_ON", hidden: true, gateRequiredNodeIds: ["story-ch8-duel-7"] },
    ],
    spawns: [{ id: "spawn-entry", tileX: 20, tileY: 33, facing: "UP" }],
    defaultSpawnId: "spawn-entry",
  });
}
