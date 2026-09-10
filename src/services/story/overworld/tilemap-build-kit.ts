// src/services/story/overworld/tilemap-build-kit.ts - Herramientas de geometría compartidas por los tilemaps de
// los Actos 5-8. Los Actos 3 y 4 llevan su propia copia de estos helpers (con el ancho/alto cerrados a mano);
// aquí están parametrizados por tamaño para que cuatro actos nuevos no repitan cuatro veces lo mismo.
import { GROUND_TILE, OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";

/** Las tres capas mutables mientras se construye el mapa (antes de validar). */
export interface IMutableTilemapLayers {
  ground: number[][];
  overlay: number[][];
  collision: number[][];
  width: number;
  height: number;
}

/** Rectángulo de celdas, inclusivo en las cuatro esquinas. */
export interface ITileRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ITilePoint {
  x: number;
  y: number;
}

/**
 * Lienzo inicial: todo vacío no transitable (abismo digital). Las salas y los corredores se tallan encima,
 * así que cualquier celda que nadie haya tallado es, por construcción, un agujero por el que no se pasa.
 */
export function buildVoidLayers(width: number, height: number): IMutableTilemapLayers {
  return {
    ground: Array.from({ length: height }, () => Array.from({ length: width }, () => GROUND_TILE.WATER as number)),
    overlay: Array.from({ length: height }, () => Array.from({ length: width }, () => 0)),
    collision: Array.from({ length: height }, () => Array.from({ length: width }, () => 0)),
    width,
    height,
  };
}

function assertInside(map: IMutableTilemapLayers, tileX: number, tileY: number, what: string): void {
  if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height) {
    throw new Error(`tilemap-build-kit: ${what} en (${tileX}, ${tileY}) se sale del mapa ${map.width}x${map.height}.`);
  }
}

/** Sala transitable. `groundKind` permite que cada acto tenga su suelo (arena, hierba, camino…). */
export function fillRoom(map: IMutableTilemapLayers, rect: ITileRect, groundKind: number = GROUND_TILE.SAND): void {
  assertInside(map, rect.x0, rect.y0, "fillRoom");
  assertInside(map, rect.x1, rect.y1, "fillRoom");
  for (let tileY = rect.y0; tileY <= rect.y1; tileY++) {
    for (let tileX = rect.x0; tileX <= rect.x1; tileX++) {
      map.ground[tileY][tileX] = groundKind;
      map.collision[tileY][tileX] = 1;
    }
  }
}

/**
 * Corredor recto de una casilla. Una sola celda de ancho a propósito: así una puerta, un rival sólido o un
 * haz de visión puestos encima son barreras de verdad y no algo que se rodea por el lado.
 */
export function carveCorridor(
  map: IMutableTilemapLayers,
  from: ITilePoint,
  to: ITilePoint,
  groundKind: number = GROUND_TILE.PATH,
): void {
  assertInside(map, from.x, from.y, "carveCorridor");
  assertInside(map, to.x, to.y, "carveCorridor");
  if (from.x !== to.x && from.y !== to.y) {
    throw new Error(`tilemap-build-kit: carveCorridor solo traza rectas (${from.x},${from.y})->(${to.x},${to.y}).`);
  }
  if (from.x === to.x) {
    for (let tileY = Math.min(from.y, to.y); tileY <= Math.max(from.y, to.y); tileY++) {
      map.ground[tileY][from.x] = groundKind;
      map.collision[tileY][from.x] = 1;
    }
    return;
  }
  for (let tileX = Math.min(from.x, to.x); tileX <= Math.max(from.x, to.x); tileX++) {
    map.ground[from.y][tileX] = groundKind;
    map.collision[from.y][tileX] = 1;
  }
}

/** Atrezzo sólido en la capa overlay (bloquea el paso). */
export function placeStructure(map: IMutableTilemapLayers, tileX: number, tileY: number, kind: number): void {
  assertInside(map, tileX, tileY, "placeStructure");
  map.overlay[tileY][tileX] = kind;
  map.collision[tileY][tileX] = 0;
}

/** Muro de atrezzo, con hueco opcional (`gapAt`) para dejar una única puerta. */
export function buildWall(
  map: IMutableTilemapLayers,
  rect: ITileRect,
  kind: number = OVERLAY_TILE.SERVER_RACK,
  gapAt?: ITilePoint,
): void {
  for (let tileY = rect.y0; tileY <= rect.y1; tileY++) {
    for (let tileX = rect.x0; tileX <= rect.x1; tileX++) {
      if (gapAt && gapAt.x === tileX && gapAt.y === tileY) continue;
      placeStructure(map, tileX, tileY, kind);
    }
  }
}

/** Cinta transportadora: suelo transitable que arrastra una celda en su sentido al aterrizar encima. */
export function placeBelt(map: IMutableTilemapLayers, tileX: number, tileY: number, kind: number): void {
  assertInside(map, tileX, tileY, "placeBelt");
  map.ground[tileY][tileX] = kind;
  map.collision[tileY][tileX] = 1;
}

/**
 * Marca la casilla de un objeto (rival, servicio, recompensa, interruptor) como sólida: se interactúa con él
 * desde una celda contigua. Falla si la casilla no era suelo transitable — un objeto plantado sobre el vacío
 * es un objeto inalcanzable, y más vale que reviente el build que descubrirlo jugando.
 */
export function markSolid(map: IMutableTilemapLayers, tileX: number, tileY: number, label = "objeto"): void {
  assertInside(map, tileX, tileY, `markSolid (${label})`);
  if (map.collision[tileY][tileX] !== 1) {
    throw new Error(`tilemap-build-kit: ${label} en (${tileX}, ${tileY}) debería estar sobre suelo transitable.`);
  }
  map.collision[tileY][tileX] = 0;
}

/**
 * Abre un pasillo A TRAVÉS de un bloque de atrezzo ya construido: además de dejar la celda transitable, borra
 * la estructura del overlay. `carveCorridor` no lo hace —talla sobre vacío, no sobre muro— y olvidarlo deja un
 * pasillo por el que se anda pero que se sigue dibujando tapiado.
 */
export function carveThroughWall(
  map: IMutableTilemapLayers,
  from: ITilePoint,
  to: ITilePoint,
  groundKind: number = GROUND_TILE.PATH,
): void {
  carveCorridor(map, from, to, groundKind);
  const [x0, x1] = [Math.min(from.x, to.x), Math.max(from.x, to.x)];
  const [y0, y1] = [Math.min(from.y, to.y), Math.max(from.y, to.y)];
  for (let tileY = y0; tileY <= y1; tileY++) {
    for (let tileX = x0; tileX <= x1; tileX++) map.overlay[tileY][tileX] = 0;
  }
}

/** ¿Es transitable esta celda? (fuera del mapa cuenta como no transitable). */
export function isWalkable(map: IMutableTilemapLayers, tileX: number, tileY: number): boolean {
  return map.collision[tileY]?.[tileX] === 1;
}
