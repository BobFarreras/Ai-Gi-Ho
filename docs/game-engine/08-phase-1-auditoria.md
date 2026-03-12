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
- Se dividió `actions/play-and-execution.integration.test.ts` en suites específicas de reglas de juego, ejecución/trampas y cambio de modo.

## 3. Hallazgos priorizados

### Medio
- Aún existen oportunidades de extracción adicional de fixtures compartidas entre `actions/` y `effects/`.

## 4. Plan incremental recomendado (sin big-bang)
1. Evaluar extracción transversal de fixtures para `effects/` y `phases/` donde persista duplicación de estado base.
2. Revisar cobertura de rutas de error en `resolve-pending-turn-action` y `resolve-execution` para asegurar regresión fina.
3. Ejecutar `pnpm lint`, `pnpm test`, `pnpm build` al cerrar cada subfase.
