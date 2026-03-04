// src/services/home/deck-builder/deck-builder-actions.ts - Orquesta acciones de Mi Home reutilizando casos de uso del dominio.
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IDeck } from "@/core/entities/home/IDeck";
import { AddCardToDeckUseCase } from "@/core/use-cases/home/AddCardToDeckUseCase";
import { MoveDeckCardUseCase } from "@/core/use-cases/home/MoveDeckCardUseCase";
import { RemoveCardFromDeckUseCase } from "@/core/use-cases/home/RemoveCardFromDeckUseCase";
import { SaveDeckUseCase } from "@/core/use-cases/home/SaveDeckUseCase";
import { InMemoryDeckRepository } from "@/infrastructure/repositories/InMemoryDeckRepository";

interface IDeckActionContext {
  playerId: string;
  deck: IDeck;
  collection: ICollectionCard[];
}

function createRepository(context: IDeckActionContext): InMemoryDeckRepository {
  return new InMemoryDeckRepository(context.collection, [context.deck]);
}

export async function addCardToDeckAction(context: IDeckActionContext, cardId: string): Promise<IDeck> {
  const repository = createRepository(context);
  const useCase = new AddCardToDeckUseCase(repository);
  return useCase.execute({ playerId: context.playerId, cardId });
}

export async function removeCardFromDeckAction(context: IDeckActionContext, slotIndex: number): Promise<IDeck> {
  const repository = createRepository(context);
  const useCase = new RemoveCardFromDeckUseCase(repository);
  return useCase.execute({ playerId: context.playerId, slotIndex });
}

export async function moveDeckCardAction(context: IDeckActionContext, fromIndex: number, toIndex: number): Promise<IDeck> {
  const repository = createRepository(context);
  const useCase = new MoveDeckCardUseCase(repository);
  return useCase.execute({ playerId: context.playerId, fromSlotIndex: fromIndex, toSlotIndex: toIndex });
}

export async function saveDeckAction(context: IDeckActionContext): Promise<IDeck> {
  const repository = createRepository(context);
  const useCase = new SaveDeckUseCase(repository);
  return useCase.execute(context.playerId);
}
