// src/services/story/overworld/act-5-mirror-cutscene.test.ts - Blinda "El Reflejo": el doble repite los pasos
// del jugador EN ESPEJO, todas las casillas que pisa existen, rompe la regla con un paso que nadie ha dado, y
// Verso aparece justo detrás y baja hasta el jugador cruzando el hueco de la línea de espejos.
import {
  MIRROR_DOUBLE_NPC_ID,
  MIRROR_VERSO_NPC_ID,
  buildAct5MirrorCutscene,
} from "@/services/story/overworld/act-5-mirror-cutscene";
import {
  MIRROR_DOUBLE_TILE,
  MIRROR_TRIGGER_TILE,
  buildAct5OverworldTilemap,
} from "@/services/story/overworld/act-5-overworld-tilemap";

const tilemap = buildAct5OverworldTilemap();

function stepsFor(isCompactViewport = false) {
  return buildAct5MirrorCutscene(tilemap, { isCompactViewport });
}

describe("buildAct5MirrorCutscene", () => {
  it("tiene guion, y en móvil las pausas son más cortas", () => {
    const desktop = stepsFor(false);
    const compact = stepsFor(true);
    expect(desktop.length).toBeGreaterThan(0);
    expect(desktop).toHaveLength(compact.length);
    const secondsOf = (steps: ReturnType<typeof stepsFor>) =>
      steps.reduce((total, step) => total + (step.kind === "WAIT" ? step.seconds : 0), 0);
    expect(secondsOf(compact)).toBeLessThan(secondsOf(desktop));
  });

  it("devuelve [] si el mapa no trae el trigger (se pasa directo a la narración)", () => {
    const withoutTrigger = { ...tilemap, objects: [] };
    expect(buildAct5MirrorCutscene(withoutTrigger, { isCompactViewport: false })).toEqual([]);
  });

  it("el doble sale con la CARA DEL JUGADOR al otro lado de la línea de espejos", () => {
    const spawn = stepsFor().find((step) => step.kind === "SPAWN_NPC" && step.npcId === MIRROR_DOUBLE_NPC_ID);
    expect(spawn?.kind === "SPAWN_NPC" && spawn.spriteSrc).toBe("/assets/story/player/bob.webp");
    expect(spawn?.kind === "SPAWN_NPC" && spawn.tileX).toBe(MIRROR_DOUBLE_TILE.tileX);
    expect(spawn?.kind === "SPAWN_NPC" && spawn.tileY).toBe(MIRROR_DOUBLE_TILE.tileY);
    expect(MIRROR_DOUBLE_TILE.tileY).toBeLessThan(MIRROR_TRIGGER_TILE.tileY);
  });

  it("es la única cutscene que mueve al JUGADOR, y lo devuelve a su casilla (ida y vuelta)", () => {
    const playerSteps = stepsFor().filter((step) => step.kind === "PLAYER_STEP");
    expect(playerSteps.length).toBeGreaterThan(0);
    const drift = playerSteps.reduce(
      (total, step) => total + (step.kind === "PLAYER_STEP" && step.direction === "LEFT" ? -1 : 1),
      0,
    );
    expect(drift).toBe(0);
  });

  it("el doble REFLEJA cada paso: se mueve al lado contrario, un compás después", () => {
    const steps = stepsFor();
    let expectedX = MIRROR_DOUBLE_TILE.tileX;
    let seenPairs = 0;
    for (let index = 0; index < steps.length - 1; index++) {
      const step = steps[index];
      const next = steps[index + 1];
      if (step.kind !== "PLAYER_STEP") continue;
      expect(next.kind).toBe("NPC_WALK_TO");
      expectedX += step.direction === "LEFT" ? 1 : -1;
      expect(next.kind === "NPC_WALK_TO" && next.npcId).toBe(MIRROR_DOUBLE_NPC_ID);
      expect(next.kind === "NPC_WALK_TO" && next.tileX).toBe(expectedX);
      expect(next.kind === "NPC_WALK_TO" && next.tileY).toBe(MIRROR_DOUBLE_TILE.tileY);
      seenPairs++;
    }
    expect(seenPairs).toBeGreaterThanOrEqual(4);
  });

  it("todas las casillas que pisa un NPC son suelo transitable del mapa", () => {
    for (const step of stepsFor()) {
      if (step.kind !== "NPC_WALK_TO" && step.kind !== "SPAWN_NPC") continue;
      expect(
        tilemap.collision[step.tileY]?.[step.tileX],
        `la escena pisa (${step.tileX}, ${step.tileY}), que no es suelo`,
      ).toBe(1);
    }
  });

  it("Verso aparece en la casilla que el doble acaba de dejar, y el doble se apaga después", () => {
    const steps = stepsFor();
    const versoSpawn = steps.findIndex((step) => step.kind === "SPAWN_NPC" && step.npcId === MIRROR_VERSO_NPC_ID);
    const doubleDespawn = steps.findIndex((step) => step.kind === "DESPAWN_NPC" && step.npcId === MIRROR_DOUBLE_NPC_ID);
    expect(versoSpawn).toBeGreaterThan(0);
    expect(doubleDespawn).toBeGreaterThan(versoSpawn);
    const spawn = steps[versoSpawn];
    expect(spawn.kind === "SPAWN_NPC" && spawn.tileX).toBe(MIRROR_DOUBLE_TILE.tileX);
    expect(spawn.kind === "SPAWN_NPC" && spawn.tileY).toBe(MIRROR_DOUBLE_TILE.tileY);
  });

  it("Verso acaba pegado al jugador (una casilla por encima del trigger) y el jugador lo encara", () => {
    const steps = stepsFor();
    const versoWalks = steps.filter((step) => step.kind === "NPC_WALK_TO" && step.npcId === MIRROR_VERSO_NPC_ID);
    const last = versoWalks[versoWalks.length - 1];
    expect(last.kind === "NPC_WALK_TO" && last.tileX).toBe(MIRROR_TRIGGER_TILE.tileX);
    expect(last.kind === "NPC_WALK_TO" && last.tileY).toBe(MIRROR_TRIGGER_TILE.tileY - 1);
    expect(steps.some((step) => step.kind === "PLAYER_FACE" && step.direction === "UP")).toBe(true);
  });
});
