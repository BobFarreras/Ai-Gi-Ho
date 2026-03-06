// src/components/hub/HubNodeActionPanel.tsx - Panel HTML accesible para nodos 3D con navegación o estado bloqueado.
"use client";

import { IHubSection } from "@/core/entities/hub/IHubSection";

interface HubNodeActionPanelProps {
  section: IHubSection;
  baseColor: string;
  isHovered?: boolean;
  isLockReasonVisible: boolean;
  onAction: () => void;
}

function withHexAlpha(color: string, alphaHex: string): string {
  if (!color.startsWith("#") || color.length !== 7) return color;
  return `${color}${alphaHex}`;
}

export function HubNodeActionPanel({ section, baseColor, isHovered = false, isLockReasonVisible, onAction }: HubNodeActionPanelProps) {
  const isLocked = section.isLocked;

  return (
    <button
      type="button"
      aria-label={isLocked ? `Mostrar bloqueo de ${section.title}` : `Abrir ${section.title}`}
      onClick={onAction}
      className={`flex w-[220px] cursor-pointer flex-col items-center justify-center border bg-[#030914]/80 py-3 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-[#051124]/90
        hover:brightness-110
      `}
      style={{
        borderColor: withHexAlpha(baseColor, "80"),
        boxShadow: `0 0 ${isHovered ? "24px" : "14px"} ${withHexAlpha(baseColor, isHovered ? "55" : "33")}`,
        clipPath: "polygon(0 0, 85% 0, 100% 15px, 100% 100%, 15% 100%, 0 calc(100% - 15px))",
      }}
    >
      <div className="flex items-center gap-3">
        {isLocked ? <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" /> : null}
        <h2 className="font-mono text-xl font-black uppercase tracking-widest text-white drop-shadow-md" style={{ textShadow: `0 0 10px ${baseColor}80` }}>
          {section.title}
        </h2>
      </div>
      {isLocked ? <p className="mt-2 border border-red-500/20 bg-red-950/50 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-red-400">[ OFFLINE ]</p> : null}
      {isLocked && isLockReasonVisible && section.lockReason ? (
        <p className="mt-2 max-w-[190px] text-center font-mono text-[10px] font-bold uppercase tracking-widest text-amber-300">{section.lockReason}</p>
      ) : null}
    </button>
  );
}
