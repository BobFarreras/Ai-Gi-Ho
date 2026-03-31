<!-- docs/game-engine/09-effects-vfx-audio-inventory.md - Inventario funcional de efectos de ejecución/trampa con estado de animación y sonido. -->
# Inventario de Efectos (Motor + VFX + Audio)

Este documento resume el estado actual de los efectos del juego en esta rama.

## Ejecuciones

| Acción (`effect.action`) | Qué hace | Motor | Animación | Sonido |
|---|---|---|---|---|
| `DAMAGE` | Daño directo al objetivo (`PLAYER`/`OPPONENT`). | ✅ | ✅ Carga + rayo + impacto HUD. | ✅ `cargar.mp3` + `damage.mp3` |
| `HEAL` | Cura LP del propietario. | ✅ | ✅ Aura de curación + etiqueta `HEAL` + proyectil al HUD. | ✅ `heal.mp3` (si existe) |
| `DRAW_CARD` | Roba `N` cartas del deck a la mano. | ✅ | ✅ Flujo visual lento deck -> mano con aparición diferida en mano al terminar la animación. | ✅ `draw_card.mp3` |
| `RESTORE_ENERGY` | Recupera energía (normalmente hasta máximo). | ✅ | ✅ Carga amarilla + transferencia al HUD del propietario. | ✅ `cargar.mp3` + `restore_energy.mp3` |
| `BOOST_ATTACK_ALLIED_ENTITY` | Sube ATK a la mejor entidad aliada. | ✅ | ✅ Impacto de buff por entidad. | ✅ Audio genérico de buff (`stat_up.mp3`) |
| `BOOST_DEFENSE_BY_ARCHETYPE` | Sube DEF a entidades de un arquetipo. | ✅ | ✅ Impacto de buff por entidad. | ✅ Audio genérico de buff (`stat_up.mp3`) |
| `BOOST_ATTACK_BY_ARCHETYPE` | Sube ATK a entidades de un arquetipo. | ✅ | ✅ Impacto de buff por entidad. | ✅ Audio genérico de buff (`stat_up.mp3`) |
| `SET_DEFENSE_BY_CARD_ID` | Fija DEF de una carta concreta a un valor. | ✅ | ✅ Impacto de buff en objetivos afectados. | ✅ Audio genérico de buff (`stat_up.mp3`) |
| `BOOST_DEFENSE_BY_CARD_ID` | Aumenta DEF de una carta concreta. | ✅ | ✅ Impacto de buff en objetivos afectados. | ✅ Audio genérico de buff (`stat_up.mp3`) |
| `DRAIN_OPPONENT_ENERGY` | Drena energía del rival a `0`. | ✅ | ✅ Carga lila + transferencia al HUD rival. | ✅ `cargar.mp3` + `drain_opponent_energy.mp3` |
| `SET_CARD_DUEL_PROGRESS` | Ajusta nivel/versión temporal de carta objetivo en duelo. | ✅ | ✅ Carga amarilla + rayos de evolución. | ✅ `evolution.mp3` |
| `FUSION_SUMMON` | Inicia invocación de fusión (flujo especial). | ✅ | ✅ Cinemática/capa de fusión. | ✅ `fusion-summon.mp3` |
| `RETURN_GRAVEYARD_CARD_TO_HAND` | Selección manual: devuelve carta del cementerio a mano. | ✅ | 🟡 Flujo base (sin VFX dedicado avanzado). | 🟡 Fallback genérico |
| `RETURN_GRAVEYARD_CARD_TO_FIELD` | Selección manual: devuelve carta del cementerio al campo. | ✅ | 🟡 Flujo base (sin VFX dedicado avanzado). | 🟡 Fallback genérico |
| `REVEAL_OPPONENT_SET_CARD` | Selección manual: revela carta seteada rival. | ✅ | 🟡 Flujo base (sin VFX dedicado avanzado). | 🟡 Fallback genérico |
| `STEAL_OPPONENT_GRAVEYARD_CARD_TO_HAND` | Selección manual: roba carta del cementerio rival a la mano. | ✅ | 🟡 Flujo base (sin VFX dedicado avanzado). | 🟡 Fallback genérico |

## Trampas

| Acción (`effect.action`) | Qué hace | Motor | Animación | Sonido |
|---|---|---|---|---|
| `DAMAGE` | Daño directo por activación de trampa. | ✅ | ✅ Reutiliza flujo de daño (rayo). | ✅ `cargar.mp3` + `damage.mp3` |
| `REDUCE_OPPONENT_ATTACK` | Baja ATK de entidades rivales. | ✅ | ✅ Impacto de debuff lila por entidad. | ✅ `bajada.mp3` |
| `REDUCE_OPPONENT_DEFENSE` | Baja DEF de entidades rivales. | ✅ | ✅ Impacto de debuff lila por entidad. | ✅ `bajada.mp3` |
| `NEGATE_ATTACK_AND_DESTROY_ATTACKER` | Niega ataque y destruye atacante. | ✅ | ✅ VFX de bloqueo `LOCK` sobre la carta bloqueada (atacante), reusable para bloqueos. | ✅ `block.mp3` |
| `COPY_OPPONENT_BUFF_TO_ALLIED_ENTITIES` | Copia buff rival a entidades propias. | ✅ | 🟡 Usa buff impact base. | 🟡 Fallback/pendiente dedicado |
| `FORCE_SUMMONED_DEFENSE_TO_ATTACK_LOCKED` | Fuerza modo `ATTACK` y bloquea postura. | ✅ | ✅ VFX de bloqueo `LOCK` sobre objetivo bloqueado (reutilizable). | ✅ `block.mp3` |
| `DIRECT_ATTACK_ENERGY_DRAIN_AND_SET_SELF_TO_TEN` | En ataque directo: rival a 0 energía, dueño a 10. | ✅ | 🟡 Lógica OK, VFX dedicado pendiente para doble HUD. | 🟡 Fallback/pendiente dedicado |

## Convenciones de audio activas

- Carpeta principal: `public/audio/sfx/effects/execution/`.
- Convención por defecto: `<action_en_minusculas>.mp3`.
- Override actual aplicado:
  - Buffs -> `stat_up.mp3`.
  - Debuffs (`REDUCE_*`) -> `bajada.mp3`.
  - Bloqueos de trampa -> `block.mp3`.

## Checklist rápido para nuevos efectos

1. Registrar acción en el motor (`execution-effect-registry` o `trap-effect-registry`).
2. Definir qué evento de `combatLog` debe disparar feedback visual.
3. Crear VFX dedicado o mapear a un VFX reutilizable.
4. Añadir audio por convención o por override.
5. Verificar fallback de audio (`audioRuntime`) cuando no exista archivo.
