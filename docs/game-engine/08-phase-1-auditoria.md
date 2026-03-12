<!-- docs/game-engine/08-phase-1-auditoria.md - Auditoría inicial de Fase 1 del game-engine con hallazgos y plan incremental de refactor. -->
# Auditoría Fase 1 - game-engine

## 1. Alcance auditado
- `src/core/use-cases/game-engine/actions`
- `src/core/use-cases/game-engine/phases`
- `src/core/use-cases/game-engine/combat`
- `src/core/use-cases/game-engine/effects`
- `src/core/use-cases/game-engine/logging`

## 2. Cambio aplicado en esta fase
- Se eliminó duplicación del flujo de robo de carta extrayendo `drawTopDeckCard` en `state/player-utils.ts`.
- Se reemplazó el fallback silencioso de `resolve-pending-turn-action` por error explícito para tipos no soportados.
- Se extrajo guard reutilizable `assertMainPhaseActionAllowed` para centralizar precondiciones de `play-card*`.
- Se dividió `effects/trap-triggers.integration.test.ts` en suites separadas de ataque y ejecución con fixtures compartidas.
- Se introdujo `idFactory` opcional en `GameState` para generar IDs/timestamps deterministas en `play-card`, `combat-log`, fusión y revive.
- Se dividió `combat/combat-and-phase.integration.test.ts` en suites de combate y transición de fase con fixtures compartidas.
- Se reemplazaron cabeceras genéricas por descripciones específicas en módulos de `game-engine`.

## 3. Hallazgos priorizados

### Medio
- Archivos de test de integración con alta densidad de escenarios:
  - `actions/play-and-execution.integration.test.ts` (~182 líneas).
  - Riesgo: mantenimiento costoso y diagnóstico lento cuando falla un bloque grande.

## 4. Plan incremental recomendado (sin big-bang)
1. Dividir `actions/play-and-execution.integration.test.ts` en suites por intención (play, execution, mode change).
2. Evaluar extracción de fixtures reutilizables para tests de `actions` y `effects` evitando duplicación de estado base.
3. Ejecutar `pnpm lint`, `pnpm test`, `pnpm build` al cerrar cada subfase.
