// src/services/tutorial/arsenal/resolve-arsenal-tutorial-steps.ts - Define pasos guiados del nodo Preparar Deck para la fase inicial.
import { ITutorialFlowStep } from "@/core/entities/tutorial/ITutorialFlowStep";

export function resolveArsenalTutorialSteps(): ITutorialFlowStep[] {
  return [
    {
      id: "arsenal-select-card",
      title: "Selecciona una carta",
      description: "Haz click en una carta del almacén real para cargar su detalle en el inspector.",
      targetId: "tutorial-home-collection",
      allowedTargetIds: ["tutorial-home-collection"],
      completionType: "USER_ACTION",
      expectedActionId: "SELECT_CARD_DETAIL",
    },
    {
      id: "arsenal-add-deck",
      title: "Añadir al deck",
      description: "Con la carta seleccionada, pulsa Añadir para moverla al deck principal.",
      targetId: "tutorial-home-add-button",
      allowedTargetIds: ["tutorial-home-add-button"],
      completionType: "USER_ACTION",
      expectedActionId: "ADD_CARD_TO_DECK",
    },
    {
      id: "arsenal-open-evolve",
      title: "Evolución y cierre",
      description: "Pulsa Evolucionar para revisar el flujo. Si la carta no cumple requisitos, usa Siguiente para cerrar el nodo.",
      targetId: "tutorial-home-evolve-button",
      allowedTargetIds: ["tutorial-home-evolve-button", "tutorial-home-inspector"],
      completionType: "BOTH",
      expectedActionId: "OPEN_EVOLVE_PANEL",
    },
  ];
}
