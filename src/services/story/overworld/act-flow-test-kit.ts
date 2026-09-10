// src/services/story/overworld/act-flow-test-kit.ts - Utilería de test compartida por los Actos 5-8. Los tests
// de los Actos 1-4 llevan estos helpers copiados dentro de cada spec; con cuatro actos nuevos sale más a cuenta
// tenerlos una sola vez. NO se importa desde runtime: sólo desde los `*.test.ts` de este directorio.
import { IOverworldProgressState, toGridPositionKey } from "@/core/services/story/overworld/overworld-types";
import { findGridPath } from "@/core/services/story/overworld/pathfinding";
import { IResolvedMovementContext, resolveMovementContext } from "@/core/services/story/overworld/movement-rules";
import { IOverworldTilemap } from "@/services/story/overworld/tilemap-schema";
import {
  buildCollisionGridFromTilemap,
  listGatesFromTilemap,
} from "@/services/story/overworld/tilemap-runtime";

export interface IActProgressInput {
  /** Rivales vencidos (liberan su casilla, como hace el engine al terminar el combate). */
  completed?: string[];
  /** Consolas, placas e interruptores ya usados. */
  interacted?: string[];
  /** Casillas pisadas (los EVENT de tipo STEP_ON cuentan como visitados). */
  visited?: string[];
}

/** Contexto de movimiento equivalente al del engine para un estado de progreso dado. */
export function buildMovementContextFor(tilemap: IOverworldTilemap, progress: IActProgressInput = {}): IResolvedMovementContext {
  const completed = new Set<string>(progress.completed ?? []);
  const state: IOverworldProgressState = {
    visitedNodeIds: new Set<string>(progress.visited ?? []),
    interactedNodeIds: new Set<string>(progress.interacted ?? []),
    completedNodeIds: completed,
  };
  const openTileKeys = new Set<string>(
    tilemap.objects
      .filter((object) => (object.kind === "DUEL" || object.kind === "BOSS") && completed.has(object.id))
      .map((object) => toGridPositionKey({ tileX: object.tileX, tileY: object.tileY })),
  );
  return resolveMovementContext({
    collisionGrid: buildCollisionGridFromTilemap(tilemap),
    gates: listGatesFromTilemap(tilemap),
    progress: state,
    openTileKeys,
  });
}

export function spawnTileOf(tilemap: IOverworldTilemap): { tileX: number; tileY: number } {
  const spawn = tilemap.spawns.find((entry) => entry.id === tilemap.defaultSpawnId) ?? tilemap.spawns[0];
  return { tileX: spawn.tileX, tileY: spawn.tileY };
}

/** Objeto del mapa por id. Revienta si no existe: en un test, un id mal escrito es un falso verde. */
export function objectOf(tilemap: IOverworldTilemap, id: string) {
  const object = tilemap.objects.find((entry) => entry.id === id);
  if (!object) throw new Error(`act-flow-test-kit: no existe el objeto '${id}' en el mapa '${tilemap.id}'.`);
  return object;
}

/** Celda transitable contigua a un objeto sólido: desde ahí se interactúa con él. */
export function approachTileOf(
  tilemap: IOverworldTilemap,
  target: { tileX: number; tileY: number },
): { tileX: number; tileY: number } {
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as Array<[number, number]>) {
    const tileX = target.tileX + dx;
    const tileY = target.tileY + dy;
    if (tilemap.collision[tileY]?.[tileX] === 1) return { tileX, tileY };
  }
  throw new Error(`act-flow-test-kit: (${target.tileX}, ${target.tileY}) no tiene ninguna casilla contigua transitable.`);
}

/** ¿Se llega desde el spawn hasta el objeto `id` con este progreso? (a su casilla contigua si es sólido). */
export function canReachObject(tilemap: IOverworldTilemap, id: string, progress: IActProgressInput = {}): boolean {
  const object = objectOf(tilemap, id);
  const isSolid = tilemap.collision[object.tileY]?.[object.tileX] !== 1;
  const target = isSolid ? approachTileOf(tilemap, object) : { tileX: object.tileX, tileY: object.tileY };
  return findGridPath(spawnTileOf(tilemap), target, buildMovementContextFor(tilemap, progress)) !== null;
}
