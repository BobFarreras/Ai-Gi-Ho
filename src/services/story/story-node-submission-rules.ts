// src/services/story/story-node-submission-rules.ts - Define validación de submissions especiales en nodos Story de activación.
import { ValidationError } from "@/core/errors/ValidationError";

export interface IStoryNodeSubmissionPrompt {
  title: string;
  hint: string;
  placeholder: string;
  activationLabel: string;
  generatedCode: string;
  requiredNodeIds: string[];
}

/** Config interna de un terminal de submission: código esperado + requisitos + mensajes de error. */
interface IStoryNodeSubmissionConfig extends IStoryNodeSubmissionPrompt {
  /** Ids de nodo (eventos/llaves) que deben estar resueltos antes de aceptar el código. */
  requiredNodeIds: string[];
  missingRequirementsError: string;
  emptyAnswerError: string;
  invalidCodeError: string;
}

/**
 * Catálogo de terminales de submission por nodo. Añadir aquí cada puzzle de código:
 * el motor overworld (y el modo clásico) los consumen por id sin hardcodear textos en la vista.
 */
const SUBMISSION_CONFIG_BY_NODE_ID: Record<string, IStoryNodeSubmissionConfig> = {
  // Acto 2: sincronizar el puente con ambas llaves + el código de enlace.
  "story-ch2-bridge-submission": {
    title: "Sincronización de Pasarela",
    hint: "Conecta ambas llaves y ejecuta la secuencia de enlace para abrir el puente principal.",
    placeholder: "BRG-XXXX-XXXX",
    activationLabel: "Conectar llaves",
    generatedCode: "BRG-7719-9924",
    requiredNodeIds: ["story-ch2-branch-lower-up-event", "story-ch2-link-recovered-event"],
    missingRequirementsError:
      "Faltan llaves de enlace. Completa los eventos clave antes de sincronizar el puente.",
    emptyAnswerError: "Debes completar la submission para sincronizar el puente.",
    invalidCodeError: "Submission inválida. Revisa la firma del enlace de pasarela.",
  },
  // Acto 3: terminal del cortafuegos del Repositorio Fantasma. El código se descubre en un log del acto.
  "story-ch3-firewall-terminal": {
    title: "Terminal del Cortafuegos",
    hint: "Introduce la clave de purga hallada en el registro corrupto para bajar el cortafuegos hacia el núcleo.",
    placeholder: "PURGE-XXXX",
    activationLabel: "Ejecutar purga",
    generatedCode: "PURGE-3F17",
    requiredNodeIds: ["story-ch3-event-corrupt-log"],
    missingRequirementsError:
      "Sin la clave de purga el terminal rechaza la conexión. Encuentra el registro corrupto primero.",
    emptyAnswerError: "Introduce la clave de purga para ejecutar el terminal.",
    invalidCodeError: "Clave rechazada. El cortafuegos sigue activo: revisa el registro corrupto.",
  },
  // Acto 6: terminal del borde de la red pública. La clave se compone leyendo las TRES llaves de router,
  // así que el terminal no se puede resolver por fuerza bruta antes de haber hecho las tres regiones.
  "story-ch6-edge-terminal": {
    title: "Terminal del Borde",
    hint: "Encadena las tres claves de router (norte, este y sur) para autorizar la salida al borde de la red.",
    placeholder: "EDGE-XXXX-XXXX",
    activationLabel: "Autorizar salida",
    generatedCode: "EDGE-4021-8830",
    requiredNodeIds: ["story-ch6-key-north", "story-ch6-key-east", "story-ch6-key-south"],
    missingRequirementsError:
      "El terminal rechaza la conexión: faltan claves de router. Toma las tres antes de volver.",
    emptyAnswerError: "Introduce la clave del borde para autorizar la salida.",
    invalidCodeError: "Clave rechazada. Vuelve a leer las tres claves de router: el orden importa.",
  },
};

function resolveConfig(nodeId: string): IStoryNodeSubmissionConfig | null {
  return SUBMISSION_CONFIG_BY_NODE_ID[nodeId] ?? null;
}

/**
 * Valida códigos de submission para nodos que exigen activación manual antes de desbloquear ruta.
 */
export function assertStoryNodeSubmissionValid(nodeId: string, submissionAnswer: string | null): void {
  const config = resolveConfig(nodeId);
  if (!config) return;
  if (!submissionAnswer || submissionAnswer.trim().length === 0) {
    throw new ValidationError(config.emptyAnswerError);
  }
  const normalized = submissionAnswer.trim().toLowerCase();
  if (normalized !== config.generatedCode.toLowerCase()) {
    throw new ValidationError(config.invalidCodeError);
  }
}

/**
 * Exige que las llaves/eventos previos del acto estén resueltos antes de permitir submission.
 */
export function assertStoryNodeSubmissionRequirements(input: {
  nodeId: string;
  completedNodeIds: string[];
  interactedNodeIds: string[];
}): void {
  const config = resolveConfig(input.nodeId);
  if (!config) return;
  const missing = config.requiredNodeIds.filter(
    (requiredNodeId) =>
      !input.completedNodeIds.includes(requiredNodeId) &&
      !input.interactedNodeIds.includes(requiredNodeId),
  );
  if (missing.length > 0) {
    throw new ValidationError(config.missingRequirementsError);
  }
}

/**
 * Devuelve metadatos de UI para pedir submission en cliente sin hardcodear textos en la vista.
 */
export function resolveStoryNodeSubmissionPrompt(nodeId: string): IStoryNodeSubmissionPrompt | null {
  const config = resolveConfig(nodeId);
  if (!config) return null;
  return {
    title: config.title,
    hint: config.hint,
    placeholder: config.placeholder,
    activationLabel: config.activationLabel,
    generatedCode: config.generatedCode,
    requiredNodeIds: [...config.requiredNodeIds],
  };
}
