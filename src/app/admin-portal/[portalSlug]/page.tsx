// src/app/admin-portal/[portalSlug]/page.tsx - Muestra resumen operativo del panel admin y próximos módulos disponibles.
import Link from "next/link";

interface AdminPortalPageProps {
  params: Promise<{ portalSlug: string }>;
}

export default async function AdminPortalPage({ params }: AdminPortalPageProps) {
  const { portalSlug } = await params;
  const basePath = `/admin-portal/${portalSlug}`;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-200">
        Usa las secciones superiores para gestionar datos. La edición está separada por dominio para reducir errores operativos.
      </p>
      <div className="grid gap-3 md:grid-cols-4">
        <Link href={`${basePath}/catalog`} className="rounded-lg border border-slate-600 bg-slate-950/70 p-4 text-sm text-slate-100 hover:border-cyan-400">
          Card Catalog
        </Link>
        <Link href={`${basePath}/market`} className="rounded-lg border border-slate-600 bg-slate-950/70 p-4 text-sm text-slate-100 hover:border-cyan-400">
          Market
        </Link>
        <Link href={`${basePath}/starter-deck`} className="rounded-lg border border-slate-600 bg-slate-950/70 p-4 text-sm text-slate-100 hover:border-cyan-400">
          Starter Deck
        </Link>
        <Link href={`${basePath}/story-decks`} className="rounded-lg border border-slate-600 bg-slate-950/70 p-4 text-sm text-slate-100 hover:border-cyan-400">
          Story Decks
        </Link>
      </div>
    </div>
  );
}
