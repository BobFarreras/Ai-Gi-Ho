// src/services/story/overworld/act-7-overworld-tilemap.test.ts - Blinda el Acto 7 (Fundición Cuántica): válido,
// ambiente FORGE, registrado, y el único acto que se juega HACIA ABAJO — cuatro plantas, cada una con su
// cerradura, y una pasarela que empuja en contra hasta que se invierte.
import {
  ACT_8_PORTAL_ID,
  CASTING_ALQUIMISTA_TILE,
  CASTING_LINE_TILE_Y,
  CASTING_MIDUTECH_TILE,
  CASTING_SCENERY_ALQUIMISTA_ID,
  CASTING_SCENERY_MIDUTECH_ID,
  CASTING_SCENE_DUEL_ID,
  CASTING_SCENE_TRIGGER_ID,
  buildAct7OverworldTilemap,
} from "@/services/story/overworld/act-7-overworld-tilemap";
import { buildOverworldTilemap } from "@/services/story/overworld/resolve-overworld-tilemap";
import { findStoryVirtualNodeDefinition } from "@/services/story/map-definitions/story-map-definition-registry";
import { canReachObject, objectOf, spawnTileOf } from "@/services/story/overworld/act-flow-test-kit";
import { GROUND_TILE } from "@/services/story/overworld/overworld-tile-kinds";

const DUEL_1 = "story-ch7-duel-1";
const DUEL_2 = "story-ch7-duel-2";
const DUEL_4 = "story-ch7-duel-4";
const PLATE_1 = "story-ch7-plate-1";

