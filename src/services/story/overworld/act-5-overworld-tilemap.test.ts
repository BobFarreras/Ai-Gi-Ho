// src/services/story/overworld/act-5-overworld-tilemap.test.ts - Blinda el Acto 5 (Core Invertido): válido,
// ambiente MIRROR, registrado, y las tres cerraduras del acto en el orden correcto — Eco corta la entrada, las
// DOS placas simétricas abren la sala del Reflejo, y los tres sellos + Verso abren el trono.
import {
  ACT_6_PORTAL_ID,
  MIRROR_DOUBLE_TILE,
  MIRROR_SCENE_DUEL_ID,
  MIRROR_SCENE_TRIGGER_ID,
  MIRROR_TRIGGER_TILE,
  buildAct5OverworldTilemap,
} from "@/services/story/overworld/act-5-overworld-tilemap";
import { buildOverworldTilemap } from "@/services/story/overworld/resolve-overworld-tilemap";
import { findStoryVirtualNodeDefinition } from "@/services/story/map-definitions/story-map-definition-registry";
import { canReachObject, objectOf } from "@/services/story/overworld/act-flow-test-kit";

const DUEL_1 = "story-ch5-duel-1";
const PLATE_LEFT = "story-ch5-plate-left";
const PLATE_RIGHT = "story-ch5-plate-right";
const SEALS = ["story-ch5-seal-1", "story-ch5-seal-2", "story-ch5-seal-3"];

