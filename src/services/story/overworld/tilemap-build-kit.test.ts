// src/services/story/overworld/tilemap-build-kit.test.ts - Blinda la geometría compartida de los Actos 5-8.
// La gracia del kit son sus asserts: un objeto sobre el vacío o un corredor en diagonal revientan el build en
// vez de descubrirse jugando. Estos tests comprueban justo eso, y el caso que ya nos mordió una vez:
// `carveCorridor` no borra el atrezzo, y por eso existe `carveThroughWall`.
import { GROUND_TILE, OVERLAY_TILE } from "@/services/story/overworld/overworld-tile-kinds";
import {
  buildVoidLayers,
  buildWall,
  carveCorridor,
  carveThroughWall,
  fillRoom,
  isWalkable,
  markSolid,
  placeBelt,
  placeStructure,
} from "@/services/story/overworld/tilemap-build-kit";

describe("tilemap-build-kit", () => {
  it("el lienzo inicial es todo vacío no transitable, con el tamaño declarado", () => {
    const map = buildVoidLayers(6, 4);
    expect(map.width).toBe(6);
    expect(map.height).toBe(4);
    expect(map.collision).toHaveLength(4);
    expect(map.collision.every((row) => row.length === 6 && row.every((cell) => cell === 0))).toBe(true);
    expect(map.ground.every((row) => row.every((cell) => cell === GROUND_TILE.WATER))).toBe(true);
  });

  it("fillRoom talla suelo transitable, y respeta el tipo de suelo de cada acto", () => {
    const map = buildVoidLayers(8, 8);
    fillRoom(map, { x0: 2, y0: 2, x1: 4, y1: 3 }, GROUND_TILE.GRASS);
    expect(isWalkable(map, 2, 2)).toBe(true);
    expect(isWalkable(map, 4, 3)).toBe(true);
    expect(map.ground[3][4]).toBe(GROUND_TILE.GRASS);
    // Fuera del rectángulo sigue siendo vacío.
    expect(isWalkable(map, 5, 3)).toBe(false);
    expect(isWalkable(map, 2, 1)).toBe(false);
  });

  it("carveCorridor sólo traza rectas: la diagonal revienta el build", () => {
    const map = buildVoidLayers(8, 8);
    carveCorridor(map, { x: 1, y: 1 }, { x: 5, y: 1 });
    expect([1, 2, 3, 4, 5].every((tileX) => isWalkable(map, tileX, 1))).toBe(true);
    expect(() => carveCorridor(map, { x: 1, y: 1 }, { x: 3, y: 4 })).toThrow(/rectas/);
  });

  it("salirse del mapa revienta el build en vez de escribir fuera de la rejilla", () => {
    const map = buildVoidLayers(4, 4);
    expect(() => fillRoom(map, { x0: 0, y0: 0, x1: 9, y1: 1 })).toThrow(/se sale del mapa/);
    expect(() => carveCorridor(map, { x: -1, y: 0 }, { x: 2, y: 0 })).toThrow(/se sale del mapa/);
    expect(() => placeStructure(map, 4, 0, OVERLAY_TILE.SERVER_RACK)).toThrow(/se sale del mapa/);
  });

  it("markSolid revienta si el objeto no está sobre suelo transitable (objeto inalcanzable)", () => {
    const map = buildVoidLayers(8, 8);
    fillRoom(map, { x0: 1, y0: 1, x1: 3, y1: 3 });
    expect(() => markSolid(map, 1, 1, "rival")).not.toThrow();
    expect(isWalkable(map, 1, 1)).toBe(false); // se interactúa desde el lado
    expect(() => markSolid(map, 6, 6, "recompensa")).toThrow(/suelo transitable/);
    // Y tampoco vale plantarlo encima del atrezzo.
    placeStructure(map, 2, 2, OVERLAY_TILE.SERVER_RACK);
    expect(() => markSolid(map, 2, 2, "consola")).toThrow(/suelo transitable/);
  });

  it("buildWall levanta atrezzo sólido y deja pasar sólo por el hueco declarado", () => {
    const map = buildVoidLayers(8, 8);
    fillRoom(map, { x0: 0, y0: 0, x1: 7, y1: 7 });
    buildWall(map, { x0: 2, y0: 4, x1: 5, y1: 4 }, OVERLAY_TILE.SERVER_RACK, { x: 4, y: 4 });
    expect(isWalkable(map, 2, 4)).toBe(false);
    expect(isWalkable(map, 4, 4)).toBe(true);
    expect(map.overlay[4][4]).toBe(0);
    expect(map.overlay[4][3]).toBe(OVERLAY_TILE.SERVER_RACK);
  });

  it("carveCorridor deja el atrezzo puesto; carveThroughWall es el que abre de verdad", () => {
    const walled = buildVoidLayers(8, 8);
    fillRoom(walled, { x0: 0, y0: 0, x1: 7, y1: 7 });
    buildWall(walled, { x0: 2, y0: 2, x1: 5, y1: 5 }, OVERLAY_TILE.SERVER_RACK);
    // El fallo que ya nos mordió: se anda por el pasillo, pero se sigue dibujando tapiado.
    carveCorridor(walled, { x: 3, y: 2 }, { x: 3, y: 5 });
    expect(isWalkable(walled, 3, 3)).toBe(true);
    expect(walled.overlay[3][3]).toBe(OVERLAY_TILE.SERVER_RACK);

    const carved = buildVoidLayers(8, 8);
    fillRoom(carved, { x0: 0, y0: 0, x1: 7, y1: 7 });
    buildWall(carved, { x0: 2, y0: 2, x1: 5, y1: 5 }, OVERLAY_TILE.SERVER_RACK);
    carveThroughWall(carved, { x: 3, y: 2 }, { x: 3, y: 5 });
    for (let tileY = 2; tileY <= 5; tileY++) {
      expect(isWalkable(carved, 3, tileY)).toBe(true);
      expect(carved.overlay[tileY][3]).toBe(0);
    }
    // Y no toca las columnas de al lado: el pozo sigue siendo de una casilla.
    expect(isWalkable(carved, 2, 3)).toBe(false);
    expect(isWalkable(carved, 4, 3)).toBe(false);
  });

  it("placeBelt deja la casilla transitable (una cinta se pisa, no se rodea)", () => {
    const map = buildVoidLayers(6, 6);
    fillRoom(map, { x0: 0, y0: 0, x1: 5, y1: 5 });
    placeBelt(map, 2, 2, GROUND_TILE.BELT_UP);
    expect(map.ground[2][2]).toBe(GROUND_TILE.BELT_UP);
    expect(isWalkable(map, 2, 2)).toBe(true);
  });
});
