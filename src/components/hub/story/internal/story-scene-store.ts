// src/components/hub/story/internal/story-scene-store.ts - Store local Zustand para estado UI del mapa Story sin acoplar dominio.
import { create } from "zustand";
import { IPlayerStoryHistoryEvent } from "@/core/entities/story/IPlayerStoryHistoryEvent";
import { IStoryMapNodeRuntime } from "@/services/story/story-map-runtime-data";

interface IStorySceneState {
  selectedNodeId: string | null;
  currentNodeId: string | null;
  history: IPlayerStoryHistoryEvent[];
  nodesById: Record<string, IStoryMapNodeRuntime>;
  setSelectedNodeId: (nodeId: string | null) => void;
  setCurrentNodeId: (nodeId: string | null) => void;
}

function createNodesById(nodes: IStoryMapNodeRuntime[]): Record<string, IStoryMapNodeRuntime> {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
}

/**
 * Mantiene estado de escena Story (selección local + historial) sin re-render global del módulo.
 */
export function createStorySceneStore(input: {
  nodes: IStoryMapNodeRuntime[];
  currentNodeId: string | null;
  history: IPlayerStoryHistoryEvent[];
}) {
  return create<IStorySceneState>((set) => ({
    selectedNodeId: input.currentNodeId ?? input.nodes[0]?.id ?? null,
    currentNodeId: input.currentNodeId,
    history: input.history,
    nodesById: createNodesById(input.nodes),
    setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
    setCurrentNodeId: (currentNodeId) => set({ currentNodeId }),
  }));
}

export type StorySceneStore = ReturnType<typeof createStorySceneStore>;
