// src/services/story/story-node-interaction-dialogue-acts-5-8.test.ts - Blinda el guion del tramo final. Lo
// que se comprueba no es el texto (eso es contenido, y se edita), sino el CONTRATO: que todo lo que el mapa
// hace hablar tenga línea, que las líneas de las cuatro escenas firma existan, y que nada pise el catálogo de
// los Actos 1-4. Una escena sin diálogo se ve en pantalla como un cuadro vacío.
import { STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID } from "@/services/story/story-node-interaction-dialogue-acts-5-8";
import { STORY_NODE_INTERACTION_DIALOGUE_BY_NODE_ID } from "@/services/story/story-node-interaction-dialogue-catalog";
import {
  MIRROR_SCENE_TRIGGER_ID,
  buildAct5OverworldTilemap,
} from "@/services/story/overworld/act-5-overworld-tilemap";
import {
  SWARM_SCENE_TRIGGER_ID,
  buildAct6OverworldTilemap,
} from "@/services/story/overworld/act-6-overworld-tilemap";
import {
  CASTING_SCENE_TRIGGER_ID,
  buildAct7OverworldTilemap,
} from "@/services/story/overworld/act-7-overworld-tilemap";
import {
  CHOIR_SCENE_TRIGGER_ID,
  buildAct8OverworldTilemap,
} from "@/services/story/overworld/act-8-overworld-tilemap";

const TILEMAPS = [
  buildAct5OverworldTilemap(),
  buildAct6OverworldTilemap(),
  buildAct7OverworldTilemap(),
  buildAct8OverworldTilemap(),
];

/** Los nodos que ABREN un cuadro de diálogo al usarlos. Las puertas, cajas y servicios no narran. */
const NARRATING_KINDS = new Set(["EVENT", "REWARD_CARD", "REWARD_OBJECT"]);

describe("STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID", () => {
  it("se mezcla en el catálogo único que consulta el resolutor de diálogos", () => {
    for (const nodeId of Object.keys(STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID)) {
      expect(STORY_NODE_INTERACTION_DIALOGUE_BY_NODE_ID[nodeId], `'${nodeId}' no llega al catálogo`).toBeTruthy();
    }
  });

  it("no pisa ninguna entrada de los Actos 1-4 (los ids llevan su capítulo dentro)", () => {
    for (const nodeId of Object.keys(STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID)) {
      expect(nodeId).toMatch(/^story-ch[5-8]-/);
    }
  });

  it("las CUATRO escenas firma tienen su línea: sin ella el cuadro sale vacío a mitad de cinemática", () => {
    for (const triggerId of [
      MIRROR_SCENE_TRIGGER_ID,
      SWARM_SCENE_TRIGGER_ID,
      CASTING_SCENE_TRIGGER_ID,
      CHOIR_SCENE_TRIGGER_ID,
    ]) {
      const dialogue = STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID[triggerId];
      expect(dialogue, `la escena '${triggerId}' no tiene guion`).toBeTruthy();
      expect(dialogue.lines.length).toBeGreaterThan(0);
    }
  });

  it("El Coro son CUATRO medias líneas: la frase sólo se entiende leyéndolas seguidas", () => {
    const choir = STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID[CHOIR_SCENE_TRIGGER_ID];
    const echoes = choir.lines.filter((line) => line.speaker.startsWith("Coro"));
    expect(echoes).toHaveLength(4);
    expect(new Set(echoes.map((line) => line.speaker)).size).toBe(4);
  });

  it("todo nodo que abre cuadro en los mapas 5-8 tiene su narración", () => {
    for (const tilemap of TILEMAPS) {
      const narrating = tilemap.objects.filter((object) => NARRATING_KINDS.has(object.kind));
      expect(narrating.length, `el mapa '${tilemap.id}' no narra nada`).toBeGreaterThan(0);
      for (const object of narrating) {
        expect(
          STORY_NODE_INTERACTION_DIALOGUE_BY_NODE_ID[object.id],
          `'${object.id}' (${tilemap.id}) abre cuadro pero no tiene diálogo`,
        ).toBeTruthy();
      }
    }
  });

  it("cada línea tiene interlocutor y texto (nada de bocadillos en blanco)", () => {
    for (const [nodeId, dialogue] of Object.entries(STORY_ACTS_5_8_DIALOGUE_BY_NODE_ID)) {
      expect(dialogue.title.trim().length, `'${nodeId}' sin título`).toBeGreaterThan(0);
      expect(dialogue.lines.length, `'${nodeId}' sin líneas`).toBeGreaterThan(0);
      for (const line of dialogue.lines) {
        expect(line.speaker.trim().length, `'${nodeId}' tiene una línea sin locutor`).toBeGreaterThan(0);
        expect(line.text.trim().length, `'${nodeId}' tiene una línea vacía`).toBeGreaterThan(0);
      }
    }
  });
});
