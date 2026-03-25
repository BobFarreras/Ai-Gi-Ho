// src/components/admin/AdminCatalogPanel.tsx - Renderiza panel de Fase B para gestionar cartas, listings y packs del mercado.
"use client";

import { useMemo, useState } from "react";
import { AdminJsonCommandForm } from "@/components/admin/internal/AdminJsonCommandForm";
import { fetchAdminCatalogSnapshot, saveAdminCard, saveAdminListing, saveAdminPack } from "@/components/admin/admin-catalog-api";
import { IAdminCatalogSnapshot } from "@/core/entities/admin/IAdminCatalogSnapshot";

const cardTemplate = JSON.stringify(
  {
    id: "entity-example-admin",
    name: "Example Admin Card",
    description: "Carta creada desde panel admin.",
    type: "ENTITY",
    faction: "OPEN_SOURCE",
    cost: 3,
    attack: 1200,
    defense: 1100,
    archetype: "TOOL",
    trigger: null,
    bgUrl: null,
    renderUrl: null,
    effect: null,
    fusionRecipeId: null,
    fusionMaterialIds: [],
    fusionEnergyRequirement: null,
    isActive: true,
  },
  null,
  2,
);

const listingTemplate = JSON.stringify({ id: "listing-entity-example-admin", cardId: "entity-example-admin", rarity: "COMMON", priceNexus: 120, stock: null, isAvailable: true }, null, 2);
const packTemplate = JSON.stringify(
  {
    id: "pack-example-admin",
    name: "Pack Admin Example",
    description: "Pack editado desde admin.",
    priceNexus: 300,
    cardsPerPack: 5,
    packPoolId: "pool-example-admin",
    previewCardIds: ["entity-example-admin"],
    isAvailable: true,
    poolEntries: [{ id: "pool-example-admin-entity-example-admin", cardId: "entity-example-admin", rarity: "COMMON", weight: 10 }],
  },
  null,
  2,
);

interface AdminCatalogPanelProps {
  initialSnapshot: IAdminCatalogSnapshot;
}

export function AdminCatalogPanel({ initialSnapshot }: AdminCatalogPanelProps) {
  const [snapshot, setSnapshot] = useState<IAdminCatalogSnapshot>(initialSnapshot);
  const [loadError, setLoadError] = useState<string>("");

  async function refresh(): Promise<void> {
    try {
      setSnapshot(await fetchAdminCatalogSnapshot());
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No se pudo cargar datos admin.");
    }
  }

  const counts = useMemo(
    () => ({ cards: snapshot.cards.length, listings: snapshot.listings.length, packs: snapshot.packs.length }),
    [snapshot],
  );

  return (
    <section className="mt-6 space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-xs text-slate-200">
        <p>Totales actuales: cartas {counts.cards} | listings {counts.listings} | packs {counts.packs}</p>
        {loadError ? <p className="mt-2 text-rose-300">{loadError}</p> : null}
        <button type="button" aria-label="Refrescar snapshot admin" onClick={() => void refresh()} className="mt-2 rounded-md border border-cyan-500 px-2 py-1 font-bold uppercase text-cyan-200">
          Refrescar
        </button>
      </div>
      <AdminJsonCommandForm title="Carta" description="Crea o edita carta en cards_catalog." initialValue={cardTemplate} submitLabel="Guardar carta" onSubmitJson={async (json) => { await saveAdminCard(json); await refresh(); }} />
      <AdminJsonCommandForm title="Listing" description="Crea o edita listing en market_card_listings." initialValue={listingTemplate} submitLabel="Guardar listing" onSubmitJson={async (json) => { await saveAdminListing(json); await refresh(); }} />
      <AdminJsonCommandForm title="Pack" description="Crea o edita pack y reemplaza su pool completo." initialValue={packTemplate} submitLabel="Guardar pack" onSubmitJson={async (json) => { await saveAdminPack(json); await refresh(); }} />
    </section>
  );
}
