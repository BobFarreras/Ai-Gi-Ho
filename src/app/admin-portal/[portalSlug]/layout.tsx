// src/app/admin-portal/[portalSlug]/layout.tsx - Protege el acceso al portal admin validando slug esperado y permisos administrativos.
import { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { AuthorizationError } from "@/core/errors/AuthorizationError";
import { AdminSectionNav } from "@/components/admin/AdminSectionNav";
import { assertAdminAccess } from "@/services/admin/assert-admin-access";
import { resolveAdminPortalSlug } from "@/services/admin/internal/resolve-admin-portal-slug";
import { getCurrentUserSession } from "@/services/auth/get-current-user-session";

interface AdminPortalLayoutProps {
  children: ReactNode;
  params: Promise<{ portalSlug: string }>;
}

export default async function AdminPortalLayout({ children, params }: AdminPortalLayoutProps) {
  const session = await getCurrentUserSession();
  if (!session) redirect("/login");
  const resolvedParams = await params;
  if (resolvedParams.portalSlug !== resolveAdminPortalSlug()) {
    notFound();
  }
  try {
    await assertAdminAccess();
  } catch (error) {
    if (!(error instanceof AuthorizationError)) throw error;
    notFound();
  }
  return (
    <main className="min-h-dvh bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl min-h-0 flex-col rounded-xl border border-slate-700 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        <p className="mt-1 text-sm text-slate-300">Gestiona catálogo, mercado y decks desde rutas separadas por dominio.</p>
        <AdminSectionNav portalSlug={resolvedParams.portalSlug} />
        <div className="mt-6 min-h-0 flex-1">{children}</div>
      </section>
    </main>
  );
}
