# AI-GI-OH! - REGLAS DEL MOTOR DE JUEGO (DOMAIN ENGINE)

## 1. Estructura del Turno (Phases)
Cada turno se divide en fases estrictas. Ciertas acciones solo pueden hacerse en fases específicas.
- **DRAW_PHASE**: El jugador roba 1 carta. Se regenera la energía.
- **MAIN_PHASE_1**: El jugador puede invocar Entidades y usar Ejecuciones (Magias).
- **BATTLE_PHASE**: Las Entidades en modo ATAQUE pueden declarar ataques.
- **MAIN_PHASE_2**: Post-combate. Se pueden poner trampas (SET) o invocar si no se hizo en la Main 1.
- **END_PHASE**: Se resuelven efectos de final de turno y pasa el turno.

## 2. Reglas de Invocación de Entidades (Summoning)
- **Límite de Invocación**: Solo se permite 1 "Invocación Normal" por turno.
- **Coste de Energía**: El jugador debe tener `currentEnergy >= card.cost`.
- **Modos de Despliegue**:
  1. `ATTACK`: Boca arriba, en vertical. Lista para atacar.
  2. `DEFENSE`: Boca arriba, en horizontal. Protege los HP.
  3. `SET`: Boca abajo, en horizontal. El rival no ve los stats. Se voltea al ser atacada.

## 3. Reglas de Combate (Batalla)
Una carta que acaba de ser invocada este turno **no puede atacar** (Sicknessing), salvo que tenga la habilidad "Haste/Rápido".
- **ATK vs ATK**: Se comparan Puntos de Ataque. El menor es destruido. El dueño recibe daño a sus HP.
- **ATK vs DEF**: Si el atacante supera la defensa, destruye la carta (Sin daño a HP). Si la defensa es mayor, el atacante recibe daño de "Rebote" a sus HP.
- **ATK vs SET**: La carta SET se voltea (Flip) y se calcula como ATK vs DEF. Dispara efectos de "Flip" si los tiene.