// src/components/admin/AdminSectionNav.tsx - Navegación principal del panel admin para separar dominios funcionales.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface IAdminSectionNavProps {
  portalSlug: string;
}

interface IAdminSectionLink {
  href: string;
  label: string;
}

function buildLinks(portalSlug: string): IAdminSectionLink[] {
  const base = `/admin-portal/${portalSlug}`;
  return [
    { href: base, label: "Resumen" },
    { href: `${base}/catalog`, label: "Card Catalog + Market" },
    { href: `${base}/starter-deck`, label: "Starter Deck" },
    { href: `${base}/story-decks`, label: "Story Decks" },
  ];
}

export function AdminSectionNav({ portalSlug }: IAdminSectionNavProps) {
  const pathname = usePathname();
  return (
    <nav className="mt-4 flex flex-wrap gap-2">
      {buildLinks(portalSlug).map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-wide ${
              isActive ? "border-cyan-300 bg-cyan-500/20 text-cyan-100" : "border-slate-600 bg-slate-900 text-slate-200 hover:border-cyan-500"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
