// src/components/hub/HubSceneHudOverlay.tsx - Capa HUD 2D superpuesta para usuario, progreso y sesión dentro del Hub.
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";
import { HubProgressSection } from "@/components/hub/HubProgressSection";
import { HubSessionSection } from "@/components/hub/HubSessionSection";
import { HubUserSection } from "@/components/hub/HubUserSection";
import { HUB_HUD_ANIMATION_DURATION, HUB_HUD_START_DELAY_MS } from "@/components/hub/internal/hub-entry-timings";

interface HubSceneHudOverlayProps {
  playerLabel?: string;
  progress?: IPlayerHubProgress;
  showMetaNodes: boolean;
}

export function HubSceneHudOverlay({ playerLabel, progress, showMetaNodes }: HubSceneHudOverlayProps) {
  const [canShowHud, setCanShowHud] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setCanShowHud(true), HUB_HUD_START_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {showMetaNodes && playerLabel && canShowHud ? (
        <motion.div
          initial={{ x: "-120vw" }}
          animate={{ x: 0 }}
          transition={{ duration: HUB_HUD_ANIMATION_DURATION, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform" }}
          className="pointer-events-auto absolute left-4 top-4 sm:left-[6%] sm:top-[6%]"
        >
          <HubUserSection playerLabel={playerLabel} />
        </motion.div>
      ) : null}
      {showMetaNodes && progress && canShowHud ? (
        <motion.div
          initial={{ y: "-64vh" }}
          animate={{ y: 0 }}
          transition={{ duration: HUB_HUD_ANIMATION_DURATION, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          style={{ willChange: "transform" }}
          className="pointer-events-auto absolute left-1/2 top-5 -translate-x-1/2 sm:top-3"
        >
          <HubProgressSection progress={progress} />
        </motion.div>
      ) : null}
      {showMetaNodes && canShowHud ? (
        <motion.div
          initial={{ x: "120vw" }}
          animate={{ x: 0 }}
          transition={{ duration: HUB_HUD_ANIMATION_DURATION, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          style={{ willChange: "transform" }}
          className="pointer-events-auto absolute right-4 top-4 sm:right-[6%] sm:top-[6%]"
        >
          <HubSessionSection />
        </motion.div>
      ) : null}
    </div>
  );
}
