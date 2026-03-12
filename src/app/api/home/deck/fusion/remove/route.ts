// src/app/api/home/deck/fusion/remove/route.ts - Vacía un slot del bloque de fusión del Arsenal.
import { NextRequest, NextResponse } from "next/server";
import { GameRuleError } from "@/core/errors/GameRuleError";
import { ValidationError } from "@/core/errors/ValidationError";
import { createHomeRouteContext } from "@/app/api/home/internal/create-home-route-context";
import { requireTrustedMutationOrigin } from "@/services/security/api/require-trusted-mutation-origin";
import {
  readJsonObjectBody,
  readRequiredIntegerField,
} from "@/services/security/api/request-body-parser";

export async function POST(request: NextRequest) {
  const originGuard = requireTrustedMutationOrigin(request);
  if (originGuard) return originGuard;
  try {
    const payload = await readJsonObjectBody(request, "Payload inválido para retirar carta de fusión.");
    const slotIndex = readRequiredIntegerField(payload, "slotIndex", "El slotIndex debe ser un entero válido.");
    const context = await createHomeRouteContext(request);
    const deck = await context.removeFusionCardUseCase.execute({
      playerId: context.playerId,
      slotIndex,
    });
    return NextResponse.json(deck, { status: 200, headers: context.response.headers });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof GameRuleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "No se pudo retirar la carta del bloque de fusión." }, { status: 400 });
  }
}
