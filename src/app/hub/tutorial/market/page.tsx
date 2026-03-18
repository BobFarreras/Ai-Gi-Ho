// src/app/hub/tutorial/market/page.tsx - Nodo de tutorial para lógica de Market con guía por pasos (fase en construcción).
import Link from "next/link";
import { HubSectionEntryBurst } from "@/components/hub/sections/HubSectionEntryBurst";

export default function TutorialMarketPage() {
  return (
    <main className="hub-control-room-bg min-h-dvh px-4 py-8 text-slate-100 sm:px-6">
      <HubSectionEntryBurst />
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-300/35 bg-slate-950/80 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Nodo 3</p>
        <h1 className="mt-2 text-2xl font-black uppercase text-cyan-100">Tutorial de Market</h1>
        <p className="mt-2 text-sm text-slate-300">Aquí se enseñará el uso de filtros, ordenación y compra con un flujo bloqueado por objetivos.</p>
        <div className="mt-4 flex gap-2">
          <Link href="/hub/market" className="rounded-md border border-cyan-200/35 px-3 py-2 text-xs font-black uppercase text-cyan-100">
            Ir al Market
          </Link>
          <Link href="/hub/tutorial" className="rounded-md border border-slate-600 px-3 py-2 text-xs font-black uppercase text-slate-200">
            Volver al mapa
          </Link>
        </div>
      </section>
    </main>
  );
}
