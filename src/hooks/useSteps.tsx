import { useState, useMemo, useCallback } from "react";
import {
  type Layer,
  type Material,
  type ResistPosition,
  MATERIALS,
} from "@/lib/materials";
import type { Step, DepositStep, EtchStep, StepInput } from "@/lib/steps";
import { validateSteps } from "@/lib/validation";

interface FlowState {
  layers: Layer[];
  resist: ResistPosition;
}

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>([]);

  const { layers, resist } = useMemo(() => {
    return handleFlowState(steps);
  }, [steps]);

  const warnings = useMemo(() => {
    return validateSteps(steps);
  }, [steps]);

  const addStep = useCallback((step: StepInput) => {
    const id = crypto.randomUUID();
    setSteps((prev) => [...prev, { ...step, id }]);
  }, []);

  const deleteStep = useCallback((id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorderSteps = useCallback((newSteps: Step[]) => {
    setSteps(newSteps);
  }, []);

  const updateDepositStep = useCallback(
    (
      id: string,
      updates: {
        material?: Material;
        layers?: number;
      },
    ) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === id && s.type === "deposit" ? { ...s, ...updates } : s,
        ),
      );
    },
    [],
  );

  const updatePatternStep = useCallback(
    (id: string, updates: { side?: "left" | "right" }) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === id && s.type === "pattern" ? { ...s, ...updates } : s,
        ),
      );
    },
    [],
  );

  const updateEtchStep = useCallback(
    (id: string, updates: { time?: number }) => {
      setSteps((prev) =>
        prev.map((s) =>
          s.id === id && s.type === "etch" ? { ...s, ...updates } : s,
        ),
      );
    },
    [],
  );

  const clearSteps = useCallback(() => {
    setSteps([]);
  }, []);

  return {
    steps,
    layers,
    resist,
    warnings,
    addStep,
    deleteStep,
    reorderSteps,
    updateDepositStep,
    updatePatternStep,
    updateEtchStep,
    clearSteps,
  };
}

function handleFlowState(steps: Step[]): FlowState {
  const layers: Layer[] = [];
  let resist: ResistPosition = null;

  let leftSurface = 0;
  let rightSurface = 0;

  for (const step of steps) {
    switch (step.type) {
      case "deposit":
        handleDeposit(layers, step, leftSurface, rightSurface);

        const material = MATERIALS[step.material];
        const depositThickness = step.layers * material.thickness;
        leftSurface += depositThickness;
        rightSurface += depositThickness;
        resist = null;
        break;

      case "pattern":
        resist = step.side;
        break;

      case "etch":
        const result = handleEtch(
          layers,
          step,
          resist,
          leftSurface,
          rightSurface,
        );
        leftSurface = result.leftSurface;
        rightSurface = result.rightSurface;
        resist = null;
        break;
    }
  }

  const filteredLayers = layers.filter(
    (l) => l.leftTop > l.leftBottom || l.rightTop > l.rightBottom,
  );

  return { layers: filteredLayers, resist };
}

function handleDeposit(
  layers: Layer[],
  step: DepositStep,
  leftSurface: number,
  rightSurface: number,
) {
  const material = MATERIALS[step.material];
  const thickness = step.layers * material.thickness;

  layers.push({
    id: crypto.randomUUID(),
    material: step.material,
    leftBottom: leftSurface,
    leftTop: leftSurface + thickness,
    rightBottom: rightSurface,
    rightTop: rightSurface + thickness,
  });
}

function handleEtch(
  layers: Layer[],
  step: EtchStep,
  resist: ResistPosition,
  leftSurface: number,
  rightSurface: number,
) {
  const etchLeft = resist !== "left";
  const etchRight = resist !== "right";

  let remainingTimeLeft = etchLeft ? step.time : 0;
  let remainingTimeRight = etchRight ? step.time : 0;

  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const material = MATERIALS[layer.material];

    if (remainingTimeLeft > 0 && layer.leftTop > layer.leftBottom) {
      const leftThickness = layer.leftTop - layer.leftBottom;
      const maxEtchAmount = remainingTimeLeft * material.etchRate;
      const actualEtched = Math.min(maxEtchAmount, leftThickness);

      layer.leftTop -= actualEtched;
      leftSurface -= actualEtched;
      remainingTimeLeft -= actualEtched / material.etchRate;
    }

    if (remainingTimeRight > 0 && layer.rightTop > layer.rightBottom) {
      const rightThickness = layer.rightTop - layer.rightBottom;
      const maxEtchAmount = remainingTimeRight * material.etchRate;
      const actualEtched = Math.min(maxEtchAmount, rightThickness);

      layer.rightTop -= actualEtched;
      rightSurface -= actualEtched;
      remainingTimeRight -= actualEtched / material.etchRate;
    }

    if (remainingTimeLeft <= 0 && remainingTimeRight <= 0) {
      break;
    }
  }

  return { leftSurface, rightSurface };
}
