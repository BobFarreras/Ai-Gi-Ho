// src/core/services/tutorial/resolve-tutorial-map-state.ts - Resuelve estado de nodos tutorial en modo migración y desbloqueo secuencial.
import { ITutorialMapNodeDefinition, ITutorialMapNodeRuntime, TutorialNodeState } from "@/core/entities/tutorial/ITutorialMapNode";

interface IResolveTutorialMapStateInput {
  catalog: ITutorialMapNodeDefinition[];
  hasCompletedLegacyTutorial: boolean;
  completedNodeIds?: string[];
}

function resolveNodeState(isCompleted: boolean, isFirstPending: boolean): TutorialNodeState {
  if (isCompleted) return "COMPLETED";
  return isFirstPending ? "AVAILABLE" : "LOCKED";
}

/**
 * Conserva compatibilidad con el flag legacy hasta migrar al progreso por nodo.
 */
export function resolveTutorialMapState(input: IResolveTutorialMapStateInput): ITutorialMapNodeRuntime[] {
  const completedNodeIds = new Set<string>(
    input.hasCompletedLegacyTutorial ? input.catalog.map((node) => node.id) : (input.completedNodeIds ?? []),
  );
  let hasAssignedPendingNode = false;
  return [...input.catalog]
    .sort((a, b) => a.order - b.order)
    .map((node) => {
      const isCompleted = completedNodeIds.has(node.id);
      const isFirstPending = !isCompleted && !hasAssignedPendingNode;
      if (!isCompleted && !hasAssignedPendingNode) hasAssignedPendingNode = true;
      return { ...node, state: resolveNodeState(isCompleted, isFirstPending) };
    });
}
