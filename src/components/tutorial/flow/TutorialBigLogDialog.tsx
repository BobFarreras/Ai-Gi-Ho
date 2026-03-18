// src/components/tutorial/flow/TutorialBigLogDialog.tsx - Diálogo narrativo de BigLog con botón siguiente y soporte de bloqueos del tutorial.
"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface ITutorialBigLogDialogProps {
  title: string;
  description: string;
  canUseNext: boolean;
  isFinished: boolean;
  onNext: () => void;
  targetId?: string | null;
}

type DialogPlacement = "bottom" | "top";

function resolveRect(targetId: string | null): DOMRect | null {
  if (!targetId) return null;
  const element = document.querySelector<HTMLElement>(`[data-tutorial-id="${targetId}"]`);
  return element?.getBoundingClientRect() ?? null;
}

function hasRectOverlap(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function TutorialBigLogDialog({ title, description, canUseNext, isFinished, onNext, targetId = null }: ITutorialBigLogDialogProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [placement, setPlacement] = useState<DialogPlacement>("bottom");

  useEffect(() => {
    if (!targetId) return;
    const updatePlacement = (): void => {
      const dialogRect = containerRef.current?.getBoundingClientRect();
      const targetRect = resolveRect(targetId);
      if (!dialogRect || !targetRect) {
        setPlacement("bottom");
        return;
      }
      if (!hasRectOverlap(dialogRect, targetRect)) {
        setPlacement("bottom");
        return;
      }
      setPlacement(targetRect.top > window.innerHeight * 0.46 ? "top" : "bottom");
    };
    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    const intervalId = window.setInterval(updatePlacement, 160);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [targetId]);

  const positionClass = useMemo(
    () => (placement === "top" ? "top-4 bottom-auto" : "bottom-4 top-auto"),
    [placement],
  );

  return (
    <aside
      ref={containerRef}
      data-tutorial-overlay="true"
      className={`pointer-events-auto fixed left-1/2 z-[430] w-[min(96vw,960px)] -translate-x-1/2 rounded-2xl border border-cyan-300/45 bg-slate-950/95 p-4 shadow-[0_10px_38px_rgba(0,0,0,0.6)] transition-all duration-300 ${positionClass}`}
    >
      <div className="flex items-start gap-3">
        <Image src="/assets/story/opponents/opp-ch1-biglog/avatar-BigLog.png" alt="Avatar de BigLog" width={74} height={74} className="rounded-xl border border-cyan-300/35" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-300">BigLog Tutorial</p>
          <h3 className="mt-1 text-base font-black uppercase leading-tight text-cyan-100 sm:text-lg">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">{description}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              data-tutorial-overlay="true"
              onClick={onNext}
              disabled={!canUseNext || isFinished}
              aria-label="Siguiente paso del tutorial"
              className="rounded-md border border-cyan-200/45 px-3 py-2 text-xs font-black uppercase text-cyan-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Siguiente
            </button>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{isFinished ? "Tutorial completado" : canUseNext ? "Puedes continuar" : "Realiza la acción marcada"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
