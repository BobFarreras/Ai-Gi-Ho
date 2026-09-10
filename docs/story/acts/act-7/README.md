<!-- docs/story/acts/act-7/README.md - Especificación del Acto 7 (La Fundición Cuántica) tal y como está implementado. -->
# Acto 7 — La Fundición Cuántica (Prototipo Cero)

> **Diseño de los cuatro actos finales:** [ACTS-5-8-MASTER-GUIDE.md](../ACTS-5-8-MASTER-GUIDE.md).

## Resumen narrativo
1. La versión industrial de la Fábrica de Cartas del Acto 4. Aquí se cuelan cartas que no existen en ningún
   catálogo, y la cadena no ha parado desde que entraste.
2. Midutech vuelve — vivo, y **de empleado**. Alguien le dio una segunda oportunidad.
3. Lo que se estaba fabricando no era una carta: era un cuerpo.
4. El Prototipo abre los ojos antes de que llegues a apagarlo, y ya ha absorbido a sus creadores.

## Dónde vive
| Pieza | Fichero |
|---|---|
| Mapa | [`act-7-overworld-tilemap.ts`](../../../../src/services/story/overworld/act-7-overworld-tilemap.ts) |
| Cinemática firma | [`act-7-casting-cutscene.ts`](../../../../src/services/story/overworld/act-7-casting-cutscene.ts) |
| Nodos virtuales | [`act-7-map-definition.ts`](../../../../src/services/story/map-definitions/act-7-map-definition.ts) |
| Contenido BD | [`163_story_act7_fundicion_cuantica.sql`](../../../supabase/sql/163_story_act7_fundicion_cuantica.sql) |

- **Ambiente:** `FORGE` — negro quemado con naranja de colada. Es el acto más oscuro y el más cálido.
- **Tamaño:** 44×72. Es el **único acto que se juega hacia abajo**: se entra por la planta 4 y el jefe está en
  el sótano. Toda la gramática de movimiento del jugador se invierte.

## Flujo
| Planta | Nodos | Cerradura |
|---|---|---|
| Planta 4 | `story-ch7-event-intro`, servicios, warp al Acto 6, caja + placa, `story-ch7-duel-1` | — |
| Bajada a la 3 | `story-a7-gate-floor3` | placa **+** duel-1 |
| Planta 3 | `story-ch7-event-casting` → `story-ch7-duel-3` (Alquimista), `story-ch7-cache-atk`, `story-ch7-duel-2`, `story-ch7-belt-switch` | el interruptor exige duel-2 |
| Pasarela | tramo `BELT_UP` en la columna de descenso | **empuja en contra** hasta invertirla |
| Planta 2 | `story-ch7-card-superc`, `story-ch7-event-employee`, `story-ch7-duel-4` (Midutech) | la carta exige la Colada |
| Bajada a la 1 | `story-a7-gate-floor1` | duel-4 |
| Planta 1 | tres muros serpenteantes, `story-ch7-belt-switch-bottom` | — |
| Sótano | `story-ch7-event-awakening`, `story-ch7-duel-5` (BOSS) | — |
| Salida | `story-ch7-transition-to-act8` | vencer al Prototipo |

**La pasarela en contra** es la mecánica del acto: el tramo de descenso arranca como cinta *hacia arriba*, y
sólo el interruptor de la planta 3 (guardado por duel-2) la invierte. El gemelo de la planta 1 la **restaura**,
así que nunca hay forma de quedarse encerrado abajo — los dos actúan sobre el mismo rectángulo.

## Rivales
| Duelo | Rival | Dificultad | Nivel/tier | Idea de mazo |
|---|---|---|---|---|
| 1-2 | Operario de Colada | ELITE | 96-97 / t5 | Entidades de sistema, sobrecarga y castigo en runtime. |
| 3 | Alquimista | MYTHIC | 98 / t5 | **Cuatro fusiones** encadenadas: cada turno sale algo mayor del molde. |
| 4 | Midutech Recompilado | MYTHIC | 99 / t5 | El control del Acto 4, sin las ataduras del Núcleo. |
| 5 | Prototipo Cero | MYTHIC | 100 / t5 | Fusiones, remates y bloqueo. ATK efectivo 3910, DEF 2750. |

## Cinemática firma — "La Colada"
Misma gramática que la Fábrica de Cartas del Acto 4 (dos NPCs, narración dentro del guion) con el remate
**invertido**: allí uno se marchaba y el otro venía a por ti; aquí los dos se disputan una carta por encima de
la cinta sin mirarte, y cuando terminan **giran la cabeza a la vez**. Sí que te habían visto. Midutech se
retira (esta no es su pelea, ya no manda aquí) y el Alquimista sube por el pasillo hasta pegarse al jugador.

Los dos NPCs de atrezzo **no se marcan sólidos** a propósito: la escena traza el camino del Alquimista con un
BFS que arranca en su propia casilla, y sobre celda bloqueada no habría camino.

## Validación
- `act-7-overworld-tilemap.test.ts`: se juega hacia abajo, las tres compuertas encadenan, y todas las casillas
  del tramo de descenso son `BELT_UP` de salida (bajarla a pelo no es una opción).
- `act-7-casting-cutscene.test.ts`: los dos se miran antes de hablar, giran los dos hacia el jugador después,
  y el Alquimista sube casilla a casilla por suelo real hasta quedarse a una del trigger.

## Curva de dificultad

Los niveles y los **atributos base** de los rivales los fija la migración
[`165_story_acts_5_8_dificultad.sql`](../../../supabase/sql/165_story_acts_5_8_dificultad.sql), no las
migraciones de contenido: aquéllas dejaron los mazos con los stats pelados del catálogo y el acto salía más
blando que el Acto 4. El override fija la BASE de la carta y encima se aplica la curva de nivel, así que el
ATK que ve el jugador es `base + bonus de nivel`.
