"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ICombatLogEvent } from "@/core/entities/ICombatLog";

interface FusionCinematicLayerProps {
  events: ICombatLogEvent[];
  onActiveChange: (active: boolean) => void;
}

interface IFusionPlaybackItem {
  id: string;
  fusionCardId: string;
}

const FUSION_VIDEO_BY_CARD_ID: Record<string, string> = {
  "fusion-gemgpt": "/assets/videos/fusions/gemgpt.mp4",
  "fusion-kaclauli": "/assets/videos/fusions/kaclauli.mp4",
  "fusion-pytgress": "/assets/videos/fusions/pytgress.mp4",
};

const DEFAULT_DURATION_MS = 3200;

function toFusionItem(event: ICombatLogEvent): IFusionPlaybackItem | null {
  if (event.eventType !== "FUSION_SUMMONED" || typeof event.payload !== "object" || event.payload === null) return null;
  const payload = event.payload as Record<string, unknown>;
  const fusionCardId = typeof payload.fusionCardId === "string" ? payload.fusionCardId : null;
  if (!fusionCardId) return null;
  return { id: event.id, fusionCardId };
}

export function FusionCinematicLayer({ events, onActiveChange }: FusionCinematicLayerProps) {
  const [queue, setQueue] = useState<IFusionPlaybackItem[]>([]);
  const processedCountRef = useRef(0);
  const activeItem = queue[0] ?? null;

  useEffect(() => {
    const nextItems = events.slice(processedCountRef.current).map(toFusionItem).filter((item): item is IFusionPlaybackItem => Boolean(item));
    processedCountRef.current = events.length;
    if (nextItems.length > 0) setQueue((previous) => [...previous, ...nextItems]);
  }, [events]);

  useEffect(() => {
    onActiveChange(Boolean(activeItem));
  }, [activeItem, onActiveChange]);

  useEffect(() => {
    if (!activeItem) return;
    const timeoutId = setTimeout(() => setQueue((previous) => previous.slice(1)), DEFAULT_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, [activeItem]);

  if (!activeItem) return null;
  const videoSrc = FUSION_VIDEO_BY_CARD_ID[activeItem.fusionCardId];

  return (
    <div className="absolute inset-0 z-[250] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center"
        >
          {videoSrc ? (
            <video
              autoPlay
              muted
              playsInline
              className="w-[min(72vw,980px)] rounded-2xl border border-cyan-400/45 shadow-[0_0_45px_rgba(6,182,212,0.35)]"
              onEnded={() => setQueue((previous) => previous.slice(1))}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <div className="px-10 py-6 rounded-2xl border border-cyan-300/55 bg-cyan-950/60 shadow-[0_0_45px_rgba(6,182,212,0.3)]">
              <p className="text-cyan-100 text-3xl font-black uppercase tracking-wider">{activeItem.fusionCardId}</p>
              <p className="text-cyan-200 text-sm mt-2">Invocación por fusión completada</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
