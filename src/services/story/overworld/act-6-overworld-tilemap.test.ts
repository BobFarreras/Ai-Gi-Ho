// src/services/story/overworld/act-6-overworld-tilemap.test.ts - Blinda el Acto 6 (Red Abierta): válido,
// ambiente CLOUD, registrado, y su estructura NO lineal — tres regiones abiertas en el orden que quieras, y una
// sola cerradura al final (las tres llaves) antes del terminal y del Leviatán.
import {
  ACT_7_PORTAL_ID,
  SWARM_CENTER_TILE,
  SWARM_ENTRY_TILES,
  SWARM_SCENE_DUEL_ID,
  SWARM_SCENE_TRIGGER_ID,
  buildAct6OverworldTilemap,
} from "@/services/story/overworld/act-6-overworld-tilemap";
import { buildOverworldTilemap } from "@/services/story/overworld/resolve-overworld-tilemap";
import { findStoryVirtualNodeDefinition } from "@/services/story/map-definitions/story-map-definition-registry";
import { canReachObject, objectOf } from "@/services/story/overworld/act-flow-test-kit";
import { traceWalkableCorridor } from "@/services/story/overworld/trace-walkable-corridor";

const KEYS = ["story-ch6-key-north", "story-ch6-key-east", "story-ch6-key-south"];
const TERMINAL = "story-ch6-edge-terminal";

describe("buildAct6OverworldTilemap", () => {
  it("se construye y valida sin lanzar, en ambiente CLOUD (a cielo abierto)", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(tilemap.ambient).toBe("CLOUD");
    expect(tilemap.act).toBe(6);
    expect(tilemap.id).toBe("act-6");
  });

  it("queda registrado, tiene spawn de entrada y vuelve al Acto 5", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(buildOverworldTilemap("act-6")).not.toBeNull();
    expect(tilemap.defaultSpawnId).toBe("spawn-entry");
    expect(objectOf(tilemap, "story-ch6-transition-to-act5").warp?.toMapId).toBe("act-5");
  });

  it("es un mapa ANCHO (apaisado), al revés que los pasillos verticales de los actos anteriores", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(tilemap.width).toBeGreaterThan(tilemap.height);
  });

  it("las tres regiones son SIMULTÁNEAS: las tres llaves se alcanzan desde el spawn sin nada hecho", () => {
    const tilemap = buildAct6OverworldTilemap();
    for (const key of KEYS) {
      expect(canReachObject(tilemap, key, {}), `la llave '${key}' debería ser alcanzable de salida`).toBe(true);
    }
  });

  it("cada llave exige haber ganado SU región (no se cogen de paso)", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(objectOf(tilemap, KEYS[0]).gateRequiredNodeIds).toEqual(["story-ch6-duel-1"]);
    expect(objectOf(tilemap, KEYS[1]).gateRequiredNodeIds).toEqual(["story-ch6-duel-2"]);
    expect(objectOf(tilemap, KEYS[2]).gateRequiredNodeIds).toEqual(["story-ch6-duel-3"]);
  });

  it("la boca oeste es lo único lineal: se abre con las TRES llaves, y con dos no", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(objectOf(tilemap, "story-a6-gate-west").gateRequiredNodeIds).toEqual(KEYS);
    expect(canReachObject(tilemap, TERMINAL, { interacted: [KEYS[0], KEYS[1]] })).toBe(false);
    expect(canReachObject(tilemap, TERMINAL, { interacted: KEYS })).toBe(true);
  });

  it("el Leviatán exige el terminal de código Y haber sobrevivido al Enjambre", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(objectOf(tilemap, "story-a6-gate-leviathan").gateRequiredNodeIds).toEqual([TERMINAL, SWARM_SCENE_DUEL_ID]);
    const westOpen = { interacted: KEYS };
    expect(canReachObject(tilemap, "story-ch6-duel-5", westOpen)).toBe(false);
    expect(
      canReachObject(tilemap, "story-ch6-duel-5", {
        interacted: [...KEYS, TERMINAL],
        completed: [SWARM_SCENE_DUEL_ID],
      }),
    ).toBe(true);
  });

  it("la escena del Enjambre tiene cinco bocas y todas trazan un camino real hasta su sitio del círculo", () => {
    const tilemap = buildAct6OverworldTilemap();
    expect(SWARM_ENTRY_TILES).toHaveLength(5);
    for (const entry of SWARM_ENTRY_TILES) {
      const route = traceWalkableCorridor(tilemap.collision, entry.from, entry.to);
      expect(route.length, `la boca (${entry.from.tileX}, ${entry.from.tileY}) no llega a su sitio`).toBeGreaterThan(0);
      expect(route[route.length - 1]).toEqual({ tileX: entry.to.tileX, tileY: entry.to.tileY });
    }
  });

  it("el círculo se cierra alrededor del trigger, y el trigger se pisa (no se acciona)", () => {
    const tilemap = buildAct6OverworldTilemap();
    const trigger = objectOf(tilemap, SWARM_SCENE_TRIGGER_ID);
    expect(trigger.trigger).toBe("STEP_ON");
    expect({ tileX: trigger.tileX, tileY: trigger.tileY }).toEqual({
      tileX: SWARM_CENTER_TILE.tileX,
      tileY: SWARM_CENTER_TILE.tileY,
    });
    // Ninguna copia se planta encima del jugador: todas se paran a una casilla o más.
    for (const entry of SWARM_ENTRY_TILES) {
      const distance = Math.abs(entry.to.tileX - trigger.tileX) + Math.abs(entry.to.tileY - trigger.tileY);
      expect(distance).toBeGreaterThanOrEqual(1);
    }
  });

  it("hay una corriente de datos (cinta) en la región este", () => {
    const tilemap = buildAct6OverworldTilemap();
    const hasBelt = tilemap.layers.ground.some((row) => row.some((cell) => cell >= 6 && cell <= 9));
    expect(hasBelt).toBe(true);
  });

  it("el portal al Acto 7 salta a la Fundición y sólo tras vencer al Leviatán", () => {
    const portal = objectOf(buildAct6OverworldTilemap(), ACT_7_PORTAL_ID);
    expect(portal.warp).toEqual({ toMapId: "act-7", toSpawnId: "spawn-entry", direction: "forward" });
    expect(portal.gateRequiredNodeIds).toEqual(["story-ch6-duel-5"]);
  });

  it("todos los nodos virtuales del acto están registrados", () => {
    const tilemap = buildAct6OverworldTilemap();
    const virtualKinds = new Set(["EVENT", "PLATE", "REWARD_CARD", "REWARD_OBJECT", "SUBMISSION"]);
    for (const object of tilemap.objects.filter((entry) => virtualKinds.has(entry.kind))) {
      expect(findStoryVirtualNodeDefinition(object.id), `falta la definición virtual de '${object.id}'`).toBeTruthy();
    }
  });
});
