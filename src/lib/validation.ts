import { MATERIALS, type Layer, type ResistPosition } from "./materials";
import type { Step } from "./steps";

export type WarningType =
  | "etch-exceeds-material"
  | "etch-no-layers"
  | "etch-no-pattern"
  | "pattern-no-layers"
  | "pattern-overwrites"
  | "deposit-removes-pattern"
  | "pattern-first-step"
  | "etch-first-step"
  | "duplicate-deposit";

export interface StepWarning {
  stepId: string;
  type: WarningType;
  message: string;
  severity: "info" | "warning";
}

export function validateSteps(steps: Step[]): StepWarning[] {
  const warnings: StepWarning[] = [];

  let currentLayers: Layer[] = [];
  let currentResist: ResistPosition = null;
  let leftSurface = 0;
  let rightSurface = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const prevStep = steps[i - 1];

    switch (step.type) {
      case "deposit": {
        // Warning: Depositing removes existing pattern
        if (currentResist !== null) {
          warnings.push({
            stepId: step.id,
            type: "deposit-removes-pattern",
            message: "This deposit will remove the existing resist pattern",
            severity: "info",
          });
        }

        // Warning: Depositing same material back-to-back
        if (
          prevStep?.type === "deposit" &&
          prevStep.material === step.material
        ) {
          warnings.push({
            stepId: step.id,
            type: "duplicate-deposit",
            message: `Back-to-back deposits of ${MATERIALS[step.material].name}`,
            severity: "info",
          });
        }

        // Update state
        const material = MATERIALS[step.material];
        const thickness = step.layers * material.thickness;
        leftSurface += thickness;
        rightSurface += thickness;
        currentLayers.push({
          id: step.id,
          material: step.material,
          leftBottom: leftSurface - thickness,
          leftTop: leftSurface,
          rightBottom: rightSurface - thickness,
          rightTop: rightSurface,
        });
        currentResist = null;
        break;
      }

      case "pattern": {
        // Warning: Pattern as first step
        if (i === 0) {
          warnings.push({
            stepId: step.id,
            type: "pattern-first-step",
            message: "Pattern step has no effect without deposited layers",
            severity: "warning",
          });
        }

        // Warning: No layers to pattern
        if (currentLayers.length === 0 && i > 0) {
          warnings.push({
            stepId: step.id,
            type: "pattern-no-layers",
            message: "No layers to protect - pattern will have no effect",
            severity: "warning",
          });
        }

        // Warning: Pattern overwrites previous pattern
        if (currentResist !== null) {
          warnings.push({
            stepId: step.id,
            type: "pattern-overwrites",
            message: `This pattern will replace the existing resist`,
            severity: "warning",
          });
        }

        // Update state
        currentResist = step.side;
        break;
      }

      case "etch": {
        // Warning: Etch as first step
        if (i === 0) {
          warnings.push({
            stepId: step.id,
            type: "etch-first-step",
            message: "Etch step has no effect without deposited layers",
            severity: "warning",
          });
        }

        // Warning: No layers to etch
        if (currentLayers.length === 0 && i > 0) {
          warnings.push({
            stepId: step.id,
            type: "etch-no-layers",
            message: "No layers to etch",
            severity: "warning",
          });
        }

        // Warning: Etching without pattern (affects both sides)
        if (currentResist === null && currentLayers.length > 0) {
          warnings.push({
            stepId: step.id,
            type: "etch-no-pattern",
            message: "No resist pattern - both sides will be etched equally",
            severity: "info",
          });
        }

        // Warning: Etch time exceeds available material
        if (currentLayers.length > 0) {
          const etchWarning = checkEtchExceedsMaterial(
            currentLayers,
            step.time,
            currentResist,
          );
          if (etchWarning) {
            warnings.push({
              stepId: step.id,
              type: "etch-exceeds-material",
              message: etchWarning,
              severity: "warning",
            });
          }
        }

        // Update state (simplified - just track that etch happened)
        currentResist = null;
        // Recalculate surfaces after etch
        const etchResult = simulateEtch(
          currentLayers,
          step.time,
          currentResist,
        );
        leftSurface = etchResult.leftSurface;
        rightSurface = etchResult.rightSurface;
        currentLayers = etchResult.layers;
        break;
      }
    }
  }

  return warnings;
}

