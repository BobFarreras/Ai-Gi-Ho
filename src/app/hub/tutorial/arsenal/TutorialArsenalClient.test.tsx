// src/app/hub/tutorial/arsenal/TutorialArsenalClient.test.tsx - Verifica flujo guiado de Preparar Deck sobre el layout real de Arsenal.
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TutorialArsenalClient } from "@/app/hub/tutorial/arsenal/TutorialArsenalClient";

vi.mock("@/components/hub/home/HomeDeckBuilderScene", () => ({
  HomeDeckBuilderScene: () => (
    <div>
      <button type="button" data-tutorial-id="tutorial-home-collection">Colección</button>
      <button type="button" data-tutorial-id="tutorial-home-add-button">Añadir</button>
      <button type="button" data-tutorial-id="tutorial-home-evolve-button">Evolucionar</button>
      <div data-tutorial-id="tutorial-home-inspector">Inspector</div>
    </div>
  ),
}));

describe("TutorialArsenalClient", () => {
  it("muestra intro y permite avanzar por los pasos del nodo", () => {
    render(<TutorialArsenalClient playerId="p1" initialDeck={{ playerId: "p1", slots: [], fusionSlots: [] }} collection={[]} initialCardProgress={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Empezar" }));
    expect(screen.getByText("Selecciona una carta")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Colección" }));
    expect(screen.getByText("Añadir al deck")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Añadir" }));
    expect(screen.getByText("Evolución y cierre")).toBeInTheDocument();
  });
});
