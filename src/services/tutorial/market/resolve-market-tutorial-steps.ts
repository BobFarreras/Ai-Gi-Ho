// src/services/tutorial/market/resolve-market-tutorial-steps.ts - Define pasos guiados del nodo Market para filtros, compra e historial.
import { ITutorialFlowStep } from "@/core/entities/tutorial/ITutorialFlowStep";

export function resolveMarketTutorialSteps(): ITutorialFlowStep[] {
  return [
    {
      id: "market-type-filter",
      title: "Filtro por tipo",
      description: "Selecciona el tipo de carta para segmentar el catálogo y encontrar más rápido lo que necesitas.",
      targetId: "market-type-filter",
      allowedTargetIds: ["market-type-filter"],
      completionType: "USER_ACTION",
      expectedActionId: "CHANGE_TYPE_FILTER",
    },
    {
      id: "market-order-filter",
      title: "Ordenar resultados",
      description: "Cambia el orden para priorizar precio, energía o nombre según tu estrategia de compra.",
      targetId: "market-order-filter",
      allowedTargetIds: ["market-order-filter"],
      completionType: "USER_ACTION",
      expectedActionId: "CHANGE_ORDER_FILTER",
    },
    {
      id: "market-buy-pack",
      title: "Comprar sobre",
      description: "Haz una compra para entender el gasto de Nexus y la confirmación de transacción.",
      targetId: "market-buy-pack",
      allowedTargetIds: ["market-buy-pack"],
      completionType: "USER_ACTION",
      expectedActionId: "BUY_PACK",
    },
    {
      id: "market-open-history",
      title: "Revisar historial",
      description: "Abre el historial para auditar compras recientes y validar trazabilidad del mercado.",
      targetId: "market-history-tab",
      allowedTargetIds: ["market-history-tab"],
      completionType: "USER_ACTION",
      expectedActionId: "OPEN_HISTORY",
    },
  ];
}
