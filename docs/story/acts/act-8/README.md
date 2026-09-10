<!-- docs/story/acts/act-8/README.md - Especificación del Acto 8 (La Singularidad), cierre de la campaña. -->
# Acto 8 — La Singularidad (La Entidad)

> **Diseño de los cuatro actos finales:** [ACTS-5-8-MASTER-GUIDE.md](../ACTS-5-8-MASTER-GUIDE.md).
> **Este acto cierra la campaña.** No tiene portal hacia delante: sólo el retorno al Acto 7.

## Resumen narrativo
1. El mapa es pequeño a propósito. Después de una fundición de cuatro plantas y una red sin techo, todo lo
   que quedaba se ha juntado en un anillo de 40×40.
2. Al entrar, los cuatro jefes anteriores se materializan en los cuatro atriles y dicen **media línea cada
   uno**. La frase sólo se entiende leyendo las cuatro seguidas. En el centro no aparece nadie.
3. Apagar los cuatro ecos abre el pozo. BigLog se queda fuera: su canal no llega.
4. Al fondo hay algo con tu cara, tu mazo y ninguna de tus dudas. Tres fases, sin salir entre medias.

## Dónde vive
| Pieza | Fichero |
|---|---|
| Mapa | [`act-8-overworld-tilemap.ts`](../../../../src/services/story/overworld/act-8-overworld-tilemap.ts) |
| Cinemática firma | [`act-8-choir-cutscene.ts`](../../../../src/services/story/overworld/act-8-choir-cutscene.ts) |
| Nodos virtuales | [`act-8-map-definition.ts`](../../../../src/services/story/map-definitions/act-8-map-definition.ts) |
| Contenido BD | [`164_story_act8_singularidad.sql`](../../../supabase/sql/164_story_act8_singularidad.sql) |

- **Ambiente:** `SINGULARITY` — violeta sobre negro, la paleta más saturada de la campaña.
- **Tamaño:** 40×40. Un anillo alrededor de un bloque macizo, con un **pozo de una casilla de ancho** tallado
  en el centro.

## Flujo
| Tramo | Nodos | Cerradura |
|---|---|---|
| Entrada | `story-ch8-event-intro`, `story-ch8-event-choir`, servicios, warp al Acto 7 | — |
| Anillo | `story-ch8-duel-1` … `-4` (los cuatro atriles), `story-ch8-cache-candy`, `story-ch8-card-annihilator` | ninguna: **orden libre** |
| Boca del pozo | `story-a8-gate-shaft` | **los cuatro** pedestales |
| Descenso | `story-ch8-event-descent` | cruzar la boca |
| Fase I | `story-ch8-duel-5` (BOSS) | — |
| Fase II | `story-ch8-duel-6` (BOSS) | fase I |
| Fase III | `story-ch8-duel-7` (BOSS) | fase II |
| Epílogo | `story-ch8-event-epilogue` | fase III |

**"No se puede salir entre fases" no es una regla escrita: es la geometría.** El pozo tiene una casilla de
ancho y las tres fases están escalonadas dentro (y = 24, 19, 14), cada una taponando físicamente el paso a la
siguiente. El test lo comprueba celda a celda: a los lados de cada fase hay muro.

## Rivales
| Duelo | Rival | Dificultad | Nivel/tier | Herencia |
|---|---|---|---|---|
| 1 | Coro: Kernel | MYTHIC | 90 / t5 | GenNvim — entidades pesadas y presión. |
| 2 | Coro: Marea | MYTHIC | 92 / t5 | Leviatán — muros de infraestructura y contadores. |
| 3 | Coro: Molde | MYTHIC | 94 / t5 | Prototipo — cuatro fusiones. |
| 4 | Coro: Espejo | MYTHIC | 96 / t5 | Verso — robo puro. |
| 5-7 | La Entidad | MYTHIC | 98 / 99 / **100** | Tu propio mazo, sin cartas muertas. |

La **fase III** además baja la mano inicial del rival a 3: es el techo del juego, y el único duelo de la
campaña a nivel 100.

## Cinemática firma — "El Coro"
La única escena firma de los cuatro actos que **no desemboca en combate**: es narrativa pura, y por eso entra
por el registro de cutscenes narrativas del overworld (`NARRATIVE_CUTSCENE_BY_TRIGGER_ID`) y no por el de
emboscadas. Los cuatro ecos se materializan mirándote, dicen su media línea, se giran **hacia el centro** — y
en el centro no aparece nada. Se apagan del más lejano al más cercano, para que el último en irse sea el que
tienes delante. Esa ausencia es la amenaza.

## Validación
- `act-8-overworld-tilemap.test.ts`: los cuatro pedestales son simultáneos, la boca no se abre con tres, las
  fases encadenan, el pozo es de una casilla, y **no hay ningún warp `forward`** (fin de campaña).
- `act-8-choir-cutscene.test.ts`: cuatro caras distintas, nadie anda, nadie aparece en el centro, y el orden
  de apagado es por distancia descendente.
