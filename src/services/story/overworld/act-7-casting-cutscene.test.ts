// src/services/story/overworld/act-7-casting-cutscene.test.ts - Blinda "La Colada": los dos rivales discuten
// por encima de la cadena SIN mirarte, se giran los dos a la vez cuando terminan, Midutech se retira y el
// Alquimista sube por un pasillo real hasta pegarse al jugador.
import {
  CASTING_ALQUIMISTA_NPC_ID,
  CASTING_MIDUTECH_NPC_ID,
  buildAct7CastingCutscene,
} from "@/services/story/overworld/act-7-casting-cutscene";
import {
  CASTING_ALQUIMISTA_TILE,
  CASTING_MIDUTECH_TILE,
  CASTING_SCENE_TRIGGER_ID,
  buildAct7OverworldTilemap,
} from "@/services/story/overworld/act-7-overworld-tilemap";

const tilemap = buildAct7OverworldTilemap();
const trigger = tilemap.objects.find((object) => object.id === CASTING_SCENE_TRIGGER_ID)!;

function stepsFor(isCompactViewport = false) {
  return buildAct7CastingCutscene(tilemap, { isCompactViewport });
}

describe("buildAct7CastingCutscene", () => {
  it("devuelve [] si el mapa no trae el trigger", () => {
    expect(buildAct7CastingCutscene({ ...tilemap, objects: [] }, { isCompactViewport: false })).toEqual([]);
  });

  it("saca a los dos, a lado y lado de la cadena y mirando a la carta (arriba)", () => {
    const spawns = stepsFor().filter((step) => step.kind === "SPAWN_NPC");
    expect(spawns).toHaveLength(2);
    for (const spawn of spawns) expect(spawn.kind === "SPAWN_NPC" && spawn.facing).toBe("UP");
    const [alquimista, midutech] = spawns;
    expect(alquimista.kind === "SPAWN_NPC" && alquimista.npcId).toBe(CASTING_ALQUIMISTA_NPC_ID);
    expect(midutech.kind === "SPAWN_NPC" && midutech.npcId).toBe(CASTING_MIDUTECH_NPC_ID);
    expect(alquimista.kind === "SPAWN_NPC" && alquimista.tileX).toBe(CASTING_ALQUIMISTA_TILE.tileX);
    expect(midutech.kind === "SPAWN_NPC" && midutech.tileX).toBe(CASTING_MIDUTECH_TILE.tileX);
    expect(CASTING_ALQUIMISTA_TILE.tileY).toBe(CASTING_MIDUTECH_TILE.tileY);
  });

  it("la discusión pasa por encima de la cinta: se miran el uno al otro ANTES de hablar", () => {
    const steps = stepsFor();
    const eventIndex = steps.findIndex((step) => step.kind === "EVENT" && step.nodeId === CASTING_SCENE_TRIGGER_ID);
    expect(eventIndex).toBeGreaterThan(0);
    const facingsBefore = steps
      .slice(0, eventIndex)
      .filter((step) => step.kind === "NPC_FACE")
      .map((step) => (step.kind === "NPC_FACE" ? step.direction : ""));
    expect(facingsBefore).toEqual(["RIGHT", "LEFT"]);
  });

  it("el remate: los DOS giran hacia el jugador a la vez, y sólo entonces se va Midutech", () => {
    const after = stepsFor().slice(stepsFor().findIndex((step) => step.kind === "EVENT"));
    const turnUp = after.filter((step) => step.kind === "NPC_FACE" && step.direction === "UP");
    expect(turnUp).toHaveLength(2);
    const despawnIndex = after.findIndex((step) => step.kind === "DESPAWN_NPC");
    const lastTurnIndex = after.map((step) => step.kind === "NPC_FACE" && step.direction === "UP").lastIndexOf(true);
    expect(despawnIndex).toBeGreaterThan(lastTurnIndex);
    const despawn = after[despawnIndex];
    expect(despawn.kind === "DESPAWN_NPC" && despawn.npcId).toBe(CASTING_MIDUTECH_NPC_ID);
  });

  it("el Alquimista sube por un pasillo REAL, casilla a casilla y sin atravesar muros", () => {
    const steps = stepsFor();
    const walks = steps.filter((step) => step.kind === "NPC_WALK_TO" && step.npcId === CASTING_ALQUIMISTA_NPC_ID);
    expect(walks.length).toBeGreaterThan(0);
    let previous: { tileX: number; tileY: number } = { ...CASTING_ALQUIMISTA_TILE };
    for (const step of walks) {
      if (step.kind !== "NPC_WALK_TO") continue;
      expect(
        tilemap.collision[step.tileY]?.[step.tileX],
        `el Alquimista pasa por (${step.tileX}, ${step.tileY}), que no es suelo`,
      ).toBe(1);
      // Cada paso es a una casilla contigua: nada de saltos.
      expect(Math.abs(step.tileX - previous.tileX) + Math.abs(step.tileY - previous.tileY)).toBe(1);
      previous = { tileX: step.tileX, tileY: step.tileY };
    }
    // Se para pegado al jugador, no encima de él.
    expect(Math.abs(previous.tileX - trigger.tileX) + Math.abs(previous.tileY - trigger.tileY)).toBe(1);
    expect(steps.some((step) => step.kind === "PLAYER_FACE")).toBe(true);
  });
});
