// src/core/use-cases/tutorial/GetTutorialMapStateUseCase.test.ts - Valida salida del caso de uso de mapa tutorial.
import { describe, expect, it } from "vitest";
import { GetTutorialMapStateUseCase } from "@/core/use-cases/tutorial/GetTutorialMapStateUseCase";

describe("GetTutorialMapStateUseCase", () => {
  it("expone nodos secuenciales con un único nodo disponible al inicio", () => {
    const useCase = new GetTutorialMapStateUseCase();
    const runtime = useCase.execute({ completedNodeIds: [] });
    expect(runtime.length).toBeGreaterThan(0);
    expect(runtime.filter((node) => node.state === "AVAILABLE")).toHaveLength(1);
    expect(runtime[0]?.state).toBe("AVAILABLE");
  });
});
