// src/components/hub/story/StoryCircuitMap.tsx - Renderiza el mapa Story con cámara arrastrable, nodos y segmentos dinámicos.
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { IStoryMapNodeRuntime } from "@/services/story/story-map-runtime-data";
import {
  buildStoryNodePositionMap,
  resolveStoryNodePosition,
  resolveStoryPathSegments,
} from "@/components/hub/story/internal/map/layout/story-circuit-layout";
import { StoryMapNode } from "./internal/map/components/StoryMapNode";
import { useStoryAvatarTravel } from "./internal/map/hooks/use-story-avatar-travel";

import { StoryMapZoomControls } from "./internal/map/components/StoryMapZoomControls";
import { useStoryMapZoom } from "./internal/map/hooks/use-story-map-zoom";
import { listStoryMapPlatforms } from "@/services/story/map-definitions/story-map-definition-registry";

interface StoryCircuitMapProps {
  nodes: IStoryMapNodeRuntime[];
  currentNodeId: string | null;
  selectedNodeId: string | null;
  avatarVisualTarget?: { nodeId: string; stance: "CENTER" | "SIDE" } | null;
  isInteractionLocked?: boolean;
  onSelectNode: (nodeId: string | null) => void;
}

function resolveAvatarAnchor(input: {
  nodeId: string;
  stance: "CENTER" | "SIDE";
  positionMap: Record<string, { x: number; y: number }>;
}): { x: number; y: number } {
  const nodePosition = resolveStoryNodePosition(input.nodeId, input.positionMap);
  const platformY = nodePosition.y + 74;
  if (input.stance === "SIDE") {
    return { x: nodePosition.x - 92, y: platformY };
  }
  return { x: nodePosition.x, y: platformY };
}

export function StoryCircuitMap({
  nodes,
  currentNodeId,
  selectedNodeId,
  avatarVisualTarget,
  isInteractionLocked,
  onSelectNode,
}: StoryCircuitMapProps) {
  // Cámara y zoom separados de la lógica de nodos para mantener SRP del componente.
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(0);
  const positionMap = useMemo(() => buildStoryNodePositionMap(nodes), [nodes]);
  const { zoom, zoomIn, zoomOut, resetZoom, handleWheel } = useStoryMapZoom();
  const segments = useMemo(() => resolveStoryPathSegments(nodes, positionMap), [nodes, positionMap]);
  const platforms = useMemo(() => listStoryMapPlatforms(), []);
  const avatarTargetNodeId = avatarVisualTarget?.nodeId ?? currentNodeId;
  const avatarNode = nodes.find((node) => node.id === avatarTargetNodeId) ?? nodes.find((node) => node.id === "story-ch1-player-start") ?? nodes[0];
  const visualStance = avatarVisualTarget?.stance ?? "CENTER";
  // El avatar se ancla a la plataforma del nodo para que ambos queden en el mismo plano visual.
  const avatarPos = avatarNode
    ? resolveAvatarAnchor({ nodeId: avatarNode.id, stance: visualStance, positionMap })
    : { x: 1000, y: 1000 };
  const resolveTravelPosition = (nodeId: string) =>
    resolveAvatarAnchor({ nodeId, stance: "CENTER", positionMap });
  const { avatarX, avatarY } = useStoryAvatarTravel({
    targetNodeId: avatarNode?.id ?? null,
    resolvePosition: resolveTravelPosition,
  });
  const avatarSideOffsetX = visualStance === "SIDE" ? -92 : 0;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;
    const targetX = containerWidth / 2 - avatarPos.x;
    const targetY = containerHeight / 2 - avatarPos.y + 100;
    animate(cameraX, targetX, { type: "spring", stiffness: 80, damping: 20, mass: 1 });
    animate(cameraY, targetY, { type: "spring", stiffness: 80, damping: 20, mass: 1 });
  }, [avatarPos.x, avatarPos.y, cameraX, cameraY]);

  return (
    <div
      ref={mapContainerRef}
      className="relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
      onWheel={handleWheel}
      onClick={() => {
        if (!isInteractionLocked) onSelectNode(null);
      }}
    >
      <motion.div
        drag
        dragConstraints={mapContainerRef}
        dragElastic={0.1}
        style={{ x: cameraX, y: cameraY, scale: zoom }}
        className="absolute left-0 top-0 h-[2200px] w-[3400px]"
      >
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
          {segments.map((segment, index) => <motion.line key={`path-${index}`} x1={segment.from.x} y1={segment.from.y} x2={segment.to.x} y2={segment.to.y} stroke="rgba(6, 182, 212, 0.4)" strokeWidth="6" strokeDasharray="15 15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: index * 0.08 }} />)}
        </svg>
    
        {nodes.map((node) => {
          const position = resolveStoryNodePosition(node.id, positionMap);
          return (
            <div
              key={node.id}
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ top: position.y, left: position.x }}
            >
              <StoryMapNode
                node={node}
                isSelected={selectedNodeId === node.id}
                isCurrentNode={currentNodeId === node.id}
                onClick={() => {
                  if (!isInteractionLocked) onSelectNode(node.id);
                }}
              />
            </div>
          );
        })}

        <motion.div
          className="pointer-events-none absolute z-40 flex w-20 -translate-x-1/2 -translate-y-full flex-col items-center"
          initial={false}
          style={{ top: avatarY, left: avatarX, x: avatarSideOffsetX }}
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-400 bg-black shadow-[0_0_22px_rgba(16,185,129,0.6)]">
            <Image
              src="/assets/story/player/bob.png"
              alt="Avatar del jugador"
              fill
              sizes="80px"
              quality={55}
              className="object-cover"
            />
          </div>
        </motion.div>
        {isInteractionLocked ? (
          <div className="pointer-events-none absolute left-1/2 top-8 z-40 -translate-x-1/2 rounded border border-emerald-400/50 bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-200">
            Acción en curso...
          </div>
        ) : null}
      </motion.div>
      <StoryMapZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetZoom} />
    </div>
  );
}
