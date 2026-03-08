// src/components/game/board/battlefield/internal/ExecutionActivateButton.tsx - Botón flotante para activar una ejecución seleccionada desde el tablero.
"use client";
import { Play } from "lucide-react";

interface ExecutionActivateButtonProps {
  onActivateSelectedExecution: () => void;
}

export function ExecutionActivateButton({ onActivateSelectedExecution }: ExecutionActivateButtonProps) {
  return (
    <button
      aria-label="Activar ejecución seleccionada"
      onClick={(event) => {
        event.stopPropagation();
        onActivateSelectedExecution();
      }}
      className="absolute -top-10 left-1/2 -translate-x-1/2 z-[120] flex h-8 w-8 items-center justify-center rounded-full border border-fuchsia-300/80 bg-fuchsia-700/90 text-white shadow-[0_0_16px_rgba(217,70,239,0.55)] hover:bg-fuchsia-600"
    >
      <Play size={14} />
    </button>
  );
}
