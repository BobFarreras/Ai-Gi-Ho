// src/services/story/overworld/act-5-mirror-cutscene.ts - ESCENA FIRMA del Acto 5, "El Reflejo". Sala simétrica
// partida por una línea de espejos. Al pisar el eje aparece un doble al otro lado que repite tus pasos EN ESPEJO
// con un compás de retraso: el jugador entiende la regla sin que nadie se la explique. Entonces el doble da un
// paso que tú no has dado, y detrás de él —donde estuvo todo el rato— se materializa Verso, que baja a por ti.
//
// Es la única cutscene del juego que mueve al JUGADOR (PLAYER_STEP): la gracia de la escena es que la regla se
// demuestra con tus propios pasos, no con los de un NPC.
import { OverworldCutsceneStep } from "@/components/hub/story/overworld/engine/engine-types";
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import {
  MIRROR_DOUBLE_TILE,
  MIRROR_SCENE_TRIGGER_ID,
  MIRROR_TRIGGER_TILE,
} from "@/services/story/overworld/act-5-overworld-tilemap";

/** El doble usa el sprite del jugador: la escena no funciona si no eres tú quien está al otro lado. */
const PLAYER_SPRITE = "/assets/story/player/bob.webp";
const VERSO_SPRITE = "/assets/story/opponents/opp-ch1-helena/avatar-Helena.webp";

/** Ids de actor de la escena. */
export const MIRROR_DOUBLE_NPC_ID = "double";
export const MIRROR_VERSO_NPC_ID = "verso";

/**
 * Los pasos que da el jugador, en orden. El doble ejecuta el opuesto en x (reflejo sobre el eje vertical del
 * mapa) con un compás de retraso. Se va y se vuelve: el jugador acaba donde empezó, así que la escena no
 * cambia su posición ni deja el trigger a medio pisar.
 */
const MIRRORED_STEPS: Array<"LEFT" | "RIGHT"> = ["LEFT", "LEFT", "RIGHT", "RIGHT"];

export interface IAct5MirrorCutsceneOptions {
  /** Pantalla compacta (móvil): pausas más cortas, que con la cámara alejada se hacen eternas. */
  isCompactViewport: boolean;
}

/**
 * Guion de la escena. Devuelve `[]` si el mapa no trae el trigger (entonces se pasa directo a la narración y
 * al combate, sin aparición).
 */
export function buildAct5MirrorCutscene(
  tilemap: IOverworldTilemap,
  options: IAct5MirrorCutsceneOptions,
): OverworldCutsceneStep[] {
  const trigger = tilemap.objects.find((object) => object.id === MIRROR_SCENE_TRIGGER_ID);
  if (!trigger) return [];
  const pause = options.isCompactViewport ? 0.3 : 0.45;
  const doubleTile = { tileX: MIRROR_DOUBLE_TILE.tileX, tileY: MIRROR_DOUBLE_TILE.tileY };

  const steps: OverworldCutsceneStep[] = [
    // Al otro lado de los espejos se materializa alguien con tu cara. Todavía no ha hecho nada.
    {
      kind: "SPAWN_NPC",
      npcId: MIRROR_DOUBLE_NPC_ID,
      tileX: doubleTile.tileX,
      tileY: doubleTile.tileY,
      facing: "DOWN",
      spriteSrc: PLAYER_SPRITE,
      effect: "TELEPORT",
    },
    { kind: "WAIT", seconds: pause },
  ];

  // Cada paso tuyo, repetido en espejo un compás después. Cuatro basta: a la segunda ya se ha entendido.
  let mirrorX = doubleTile.tileX;
  for (const direction of MIRRORED_STEPS) {
    steps.push({ kind: "PLAYER_STEP", direction });
    mirrorX += direction === "LEFT" ? 1 : -1; // reflejo: tú a la izquierda, él a la derecha
    steps.push({ kind: "NPC_WALK_TO", npcId: MIRROR_DOUBLE_NPC_ID, tileX: mirrorX, tileY: doubleTile.tileY });
  }
  steps.push({ kind: "WAIT", seconds: pause });

  // El paso que tú no has dado: baja una casilla hacia la línea de espejos. Deja de ser un reflejo.
  const brokenMirrorTileY = doubleTile.tileY + 1;
  steps.push({ kind: "NPC_FACE", npcId: MIRROR_DOUBLE_NPC_ID, direction: "DOWN" });
  steps.push({ kind: "NPC_WALK_TO", npcId: MIRROR_DOUBLE_NPC_ID, tileX: doubleTile.tileX, tileY: brokenMirrorTileY });
  steps.push({ kind: "WAIT", seconds: pause });

  // Y detrás de él, en la casilla que acaba de dejar, estaba Verso desde el principio.
  steps.push({
    kind: "SPAWN_NPC",
    npcId: MIRROR_VERSO_NPC_ID,
    tileX: doubleTile.tileX,
    tileY: doubleTile.tileY,
    facing: "DOWN",
    spriteSrc: VERSO_SPRITE,
    effect: "TELEPORT",
  });
  steps.push({ kind: "WAIT", seconds: pause });
  // El doble se apaga: ya no hacía falta, sólo era el envoltorio.
  steps.push({ kind: "DESPAWN_NPC", npcId: MIRROR_DOUBLE_NPC_ID, effect: "TELEPORT" });

  // Verso cruza el hueco de la línea de espejos y baja hasta quedarse pegado al jugador.
  for (let tileY = brokenMirrorTileY; tileY <= MIRROR_TRIGGER_TILE.tileY - 1; tileY++) {
    steps.push({ kind: "NPC_WALK_TO", npcId: MIRROR_VERSO_NPC_ID, tileX: doubleTile.tileX, tileY });
  }
  steps.push({ kind: "PLAYER_FACE", direction: "UP" });
  steps.push({ kind: "WAIT", seconds: pause });
  return steps;
}
