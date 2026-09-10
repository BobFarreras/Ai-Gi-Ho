<!-- docs/story/acts/act-6/README.md - Especificación del Acto 6 (La Red Abierta) tal y como está implementado. -->
# Acto 6 — La Red Abierta (Leviatán del Borde)

> **Diseño de los cuatro actos finales:** [ACTS-5-8-MASTER-GUIDE.md](../ACTS-5-8-MASTER-GUIDE.md).

## Resumen narrativo
1. La copia salió del perímetro corporativo y se replicó a la **red pública**. Es la primera vez que el
   Operador juega fuera de un edificio.
2. Cada nodo que la copia tocó se quedó un trozo mal copiado de ella: ese es el rastro.
3. Tres regiones abiertas, tres claves de router. La cuarta boca sólo se abre con las tres.
4. Al caer, el Leviatán confiesa lo que nadie había dicho todavía: **se está poniendo un cuerpo**.

## Dónde vive
| Pieza | Fichero |
|---|---|
| Mapa | [`act-6-overworld-tilemap.ts`](../../../../src/services/story/overworld/act-6-overworld-tilemap.ts) |
| Cinemática firma | [`act-6-swarm-cutscene.ts`](../../../../src/services/story/overworld/act-6-swarm-cutscene.ts) |
| Nodos virtuales | [`act-6-map-definition.ts`](../../../../src/services/story/map-definitions/act-6-map-definition.ts) |
| Terminal de código | [`story-node-submission-rules.ts`](../../../../src/services/story/story-node-submission-rules.ts) |
| Contenido BD | [`162_story_act6_red_abierta.sql`](../../../supabase/sql/162_story_act6_red_abierta.sql) |

- **Ambiente:** `CLOUD` — azul nocturno, venas de luz fría. Suelo de **hierba**, no de arena: la red pública
  está viva.
- **Tamaño:** 60×48. Es el único mapa **apaisado** de la campaña: se abre a lo ancho, sin techo ni pasillos.

## Flujo
El acto es deliberadamente **no lineal**: las tres regiones se hacen en el orden que quieras.

| Tramo | Nodos | Cerradura |
|---|---|---|
| Hub | `story-ch6-event-intro`, `story-ch6-event-trail`, servicios, warp al Acto 5 | — |
| Región norte | `story-ch6-duel-1` (Nimbus), `story-ch6-key-north`, `story-ch6-cache-usb` | la llave exige duel-1 |
| Región este | `story-ch6-duel-2`, corriente (cinta), `story-ch6-key-east`, `story-ch6-card-edge` | la llave exige duel-2 |
| Región sur | `story-ch6-duel-3`, `story-ch6-event-swarm` → `story-ch6-duel-4`, `story-ch6-key-south` | la llave exige duel-3 |
| Boca oeste | `story-a6-gate-west` | **las tres** claves de router |
| Borde | `story-ch6-edge-terminal` (SUBMISSION `EDGE-4021-8830`) | las tres claves |
| Cámara | `story-a6-gate-leviathan`, `story-ch6-duel-5` (BOSS) | terminal **+** Enjambre Mayor |
| Salida | `story-ch6-event-foundry`, `story-ch6-transition-to-act7` | vencer al Leviatán |

La clave del terminal **se compone leyendo las tres llaves** (`EDGE-40` + `21-88` + `30`), así que no se puede
resolver por fuerza bruta antes de haber hecho las tres regiones.

## Rivales
| Duelo | Rival | Dificultad | Nivel/tier | Idea de mazo |
|---|---|---|---|---|
| 1-2 | Nimbus | ELITE | 78-80 / t3 | Infraestructura y muros. Gana por agotamiento, no por daño. |
| 3 | Enjambre | ELITE | 82 / t3 | Inundación: entidades baratas + invocación doble. |
| 4 | Enjambre Mayor | BOSS | 84 / t4 | El enjambre ya coordinado: la misma inundación, con remates. |
| 5 | Leviatán del Borde | MYTHIC | 86 / t4 | Todo lo anterior en un cuerpo: control pesado y golpes de 900. |

## Cinemática firma — "El Enjambre"
En una plaza abierta y sin paredes, **cinco** copias degradadas entran **andando** desde cinco bocas y cierran
un círculo a una casilla del jugador. Ninguna ataca: hablan las cinco a la vez (la misma línea con desfase),
cuatro se apagan y la quinta se queda. Esa es el combate.

El secuenciador de cutscenes es estrictamente secuencial, así que "a la vez" se consigue **intercalando** los
pasos: una casilla por copia y ronda. Visualmente se leen como cinco cuerpos moviéndose juntos y ligeramente
desfasados, que es exactamente el efecto buscado.

## Validación
- `act-6-overworld-tilemap.test.ts`: las tres llaves son alcanzables de salida (simultaneidad real), la boca
  oeste no se abre con dos, y el Leviatán exige terminal + Enjambre.
- `act-6-swarm-cutscene.test.ts`: cinco bocas con ruta real, avance intercalado, y despawn de cuatro.
