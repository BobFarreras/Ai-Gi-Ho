// src/services/story/overworld/act-8-choir-cutscene.test.ts - Blinda "El Coro": los cuatro jefes anteriores se
// materializan en los cuatro atriles mirándote, dicen media línea cada uno, se giran hacia el centro y se
// apagan del más lejano al más cercano. En el centro NO aparece nadie: esa es la amenaza, y es narrativa pura.
import { buildAct8ChoirCutscene, resolveChoirNpcId } from "@/services/story/overworld/act-8-choir-cutscene";
import {
  CHOIR_SCENE_TRIGGER_ID,
  CHOIR_STAND_TILES,
  buildAct8OverworldTilemap,
} from "@/services/story/overworld/act-8-overworld-tilemap";

const tilemap = buildAct8OverworldTilemap();
const trigger = tilemap.objects.find((object) => object.id === CHOIR_SCENE_TRIGGER_ID)!;

function stepsFor(isCompactViewport = false) {
  return buildAct8ChoirCutscene(tilemap, { isCompactViewport });
}

describe("buildAct8ChoirCutscene", () => {
  it("devuelve [] si el mapa no trae el trigger", () => {
    expect(buildAct8ChoirCutscene({ ...tilemap, objects: [] }, { isCompactViewport: false })).toEqual([]);
  });

  it("materializa los CUATRO ecos, uno por atril, con la cara de cada jefe anterior", () => {
    const spawns = stepsFor().filter((step) => step.kind === "SPAWN_NPC");
    expect(spawns).toHaveLength(CHOIR_STAND_TILES.length);
    const sprites = new Set(spawns.map((step) => (step.kind === "SPAWN_NPC" ? step.spriteSrc : "")));
    expect(sprites.size).toBe(CHOIR_STAND_TILES.length); // cuatro caras distintas
    spawns.forEach((spawn, index) => {
      expect(spawn.kind === "SPAWN_NPC" && spawn.npcId).toBe(resolveChoirNpcId(index));
      expect(spawn.kind === "SPAWN_NPC" && spawn.effect).toBe("TELEPORT");
      expect(spawn.kind === "SPAWN_NPC" && spawn.tileX).toBe(CHOIR_STAND_TILES[index].tileX);
      expect(spawn.kind === "SPAWN_NPC" && spawn.tileY).toBe(CHOIR_STAND_TILES[index].tileY);
    });
  });

  it("es narrativa PURA: nadie anda, sólo hay una línea y en el centro no aparece nadie", () => {
    const steps = stepsFor();
    expect(steps.some((step) => step.kind === "NPC_WALK_TO")).toBe(false);
    const events = steps.filter((step) => step.kind === "EVENT");
    expect(events).toHaveLength(1);
    expect(events[0].kind === "EVENT" && events[0].nodeId).toBe(CHOIR_SCENE_TRIGGER_ID);
    const center = { tileX: Math.floor(tilemap.width / 2), tileY: Math.floor(tilemap.height / 2) };
    for (const step of steps) {
      if (step.kind !== "SPAWN_NPC") continue;
      expect({ tileX: step.tileX, tileY: step.tileY }).not.toEqual(center);
    }
  });

  it("primero te miran a ti y DESPUÉS de hablar se giran hacia el centro", () => {
    const steps = stepsFor();
    const eventIndex = steps.findIndex((step) => step.kind === "EVENT");
    const facesAfter = steps.slice(eventIndex).filter((step) => step.kind === "NPC_FACE");
    expect(facesAfter).toHaveLength(CHOIR_STAND_TILES.length);
  });

  it("se apagan del más LEJANO al más cercano: el último en irse es el que tienes delante", () => {
    const despawned: string[] = stepsFor()
      .filter((step) => step.kind === "DESPAWN_NPC")
      .map((step) => (step.kind === "DESPAWN_NPC" ? (step.npcId ?? "") : ""));
    expect(despawned).toHaveLength(CHOIR_STAND_TILES.length);
    const distanceOf = (npcId: string) => {
      const index = CHOIR_STAND_TILES.findIndex((_, position) => resolveChoirNpcId(position) === npcId);
      const tile = CHOIR_STAND_TILES[index];
      return Math.abs(tile.tileX - trigger.tileX) + Math.abs(tile.tileY - trigger.tileY);
    };
    const distances = despawned.map(distanceOf);
    expect([...distances].sort((left, right) => right - left)).toEqual(distances);
  });

  it("las pausas se acortan en móvil", () => {
    const secondsOf = (steps: ReturnType<typeof stepsFor>) =>
      steps.reduce((total, step) => total + (step.kind === "WAIT" ? step.seconds : 0), 0);
    expect(secondsOf(stepsFor(true))).toBeLessThan(secondsOf(stepsFor(false)));
  });
});
