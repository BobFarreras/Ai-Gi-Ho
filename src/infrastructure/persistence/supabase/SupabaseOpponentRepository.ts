// src/infrastructure/persistence/supabase/SupabaseOpponentRepository.ts - Carga definición de duelo de historia desde Supabase sin acoplar UI a SQL.
import { SupabaseClient } from "@supabase/supabase-js";
import { ValidationError } from "@/core/errors/ValidationError";
import { IStoryDuelDefinition, IStoryRewardCardDefinition, StoryOpponentDifficulty } from "@/core/entities/opponent/IStoryDuelDefinition";
import { IOpponentRepository } from "@/core/repositories/IOpponentRepository";
import { mapStoryDeckCardIds } from "@/infrastructure/persistence/supabase/internal/map-story-deck-card-ids";

interface IStoryDuelRow {
  id: string;
  chapter: number;
  duel_index: number;
  title: string;
  description: string;
  opponent_id: string;
  deck_list_id: string;
  opening_hand_size: number;
  starter_player: "PLAYER" | "OPPONENT" | "RANDOM";
  reward_nexus: number;
  reward_player_experience: number;
  is_boss_duel: boolean;
}

interface IStoryOpponentRow {
  id: string;
  display_name: string;
  difficulty: StoryOpponentDifficulty;
}

interface IStoryDeckCardRow {
  card_id: string;
  copies: number;
}

interface IStoryRewardCardRow {
  card_id: string;
  copies: number;
  drop_rate: number;
  is_guaranteed: boolean;
}

function toRewardCards(rows: IStoryRewardCardRow[]): IStoryRewardCardDefinition[] {
  return rows.map((row) => ({
    cardId: row.card_id,
    copies: row.copies,
    dropRate: row.drop_rate,
    isGuaranteed: row.is_guaranteed,
  }));
}

export class SupabaseOpponentRepository implements IOpponentRepository {
  constructor(private readonly client: SupabaseClient) {}

  async getStoryDuel(chapter: number, duelIndex: number): Promise<IStoryDuelDefinition | null> {
    const duelResult = await this.client
      .from("story_duels")
      .select("id,chapter,duel_index,title,description,opponent_id,deck_list_id,opening_hand_size,starter_player,reward_nexus,reward_player_experience,is_boss_duel")
      .eq("chapter", chapter)
      .eq("duel_index", duelIndex)
      .eq("is_active", true)
      .maybeSingle<IStoryDuelRow>();
    if (duelResult.error) throw new ValidationError("No se pudo cargar el duelo de historia.");
    if (!duelResult.data) return null;

    const opponentResult = await this.client
      .from("story_opponents")
      .select("id,display_name,difficulty")
      .eq("id", duelResult.data.opponent_id)
      .eq("is_active", true)
      .single<IStoryOpponentRow>();
    if (opponentResult.error || !opponentResult.data) throw new ValidationError("No se pudo cargar el oponente de historia.");

    const deckResult = await this.client
      .from("story_deck_list_cards")
      .select("card_id,copies")
      .eq("deck_list_id", duelResult.data.deck_list_id)
      .order("slot_index", { ascending: true });
    if (deckResult.error) throw new ValidationError("No se pudo cargar el mazo del oponente de historia.");

    const rewardResult = await this.client
      .from("story_duel_reward_cards")
      .select("card_id,copies,drop_rate,is_guaranteed")
      .eq("duel_id", duelResult.data.id)
      .order("card_id", { ascending: true });
    if (rewardResult.error) throw new ValidationError("No se pudo cargar la recompensa de cartas del duelo de historia.");

    return {
      id: duelResult.data.id,
      chapter: duelResult.data.chapter,
      duelIndex: duelResult.data.duel_index,
      title: duelResult.data.title,
      description: duelResult.data.description,
      opponentId: opponentResult.data.id,
      opponentName: opponentResult.data.display_name,
      opponentDifficulty: opponentResult.data.difficulty,
      opponentDeckCardIds: mapStoryDeckCardIds((deckResult.data ?? []) as IStoryDeckCardRow[]),
      openingHandSize: duelResult.data.opening_hand_size,
      starterPlayer: duelResult.data.starter_player,
      rewardNexus: duelResult.data.reward_nexus,
      rewardPlayerExperience: duelResult.data.reward_player_experience,
      rewardCards: toRewardCards((rewardResult.data ?? []) as IStoryRewardCardRow[]),
      isBossDuel: duelResult.data.is_boss_duel,
    };
  }
}
