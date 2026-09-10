// src/services/story/resolve-story-act-soundtrack-url.ts - Resuelve la música de fondo global según el acto activo del modo Story.
const STORY_ACT_SOUNDTRACKS: Record<number, string> = {
  1: "/audio/story/soundtracks/act-1/act-1-main-theme.m4a",
  2: "/audio/story/soundtracks/act-2/Chromed-Horizon.m4a",
  // Acto 3 (Repositorio Fantasma, oscuro): pista dedicada.
  3: "/audio/story/soundtracks/act-3/Neon-Horizon-Protocol.m4a",
  // Acto 4 (Núcleo GenNvim): pista dedicada.
  4: "/audio/story/soundtracks/act-4/Pulso-de-Cromo.m4a",
  5: "/audio/story/soundtracks/act-5/act-5-main-theme.m4a",
  // Actos 6-8: todavía sin pista propia. En vez de caer al tema del Acto 1 (que suena a principio de
  // campaña justo cuando la campaña se está acabando), cada uno reutiliza el tema del acto cuyo tono le
  // pega: la red abierta con el tema cromado, la fundición con el oscuro y la singularidad con el del Core.
  6: "/audio/story/soundtracks/act-2/Chromed-Horizon.m4a",
  7: "/audio/story/soundtracks/act-3/Neon-Horizon-Protocol.m4a",
  8: "/audio/story/soundtracks/act-4/Pulso-de-Cromo.m4a",
};

/**
 * Devuelve la URL del soundtrack de mapa para el acto; usa fallback de Acto 1 mientras no exista pista dedicada.
 */
export function resolveStoryActSoundtrackUrl(actId: number): string {
  return STORY_ACT_SOUNDTRACKS[actId] ?? STORY_ACT_SOUNDTRACKS[1];
}
