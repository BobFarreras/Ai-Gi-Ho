// src/services/story/overworld/act-6-swarm-cutscene.test.ts - Blinda "El Enjambre": cinco copias entran ANDANDO
// desde cinco bocas, avanzan intercaladas (el secuenciador es estrictamente secuencial, así que "a la vez" se
// finge repartiendo una casilla por copia y ronda), cierran el círculo, hablan, y se apagan cuatro.
import { buildAct6SwarmCutscene, resolveSwarmNpcId } from "@/services/story/overworld/act-6-swarm-cutscene";
import {
  SWARM_CENTER_TILE,
  SWARM_ENTRY_TILES,
  SWARM_SCENE_TRIGGER_ID,
  buildAct6OverworldTilemap,
} from "@/services/story/overworld/act-6-overworld-tilemap";

const tilemap = buildAct6OverworldTilemap();

function stepsFor(isCompactViewport = false) {
  return buildAct6SwarmCutscene(tilemap, { isCompactViewport });
}

describe("buildAct6SwarmCutscene", () => {
  it("devuelve [] si el mapa no trae el trigger", () => {
    expect(buildAct6SwarmCutscene({ ...tilemap, objects: [] }, { isCompactViewport: false })).toEqual([]);
  });

  it("saca las CINCO copias, cada una en su boca", () => {
    const spawns = stepsFor().filter((step) => step.kind === "SPAWN_NPC");
    expect(spawns).toHaveLength(SWARM_ENTRY_TILES.length);
    spawns.forEach((spawn, index) => {
      expect(spawn.kind === "SPAWN_NPC" && spawn.npcId).toBe(resolveSwarmNpcId(index));
      expect(spawn.kind === "SPAWN_NPC" && spawn.tileX).toBe(SWARM_ENTRY_TILES[index].from.tileX);
      expect(spawn.kind === "SPAWN_NPC" && spawn.tileY).toBe(SWARM_ENTRY_TILES[index].from.tileY);
    });
  });

  it("entran ANDANDO, no por teletransporte: los spawns no llevan efecto", () => {
    for (const step of stepsFor().filter((entry) => entry.kind === "SPAWN_NPC")) {
      expect(step.kind === "SPAWN_NPC" && step.effect).toBeUndefined();
    }
    expect(stepsFor().some((step) => step.kind === "NPC_WALK_TO")).toBe(true);
  });

  it("avanzan INTERCALADAS: en la primera ronda se mueven las cinco, una casilla cada una", () => {
    const walks = stepsFor().filter((step) => step.kind === "NPC_WALK_TO");
    const firstRound = walks
      .slice(0, SWARM_ENTRY_TILES.length)
      .map((step) => (step.kind === "NPC_WALK_TO" ? step.npcId : ""));
    expect(new Set(firstRound).size).toBe(SWARM_ENTRY_TILES.length);
  });

  it("todas las casillas que pisa una copia son suelo transitable", () => {
    for (const step of stepsFor()) {
      if (step.kind !== "NPC_WALK_TO" && step.kind !== "SPAWN_NPC") continue;
      expect(
        tilemap.collision[step.tileY]?.[step.tileX],
        `la escena pisa (${step.tileX}, ${step.tileY}), que no es suelo`,
      ).toBe(1);
    }
  });

  it("cada copia acaba en su sitio del círculo, y todas acaban mirando al centro", () => {
    const steps = stepsFor();
    SWARM_ENTRY_TILES.forEach((entry, index) => {
      const npcId = resolveSwarmNpcId(index);
      const walks = steps.filter((step) => step.kind === "NPC_WALK_TO" && step.npcId === npcId);
      const last = walks[walks.length - 1];
      expect(last?.kind === "NPC_WALK_TO" && last.tileX).toBe(entry.to.tileX);
      expect(last?.kind === "NPC_WALK_TO" && last.tileY).toBe(entry.to.tileY);
      expect(steps.some((step) => step.kind === "NPC_FACE" && step.npcId === npcId)).toBe(true);
      // Nadie se planta encima del jugador: el círculo se cierra a una casilla o más del centro.
      const distance =
        Math.abs(entry.to.tileX - SWARM_CENTER_TILE.tileX) + Math.abs(entry.to.tileY - SWARM_CENTER_TILE.tileY);
      expect(distance).toBeGreaterThanOrEqual(1);
    });
  });

  it("hablan CON EL CÍRCULO YA CERRADO: la narración va después de andar y antes de apagarse", () => {
    const steps = stepsFor();
    const eventIndex = steps.findIndex((step) => step.kind === "EVENT" && step.nodeId === SWARM_SCENE_TRIGGER_ID);
    const lastWalk = steps.map((step) => step.kind).lastIndexOf("NPC_WALK_TO");
    const firstDespawn = steps.findIndex((step) => step.kind === "DESPAWN_NPC");
    expect(eventIndex).toBeGreaterThan(lastWalk);
    expect(firstDespawn).toBeGreaterThan(eventIndex);
  });

  it("se apagan CUATRO: la que entró de frente se queda, y es la que pelea", () => {
    const despawned = stepsFor()
      .filter((step) => step.kind === "DESPAWN_NPC")
      .map((step) => (step.kind === "DESPAWN_NPC" ? step.npcId : ""));
    expect(despawned).toHaveLength(SWARM_ENTRY_TILES.length - 1);
    expect(despawned).not.toContain(resolveSwarmNpcId(0));
  });
});
