// src/components/game/board/battlefield/internal/ExecutionActivateButton.tsx
"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExecutionActivateButtonProps {
  onActivateSelectedExecution: () => void;
}

export function ExecutionActivateButton({ onActivateSelectedExecution }: ExecutionActivateButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, z: 40 }} // "z: 40" lo hace flotar hacia adelante en el 3D
      animate={{ scale: 1, opacity: 1, z: 40 }}
      exit={{ scale: 0, opacity: 0, z: 0 }}
      whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label="Activar ejecución seleccionada"
      onClick={(event) => {
        event.stopPropagation();
        onActivateSelectedExecution();
      }}
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150]",
        "flex h-24 w-24 items-center justify-center rounded-full cursor-pointer group",
        "border-2 border-fuchsia-400/80 bg-fuchsia-950/70 backdrop-blur-sm",
        "shadow-[0_0_40px_rgba(217,70,239,0.7)] hover:shadow-[0_0_60px_rgba(217,70,239,1)]",
        "transition-shadow duration-300"
      )}
    >
      {/* Anillo exterior giratorio */}
      <div className="absolute inset-[-8px] rounded-full border border-fuchsia-400/40 animate-[spin_4s_linear_infinite] border-t-transparent pointer-events-none" />
      
      {/* Anillo interior giratorio (inverso) */}
      <div className="absolute inset-[4px] rounded-full border-2 border-fuchsia-300/30 animate-[spin_3s_linear_infinite_reverse] border-b-transparent pointer-events-none" />
      
      {/* Icono de Play gigante y descentrado ligeramente por óptica visual */}
      <Play size={44} className="ml-2 text-fuchsia-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" />

      {/* Etiqueta flotante inferior */}
      <span className="absolute -bottom-8 text-sm font-black tracking-[0.25em] text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] group-hover:text-white transition-colors">
        ACTIVAR
      </span>
    </motion.button>
  );
}