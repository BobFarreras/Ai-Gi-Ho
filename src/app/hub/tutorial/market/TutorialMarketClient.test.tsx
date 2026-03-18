// src/app/hub/tutorial/market/TutorialMarketClient.test.tsx - Verifica avance guiado del nodo Market en filtros, compra e historial.
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TutorialMarketClient } from "@/app/hub/tutorial/market/TutorialMarketClient";

describe("TutorialMarketClient", () => {
  it("completa el flujo al interactuar con filtros, compra e historial", () => {
    render(<TutorialMarketClient />);
    fireEvent.click(screen.getByRole("button", { name: "Empezar" }));
    expect(screen.getByText("Filtro por tipo")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Tipo"), { target: { value: "ENTITY" } });
    expect(screen.getByText("Ordenar resultados")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Orden"), { target: { value: "NAME" } });
    expect(screen.getByText("Comprar sobre")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Comprar sobre (200 NX)" }));
    expect(screen.getByText("Revisar historial")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Abrir historial" }));
    expect(screen.getByText("Tutorial completado")).toBeInTheDocument();
  });
});
