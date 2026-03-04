// src/components/hub/HubDashboard.tsx - Renderiza el panel principal del hub con progreso y accesos a secciones.
import Link from "next/link";
import { IHubSection } from "@/core/entities/hub/IHubSection";
import { IPlayerHubProgress } from "@/core/entities/hub/IPlayerHubProgress";

interface HubDashboardProps {
  progress: IPlayerHubProgress;
  sections: IHubSection[];
}

export function HubDashboard({ progress, sections }: HubDashboardProps) {
  return (
    <main className="min-h-screen px-6 py-10 text-slate-100">
      <header className="mx-auto w-full max-w-6xl rounded-3xl border border-cyan-300/30 bg-slate-950/50 p-6">
        <h1 className="text-3xl font-black tracking-wide text-cyan-300">Ciudad Central</h1>
        <p className="mt-2 text-sm text-slate-300">
          Medallas: {progress.medals} | Capítulo: {progress.storyChapter} | Tutorial:{" "}
          {progress.hasCompletedTutorial ? "Completado" : "Pendiente"}
        </p>
      </header>
      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-cyan-300/25 bg-slate-950/55 p-5 shadow-lg">
            <h2 className="text-xl font-bold text-cyan-200">{section.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{section.description}</p>
            {section.isLocked ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-300">
                Bloqueado: {section.lockReason}
              </p>
            ) : (
              <Link aria-label={`Ir a ${section.title}`} href={section.href} className="mt-4 inline-block text-cyan-300 underline">
                Entrar
              </Link>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
