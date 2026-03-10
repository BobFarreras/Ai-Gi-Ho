// src/components/hub/story/internal/StoryBriefingPanel.tsx - Panel narrativo de contexto para capítulo/acto activo del mapa Story.
import { IStoryChapterBriefing } from "@/services/story/build-story-chapter-briefing";

interface StoryBriefingPanelProps {
  briefing: IStoryChapterBriefing;
}

export function StoryBriefingPanel({ briefing }: StoryBriefingPanelProps) {
  return (
    <aside className="rounded-xl border border-fuchsia-500/30 bg-slate-950/80 p-3 text-fuchsia-100">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-fuchsia-300">{briefing.arcTitle}</p>
      <p className="mt-2 text-xs"><span className="font-black uppercase text-fuchsia-200">Objetivo:</span> {briefing.objective}</p>
      <p className="mt-2 text-xs"><span className="font-black uppercase text-fuchsia-200">Tensión:</span> {briefing.tension}</p>
    </aside>
  );
}
