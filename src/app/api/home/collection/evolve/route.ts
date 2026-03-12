// src/app/api/home/collection/evolve/route.ts - Evoluciona versión de carta desde copias en almacén y devuelve snapshot actualizado.
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "@/core/errors/ValidationError";
import { GameRuleError } from "@/core/errors/GameRuleError";
import { createHomeRouteContext } from "@/app/api/home/internal/create-home-route-context";
import { requireTrustedMutationOrigin } from "@/services/security/api/require-trusted-mutation-origin";
import { readJsonObjectBody, readRequiredStringField } from "@/services/security/api/request-body-parser";

export async function POST(request: NextRequest) {
  const originGuard = requireTrustedMutationOrigin(request);
  if (originGuard) return originGuard;
  try {
    const payload = await readJsonObjectBody(request, "Payload inválido para evolucionar carta.");
    const cardId = readRequiredStringField(payload, "cardId", "El identificador de carta es obligatorio.");
    const context = await createHomeRouteContext(request);
    const evolveResult = await context.evolveCardVersionUseCase.execute({
      playerId: context.playerId,
      cardId,
    });
    return NextResponse.json(evolveResult, { status: 200, headers: context.response.headers });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof GameRuleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "No se pudo evolucionar la carta." }, { status: 400 });
  }
}
