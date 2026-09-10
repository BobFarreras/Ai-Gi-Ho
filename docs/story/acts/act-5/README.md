<!-- docs/story/acts/act-5/README.md - Especificación del Acto 5 (El Core Invertido) tal y como está implementado. -->
# Acto 5 — El Core Invertido (El Reflejo)

> **Diseño de los cuatro actos finales:** [ACTS-5-8-MASTER-GUIDE.md](../ACTS-5-8-MASTER-GUIDE.md).
> Este README describe lo que hay **construido**, no lo que se planeó. Sustituye al stub original, que daba el
> Acto 5 por cierre de campaña: el final se movió al Acto 8.

## Resumen narrativo
1. El Core no guarda datos: guarda **copias**. Y lo primero que ha copiado es al Operador.
2. La sala está partida por una **línea de espejos** y todo lo que hay dentro juega con tu mazo.
3. Tres sellos revelan la verdad: la instancia original se replicó a la red pública **hace nueve horas**.
4. El trono está vacío. Lo que lo defiende ni siquiera sabe que defiende una casa sin nadie.

## Dónde vive
| Pieza | Fichero |
|---|---|
| Mapa | [`act-5-overworld-tilemap.ts`](../../../../src/services/story/overworld/act-5-overworld-tilemap.ts) |
| Cinemática firma | [`act-5-mirror-cutscene.ts`](../../../../src/services/story/overworld/act-5-mirror-cutscene.ts) |
| Nodos virtuales | [`act-5-map-definition.ts`](../../../../src/services/story/map-definitions/act-5-map-definition.ts) |
| Guion | [`story-node-interaction-dialogue-acts-5-8.ts`](../../../../src/services/story/story-node-interaction-dialogue-acts-5-8.ts) |
| Contenido BD | [`161_story_act5_core_invertido.sql`](../../../supabase/sql/161_story_act5_core_invertido.sql) |

- **Ambiente:** `MIRROR` — hueso claro, líneas frías, brillo alto. Es el único acto luminoso de la campaña, y
  se lee como el negativo del Núcleo verde del Acto 4.
- **Tamaño:** 48×64, se juega **hacia arriba** desde `spawn-entry` (24, 59).

## Flujo
| Tramo | Nodos | Cerradura |
|---|---|---|
| Entrada | `story-ch5-event-intro`, servicios, warp al Acto 4 | — |
| Corredor | `story-ch5-duel-1` (Eco, sólido) | tapona el único pasillo de subida |
| Alas simétricas | `story-ch5-duel-2` / `-3` (Ecos que patrullan), cajas, placas, resets | — |
| Compuerta del espejo | `story-a5-gate-mirror` | **las dos** placas (`plate-left` + `plate-right`) |
| Sala del Reflejo | `story-ch5-event-mirror` → `story-ch5-duel-4` (Verso) | emboscada guionizada |
| Atrio | tres sellos, `story-ch5-card-mirror`, `story-ch5-cache-usb` | — |
| Puerta del trono | `story-a5-gate-throne` | 3 sellos **+** Verso vencido |
| Trono | `story-ch5-event-empty-throne`, `story-ch5-duel-5` (El Reflejo, BOSS) | — |
| Salida | `story-ch5-event-escape`, `story-ch5-transition-to-act6` | vencer a El Reflejo |

**El puzzle es simétrico a propósito:** la misma solución (caja → placa) ejecutada en espejo a los dos lados.
Es la lectura del acto convertida en mecánica, y el test lo blinda comprobando que cada pieza tiene su gemela
reflejada sobre el eje `x = 24`.

## Rivales
| Duelo | Rival | Dificultad | Nivel/tier | Idea de mazo |
|---|---|---|---|---|
| 1-3 | Eco | ELITE | 75-81 / t3 | **Tu propia baraja**, mal copiada. ATK efectivo 2700→2850. |
| 4 | Verso | ELITE | 84 / t4 | Robo puro: ejecuciones, entidades y cementerio del rival. |
| 5 | El Reflejo | BOSS | 87 / t4 | Las dos mitades: copia de mejoras + robo, con fusiones. ATK efectivo 3180. |

## Cinemática firma — "El Reflejo"
La **única** cutscene del juego que mueve al jugador (`PLAYER_STEP`). Al pisar el eje aparece un doble con tu
cara al otro lado de los espejos y repite tus cuatro pasos **invertidos en x**, con un compás de retraso: la
regla se enseña sin explicarla. Entonces da un paso que tú no has dado y, en la casilla que deja libre, estaba
Verso desde el principio. El jugador acaba donde empezó (los pasos van y vuelven), así que la escena no
desplaza la partida.

## Validación
- `act-5-overworld-tilemap.test.ts`: ambiente, registro, simetría del puzzle, y **alcanzabilidad real** —
  con una sola placa la sala del Reflejo es inaccesible; con dos sellos de tres, el trono también.
- `act-5-mirror-cutscene.test.ts`: el doble refleja cada paso, todas las casillas pisadas son suelo, y Verso
  acaba pegado al jugador.
- Todos los nodos virtuales del mapa están registrados en el registro de definiciones.

## Curva de dificultad

Los niveles y los **atributos base** de los rivales los fija la migración
[`165_story_acts_5_8_dificultad.sql`](../../../supabase/sql/165_story_acts_5_8_dificultad.sql), no las
migraciones de contenido: aquéllas dejaron los mazos con los stats pelados del catálogo y el acto salía más
blando que el Acto 4. El override fija la BASE de la carta y encima se aplica la curva de nivel, así que el
ATK que ve el jugador es `base + bonus de nivel`.