describe("buildAct7OverworldTilemap", () => {
  it("se construye y valida sin lanzar, en ambiente FORGE (naranja de fundición)", () => {
    const tilemap = buildAct7OverworldTilemap();
    expect(tilemap.ambient).toBe("FORGE");
    expect(tilemap.act).toBe(7);
    expect(tilemap.id).toBe("act-7");
  });

  it("queda registrado, tiene spawn de entrada y vuelve al Acto 6", () => {
    const tilemap = buildAct7OverworldTilemap();
    expect(buildOverworldTilemap("act-7")).not.toBeNull();
    expect(tilemap.defaultSpawnId).toBe("spawn-entry");
    expect(objectOf(tilemap, "story-ch7-transition-to-act6").warp?.toMapId).toBe("act-6");
  });

  it("se juega HACIA ABAJO: se entra por arriba y el jefe está al fondo", () => {
    const tilemap = buildAct7OverworldTilemap();
    const spawn = tilemap.spawns.find((entry) => entry.id === tilemap.defaultSpawnId)!;
    expect(spawn.facing).toBe("DOWN");
    expect(spawnTileOf(tilemap).tileY).toBeLessThan(tilemap.height / 4);
    expect(objectOf(tilemap, "story-ch7-duel-5").tileY).toBeGreaterThan((tilemap.height * 3) / 4);
  });

  it("la planta 4 no se deja bajar sin la caja sobre la placa Y sin vencer al operario", () => {
    const tilemap = buildAct7OverworldTilemap();
    expect(objectOf(tilemap, "story-a7-gate-floor3").gateRequiredNodeIds).toEqual([PLATE_1, DUEL_1]);
    expect(canReachObject(tilemap, CASTING_SCENE_TRIGGER_ID, {})).toBe(false);
    expect(canReachObject(tilemap, CASTING_SCENE_TRIGGER_ID, { interacted: [PLATE_1] })).toBe(false);
    expect(canReachObject(tilemap, CASTING_SCENE_TRIGGER_ID, { interacted: [PLATE_1], completed: [DUEL_1] })).toBe(true);
  });

  it("la pasarela de bajada empieza EN CONTRA y sólo se invierte tras vencer a su guardia", () => {
    const tilemap = buildAct7OverworldTilemap();
    const invert = objectOf(tilemap, "story-ch7-belt-switch");
    expect(invert.beltToggleMode).toBe("INVERT");
    expect(invert.gateRequiredNodeIds).toEqual([DUEL_2]);
    // Todas las casillas del tramo son cinta HACIA ARRIBA de salida: bajarla a pelo no es una opción.
    const rect = invert.beltToggleRect!;
    for (let tileY = rect.y0; tileY <= rect.y1; tileY++) {
      expect(tilemap.layers.ground[tileY][rect.x0]).toBe(GROUND_TILE.BELT_UP);
    }
  });

  it("el gemelo de abajo RESTAURA la pasarela: no hay forma de quedarse encerrado en las plantas bajas", () => {
    const tilemap = buildAct7OverworldTilemap();
    const restore = objectOf(tilemap, "story-ch7-belt-switch-bottom");
    expect(restore.beltToggleMode).toBe("RESTORE");
    expect(restore.gateRequiredNodeIds).toBeUndefined();
    // Los dos actúan sobre el MISMO tramo: si no, la palanca de rescate no rescataría nada.
    expect(restore.beltToggleRect).toEqual(objectOf(tilemap, "story-ch7-belt-switch").beltToggleRect);
  });

  it("la Colada: los dos NPCs de atrezzo están a lado y lado de la cadena, y el Alquimista es nodo fantasma", () => {
    const tilemap = buildAct7OverworldTilemap();
    const alquimista = objectOf(tilemap, CASTING_SCENERY_ALQUIMISTA_ID);
    const midutech = objectOf(tilemap, CASTING_SCENERY_MIDUTECH_ID);
    expect(alquimista.kind).toBe("NPC");
    expect(midutech.kind).toBe("NPC");
    expect(alquimista.tileY).toBe(midutech.tileY);
    expect(alquimista.tileY).toBeGreaterThan(CASTING_LINE_TILE_Y); // los dos, por debajo de la cadena
    expect({ tileX: alquimista.tileX, tileY: alquimista.tileY }).toEqual({ ...CASTING_ALQUIMISTA_TILE });
    expect({ tileX: midutech.tileX, tileY: midutech.tileY }).toEqual({ ...CASTING_MIDUTECH_TILE });
    const duel = objectOf(tilemap, CASTING_SCENE_DUEL_ID);
    expect(duel.hidden).toBe(true);
    expect(duel.visionRange).toBeUndefined();
  });

  it("la carta de la Fundición sólo se coge tras ganar la Colada", () => {
    expect(objectOf(buildAct7OverworldTilemap(), "story-ch7-card-superc").gateRequiredNodeIds).toEqual([
      CASTING_SCENE_DUEL_ID,
    ]);
  });

  it("la planta 1 la sella Midutech: sin vencerlo, el Prototipo es inalcanzable", () => {
    const tilemap = buildAct7OverworldTilemap();
    expect(objectOf(tilemap, "story-a7-gate-floor1").gateRequiredNodeIds).toEqual([DUEL_4]);
    const floor2 = { interacted: [PLATE_1], completed: [DUEL_1, DUEL_2, CASTING_SCENE_DUEL_ID] };
    expect(canReachObject(tilemap, "story-ch7-duel-5", floor2)).toBe(false);
    expect(canReachObject(tilemap, "story-ch7-duel-5", { ...floor2, completed: [...floor2.completed, DUEL_4] })).toBe(true);
  });

  it("el portal al Acto 8 salta a la Singularidad y sólo tras vencer al Prototipo Cero", () => {
    const portal = objectOf(buildAct7OverworldTilemap(), ACT_8_PORTAL_ID);
    expect(portal.warp).toEqual({ toMapId: "act-8", toSpawnId: "spawn-entry", direction: "forward" });
    expect(portal.gateRequiredNodeIds).toEqual(["story-ch7-duel-5"]);
  });

  it("todos los nodos virtuales del acto están registrados", () => {
    const tilemap = buildAct7OverworldTilemap();
    const virtualKinds = new Set(["EVENT", "PLATE", "REWARD_CARD", "REWARD_OBJECT", "SUBMISSION"]);
    for (const object of tilemap.objects.filter((entry) => virtualKinds.has(entry.kind))) {
      expect(findStoryVirtualNodeDefinition(object.id), `falta la definición virtual de '${object.id}'`).toBeTruthy();
    }
  });
});
