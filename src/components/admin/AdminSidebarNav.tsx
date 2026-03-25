// src/components/admin/AdminSidebarNav.tsx - Sidebar lateral admin con navegación por secciones y modo colapsado para ahorrar espacio.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface IAdminSidebarNavProps {
  portalSlug: string;
}

interface IAdminSidebarItem {
  href: string;
  shortLabel: string;
  label: string;
}

function buildItems(portalSlug: string): IAdminSidebarItem[] {
  const base = `/admin-portal/${portalSlug}`;
  return [
    { href: base, shortLabel: "R", label: "Resumen" },
    { href: `${base}/catalog`, shortLabel: "C", label: "Card Catalog" },
    { href: `${base}/starter-deck`, shortLabel: "S", label: "Starter Deck" },
    { href: `${base}/story-decks`, shortLabel: "T", label: "Story Decks" },
  ];
}

export function AdminSidebarNav({ portalSlug }: IAdminSidebarNavProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const items = buildItems(portalSlug);

  return (
    <aside className={`${isCollapsed ? "w-16" : "w-56"} flex h-full min-h-0 shrink-0 flex-col rounded-xl border border-slate-700 bg-slate-900/70 p-2 transition-all`}>
      <button
        type="button"
        aria-label="Plegar o desplegar navegación admin"
        className="mb-2 h-9 rounded-md border border-slate-600 bg-slate-900 px-2 text-xs font-bold uppercase text-cyan-100"
        onClick={() => setIsCollapsed((value) => !value)}
      >
        {isCollapsed ? ">>" : "<<"}
      </button>
      <nav className="home-modern-scroll min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {items.map((item, index) => {
          const isActive = index === 0 ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex h-10 items-center rounded-md border px-2 text-xs font-bold uppercase tracking-wide ${
                isActive ? "border-cyan-300 bg-cyan-500/20 text-cyan-100" : "border-slate-600 bg-slate-900 text-slate-200 hover:border-cyan-500"
              }`}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-[10px]">{item.shortLabel}</span>
              {isCollapsed ? null : <span className="ml-2 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
