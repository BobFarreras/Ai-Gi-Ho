// src/services/story/overworld/act-7-casting-cutscene.ts - ESCENA FIRMA del Acto 7, "La Colada". La cadena
// escupe una carta y dos rivales se la disputan POR ENCIMA de la cinta, sin verte: el Alquimista, que decide
// qué se fabrica, y Midutech, que ya no manda aquí. Midutech alarga la mano, el Alquimista para la cinta con un
// gesto… y los dos giran la cabeza a la vez. Sí que te habían visto.
//
// Misma gramática que la Fábrica de Cartas del Acto 4 (dos NPCs, narración DENTRO del guion), pero con el
// remate invertido: allí uno se marchaba y el otro venía a por ti; aquí se giran los dos.
import { OverworldCutsceneStep } from "@/components/hub/story/overworld/engine/engine-types";
import { OverworldDirection } from "@/core/services/story/overworld/overworld-types";
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import {
  CASTING_ALQUIMISTA_TILE,
  CASTING_MIDUTECH_TILE,
  CASTING_SCENE_TRIGGER_ID,
} from "@/services/story/overworld/act-7-overworld-tilemap";
import { ITileCoordinate, traceWalkableCorridor } from "@/services/story/overworld/trace-walkable-corridor";

const ALQUIMISTA_SPRITE = "/assets/story/opponents/opp-ch1-jaku/avatar-Jaku.webp";
const MIDUTECH_SPRITE = "/assets/story/opponents/opp-ch1-midutech/avatar-Midutech.webp";

/** Ids de actor de la escena. */
export const CASTING_ALQUIMISTA_NPC_ID = "alquimista";
export const CASTING_MIDUTECH_NPC_ID = "midutech";

function resolveFacing(from: ITileCoordinate, to: ITileCoordinate): OverworldDirection {
  if (to.tileX > from.tileX) return "RIGHT";
  if (to.tileX < from.tileX) return "LEFT";
  if (to.tileY > from.tileY) return "DOWN";
  return "UP";
}

export interface IAct7CastingCutsceneOptions {
  /** Pantalla compacta (móvil): pausas más cortas. */
  isCompactViewport: boolean;
}

/**
 * Guion de la escena. Devuelve `[]` si el mapa no trae el trigger o si no hay pasillo entre el Alquimista y el
 * jugador (entonces se pasa directo a la narración y al combate).
 */
export function buildAct7CastingCutscene(
  tilemap: IOverworldTilemap,
  options: IAct7CastingCutsceneOptions,
): OverworldCutsceneStep[] {
  const trigger = tilemap.objects.find((object) => object.id === CASTING_SCENE_TRIGGER_ID);
  if (!trigger) return [];
  // Camino desde el Alquimista hasta la casilla del jugador: por ahí subirá cuando termine de discutir.
  const corridor = traceWalkableCorridor(
    tilemap.collision,
    { tileX: CASTING_ALQUIMISTA_TILE.tileX, tileY: CASTING_ALQUIMISTA_TILE.tileY },
    { tileX: trigger.tileX, tileY: trigger.tileY },
  );
  if (corridor.length < 2) return [];
  const pause = options.isCompactViewport ? 0.3 : 0.45;

  const steps: OverworldCutsceneStep[] = [
    // Los dos, a lado y lado de la cadena, mirando hacia arriba: la carta va pasando entre ellos.
    {
      kind: "SPAWN_NPC",
      npcId: CASTING_ALQUIMISTA_NPC_ID,
      tileX: CASTING_ALQUIMISTA_TILE.tileX,
      tileY: CASTING_ALQUIMISTA_TILE.tileY,
      facing: "UP",
      spriteSrc: ALQUIMISTA_SPRITE,
    },
    {
      kind: "SPAWN_NPC",
      npcId: CASTING_MIDUTECH_NPC_ID,
      tileX: CASTING_MIDUTECH_TILE.tileX,
      tileY: CASTING_MIDUTECH_TILE.tileY,
      facing: "UP",
      spriteSrc: MIDUTECH_SPRITE,
    },
    { kind: "WAIT", seconds: pause },
    // Se giran el uno hacia el otro: la discusión pasa por encima de la cinta.
    { kind: "NPC_FACE", npcId: CASTING_ALQUIMISTA_NPC_ID, direction: "RIGHT" },
    { kind: "NPC_FACE", npcId: CASTING_MIDUTECH_NPC_ID, direction: "LEFT" },
    // Las líneas de los dos, todavía sin dirigirse a ti.
    { kind: "EVENT", nodeId: CASTING_SCENE_TRIGGER_ID },
    { kind: "WAIT", seconds: pause },
    // El remate: los dos giran la cabeza a la vez hacia donde estás.
    { kind: "NPC_FACE", npcId: CASTING_ALQUIMISTA_NPC_ID, direction: "UP" },
    { kind: "NPC_FACE", npcId: CASTING_MIDUTECH_NPC_ID, direction: "UP" },
    { kind: "WAIT", seconds: pause },
    // Midutech se retira: esta no es su pelea, ya no manda aquí.
    { kind: "DESPAWN_NPC", npcId: CASTING_MIDUTECH_NPC_ID, effect: "TELEPORT" },
  ];

  // El Alquimista sube por el pasillo hasta quedarse pegado al jugador.
  const stopIndex = corridor.length - 2;
  steps.push({
    kind: "NPC_FACE",
    npcId: CASTING_ALQUIMISTA_NPC_ID,
    direction: resolveFacing(corridor[0], corridor[1]),
  });
  for (let index = 1; index <= stopIndex; index++) {
    steps.push({
      kind: "NPC_WALK_TO",
      npcId: CASTING_ALQUIMISTA_NPC_ID,
      tileX: corridor[index].tileX,
      tileY: corridor[index].tileY,
    });
  }
  steps.push({ kind: "PLAYER_FACE", direction: resolveFacing(corridor[corridor.length - 1], corridor[stopIndex]) });
  steps.push({ kind: "WAIT", seconds: pause });
  return steps;
}
