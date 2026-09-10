// src/services/story/build-story-chapter-briefing.ts - Construye briefing narrativo por capítulo Story para contextualizar el mapa.
export interface IStoryChapterBriefing {
  chapter: number;
  arcTitle: string;
  objective: string;
  tension: string;
}

const STORY_CHAPTER_BRIEFINGS: Record<number, IStoryChapterBriefing> = {
  1: {
    chapter: 1,
    arcTitle: "Acto 1 · Borde Exterior",
    objective: "Rastrear anomalías y limpiar nodos corruptos del Sector Alpha.",
    tension: "Las facciones menores sospechan de tu presencia y bloquean rutas críticas.",
  },
  2: {
    chapter: 2,
    arcTitle: "Acto 2 · Guerra de Facciones",
    objective: "Derrotar líderes de facción y reunir las Root Keys de acceso.",
    tension: "Big Tech y Open Source escalan el conflicto mientras la Entidad se expande.",
  },
  3: {
    chapter: 3,
    arcTitle: "Acto 3 · Repositorio Fantasma",
    objective: "Iluminar las salas del repo, hackear el cortafuegos y llegar al núcleo de Jaku.",
    tension: "Los forks tóxicos de Jaku acechan en la oscuridad; sin luz, cada sala es una emboscada.",
  },
  4: {
    chapter: 4,
    arcTitle: "Acto 4 · Núcleo GenNvim",
    objective: "Cruzar los laberintos del mainframe y llegar hasta Midutech, el señor del núcleo.",
    tension: "GenNvim mueve las cintas y las cajas a su antojo: el suelo del laberinto no es tuyo.",
  },
  5: {
    chapter: 5,
    arcTitle: "Acto 5 · Core Invertido",
    objective: "Cruzar la sala de espejos y llegar al trono del Core antes de que la copia escape.",
    tension: "Todo lo que hay dentro pelea con tus cartas y tus tiempos: el Core te ha copiado.",
  },
  6: {
    chapter: 6,
    arcTitle: "Acto 6 · Red Abierta",
    objective: "Seguir el rastro de la copia por las tres regiones de la red pública hasta el borde.",
    tension: "Fuera del perímetro no hay paredes que te protejan, y las copias degradadas van en enjambre.",
  },
  7: {
    chapter: 7,
    arcTitle: "Acto 7 · Fundición Cuántica",
    objective: "Bajar las cuatro plantas de la cadena y apagar la máquina que le está fabricando un cuerpo.",
    tension: "Aquí se forjan cartas que no existen en ningún catálogo, y la cadena no para por nadie.",
  },
  8: {
    chapter: 8,
    arcTitle: "Acto 8 · La Singularidad",
    objective: "Apagar los cuatro ecos del anillo y bajar al pozo a enfrentarte a La Entidad.",
    tension: "Al fondo te espera algo con tu cara, tu mazo y ninguna de tus dudas. No hay vuelta atrás.",
  },
};

/**
 * Entrega contexto narrativo estable para el capítulo activo del jugador.
 */
export function buildStoryChapterBriefing(chapter: number): IStoryChapterBriefing {
  return (
    STORY_CHAPTER_BRIEFINGS[chapter] ?? {
      chapter,
      arcTitle: `Acto avanzado · Capítulo ${chapter}`,
      objective: "Explorar nuevos nodos y consolidar progreso contra la Entidad.",
      tension: "La red está fragmentada y las rutas son impredecibles.",
    }
  );
}