describe("buildAct5OverworldTilemap", () => {
  it("se construye y valida sin lanzar, en ambiente MIRROR (el Core en negativo)", () => {
    const tilemap = buildAct5OverworldTilemap();
    expect(tilemap.ambient).toBe("MIRROR");
    expect(tilemap.act).toBe(5);
    expect(tilemap.id).toBe("act-5");
  });

  it("queda registrado y resoluble por su mapId 'act-5'", () => {
    expect(buildOverworldTilemap("act-5")).not.toBeNull();
  });

  it("expone el spawn 'spawn-entry' al que llega el portal del Acto 4, y vuelve al Acto 4", () => {
    const tilemap = buildAct5OverworldTilemap();
    expect(tilemap.defaultSpawnId).toBe("spawn-entry");
    expect(tilemap.spawns.some((spawn) => spawn.id === "spawn-entry")).toBe(true);
    expect(objectOf(tilemap, "story-ch5-transition-to-act4").warp?.toMapId).toBe("act-4");
  });

  it("tiene servicios (mercado/arsenal/salir)", () => {
    const kinds = new Set(buildAct5OverworldTilemap().objects.map((object) => object.kind));
    expect(kinds.has("MARKET")).toBe(true);
    expect(kinds.has("ARSENAL")).toBe(true);
    expect(kinds.has("TELEPORT")).toBe(true);
  });

  it("el puzzle es SIMÉTRICO: cada caja/placa/reset tiene su gemela reflejada en el eje del mapa", () => {
    const tilemap = buildAct5OverworldTilemap();
    const axis = MIRROR_TRIGGER_TILE.tileX;
    for (const [leftId, rightId] of [
      [PLATE_LEFT, PLATE_RIGHT],
      ["story-ch5-box-left", "story-ch5-box-right"],
      ["story-a5-box-reset-left", "story-a5-box-reset-right"],
    ]) {
      const left = objectOf(tilemap, leftId);
      const right = objectOf(tilemap, rightId);
      expect(right.tileY).toBe(left.tileY);
      expect(axis - left.tileX).toBe(right.tileX - axis);
    }
  });

  it("Eco (duel-1) tapona el único corredor de entrada: sin vencerlo no se llega a ninguna placa", () => {
    const tilemap = buildAct5OverworldTilemap();
    expect(canReachObject(tilemap, PLATE_LEFT, {})).toBe(false);
    expect(canReachObject(tilemap, PLATE_LEFT, { completed: [DUEL_1] })).toBe(true);
    expect(canReachObject(tilemap, PLATE_RIGHT, { completed: [DUEL_1] })).toBe(true);
  });

  it("la compuerta del espejo exige LAS DOS placas: hacer un ala no basta", () => {
    const tilemap = buildAct5OverworldTilemap();
    const gate = objectOf(tilemap, "story-a5-gate-mirror");
    expect(gate.gateRequiredNodeIds).toEqual([PLATE_LEFT, PLATE_RIGHT]);
    const onlyLeft = { completed: [DUEL_1], interacted: [PLATE_LEFT] };
    expect(canReachObject(tilemap, MIRROR_SCENE_TRIGGER_ID, onlyLeft)).toBe(false);
    const both = { completed: [DUEL_1], interacted: [PLATE_LEFT, PLATE_RIGHT] };
    expect(canReachObject(tilemap, MIRROR_SCENE_TRIGGER_ID, both)).toBe(true);
  });

  it("el trono exige los TRES sellos y haber vencido a Verso en la escena del espejo", () => {
    const tilemap = buildAct5OverworldTilemap();
    const gate = objectOf(tilemap, "story-a5-gate-throne");
    expect(gate.gateRequiredNodeIds).toEqual([...SEALS, MIRROR_SCENE_DUEL_ID]);
    const openMirror = { completed: [DUEL_1], interacted: [PLATE_LEFT, PLATE_RIGHT] };
    // Con la sala del Reflejo abierta pero sin sellos ni Verso, el trono sigue sellado.
    expect(canReachObject(tilemap, "story-ch5-duel-5", openMirror)).toBe(false);
    // Faltando UN solo sello, tampoco.
    expect(
      canReachObject(tilemap, "story-ch5-duel-5", {
        completed: [DUEL_1, MIRROR_SCENE_DUEL_ID],
        interacted: [PLATE_LEFT, PLATE_RIGHT, SEALS[0], SEALS[1]],
      }),
    ).toBe(false);
    expect(
      canReachObject(tilemap, "story-ch5-duel-5", {
        completed: [DUEL_1, MIRROR_SCENE_DUEL_ID],
        interacted: [PLATE_LEFT, PLATE_RIGHT, ...SEALS],
      }),
    ).toBe(true);
  });

  it("Verso es un nodo FANTASMA de la escena: oculto, sin haz de visión y sobre casilla libre", () => {
    const tilemap = buildAct5OverworldTilemap();
    const verso = objectOf(tilemap, MIRROR_SCENE_DUEL_ID);
    expect(verso.hidden).toBe(true);
    expect(verso.visionRange).toBeUndefined();
    // No ocupa casilla: si fuera sólido, taponaría el hueco del espejo antes de que salte la escena.
    expect(tilemap.collision[verso.tileY][verso.tileX]).toBe(1);
  });

  it("el doble y el trigger comparten el eje de simetría, con el doble al otro lado de la línea de espejos", () => {
    expect(MIRROR_DOUBLE_TILE.tileX).toBe(MIRROR_TRIGGER_TILE.tileX);
    expect(MIRROR_DOUBLE_TILE.tileY).toBeLessThan(MIRROR_TRIGGER_TILE.tileY);
    const tilemap = buildAct5OverworldTilemap();
    expect(tilemap.collision[MIRROR_DOUBLE_TILE.tileY][MIRROR_DOUBLE_TILE.tileX]).toBe(1);
    expect(tilemap.collision[MIRROR_TRIGGER_TILE.tileY][MIRROR_TRIGGER_TILE.tileX]).toBe(1);
  });

  it("el portal al Acto 6 salta a la Red Abierta y sólo tras vencer a El Reflejo", () => {
    const portal = objectOf(buildAct5OverworldTilemap(), ACT_6_PORTAL_ID);
    expect(portal.kind).toBe("WARP");
    expect(portal.warp).toEqual({ toMapId: "act-6", toSpawnId: "spawn-entry", direction: "forward" });
    expect(portal.gateRequiredNodeIds).toEqual(["story-ch5-duel-5"]);
  });

  it("todos los nodos virtuales del acto (eventos, placas, sellos, recompensas) están registrados", () => {
    const tilemap = buildAct5OverworldTilemap();
    const virtualKinds = new Set(["EVENT", "PLATE", "REWARD_CARD", "REWARD_OBJECT", "SUBMISSION"]);
    const ids = tilemap.objects.filter((object) => virtualKinds.has(object.kind)).map((object) => object.id);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(findStoryVirtualNodeDefinition(id), `falta la definición virtual de '${id}'`).toBeTruthy();
    }
  });
});
