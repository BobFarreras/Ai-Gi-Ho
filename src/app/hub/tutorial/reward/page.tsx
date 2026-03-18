// src/app/hub/tutorial/reward/page.tsx - Nodo final para claim de recompensa del tutorial completo (fase en construcción).
import Link from "next/link";
import { HubSectionEntryBurst } from "@/components/hub/sections/HubSectionEntryBurst";

export default function TutorialRewardPage() {
  return (
    <main className="hub-control-room-bg min-h-dvh px-4 py-8 text-slate-100 sm:px-6">
      <HubSectionEntryBurst />
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-300/35 bg-slate-950/80 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Nodo 4</p>
        <h1 className="mt-2 text-2xl font-black uppercase text-cyan-100">Recompensa Final</h1>
        <p className="mt-2 text-sm text-slate-300">Este nodo reclamará la recompensa de cierre del onboarding cuando todos los nodos previos estén completados.</p>
        <Link href="/hub/tutorial" className="mt-4 inline-block rounded-md border border-slate-600 px-3 py-2 text-xs font-black uppercase text-slate-200">
          Volver al mapa
        </Link>
      </section>
    </main>
  );
}
