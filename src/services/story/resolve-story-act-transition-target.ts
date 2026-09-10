// src/services/story/resolve-story-act-transition-target.ts - Resuelve si un nodo Story representa una transición de acto y su destino.
const STORY_ACT_TRANSITION_TARGET_BY_NODE_ID: Record<string, number> = {
  "story-ch1-transition-to-act2": 2,
  "story-ch2-transition-to-act1": 1,
  "story-ch2-transition-to-act3": 3,
  "story-ch3-transition-to-act2": 2,
  "story-ch3-transition-to-act4": 4,
  // Actos 5-8: cada uno enlaza con el anterior (retorno) y con el siguiente (avance tras el jefe).
  "story-ch4-transition-to-act3": 3,
  "story-ch4-transition-to-act5": 5,
  "story-ch5-transition-to-act4": 4,
  "story-ch5-transition-to-act6": 6,
  "story-ch6-transition-to-act5": 5,
  "story-ch6-transition-to-act7": 7,
  "story-ch7-transition-to-act6": 6,
  "story-ch7-transition-to-act8": 8,
  "story-ch8-transition-to-act7": 7,
};

/**
 * Devuelve el acto destino para nodos de transición entre actos.
 */
export function resolveStoryActTransitionTarget(nodeId: string): number | null {
  return STORY_ACT_TRANSITION_TARGET_BY_NODE_ID[nodeId] ?? null;
}

