// src/components/hub/story/internal/StoryNodeInteractionDialog.tsx - Modal narrativo para interacciones de nodos Story no-duelo.
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IStoryInteractionDialogueLine } from "@/services/story/resolve-story-node-interaction-dialogue";

interface IStoryNodeInteractionDialogProps {
  isOpen: boolean;
  title: string;
  line: IStoryInteractionDialogueLine | null;
  onNext: () => void;
  onClose: () => void;
}

export function StoryNodeInteractionDialog({
  isOpen,
  title,
  line,
  onNext,
  onClose,
}: IStoryNodeInteractionDialogProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
          <motion.article
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            className="w-full max-w-xl rounded-xl border border-cyan-500/40 bg-slate-950/95 p-5 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Interacción Story</p>
            <h3 className="mt-1 text-lg font-black uppercase tracking-wider text-fuchsia-100">{title}</h3>
            <div className="mt-4 rounded border border-cyan-900/60 bg-black/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{line?.speaker ?? "Sistema"}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-100">{line?.text ?? "Sin contenido narrativo."}</p>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-700 px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-200"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded border border-cyan-500/60 bg-cyan-950/70 px-3 py-2 text-xs font-black uppercase tracking-wider text-cyan-100"
              >
                Continuar
              </button>
            </div>
          </motion.article>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
