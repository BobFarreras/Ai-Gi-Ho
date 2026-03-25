// src/app/admin-portal/[portalSlug]/story-decks/page.tsx - Presenta estado del módulo de mazos story y el alcance próximo de edición.
interface AdminStoryDecksPageProps {
  params: Promise<{ portalSlug: string }>;
}

export default async function AdminStoryDecksPage({ params }: AdminStoryDecksPageProps) {
  await params;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-slate-100">Story Decks</h2>
      <p className="text-sm text-slate-300">
        Esta sección será el siguiente bloque: listado de oponentes, mazos visuales y edición controlada por modo.
      </p>
      <p className="rounded-md border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-200">
        En Fase C queda habilitada la navegación estructurada del panel y el flujo visual completo para Starter Deck.
      </p>
    </section>
  );
}

