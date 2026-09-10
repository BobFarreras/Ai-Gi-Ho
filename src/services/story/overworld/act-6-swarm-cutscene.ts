// src/services/story/overworld/act-6-swarm-cutscene.ts - ESCENA FIRMA del Acto 6, "El Enjambre". En una plaza
// abierta y sin paredes, cinco copias degradadas de La Entidad entran ANDANDO desde cinco bocas y cierran un
// círculo a una casilla de ti. Ninguna ataca. Hablan las cinco a la vez (la misma línea repetida con desfase),
// cuatro se apagan y la quinta se queda: ese es el combate.
//
// El secuenciador de cutscenes es estrictamente secuencial, así que "a la vez" se consigue INTERCALANDO los
// pasos: cada copia avanza una casilla por ronda. Visualmente se leen como cinco cuerpos moviéndose juntos y
// ligeramente desfasados, que es justo lo que se quería.
import { OverworldCutsceneStep } from "@/components/hub/story/overworld/engine/engine-types";
import { OverworldDirection } from "@/core/services/story/overworld/overworld-types";
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import {
  SWARM_CENTER_TILE,
  SWARM_ENTRY_TILES,
  SWARM_SCENE_TRIGGER_ID,
} from "@/services/story/overworld/act-6-overworld-tilemap";
import { ITileCoordinate, traceWalkableCorridor } from "@/services/story/overworld/trace-walkable-corridor";

const ENJAMBRE_SPRITE = "/assets/story/opponents/opp-ch1-soldier-act01/avatar-Soldado-act01.webp";

/** Id de actor de cada copia. La que se queda es la primera (la que entra de frente). */
export function resolveSwarmNpcId(index: number): string {
  return `swarm-${index}`;
}

function resolveFacing(from: ITileCoordinate, to: ITileCoordinate): OverworldDirection {
  if (to.tileX > from.tileX) return "RIGHT";
  if (to.tileX < from.tileX) return "LEFT";
  if (to.tileY > from.tileY) return "DOWN";
  return "UP";
}

export interface IAct6SwarmCutsceneOptions {
  /** Pantalla compacta (móvil): pausas más cortas. */
  isCompactViewport: boolean;
}

/**
 * Guion de la escena. Devuelve `[]` si el mapa no trae el trigger (se pasa entonces directo a la narración y
 * al combate, sin aparición).
 */
export function buildAct6SwarmCutscene(
  tilemap: IOverworldTilemap,
  options: IAct6SwarmCutsceneOptions,
): OverworldCutsceneStep[] {
  const trigger = tilemap.objects.find((object) => object.id === SWARM_SCENE_TRIGGER_ID);
  if (!trigger) return [];
  const pause = options.isCompactViewport ? 0.25 : 0.4;

  // Ruta de cada copia desde su boca hasta su sitio del círculo, trazada sobre la rejilla (la plaza es abierta,
  // así que si alguien mueve el atrezzo las rutas siguen siendo válidas sin tocar coordenadas a mano).
  const routes = SWARM_ENTRY_TILES.map((entry) =>
    traceWalkableCorridor(
      tilemap.collision,
      { tileX: entry.from.tileX, tileY: entry.from.tileY },
      { tileX: entry.to.tileX, tileY: entry.to.tileY },
    ),
  );
  if (routes.some((route) => route.length < 1)) return [];

  const steps: OverworldCutsceneStep[] = [];
  // Las cinco bocas se encienden a la vez: las copias aparecen en el borde, todavía lejos.
  routes.forEach((route, index) => {
    steps.push({
      kind: "SPAWN_NPC",
      npcId: resolveSwarmNpcId(index),
      tileX: route[0].tileX,
      tileY: route[0].tileY,
      facing: resolveFacing(route[0], route[Math.min(1, route.length - 1)]),
      spriteSrc: ENJAMBRE_SPRITE,
    });
  });
  steps.push({ kind: "WAIT", seconds: pause });

  // Avance intercalado: una casilla por copia y ronda, hasta que todas llegan a su sitio.
  const longestRoute = Math.max(...routes.map((route) => route.length));
  for (let tileIndex = 1; tileIndex < longestRoute; tileIndex++) {
    routes.forEach((route, index) => {
      const tile = route[Math.min(tileIndex, route.length - 1)];
      if (tileIndex >= route.length) return; // esta copia ya está en su sitio
      steps.push({ kind: "NPC_WALK_TO", npcId: resolveSwarmNpcId(index), tileX: tile.tileX, tileY: tile.tileY });
    });
  }

  // El círculo se cierra: todas te miran, ninguna se acerca más.
  routes.forEach((route, index) => {
    const last = route[route.length - 1];
    steps.push({
      kind: "NPC_FACE",
      npcId: resolveSwarmNpcId(index),
      direction: resolveFacing(last, { tileX: SWARM_CENTER_TILE.tileX, tileY: SWARM_CENTER_TILE.tileY }),
    });
  });
  steps.push({ kind: "WAIT", seconds: pause });
  // Hablan las cinco (la narración va dentro del guion: se dice con el círculo cerrado, antes de que se apaguen).
  steps.push({ kind: "EVENT", nodeId: SWARM_SCENE_TRIGGER_ID });

  // Cuatro se apagan, de la más lejana a la más cercana. La que entró de frente se queda.
  for (let index = routes.length - 1; index >= 1; index--) {
    steps.push({ kind: "DESPAWN_NPC", npcId: resolveSwarmNpcId(index), effect: "TELEPORT" });
  }
  steps.push({ kind: "PLAYER_FACE", direction: "UP" });
  steps.push({ kind: "WAIT", seconds: pause });
  return steps;
}
