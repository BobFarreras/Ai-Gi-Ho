// src/app/api/home/deck/add-slot/route.ts - Añade una carta del almacén a un slot concreto del deck principal.
import { NextRequest, NextResponse } from "next/server";
import { ValidationError } from "@/core/errors/ValidationError";
import { GameRuleError } from "@/core/errors/GameRuleError";
import { createHomeRouteContext } from "@/app/api/home/internal/create-home-route-context";
import { requireTrustedMutationOrigin } from "@/services/security/api/require-trusted-mutation-origin";
import {
  readJsonObjectBody,
  readRequiredIntegerField,
  readRequiredStringField,
} from "@/services/security/api/request-body-parser";

export async function POST(request: NextRequest) {
  const originGuard = requireTrustedMutationOrigin(request);
  if (originGuard) return originGuard;
  try {
    const payload = await readJsonObjectBody(request, "Payload inválido para asignar carta a slot.");
    const cardId = readRequiredStringField(payload, "cardId", "El identificador de carta es obligatorio.");
    const slotIndex = readRequiredIntegerField(payload, "slotIndex", "El slotIndex debe ser un entero válido.");
    const context = await createHomeRouteContext(request);
    const deck = await context.addCardUseCase.execute({
      playerId: context.playerId,
      cardId,
      slotIndex,
    });
    return NextResponse.json(deck, { status: 200, headers: context.response.headers });
  } catch (error) {
    if (error instanceof ValidationError || error instanceof GameRuleError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "No se pudo colocar la carta en el slot seleccionado." }, { status: 400 });
  }
}
