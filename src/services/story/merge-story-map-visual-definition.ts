// src/services/story/merge-story-map-visual-definition.ts - Mezcla el runtime Story con layout visual local editable por acto.
import { IStoryMapNodeRuntime } from "@/services/story/story-map-runtime-data";
import { findStoryVisualNodeDefinition } from "@/services/story/map-definitions/story-map-definition-registry";

/**
 * Añade metadatos de layout visual (posición y dependencia opcional) sin alterar reglas de desbloqueo.
 */
export function mergeStoryMapVisualDefinition(nodes: IStoryMapNodeRuntime[]): IStoryMapNodeRuntime[] {
  return nodes.map((node) => {
    const visualNode = findStoryVisualNodeDefinition(node.id);
    if (!visualNode) return node;
    return {
      ...node,
      unlockRequirementNodeId: visualNode.unlockRequirementNodeId ?? node.unlockRequirementNodeId,
      position: visualNode.position,
    };
  });
}
