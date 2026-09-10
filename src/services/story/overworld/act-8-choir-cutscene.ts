// src/services/story/overworld/act-8-choir-cutscene.ts - ESCENA FIRMA del Acto 8, "El Coro". Nada más entrar,
// los cuatro jefes de los actos anteriores se materializan en los cuatro pedestales del anillo. Cada uno dice
// MEDIA LÍNEA: la frase sólo se entiende leyendo las cuatro seguidas. Se giran hacia el centro a la vez y se
// apagan uno a uno, del más lejano al más cercano. En el centro no aparece nada. Esa es la amenaza.
//
// Es la única escena firma de los Actos 5-8 que NO desemboca en combate: es narrativa pura, y por eso la
// escena entra por el registro de cutscenes narrativas del overworld, no por el de emboscadas.
import { OverworldCutsceneStep } from "@/components/hub/story/overworld/engine/engine-types";
import { OverworldDirection } from "@/core/services/story/overworld/overworld-types";
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import { CHOIR_SCENE_TRIGGER_ID, CHOIR_STAND_TILES } from "@/services/story/overworld/act-8-overworld-tilemap";

/** Cada eco lleva la cara del jefe al que evoca, en el orden de los pedestales (N, E, S, O). */
const CHOIR_SPRITES = [
  "/assets/story/opponents/opp-ch1-apprentice/avatar-GenNvim.webp",
  "/assets/story/opponents/opp-ch1-guill/avatar-Guill.webp",
  "/assets/story/opponents/opp-ch3-gokernel/avatar-Gokernel.webp",
  "/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp",
] as const;

/** Id de actor de cada eco del Coro. */
export function resolveChoirNpcId(index: number): string {
  return `choir-${index}`;
}

/** Hacia dónde mira un eco para encarar el centro del anillo. */
function facingTowardCenter(tile: { tileX: number; tileY: number }, center: { tileX: number; tileY: number }): OverworldDirection {
  if (Math.abs(tile.tileX - center.tileX) >= Math.abs(tile.tileY - center.tileY)) {
    return tile.tileX > center.tileX ? "LEFT" : "RIGHT";
  }
  return tile.tileY > center.tileY ? "UP" : "DOWN";
}

export interface IAct8ChoirCutsceneOptions {
  /** Pantalla compacta (móvil): pausas más cortas. */
  isCompactViewport: boolean;
}

/**
 * Guion de la escena. Devuelve `[]` si el mapa no trae el trigger (entonces sólo se narra, sin aparición).
 */
export function buildAct8ChoirCutscene(
  tilemap: IOverworldTilemap,
  options: IAct8ChoirCutsceneOptions,
): OverworldCutsceneStep[] {
  const trigger = tilemap.objects.find((object) => object.id === CHOIR_SCENE_TRIGGER_ID);
  if (!trigger) return [];
  const pause = options.isCompactViewport ? 0.3 : 0.5;
  // El centro del anillo: el punto de convergencia, donde no va a aparecer nada.
  const center = { tileX: Math.floor(tilemap.width / 2), tileY: Math.floor(tilemap.height / 2) };

  const steps: OverworldCutsceneStep[] = [];
  // Los cuatro se materializan a la vez en sus pedestales, ya mirándote.
  CHOIR_STAND_TILES.forEach((tile, index) => {
    steps.push({
      kind: "SPAWN_NPC",
      npcId: resolveChoirNpcId(index),
      tileX: tile.tileX,
      tileY: tile.tileY,
      facing: facingTowardCenter(tile, { tileX: trigger.tileX, tileY: trigger.tileY }),
      spriteSrc: CHOIR_SPRITES[index] ?? CHOIR_SPRITES[0],
      effect: "TELEPORT",
    });
  });
  steps.push({ kind: "WAIT", seconds: pause });
  // Las cuatro medias líneas, seguidas. Por separado no significan nada.
  steps.push({ kind: "EVENT", nodeId: CHOIR_SCENE_TRIGGER_ID });
  steps.push({ kind: "WAIT", seconds: pause });
  // Y entonces dejan de mirarte: se giran hacia el centro, todos a la vez.
  CHOIR_STAND_TILES.forEach((tile, index) => {
    steps.push({ kind: "NPC_FACE", npcId: resolveChoirNpcId(index), direction: facingTowardCenter(tile, center) });
  });
  steps.push({ kind: "WAIT", seconds: pause });
  // Se apagan del más lejano al más cercano, para que el último en irse sea el que tienes delante.
  const byDistanceDesc = CHOIR_STAND_TILES.map((tile, index) => ({
    index,
    distance: Math.abs(tile.tileX - trigger.tileX) + Math.abs(tile.tileY - trigger.tileY),
  })).sort((left, right) => right.distance - left.distance);
  for (const { index } of byDistanceDesc) {
    steps.push({ kind: "DESPAWN_NPC", npcId: resolveChoirNpcId(index), effect: "TELEPORT" });
  }
  // En el centro no aparece nada. Sólo te quedas mirando el pozo.
  steps.push({ kind: "PLAYER_FACE", direction: "UP" });
  steps.push({ kind: "WAIT", seconds: pause });
  return steps;
}
