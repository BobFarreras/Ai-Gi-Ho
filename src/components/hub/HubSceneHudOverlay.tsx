// src/components/hub/HubSceneHudOverlay.tsx - Capa HUD 2D superpuesta para usuario, progreso y sesión dentro del Hub.
"use client";

import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";
import { HubProgressSection } from "@/components/hub/HubProgressSection";
import { HubSessionSection } from "@/components/hub/HubSessionSection";
import { HubUserSection } from "@/components/hub/HubUserSection";

interface HubSceneHudOverlayProps {
  playerLabel?: string;
  progress?: IPlayerHubProgress;
  showMetaNodes: boolean;
}

export function HubSceneHudOverlay({ playerLabel, progress, showMetaNodes }: HubSceneHudOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {showMetaNodes && playerLabel ? (
        <div className="pointer-events-auto absolute left-4 top-4 sm:left-[6%] sm:top-[6%]">
          <HubUserSection playerLabel={playerLabel} />
        </div>
      ) : null}
      {showMetaNodes && progress ? (
        <div className="pointer-events-auto absolute left-1/2 top-5 -translate-x-1/2 sm:top-3">
          <HubProgressSection progress={progress} />
        </div>
      ) : null}
      {showMetaNodes ? (
        <div className="pointer-events-auto absolute right-4 top-4 sm:right-[6%] sm:top-[6%]">
          <HubSessionSection />
        </div>
      ) : null}
    </div>
  );
}
