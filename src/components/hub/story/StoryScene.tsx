// src/components/hub/story/StoryScene.tsx - Escena cliente del mapa Story con selección de nodos e historial desacoplado.
"use client";

import { useState } from "react";
import { useStore } from "zustand";
import { StoryCircuitMap } from "@/components/hub/story/StoryCircuitMap";
import { StoryHistoryPanel } from "@/components/hub/story/internal/StoryHistoryPanel";
import { createStorySceneStore, StorySceneStore } from "@/components/hub/story/internal/story-scene-store";
import { IStoryMapRuntimeData } from "@/services/story/story-map-runtime-data";

interface StorySceneProps {
  runtime: IStoryMapRuntimeData;
}

export function StoryScene({ runtime }: StorySceneProps) {
  const [store] = useState<StorySceneStore>(() =>
    createStorySceneStore({
      nodes: runtime.nodes,
      currentNodeId: runtime.currentNodeId,
      history: runtime.history,
    }),
  );
  const selectedNodeId = useStore(store, (state) => state.selectedNodeId);
  const currentNodeId = useStore(store, (state) => state.currentNodeId);
  const history = useStore(store, (state) => state.history);
  const setSelectedNodeId = useStore(store, (state) => state.setSelectedNodeId);
  return (
    <section className="mx-auto w-full max-w-6xl space-y-3">
      <StoryCircuitMap
        nodes={runtime.nodes}
        selectedNodeId={selectedNodeId}
        currentNodeId={currentNodeId}
        onSelectNode={setSelectedNodeId}
      />
      <StoryHistoryPanel history={history} />
    </section>
  );
}
