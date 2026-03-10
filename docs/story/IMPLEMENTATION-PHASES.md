<!-- docs/story/IMPLEMENTATION-PHASES.md - Seguimiento fase a fase de implementación técnica del modo Story. -->
# Story - Implementación por Fases

## Fase 4 - Estado/UI de escena Story

### Objetivo

Separar el estado de interacción del mapa Story de la capa de renderizado.

### Implementado

1. Store local Zustand para escena Story:
   - `src/components/hub/story/internal/story-scene-store.ts`.
2. Escena cliente `StoryScene` con selección de nodo e historial:
   - `src/components/hub/story/StoryScene.tsx`.
3. `StoryCircuitMap` adaptado a selección de nodo + nodo actual + layout móvil.
4. `StoryHistoryPanel` para timeline del jugador.

### Validación

1. Mapa renderiza con nodo seleccionado.
2. Historial Story visible en panel inferior.
3. `pnpm lint`, `pnpm test`, `pnpm build` en verde.
