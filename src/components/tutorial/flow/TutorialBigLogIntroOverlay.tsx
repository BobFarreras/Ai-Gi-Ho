// src/components/tutorial/flow/TutorialBigLogIntroOverlay.tsx - Overlay de introducción de BigLog antes de iniciar un nodo guiado de tutorial.
"use client";
import Image from "next/image";

interface ITutorialBigLogIntroOverlayProps {
  isVisible: boolean;
  title: string;
  description: string;
  onStart: () => void;
}

export function TutorialBigLogIntroOverlay({ isVisible, title, description, onStart }: ITutorialBigLogIntroOverlayProps) {
  if (!isVisible) return null;
  return (
    <section data-tutorial-overlay="true" className="pointer-events-auto fixed inset-0 z-[440] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <article className="w-full max-w-3xl rounded-2xl border border-cyan-300/40 bg-slate-950/95 p-5 shadow-[0_18px_52px_rgba(2,6,18,0.78)]">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <Image src="/assets/story/opponents/opp-ch1-biglog/intro-BigLog.png" alt="Introducción de BigLog" width={120} height={150} className="rounded-xl border border-cyan-300/35" />
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-300">Introducción</p>
            <h2 className="mt-1 text-xl font-black uppercase text-cyan-100">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">{description}</p>
            <button
              type="button"
              data-tutorial-overlay="true"
              onClick={onStart}
              className="mt-4 rounded-md border border-cyan-200/45 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-cyan-100"
            >
              Empezar
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
