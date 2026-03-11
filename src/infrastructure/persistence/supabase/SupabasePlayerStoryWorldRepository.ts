// src/infrastructure/persistence/supabase/SupabasePlayerStoryWorldRepository.ts - Persistencia Supabase del cursor de mapa Story e historial de eventos.
import { SupabaseClient } from "@supabase/supabase-js";
import { ValidationError } from "@/core/errors/ValidationError";
import { IPlayerStoryHistoryEvent } from "@/core/entities/story/IPlayerStoryHistoryEvent";
import { IPlayerStoryWorldCompactState } from "@/core/entities/story/IPlayerStoryWorldCompactState";
import { IPlayerStoryWorldRepository } from "@/core/repositories/IPlayerStoryWorldRepository";

interface IStoryWorldStateRow {
  player_id: string;
  current_node_id: string | null;
  visited_node_ids?: string[] | null;
  interacted_node_ids?: string[] | null;
}

interface IStoryHistoryRow {
  event_id: string;
  player_id: string;
  node_id: string;
  kind: "MOVE" | "NODE_RESOLVED" | "REWARD_GRANTED" | "INTERACTION";
  details: string;
  created_at: string;
}

function toHistoryEntity(row: IStoryHistoryRow): IPlayerStoryHistoryEvent {
  return {
    eventId: row.event_id,
    playerId: row.player_id,
    nodeId: row.node_id,
    kind: row.kind,
    details: row.details,
    createdAtIso: row.created_at,
  };
}

export class SupabasePlayerStoryWorldRepository implements IPlayerStoryWorldRepository {
  constructor(private readonly client: SupabaseClient) {}

  private normalizeStringArray(value: string[] | null | undefined): string[] {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter((entry) => typeof entry === "string" && entry.length > 0)));
  }

  async getCurrentNodeIdByPlayerId(playerId: string): Promise<string | null> {
    const { data, error } = await this.client
      .from("player_story_world_state")
      .select("player_id,current_node_id")
      .eq("player_id", playerId)
      .maybeSingle<IStoryWorldStateRow>();
    if (error) throw new ValidationError("No se pudo leer el nodo actual de Story.");
    return data?.current_node_id ?? null;
  }

  async saveCurrentNodeId(playerId: string, currentNodeId: string | null): Promise<void> {
    const { error } = await this.client
      .from("player_story_world_state")
      .upsert({ player_id: playerId, current_node_id: currentNodeId }, { onConflict: "player_id" });
    if (error) throw new ValidationError("No se pudo guardar el nodo actual de Story.");
  }

  async getCompactStateByPlayerId(playerId: string): Promise<IPlayerStoryWorldCompactState> {
    const { data, error } = await this.client
      .from("player_story_world_state")
      .select("player_id,current_node_id,visited_node_ids,interacted_node_ids")
      .eq("player_id", playerId)
      .maybeSingle<IStoryWorldStateRow>();
    if (error) throw new ValidationError("No se pudo cargar estado compacto de Story.");
    return {
      currentNodeId: data?.current_node_id ?? null,
      visitedNodeIds: this.normalizeStringArray(data?.visited_node_ids),
      interactedNodeIds: this.normalizeStringArray(data?.interacted_node_ids),
    };
  }

  async saveCompactStateByPlayerId(
    playerId: string,
    state: IPlayerStoryWorldCompactState,
  ): Promise<void> {
    const { error } = await this.client.from("player_story_world_state").upsert(
      {
        player_id: playerId,
        current_node_id: state.currentNodeId,
        visited_node_ids: this.normalizeStringArray(state.visitedNodeIds),
        interacted_node_ids: this.normalizeStringArray(state.interactedNodeIds),
      },
      { onConflict: "player_id" },
    );
    if (error) throw new ValidationError("No se pudo guardar estado compacto de Story.");
  }

  async listHistoryByPlayerId(playerId: string, limit = 20): Promise<IPlayerStoryHistoryEvent[]> {
    const { data, error } = await this.client
      .from("player_story_history_events")
      .select("event_id,player_id,node_id,kind,details,created_at")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new ValidationError("No se pudo cargar el historial Story.");
    return ((data ?? []) as IStoryHistoryRow[]).map(toHistoryEntity);
  }

  async appendHistoryEvents(playerId: string, events: IPlayerStoryHistoryEvent[]): Promise<void> {
    if (events.length === 0) return;
    const rows = events.map((event) => ({
      event_id: event.eventId,
      player_id: playerId,
      node_id: event.nodeId,
      kind: event.kind,
      details: event.details,
      created_at: event.createdAtIso,
    }));
    const { error } = await this.client
      .from("player_story_history_events")
      .upsert(rows, { onConflict: "event_id" });
    if (error) throw new ValidationError("No se pudo guardar eventos de historial Story.");
  }

  async clearHistoryByPlayerId(playerId: string): Promise<void> {
    const { error } = await this.client
      .from("player_story_history_events")
      .delete()
      .eq("player_id", playerId);
    if (error) throw new ValidationError("No se pudo limpiar historial Story.");
  }
}
