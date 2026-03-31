// src/components/game/board/hooks/internal/audio/effect-audio-registry.ts - Resuelve rutas de audio por acción de efecto para EXECUTION/TRAP con convención snake_case.
import { ICombatLogEvent } from "@/core/entities/ICombatLog";

type EffectAudioSource = "execution" | "trap";

function normalizeActionToFileName(action: string): string {
  const normalized = action.trim().toLowerCase();
  return normalized.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function readEffectAction(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;
  return typeof payload.effectAction === "string" && payload.effectAction.trim().length > 0 ? payload.effectAction : null;
}

function resolveSource(event: ICombatLogEvent, payload: Record<string, unknown> | null): EffectAudioSource | null {
  if (event.eventType === "TRAP_TRIGGERED") return "trap";
  if (event.eventType !== "CARD_PLAYED" || !payload) return null;
  const cardType = typeof payload.cardType === "string" ? payload.cardType : "";
  const mode = typeof payload.mode === "string" ? payload.mode : "";
  if (cardType === "EXECUTION" && mode === "ACTIVATE") return "execution";
  return null;
}

/**
 * Devuelve ruta absoluta del audio específico por efecto.
 * Convención:
 * - `public/audio/sfx/effects/execution/<action_en_minusculas>.mp3`
 * - `public/audio/sfx/effects/trap/<action_en_minusculas>.mp3`
 */
export function resolveEffectAudioPath(event: ICombatLogEvent): string | null {
  const payload = typeof event.payload === "object" && event.payload !== null ? (event.payload as Record<string, unknown>) : null;
  const source = resolveSource(event, payload);
  const action = readEffectAction(payload);
  if (!source || !action) return null;
  const fileName = normalizeActionToFileName(action);
  if (!fileName) return null;
  return `/audio/sfx/effects/${source}/${fileName}.mp3`;
}
