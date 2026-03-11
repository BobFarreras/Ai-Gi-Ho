// src/components/hub/story/internal/scene/state/story-scene-store.ts - Store local Zustand para estado UI del mapa Story sin acoplar dominio.
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
  setHistory: (history: IPlayerStoryHistoryEvent[]) => void;
}

function createNodesById(nodes: IStoryMapNodeRuntime[]): Record<string, IStoryMapNodeRuntime> {
  // Normaliza por id para lecturas O(1) desde paneles y acciones.
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
  const defaultNodeId =
    input.currentNodeId ??
    input.nodes.find((node) => node.id === "story-ch1-player-start")?.id ??
    input.nodes[0]?.id ??
    null;
  return create<IStorySceneState>((set) => ({
    selectedNodeId: defaultNodeId,
    currentNodeId: defaultNodeId,
    history: input.history,
    nodesById: createNodesById(input.nodes),
    setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
    setCurrentNodeId: (currentNodeId) => set({ currentNodeId }),
    setHistory: (history) => set({ history }),
  }));
}

export type StorySceneStore = ReturnType<typeof createStorySceneStore>;
