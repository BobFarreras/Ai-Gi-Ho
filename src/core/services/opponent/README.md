# Opponent Service Module

Estrategias de toma de decisiones para el rival.

## Objetivo

1. Separar la lógica de decisión del oponente del motor base.
2. Permitir cambiar estrategia sin tocar UI ni `GameEngine`.
3. Soportar evolución a LLM y multiplayer.

## Contratos

1. `types.ts`
   - `IOpponentStrategy`
   - `IOpponentPlayDecision`
   - `IOpponentAttackDecision`

2. `runOpponentStep.ts`
   - Ejecuta un paso del turno rival según fase.
   - Ciclo actual: `MAIN_1 -> BATTLE -> cambio de turno`.
   - En `MAIN_1` puede encadenar varias jugadas en pasos consecutivos mientras sigan siendo válidas.
   - En `BATTLE` mantiene el turno hasta agotar atacantes disponibles.
   - Usa `GameEngine` para aplicar la acción elegida.

3. `HeuristicOpponentStrategy.ts`
   - Implementación actual sin IA generativa.
   - Selecciona jugadas con heurísticas de valor/coste.
   - Evalúa ataques por resultado esperado (intercambio de mesa + daño) en lugar de elegir el primer objetivo.

## Dificultad (roadmap)

Para añadir niveles de dificultad, se recomienda:

1. Añadir configuración de estrategia (`easy`, `normal`, `hard`).
2. Ajustar scoring y profundidad táctica por nivel.
3. Añadir ruido controlado en `easy` para errores humanos simulados.

## Extensión futura

1. `LlmOpponentStrategy` implementando `IOpponentStrategy`.
2. `RemotePlayerStrategy` para multijugador real.
3. Selección de estrategia por partida vía DI/configuración.
