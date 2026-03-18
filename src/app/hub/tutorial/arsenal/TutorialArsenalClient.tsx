// src/app/hub/tutorial/arsenal/TutorialArsenalClient.tsx - Ejecuta el tutorial de Preparar Deck sobre la UI real de Arsenal con spotlight y guard.
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { HomeDeckBuilderScene } from "@/components/hub/home/HomeDeckBuilderScene";
import { TutorialBigLogDialog } from "@/components/tutorial/flow/TutorialBigLogDialog";
import { TutorialBigLogIntroOverlay } from "@/components/tutorial/flow/TutorialBigLogIntroOverlay";
import { TutorialInteractionGuard } from "@/components/tutorial/flow/TutorialInteractionGuard";
import { TutorialSpotlightOverlay } from "@/components/tutorial/flow/TutorialSpotlightOverlay";
import { useTutorialFlowController } from "@/components/tutorial/flow/useTutorialFlowController";
import { ICollectionCard } from "@/core/entities/home/ICollectionCard";
import { IDeck } from "@/core/entities/home/IDeck";
import { IPlayerCardProgress } from "@/core/entities/progression/IPlayerCardProgress";
import { postTutorialNodeCompletion } from "@/app/hub/tutorial/internal/tutorial-node-progress-client";
import { resolveArsenalTutorialSteps } from "@/services/tutorial/arsenal/resolve-arsenal-tutorial-steps";

interface ITutorialArsenalClientProps {
  playerId: string;
  initialDeck: IDeck;
  collection: ICollectionCard[];
  initialCardProgress: IPlayerCardProgress[];
}

function resolveActionFromClick(target: HTMLElement, currentStepId: string | undefined): string | null {
  if (currentStepId === "arsenal-select-card" && target.closest("[data-tutorial-id='tutorial-home-collection']")) return "SELECT_CARD_DETAIL";
  if (currentStepId === "arsenal-add-deck" && target.closest("[data-tutorial-id='tutorial-home-add-button']")) return "ADD_CARD_TO_DECK";
  if (currentStepId === "arsenal-open-evolve" && target.closest("[data-tutorial-id='tutorial-home-evolve-button']")) return "OPEN_EVOLVE_PANEL";
  return null;
}

export function TutorialArsenalClient(props: ITutorialArsenalClientProps) {
  const steps = useMemo(() => resolveArsenalTutorialSteps(), []);
  const tutorial = useTutorialFlowController(steps);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const hasSyncedCompletionRef = useRef(false);

  useEffect(() => {
    if (isIntroVisible) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!target) return;
      const actionId = resolveActionFromClick(target, tutorial.currentStep?.id);
      if (actionId) tutorial.onAction(actionId);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [isIntroVisible, tutorial]);

  useEffect(() => {
    if (!tutorial.isFinished || hasSyncedCompletionRef.current) return;
    hasSyncedCompletionRef.current = true;
    postTutorialNodeCompletion("tutorial-arsenal-basics").catch(() => {
      hasSyncedCompletionRef.current = false;
    });
  }, [tutorial.isFinished]);

  return (
    <>
      <HomeDeckBuilderScene
        playerId={props.playerId}
        initialDeck={props.initialDeck}
        collection={props.collection}
        initialCardProgress={props.initialCardProgress}
      />
      <TutorialInteractionGuard
        isEnabled={isIntroVisible || !tutorial.isFinished}
        allowedTargetIds={isIntroVisible ? [] : tutorial.allowedTargetIds}
      />
      <TutorialSpotlightOverlay
        isVisible={!isIntroVisible && !tutorial.isFinished}
        targetId={tutorial.currentStep?.targetId ?? null}
      />
      <TutorialBigLogIntroOverlay
        isVisible={isIntroVisible}
        title="Preparar Deck"
        description="En este nodo aprenderás a leer detalle, añadir cartas al deck y entender cómo funciona la evolución dentro del Arsenal real."
        onStart={() => setIsIntroVisible(false)}
      />
      {!isIntroVisible ? (
        <TutorialBigLogDialog
          title={tutorial.currentStep?.title ?? "Nodo completado"}
          description={tutorial.currentStep?.description ?? "Has completado Preparar Deck. Ya puedes volver al mapa y continuar con el siguiente nodo."}
          canUseNext={tutorial.canUseNext}
          isFinished={tutorial.isFinished}
          onNext={tutorial.onNext}
        />
      ) : null}
    </>
  );
}
