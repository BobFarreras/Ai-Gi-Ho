// src/app/hub/tutorial/market/page.tsx - Página server-side del nodo Market usando motor guiado reutilizable.
import { HubSectionEntryBurst } from "@/components/hub/sections/HubSectionEntryBurst";
import { TutorialMarketClient } from "@/app/hub/tutorial/market/TutorialMarketClient";

export default function TutorialMarketPage() {
  return (
    <main className="hub-control-room-bg min-h-dvh px-4 py-8 text-slate-100 sm:px-6">
      <HubSectionEntryBurst />
      <TutorialMarketClient />
    </main>
  );
}