function checkEtchExceedsMaterial(
  layers: Layer[],
  etchTime: number,
  resist: ResistPosition,
): string | null {
  const etchLeft = resist !== "left";
  const etchRight = resist !== "right";

  // Calculate max etch time before hitting substrate
  let maxTimeLeft = 0;
  let maxTimeRight = 0;

  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    const material = MATERIALS[layer.material];

    if (etchLeft) {
      const leftThickness = layer.leftTop - layer.leftBottom;
      maxTimeLeft += leftThickness / material.etchRate;
    }
    if (etchRight) {
      const rightThickness = layer.rightTop - layer.rightBottom;
      maxTimeRight += rightThickness / material.etchRate;
    }
  }

  const maxUsefulTime = Math.max(
    etchLeft ? maxTimeLeft : 0,
    etchRight ? maxTimeRight : 0,
  );

  if (etchTime > maxUsefulTime) {
    return `Etch time exceeds material depth`;
  }

  return null;
}

function simulateEtch(
  layers: Layer[],
  etchTime: number,
  resist: ResistPosition,
): { layers: Layer[]; leftSurface: number; rightSurface: number } {
  // Clone layers to avoid mutation
  const newLayers = layers.map((l) => ({ ...l }));

  const etchLeft = resist !== "left";
  const etchRight = resist !== "right";

  let remainingTimeLeft = etchLeft ? etchTime : 0;
  let remainingTimeRight = etchRight ? etchTime : 0;

  for (let i = newLayers.length - 1; i >= 0; i--) {
    const layer = newLayers[i];
    const material = MATERIALS[layer.material];

    if (remainingTimeLeft > 0 && layer.leftTop > layer.leftBottom) {
      const leftThickness = layer.leftTop - layer.leftBottom;
      const maxEtchAmount = remainingTimeLeft * material.etchRate;
      const actualEtched = Math.min(maxEtchAmount, leftThickness);
      layer.leftTop -= actualEtched;
      remainingTimeLeft -= actualEtched / material.etchRate;
    }

    if (remainingTimeRight > 0 && layer.rightTop > layer.rightBottom) {
      const rightThickness = layer.rightTop - layer.rightBottom;
      const maxEtchAmount = remainingTimeRight * material.etchRate;
      const actualEtched = Math.min(maxEtchAmount, rightThickness);
      layer.rightTop -= actualEtched;
      remainingTimeRight -= actualEtched / material.etchRate;
    }
  }

  // Filter out fully etched layers
  const filteredLayers = newLayers.filter(
    (l) => l.leftTop > l.leftBottom || l.rightTop > l.rightBottom,
  );

  // Calculate new surfaces
  const leftSurface = filteredLayers.reduce(
    (max, l) => Math.max(max, l.leftTop),
    0,
  );
  const rightSurface = filteredLayers.reduce(
    (max, l) => Math.max(max, l.rightTop),
    0,
  );

  return { layers: filteredLayers, leftSurface, rightSurface };
}

// Helper to get warnings for a specific step
export function getWarningsForStep(
  warnings: StepWarning[],
  stepId: string,
): StepWarning[] {
  return warnings.filter((w) => w.stepId === stepId);
}

// Helper to get warning count by severity
export function getWarningCounts(warnings: StepWarning[]): {
  info: number;
  warning: number;
} {
  return warnings.reduce(
    (acc, w) => {
      acc[w.severity]++;
      return acc;
    },
    { info: 0, warning: 0 },
  );
}
