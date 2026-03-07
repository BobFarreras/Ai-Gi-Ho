// src/components/hub/home/HomeInspectorActionButtons.tsx - Acciones contextuales mobile del inspector de Arsenal.
"use client";

import { Download, Sparkles, Upload } from "lucide-react";

interface HomeInspectorActionButtonsProps {
  source: "DECK" | "COLLECTION" | "NONE";
  canInsert: boolean;
  canRemove: boolean;
  canEvolve: boolean;
  evolveCost: number | null;
  onInsert: () => void;
  onRemove: () => void;
  onEvolve: () => void;
}

const actionButtonClass =
  "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition";

export function HomeInspectorActionButtons({
  source,
  canInsert,
  canRemove,
  canEvolve,
  evolveCost,
  onInsert,
  onRemove,
  onEvolve,
}: HomeInspectorActionButtonsProps) {
  if (source === "NONE") return null;
  const showEvolve = source === "COLLECTION";
  const layoutClass = showEvolve ? "grid grid-cols-2" : "grid grid-cols-1";

  return (
    <div className={`mt-auto gap-2 pt-3 ${layoutClass}`}>
      {source === "COLLECTION" ? (
        <button
          type="button"
          aria-label="Añadir carta al deck"
          disabled={!canInsert}
          onClick={onInsert}
          className={`${actionButtonClass} ${
            canInsert ? "border-cyan-500/60 bg-cyan-950/35 text-cyan-200" : "border-zinc-800 bg-zinc-950/55 text-zinc-600"
          }`}
        >
          <Upload size={14} />
          Añadir
        </button>
      ) : (
        <button
          type="button"
          aria-label="Remover carta del deck"
          disabled={!canRemove}
          onClick={onRemove}
          className={`${actionButtonClass} ${
            canRemove ? "border-red-500/55 bg-red-950/35 text-red-200" : "border-zinc-800 bg-zinc-950/55 text-zinc-600"
          }`}
        >
          <Download size={14} />
          Remover
        </button>
      )}
      {showEvolve ? (
        <button
          type="button"
          aria-label="Evolucionar carta seleccionada"
          disabled={!canEvolve}
          onClick={onEvolve}
          className={`${actionButtonClass} ${
            canEvolve ? "border-amber-400/60 bg-amber-900/30 text-amber-100" : "border-zinc-800 bg-zinc-950/55 text-zinc-600"
          }`}
        >
          <Sparkles size={14} />
          {canEvolve && evolveCost ? `Evol (${evolveCost})` : "Evolución"}
        </button>
      ) : null}
    </div>
  );
}
