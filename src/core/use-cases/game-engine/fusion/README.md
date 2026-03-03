# Fusion Module

Reglas de invocación por fusión del motor.

## Archivos

1. `fuse-cards.ts`
   - Fachada del caso de uso de fusión.

2. `fusion-recipes.ts`
   - Recetas estáticas (`requiredMaterialIds`, `requiredArchetypes`, energía mínima).

3. `internal/validate-fusion-context.ts`
   - Valida turno/fase, carta de fusión, materiales, receta y energía.

4. `internal/apply-fusion-result.ts`
   - Aplica consumo de energía, mueve materiales al cementerio e invoca entidad fusionada.

5. `internal/append-fusion-logs.ts`
   - Registra eventos `CARD_TO_GRAVEYARD` y `FUSION_SUMMONED`.

## Reglas actuales

1. Solo en fase `MAIN_1` y turno activo.
2. Deben seleccionarse exactamente 2 materiales distintos del campo.
3. Debe existir receta válida para la carta de fusión.
4. Se valida energía por material, total de receta y energía disponible del jugador.
5. La fusión consume energía del jugador.

## Tests

1. `fuse-cards.integration.test.ts`: flujo base de éxito/fracaso por receta.
2. `fuse-cards.rules.integration.test.ts`: energía, materiales duplicados, materiales inexistentes y protección de slots.

