"use client";

import { History, Volume2, VolumeX } from "lucide-react";

interface BoardActionButtonsProps {
  isMuted: boolean;
  isHistoryOpen: boolean;
  onToggleMute: () => void;
  onToggleHistory: () => void;
}

export function BoardActionButtons({
  isMuted,
  isHistoryOpen,
  onToggleMute,
  onToggleHistory,
}: BoardActionButtonsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-50 flex items-center gap-3">
      <button
        aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleMute();
        }}
        className="bg-zinc-950/90 border-2 border-cyan-500/50 text-cyan-300 p-4 rounded-full hover:bg-cyan-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
      <button
        aria-label={isHistoryOpen ? "Cerrar historial de batalla" : "Abrir historial de batalla"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleHistory();
        }}
        className="bg-zinc-950/90 border-2 border-red-500/50 text-red-500 p-4 rounded-full hover:bg-red-950 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all"
      >
        <History size={24} />
      </button>
    </div>
  );
}
