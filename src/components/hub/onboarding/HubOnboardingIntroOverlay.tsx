// src/components/hub/onboarding/HubOnboardingIntroOverlay.tsx - Overlay inicial del Hub para guiar al jugador nuevo hacia Tutorial o salto opcional.
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ACADEMY_TUTORIAL_MAP_ROUTE } from "@/core/constants/routes/academy-routes";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";
import { savePlayerOnboardingAction } from "@/components/hub/onboarding/internal/save-player-onboarding-action";

interface IHubOnboardingIntroOverlayProps {
  progress?: IPlayerHubProgress;
}

/**
 * Muestra la bienvenida solo en primera visita de usuarios sin tutorial completo/saltado.
 */
export function HubOnboardingIntroOverlay({ progress }: IHubOnboardingIntroOverlayProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldShow = Boolean(progress && !progress.hasSeenAcademyIntro && !progress.hasCompletedTutorial && !progress.hasSkippedTutorial);
  if (!shouldShow || isClosing) return null;

  const runAction = async (action: "mark_intro_seen" | "skip_tutorial") => {
    setIsLoading(true);
    try {
      await savePlayerOnboardingAction(action);
      if (action === "mark_intro_seen") {
        router.push(ACADEMY_TUTORIAL_MAP_ROUTE);
        return;
      }
      setIsClosing(true);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm">
      <article className="w-full max-w-[980px] rounded-2xl border border-cyan-300/35 bg-[#020817]/94 p-4 shadow-[0_0_42px_rgba(34,211,238,0.35)] sm:p-6">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]">
            <Image src="/assets/story/player/intro-Jugador.png" alt="Jugador" fill sizes="(max-width: 640px) 220px, 280px" className="object-contain drop-shadow-[0_0_22px_rgba(34,197,94,0.4)]" />
          </div>
          <div className="relative w-full max-w-[560px] rounded-xl border-2 border-black bg-white px-4 py-4 text-black shadow-[0_8px_0_rgba(0,0,0,0.9)] sm:px-6">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-black/70">BigLog</p>
            <h2 className="mt-1 text-lg font-black uppercase sm:text-xl">Bienvenido a Academy</h2>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">
              Este es tu núcleo base. Te recomiendo completar el tutorial para desbloquear sistemas, entender combate y empezar historia con ventaja.
            </p>
            <p className="mt-2 text-sm leading-relaxed sm:text-base">Si ya dominas el juego, puedes saltarlo y abrir todo el Hub ahora.</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void runAction("mark_intro_seen")}
                className="rounded-md border border-cyan-400/60 bg-cyan-950/80 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-cyan-100 disabled:opacity-55"
              >
                Ir al tutorial
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void runAction("skip_tutorial")}
                className="rounded-md border border-amber-400/65 bg-amber-950/75 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-amber-100 disabled:opacity-55"
              >
                Saltar tutorial
              </button>
            </div>
            <span className="absolute left-[-7px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b-2 border-r-2 border-black bg-white" />
          </div>
          <div className="relative h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]">
            <Image src="/assets/story/opponents/opp-ch1-biglog/intro-BigLog.png" alt="BigLog" fill sizes="(max-width: 640px) 220px, 280px" className="object-contain drop-shadow-[0_0_24px_rgba(34,211,238,0.5)]" />
          </div>
        </div>
      </article>
    </section>
  );
}
