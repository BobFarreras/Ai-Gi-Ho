// src/core/services/tutorial/resolve-tutorial-map-state.ts - Resuelve estado secuencial de nodos tutorial a partir del progreso por nodo persistido.
import { ITutorialMapNodeDefinition, ITutorialMapNodeRuntime, TutorialNodeState } from "@/core/entities/tutorial/ITutorialMapNode";

interface IResolveTutorialMapStateInput {
  catalog: ITutorialMapNodeDefinition[];
  completedNodeIds?: string[];
}

function resolveNodeState(isCompleted: boolean, isFirstPending: boolean): TutorialNodeState {
  if (isCompleted) return "COMPLETED";
  return isFirstPending ? "AVAILABLE" : "LOCKED";
}

export function resolveTutorialMapState(input: IResolveTutorialMapStateInput): ITutorialMapNodeRuntime[] {
  const completedNodeIds = new Set<string>(input.completedNodeIds ?? []);
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
