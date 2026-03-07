<!-- docs/DEUDA_TECNICA.md - Registro activo de deuda técnica priorizada y plan de reducción por fases. -->
# Deuda Técnica Activa

## Estado actual (2026-03-07)

### Combate / Match Runtime

1. `useBoard.ts` concentra demasiadas responsabilidades (estado UI, orquestación de turno, progresión post-duelo y errores).
2. `boardInitialState.ts` mantiene hardcodes de jugadores (`p1/p2`, nombres) y deck rival por defecto.
3. `initialDeckFactory.ts` mantiene catálogos/decks mock acoplados al entrenamiento.
4. La persistencia de EXP de cartas se dispara desde hook de UI (`apply-battle-card-experience-action`) en lugar de capa de aplicación de match.
5. El control de rival IA está acoplado al runtime del board y no entra por contrato de modo.

## Plan de mitigación

1. **Fase 0 (completada)**: contratos de match desacoplado + fábrica inicial.
2. **Fase 1**: extraer runtime de `useBoard` a `useMatchRuntime` + `useMatchUiState`.
3. **Fase 2**: controllers por modo (`Training`, `Story`, `Tutorial`, `Multiplayer`) con misma interfaz.
4. **Fase 3**: mover persistencia post-duelo a servicio de aplicación por modo.
5. **Fase 4**: retirar hardcodes de jugadores/decks del board y resolver todo por configuración de match.

## Criterios de salida de deuda (combate)

1. `Board` solo renderiza y delega eventos a un controller.
2. Ningún modo de combate depende de hardcodes de rival/nombres/deck en UI.
3. `GameEngine` permanece puro y reusable en todos los modos.
4. Pruebas por modo (`training/story/tutorial/multiplayer`) con contrato común de match.
