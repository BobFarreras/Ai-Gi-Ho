// src/components/admin/internal/AdminCardCatalogFormFields.tsx - Renderiza campos de edición completa para alta y modificación de cartas del catálogo.
"use client";

import { IAdminCardCatalogDraft } from "@/components/admin/internal/admin-card-catalog-draft";

interface IAdminCardCatalogFormFieldsProps {
  draft: IAdminCardCatalogDraft;
  isBusy: boolean;
  onChange: <K extends keyof IAdminCardCatalogDraft>(key: K, value: IAdminCardCatalogDraft[K]) => void;
}

export function AdminCardCatalogFormFields({ draft, isBusy, onChange }: IAdminCardCatalogFormFieldsProps) {
  return (
    <div className="home-modern-scroll min-h-0 space-y-4 overflow-y-auto pr-2">
      <section className="space-y-2 rounded-lg border border-slate-700/80 bg-slate-950/40 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-200">Identidad</p>
        <div className="grid gap-2 md:grid-cols-2">
          <input aria-label="ID de carta" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.id} onChange={(event) => onChange("id", event.target.value)} placeholder="card-id" disabled={isBusy} />
          <input aria-label="Nombre de carta" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.name} onChange={(event) => onChange("name", event.target.value)} placeholder="Nombre" disabled={isBusy} />
        </div>
        <textarea aria-label="Descripción de carta" className="min-h-20 w-full rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.description} onChange={(event) => onChange("description", event.target.value)} placeholder="Descripción" disabled={isBusy} />
      </section>

      <section className="space-y-2 rounded-lg border border-slate-700/80 bg-slate-950/40 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-200">Atributos base</p>
        <div className="grid gap-2 md:grid-cols-4">
          <select aria-label="Tipo de carta" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.type} onChange={(event) => onChange("type", event.target.value as IAdminCardCatalogDraft["type"])} disabled={isBusy}><option value="ENTITY">Entity</option><option value="EXECUTION">Execution</option><option value="TRAP">Trap</option><option value="FUSION">Fusion</option><option value="ENVIRONMENT">Environment</option></select>
          <select aria-label="Facción de carta" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.faction} onChange={(event) => onChange("faction", event.target.value as IAdminCardCatalogDraft["faction"])} disabled={isBusy}><option value="NEUTRAL">Neutral</option><option value="OPEN_SOURCE">Open Source</option><option value="BIG_TECH">Big Tech</option><option value="NO_CODE">No Code</option></select>
          <input aria-label="Coste" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.costText} onChange={(event) => onChange("costText", event.target.value)} placeholder="Coste" disabled={isBusy} />
          <label className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100"><input type="checkbox" checked={draft.isActive} onChange={(event) => onChange("isActive", event.target.checked)} disabled={isBusy} /> Activa</label>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <input aria-label="Ataque" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.attackText} onChange={(event) => onChange("attackText", event.target.value)} placeholder="Attack (vacío si no aplica)" disabled={isBusy} />
          <input aria-label="Defensa" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.defenseText} onChange={(event) => onChange("defenseText", event.target.value)} placeholder="Defense (vacío si no aplica)" disabled={isBusy} />
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-700/80 bg-slate-950/40 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-200">Afinidad y trigger</p>
        <div className="grid gap-2 md:grid-cols-2">
          <select aria-label="Arquetipo" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.archetype} onChange={(event) => onChange("archetype", event.target.value as IAdminCardCatalogDraft["archetype"])} disabled={isBusy}><option value="NONE">Sin arquetipo</option><option value="LLM">LLM</option><option value="FRAMEWORK">Framework</option><option value="DB">DB</option><option value="IDE">IDE</option><option value="LANGUAGE">Language</option><option value="TOOL">Tool</option><option value="SECURITY">Security</option></select>
          <select aria-label="Trigger de trampa" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.trigger} onChange={(event) => onChange("trigger", event.target.value as IAdminCardCatalogDraft["trigger"])} disabled={isBusy}><option value="NONE">Sin trigger</option><option value="ON_OPPONENT_ATTACK_DECLARED">On Opponent Attack Declared</option><option value="ON_OPPONENT_EXECUTION_ACTIVATED">On Opponent Execution Activated</option><option value="ON_OPPONENT_TRAP_ACTIVATED">On Opponent Trap Activated</option></select>
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-700/80 bg-slate-950/40 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-200">Arte y fusión</p>
        <div className="grid gap-2 md:grid-cols-2">
          <input aria-label="URL de fondo" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.bgUrl} onChange={(event) => onChange("bgUrl", event.target.value)} placeholder="bgUrl" disabled={isBusy} />
          <input aria-label="URL de render" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.renderUrl} onChange={(event) => onChange("renderUrl", event.target.value)} placeholder="renderUrl" disabled={isBusy} />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <input aria-label="Fusion recipe id" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.fusionRecipeId} onChange={(event) => onChange("fusionRecipeId", event.target.value)} placeholder="fusionRecipeId" disabled={isBusy} />
          <input aria-label="Fusion materials" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.fusionMaterialIdsText} onChange={(event) => onChange("fusionMaterialIdsText", event.target.value)} placeholder="material-1,material-2" disabled={isBusy} />
          <input aria-label="Energía de fusión" className="rounded-md border border-slate-600 bg-slate-900 p-2 text-xs text-slate-100" value={draft.fusionEnergyRequirementText} onChange={(event) => onChange("fusionEnergyRequirementText", event.target.value)} placeholder="fusionEnergyRequirement" disabled={isBusy} />
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-slate-700/80 bg-slate-950/40 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-cyan-200">Lógica (effect JSON)</p>
        <textarea aria-label="JSON de efecto" className="min-h-28 w-full rounded-md border border-slate-600 bg-slate-900 p-2 font-mono text-xs text-slate-100" value={draft.effectJson} onChange={(event) => onChange("effectJson", event.target.value)} placeholder='{"action":"DAMAGE","target":"OPPONENT","value":300}' disabled={isBusy} />
      </section>
    </div>
  );
}
