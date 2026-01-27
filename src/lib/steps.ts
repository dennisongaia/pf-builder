import type { Material } from "@/lib/materials";

export type DepositStepInput = {
  type: "deposit";
  material: Material;
  layers: number;
};

export type PatternStepInput = {
  type: "pattern";
  side: "left" | "right";
};

export type EtchStepInput = {
  type: "etch";
  time: number;
};

export type StepInput = DepositStepInput | PatternStepInput | EtchStepInput;

export type DepositStep = DepositStepInput & { id: string };
export type PatternStep = PatternStepInput & { id: string };
export type EtchStep = EtchStepInput & { id: string };

export type Step = DepositStep | PatternStep | EtchStep;
