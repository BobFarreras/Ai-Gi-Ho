// src/services/story/overworld/act-8-overworld-tilemap.test.ts - Blinda el Acto 8 (La Singularidad): válido,
// ambiente SINGULARITY, registrado, y la estructura del cierre de campaña — un anillo con cuatro pedestales en
// el orden que quieras, un pozo de una casilla de ancho con las tres fases escalonadas, y ninguna salida hacia
// delante: aquí se acaba.
import {
  CHOIR_SCENE_TRIGGER_ID,
  CHOIR_STAND_TILES,
  buildAct8OverworldTilemap,
} from "@/services/story/overworld/act-8-overworld-tilemap";
import { buildOverworldTilemap } from "@/services/story/overworld/resolve-overworld-tilemap";
import { findStoryVirtualNodeDefinition } from "@/services/story/map-definitions/story-map-definition-registry";
import { canReachObject, objectOf } from "@/services/story/overworld/act-flow-test-kit";

const PEDESTALS = ["story-ch8-duel-1", "story-ch8-duel-2", "story-ch8-duel-3", "story-ch8-duel-4"];
const PHASES = ["story-ch8-duel-5", "story-ch8-duel-6", "story-ch8-duel-7"];

describe("buildAct8OverworldTilemap", () => {
  it("se construye y valida sin lanzar, en ambiente SINGULARITY (violeta)", () => {
    const tilemap = buildAct8OverworldTilemap();
    expect(tilemap.ambient).toBe("SINGULARITY");
    expect(tilemap.act).toBe(8);
    expect(tilemap.id).toBe("act-8");
  });

  it("queda registrado, tiene spawn de entrada y vuelve al Acto 7", () => {
    const tilemap = buildAct8OverworldTilemap();
    expect(buildOverworldTilemap("act-8")).not.toBeNull();
    expect(tilemap.defaultSpawnId).toBe("spawn-entry");
    expect(objectOf(tilemap, "story-ch8-transition-to-act7").warp?.toMapId).toBe("act-7");
  });

  it("es el FINAL de la campaña: no hay ningún portal hacia delante", () => {
    const warps = buildAct8OverworldTilemap().objects.filter((object) => object.kind === "WARP");
    expect(warps.map((warp) => warp.warp?.direction)).toEqual(["backward"]);
  });

  it("los cuatro pedestales se hacen en el orden que quieras: los cuatro alcanzables de salida", () => {
    const tilemap = buildAct8OverworldTilemap();
    for (const duel of PEDESTALS) {
      expect(canReachObject(tilemap, duel, {}), `'${duel}' debería ser alcanzable de salida`).toBe(true);
    }
  });

  it("la boca del pozo exige los CUATRO pedestales, y con tres no se abre", () => {
    const tilemap = buildAct8OverworldTilemap();
    expect(objectOf(tilemap, "story-a8-gate-shaft").gateRequiredNodeIds).toEqual(PEDESTALS);
    expect(canReachObject(tilemap, PHASES[0], { completed: PEDESTALS.slice(0, 3) })).toBe(false);
    expect(canReachObject(tilemap, PHASES[0], { completed: PEDESTALS })).toBe(true);
  });

  it("las tres fases están encadenadas y en fila dentro del pozo: no hay atajo ni orden alternativo", () => {
    const tilemap = buildAct8OverworldTilemap();
    const phases = PHASES.map((id) => objectOf(tilemap, id));
    expect(phases.every((phase) => phase.kind === "BOSS")).toBe(true);
    // Misma columna y hacia arriba: cada fase está más adentro del pozo que la anterior.
    expect(new Set(phases.map((phase) => phase.tileX)).size).toBe(1);
    expect(phases[1].tileY).toBeLessThan(phases[0].tileY);
    expect(phases[2].tileY).toBeLessThan(phases[1].tileY);
    expect(phases[1].gateRequiredNodeIds).toEqual([PHASES[0]]);
    expect(phases[2].gateRequiredNodeIds).toEqual([PHASES[1]]);
  });

  it("el pozo es de UNA casilla de ancho: cada fase tapona físicamente el paso a la siguiente", () => {
    const tilemap = buildAct8OverworldTilemap();
    for (const id of PHASES) {
      const phase = objectOf(tilemap, id);
      // La fase ocupa su casilla…
      expect(tilemap.collision[phase.tileY][phase.tileX]).toBe(0);
      // …y a los lados hay muro, así que no se rodea.
      expect(tilemap.collision[phase.tileY][phase.tileX - 1]).toBe(0);
      expect(tilemap.collision[phase.tileY][phase.tileX + 1]).toBe(0);
    }
  });

  it("el epílogo está al fondo del pozo y exige la última fase", () => {
    const tilemap = buildAct8OverworldTilemap();
    const epilogue = objectOf(tilemap, "story-ch8-event-epilogue");
    expect(epilogue.trigger).toBe("STEP_ON");
    expect(epilogue.gateRequiredNodeIds).toEqual([PHASES[2]]);
    expect(canReachObject(tilemap, "story-ch8-event-epilogue", { completed: PEDESTALS })).toBe(false);
    expect(canReachObject(tilemap, "story-ch8-event-epilogue", { completed: [...PEDESTALS, ...PHASES] })).toBe(true);
  });

  it("El Coro se pisa al entrar y sus cuatro atriles son casillas reales del anillo", () => {
    const tilemap = buildAct8OverworldTilemap();
    const trigger = objectOf(tilemap, CHOIR_SCENE_TRIGGER_ID);
    expect(trigger.trigger).toBe("STEP_ON");
    expect(CHOIR_STAND_TILES).toHaveLength(4);
    for (const tile of CHOIR_STAND_TILES) {
      expect(tilemap.collision[tile.tileY]?.[tile.tileX], `el atril (${tile.tileX}, ${tile.tileY}) no es suelo`).toBe(1);
    }
  });

  it("todos los nodos virtuales del acto están registrados", () => {
    const tilemap = buildAct8OverworldTilemap();
    const virtualKinds = new Set(["EVENT", "PLATE", "REWARD_CARD", "REWARD_OBJECT", "SUBMISSION"]);
    for (const object of tilemap.objects.filter((entry) => virtualKinds.has(entry.kind))) {
      expect(findStoryVirtualNodeDefinition(object.id), `falta la definición virtual de '${object.id}'`).toBeTruthy();
    }
  });
});
