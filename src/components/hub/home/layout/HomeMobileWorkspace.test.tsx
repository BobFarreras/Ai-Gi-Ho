// src/components/hub/home/layout/HomeMobileWorkspace.test.tsx - Verifica apertura del inspector mobile al seleccionar cartas.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeMobileWorkspace } from "@/components/hub/home/layout/HomeMobileWorkspace";
import { IHomeWorkspaceProps } from "@/components/hub/home/layout/home-workspace-types";

vi.mock("@/components/hub/home/HomeDeckPanel", () => ({
  HomeDeckPanel: ({ onSelectSlot }: { onSelectSlot: (slotIndex: number) => void }) => (
    <button type="button" onClick={() => onSelectSlot(0)}>
      Seleccionar slot
    </button>
  ),
}));

vi.mock("@/components/hub/home/HomeCollectionPanel", () => ({
  HomeCollectionPanel: ({ onSelectCard }: { onSelectCard: (cardId: string) => void }) => (
    <button type="button" onClick={() => onSelectCard("entity-python")}>
      Seleccionar colección
    </button>
  ),
}));

vi.mock("@/components/hub/home/HomeCardInspectorDialog", () => ({
  HomeCardInspectorDialog: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="home-mobile-inspector-state">{isOpen ? "open" : "closed"}</div>
  ),
}));

function createProps(): IHomeWorkspaceProps {
  return {
    deck: {
      playerId: "player-1",
      slots: [{ index: 0, cardId: "entity-python" }, ...Array.from({ length: 19 }, (_, index) => ({ index: index + 1, cardId: null }))],
    },
    collectionState: [],
    filteredCollection: [],
    cardProgressById: new Map(),
    evolvableCardIds: new Set(),
    selectedSlotIndex: null,
    selectedCardId: "entity-python",
    selectedCollectionCardId: null,
    selectedCard: null,
    selectedCardVersionTier: 0,
    selectedCardLevel: 0,
    selectedCardXp: 0,
    selectedCardMasteryPassiveSkillId: null,
    onSelectSlot: vi.fn(),
    onSelectCollectionCard: vi.fn(),
    onClearError: vi.fn(),
  };
}

describe("HomeMobileWorkspace", () => {
  it("abre inspector al seleccionar slot con carta", () => {
    render(<HomeMobileWorkspace {...createProps()} />);
    expect(screen.getByTestId("home-mobile-inspector-state")).toHaveTextContent("closed");
    fireEvent.click(screen.getByRole("button", { name: "Seleccionar slot" }));
    expect(screen.getByTestId("home-mobile-inspector-state")).toHaveTextContent("open");
  });

  it("abre inspector al seleccionar carta de colección", () => {
    render(<HomeMobileWorkspace {...createProps()} />);
    fireEvent.click(screen.getByRole("button", { name: "Seleccionar colección" }));
    expect(screen.getByTestId("home-mobile-inspector-state")).toHaveTextContent("open");
  });
});
