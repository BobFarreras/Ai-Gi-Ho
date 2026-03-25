// src/components/admin/AdminMarketPanel.tsx - Panel administrativo de mercado para listados y packs separado del catálogo de cartas.
"use client";

import { useMemo, useState } from "react";
import { fetchAdminCatalogSnapshot, saveAdminListing, saveAdminPack } from "@/components/admin/admin-catalog-api";
import { AdminJsonCommandForm } from "@/components/admin/internal/AdminJsonCommandForm";
import { IAdminCatalogSnapshot } from "@/core/entities/admin/IAdminCatalogSnapshot";

const listingTemplate = JSON.stringify({ id: "listing-example-admin", cardId: "entity-example-admin", rarity: "COMMON", priceNexus: 120, stock: null, isAvailable: true }, null, 2);
const packTemplate = JSON.stringify({ id: "pack-example-admin", name: "Pack Admin Example", description: "Pack editado desde admin.", priceNexus: 300, cardsPerPack: 5, packPoolId: "pool-example-admin", previewCardIds: ["entity-example-admin"], isAvailable: true, poolEntries: [{ id: "pool-example-admin-1", cardId: "entity-example-admin", rarity: "COMMON", weight: 10 }] }, null, 2);

interface IAdminMarketPanelProps {
  initialSnapshot: IAdminCatalogSnapshot;
}

export function AdminMarketPanel({ initialSnapshot }: IAdminMarketPanelProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [feedback, setFeedback] = useState("");

  async function refresh(): Promise<void> {
    try {
      setSnapshot(await fetchAdminCatalogSnapshot());
      setFeedback("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo refrescar mercado admin.");
    }
  }

  const counts = useMemo(() => ({ listings: snapshot.listings.length, packs: snapshot.packs.length }), [snapshot]);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>Listados: {counts.listings} · Packs: {counts.packs}</p>
          <button type="button" aria-label="Refrescar datos de mercado admin" onClick={() => void refresh()} className="h-9 rounded-md border border-cyan-500 px-3 font-bold uppercase text-cyan-200">Refrescar</button>
        </div>
        {feedback ? <p className="mt-2 text-rose-300">{feedback}</p> : null}
      </div>
      <AdminJsonCommandForm title="Listing" description="Crea o edita listing en market_card_listings." initialValue={listingTemplate} submitLabel="Guardar listing" onSubmitJson={async (json) => { await saveAdminListing(json); await refresh(); }} />
      <AdminJsonCommandForm title="Pack" description="Crea o edita pack y reemplaza su pool completo." initialValue={packTemplate} submitLabel="Guardar pack" onSubmitJson={async (json) => { await saveAdminPack(json); await refresh(); }} />
    </section>
  );
}
