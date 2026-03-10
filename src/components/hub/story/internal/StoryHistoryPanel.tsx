// src/components/hub/story/internal/StoryHistoryPanel.tsx - Panel compacto con historial de eventos Story recientes del jugador.
import { IPlayerStoryHistoryEvent } from "@/core/entities/story/IPlayerStoryHistoryEvent";

interface StoryHistoryPanelProps {
  history: IPlayerStoryHistoryEvent[];
  isCompact?: boolean;
}

export function StoryHistoryPanel({ history, isCompact = false }: StoryHistoryPanelProps) {
  return (
    <aside className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 text-cyan-100">
      <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300">Historial Story</h2>
      <div className={`home-modern-scroll mt-2 space-y-2 overflow-y-auto pr-1 ${isCompact ? "max-h-[140px]" : "max-h-[200px]"}`}>
        {history.length === 0 ? (
          <p className="text-xs text-slate-400">Sin eventos todavía.</p>
        ) : (
          history.map((event) => (
            <article key={event.eventId} className="rounded border border-white/10 bg-black/35 px-2 py-1.5">
              <p className="text-[10px] font-black uppercase tracking-wide text-cyan-300">{event.kind}</p>
              <p className="text-xs text-slate-200">{event.details}</p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
