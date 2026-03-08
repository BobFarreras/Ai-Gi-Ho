// src/core/entities/opponent/IStoryDuelDefinition.ts - Define el contrato de duelo de historia cargable desde persistencia sin hardcodes.
export type StoryOpponentDifficulty = "ROOKIE" | "STANDARD" | "ELITE" | "BOSS" | "MYTHIC";

export interface IStoryRewardCardDefinition {
  cardId: string;
  copies: number;
  dropRate: number;
  isGuaranteed: boolean;
}

export interface IStoryDuelDefinition {
  id: string;
  chapter: number;
  duelIndex: number;
  title: string;
  description: string;
  opponentId: string;
  opponentName: string;
  opponentAvatarUrl?: string | null;
  opponentDifficulty: StoryOpponentDifficulty;
  opponentDeckCardIds: string[];
  openingHandSize: number;
  starterPlayer: "PLAYER" | "OPPONENT" | "RANDOM";
  rewardNexus: number;
  rewardPlayerExperience: number;
  rewardCards: IStoryRewardCardDefinition[];
  isBossDuel: boolean;
}
