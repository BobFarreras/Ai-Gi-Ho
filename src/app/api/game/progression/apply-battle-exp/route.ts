// src/app/api/game/progression/apply-battle-exp/route.ts - Persiste en batch la EXP de cartas de un duelo para el jugador autenticado.
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "@/core/errors/ValidationError";
import { ApplyBattleCardExperienceUseCase } from "@/core/use-cases/progression/ApplyBattleCardExperienceUseCase";
import { ICardExperienceEvent } from "@/core/services/progression/card-experience-rules";
import { getAuthenticatedUserId } from "@/services/auth/api/internal/get-authenticated-user-id";
import { createPlayerRouteRepositories } from "@/services/player-persistence/create-player-route-repositories";

interface IApplyBattleCardExperiencePayload {
  events: ICardExperienceEvent[];
}

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ ok: true }, { status: 200 });
    const repositories = await createPlayerRouteRepositories(request, response);
    const playerId = await getAuthenticatedUserId(repositories.client);
    const payload = (await request.json()) as IApplyBattleCardExperiencePayload;
    if (!Array.isArray(payload.events)) throw new ValidationError("El listado de eventos de experiencia es obligatorio.");
    const useCase = new ApplyBattleCardExperienceUseCase(repositories.playerCardProgressRepository);
    const result = await useCase.execute({ playerId, events: payload.events });
    return NextResponse.json(result, { status: 200, headers: response.headers });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "No se pudo guardar la experiencia de cartas del duelo." }, { status: 400 });
  }
}

