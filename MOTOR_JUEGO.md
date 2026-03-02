# AI-GI-OH! - Reglas del Motor de Juego (MOTOR_JUEGO.md)

Documento de referencia de reglas implementadas en el motor actual (`GameEngine` + `CombatService`).

## 1. Estado de partida

El estado global (`GameState`) contiene:

1. `playerA`, `playerB`.
2. `activePlayerId`.
3. `turn`.
4. `phase` (`DRAW`, `MAIN_1`, `BATTLE`, `MAIN_2`, `END`).
5. `hasNormalSummonedThisTurn`.

Cada jugador (`IPlayer`) mantiene:

1. `healthPoints`, `currentEnergy` y máximos.
2. `deck`, `hand`, `graveyard`.
3. `activeEntities` (zona de entidades).
4. `activeExecutions` (zona de ejecuciones).

## 2. Fases y avance de turno

Reglas de `nextPhase`:

1. Orden fijo: `DRAW -> MAIN_1 -> BATTLE -> MAIN_2 -> END`.
2. Al pasar de `END`:
   - cambia el jugador activo,
   - incrementa `turn`,
   - reinicia fase a `DRAW`,
   - restaura energía al máximo para ambos jugadores,
   - limpia flags de ataque y de invocación reciente (`hasAttackedThisTurn`, `isNewlySummoned`),
   - reinicia `hasNormalSummonedThisTurn`.

## 3. Reglas de juego de cartas (`playCard`)

1. Solo el jugador activo puede jugar cartas.
2. Solo se permite jugar en `MAIN_1` o `MAIN_2`.
3. Debe existir la carta en mano y tener energía suficiente.
4. Entidades (`ENTITY`):
   - máximo 3 en campo,
   - una invocación normal por turno,
   - modo permitido: `ATTACK` o `DEFENSE`.
5. Ejecuciones (`EXECUTION`):
   - máximo 3 en campo,
   - modo permitido: `SET` o `ACTIVATE`.
6. Al jugar carta:
   - se descuenta energía,
   - se retira de mano,
   - se crea `instanceId` único,
   - se envía a su zona correspondiente.

## 4. Reglas de combate (`executeAttack` + `CombatService`)

Validaciones previas:

1. El atacante debe existir en `activeEntities`.
2. Debe estar en modo `ATTACK`.
3. No puede haber atacado antes en el turno.

Resolución:

1. **Ataque directo** (sin defensor):
   - solo si el oponente no tiene entidades,
   - daño directo igual al `attack` del atacante.
2. **ATK vs ATK**:
   - mayor ATK destruye al rival,
   - daño al jugador defensor por diferencia,
   - empate: se destruyen ambos, sin daño a jugadores.
3. **ATK vs DEF/SET**:
   - si ATK > DEF: se destruye defensor, sin daño al jugador defensor,
   - si ATK < DEF: daño de rebote al atacante por diferencia, nadie se destruye,
   - empate: sin destrucción ni daño.
4. Cartas destruidas pasan al `graveyard` de su dueño.
5. Una carta en `SET` defendiendo se revela a `DEFENSE` si sobrevive.

## 5. Reglas de ejecuciones (`resolveExecution`)

1. La ejecución debe existir en `activeExecutions`.
2. Debe tener `effect` definido.
3. Acciones implementadas:
   - `DAMAGE` a `PLAYER` u `OPPONENT`.
   - `HEAL` a `PLAYER`.
4. Al resolver:
   - se retira de `activeExecutions`,
   - se mueve al `graveyard`,
   - se actualizan LP según la acción.

## 6. Cambio de modo (`changeEntityMode`)

Permite actualizar el `mode` de una carta por `instanceId` tanto en zona de entidades como de ejecuciones del jugador.

## 7. Diferencias entre reglas deseadas y estado actual

Pendientes de evolución del motor:

1. No se aplica todavía la restricción de "summoning sickness" dentro de `executeAttack`.
2. No hay historial persistente de eventos de combate en dominio.
3. Efectos avanzados (`DRAW_CARD`, `BOOST_ATK`, etc.) aún no están resueltos en el motor.
