// src/components/game/board/internal/HudDialogueBubble.tsx - Burbuja breve de diálogo asociada al HUD para feedback reactivo del duelo.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HudDialogueBubbleProps {
  isOpponent: boolean;
  message: string | null;
}

export function HudDialogueBubble({ isOpponent, message }: HudDialogueBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      {message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: isOpponent ? -8 : 8, x: isOpponent ? 10 : -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: isOpponent ? -6 : 6 }}
          transition={{ duration: 0.22 }}
          className={cn(
            "relative mb-2 max-w-[300px] rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-black text-black shadow-[0_6px_0_rgba(0,0,0,0.9)]",
            isOpponent ? "text-right" : "text-left",
          )}
        >
          {message}
          <span className={cn("absolute top-full h-3 w-3 rotate-45 border-b-2 border-r-2 border-black bg-white", isOpponent ? "right-5 -mt-[7px]" : "left-5 -mt-[7px]")} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
