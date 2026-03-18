// src/services/tutorial/market/resolve-market-tutorial-steps.ts - Define pasos guiados del nodo Market para filtros, compra e historial.
import { ITutorialFlowStep } from "@/core/entities/tutorial/ITutorialFlowStep";

interface IResolveMarketTutorialStepsInput {
  isMobileLayout: boolean;
}

function resolveBaseSteps(): ITutorialFlowStep[] {
  return [
    {
      id: "market-type-filter",
      title: "Filtro por tipo",
      description: "Aquí defines el tipo de carta que quieres ver primero en el catálogo.",
      targetId: "market-type-filter",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-order-filter",
      title: "Ordenar resultados",
      description: "Este selector cambia el criterio principal de ordenación del listado.",
      targetId: "market-order-filter",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-order-direction",
      title: "Dirección de orden",
      description: "Con este botón alternas entre ascendente y descendente para ajustar prioridad visual.",
      targetId: "market-order-direction",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-buy-card",
      title: "Comprar carta individual",
      description: "Ahora sí, realiza una compra directa desde inspección de datos.",
      targetId: "market-buy-card",
      allowedTargetIds: ["market-buy-card", "market-inspector-panel"],
      completionType: "USER_ACTION",
      expectedActionId: "BUY_CARD",
    },
    {
      id: "market-buy-card-result-warehouse",
      title: "Resultado en Almacén",
      description: "Tras comprar, la carta se registra en Almacén con su cantidad actualizada.",
      targetId: "market-vault-collection-panel",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-pack-selection",
      title: "Seleccionar Pack GemGPT",
      description: "En este bloque eliges un pack y se cargan sus cartas posibles para decidir compra.",
      targetId: "market-pack-tile-tutorial-market-pack-gemgpt",
      allowedTargetIds: ["market-pack-selector", "market-pack-tile-tutorial-market-pack-gemgpt"],
      completionType: "BOTH",
      expectedActionId: "SELECT_GEMGPT_PACK",
    },
    {
      id: "market-pack-preview-cards",
      title: "Detalle del Pack",
      description: "Aquí ves las cartas posibles del pack seleccionado y su coste antes de comprar.",
      targetId: "market-pack-preview",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-buy-pack",
      title: "Comprar sobre aleatorio",
      description: "Ahora compra un sobre. Verás que sus cartas salen de forma aleatoria.",
      targetId: "market-buy-pack",
      allowedTargetIds: ["market-buy-pack", "market-pack-reveal"],
      completionType: "BOTH",
      expectedActionId: "BUY_PACK",
    },
    {
      id: "market-pack-random-explanation",
      title: "Sobres y aleatoriedad",
      description: "Cada sobre abre un set aleatorio de cartas. No siempre saldrá la misma combinación.",
      targetId: "market-pack-reveal",
      allowedTargetIds: ["market-pack-reveal"],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-open-vault-collection",
      title: "Bóveda: tu almacén",
      description: "En Almacén puedes consultar todo lo adquirido y usarlo después en Arsenal.",
      targetId: "market-vault-collection-tab",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-open-history",
      title: "Bóveda: historial",
      description: "En Historial revisas cada transacción de Market para auditar tus gastos.",
      targetId: "market-history-tab",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
  ];
}

function resolveMobileSectionSteps(): ITutorialFlowStep[] {
  return [
    {
      id: "market-mobile-section-listings",
      title: "Sección Mercado",
      description: "Aquí exploras cartas sueltas, aplicas filtros y abres su detalle para comprar.",
      targetId: "market-mobile-tab-listings",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-mobile-section-packs",
      title: "Sección Packs",
      description: "En Packs eliges sobres, revisas cartas posibles y ejecutas compras aleatorias.",
      targetId: "market-mobile-tab-packs",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
    {
      id: "market-mobile-section-vault",
      title: "Sección Almacén",
      description: "En Almacén/Historial revisas stock y transacciones para controlar tus recursos.",
      targetId: "market-mobile-tab-vault",
      allowedTargetIds: [],
      completionType: "MANUAL_NEXT",
    },
  ];
}

export function resolveMarketTutorialSteps(input: IResolveMarketTutorialStepsInput): ITutorialFlowStep[] {
  if (!input.isMobileLayout) return resolveBaseSteps();
  const baseSteps = resolveBaseSteps();
  const [typeStep, orderStep, directionStep, ...restBaseSteps] = baseSteps;
  return [
    ...resolveMobileSectionSteps(),
    {
      id: "market-mobile-open-filters",
      title: "Botón de Filtros",
      description: "Primero pulsa Filtros para desplegar el bloque de configuración en móvil.",
      targetId: "market-mobile-open-filters",
      allowedTargetIds: ["market-mobile-open-filters"],
      completionType: "USER_ACTION",
      expectedActionId: "OPEN_MOBILE_FILTERS",
    },
    typeStep,
    orderStep,
    directionStep,
    ...restBaseSteps,
  ];
}
