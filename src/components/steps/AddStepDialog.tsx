import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { CONTENT } from "@/constants/content";
import type { Material } from "@/lib/materials";
import type { StepInput } from "@/lib/steps";

interface AddStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStep: (step: StepInput) => void;
}

export function AddStepDialog({
  open,
  onOpenChange,
  onAddStep,
}: AddStepDialogProps) {
  const [stepType, setStepType] = useState<"deposit" | "pattern" | "etch">(
    "deposit",
  );
  const [material, setMaterial] = useState<Material>("A");
  const [layers, setLayers] = useState(10);
  const [side, setSide] = useState<"left" | "right">("left");
  const [duration, setDuration] = useState(10);

  const handleSubmit = () => {
    let step: StepInput;

    switch (stepType) {
      case "deposit":
        step = { type: "deposit", material, layers };
        break;
      case "pattern":
        step = { type: "pattern", side };
        break;
      case "etch":
        step = { type: "etch", time: duration };
        break;
    }

    onAddStep(step);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          {CONTENT.sidebar.addStep}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTENT.sidebar.addStep}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{CONTENT.steps.stepType}</Label>
            <Select
              value={stepType}
              onValueChange={(v) => setStepType(v as typeof stepType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">{CONTENT.steps.deposit}</SelectItem>
                <SelectItem value="pattern">{CONTENT.steps.pattern}</SelectItem>
                <SelectItem value="etch">{CONTENT.steps.etch}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {stepType === "deposit" && (
            <>
              <div className="space-y-2">
                <Label>{CONTENT.material.material}</Label>
                <Select
                  value={material}
                  onValueChange={(v) => setMaterial(v as Material)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">
                      {CONTENT.material.materialA}
                    </SelectItem>
                    <SelectItem value="B">
                      {CONTENT.material.materialB}
                    </SelectItem>
                    <SelectItem value="C">
                      {CONTENT.material.materialC}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{CONTENT.material.layers}</Label>
                <Input
                  type="number"
                  min={1}
                  value={layers}
                  onChange={(e) => setLayers(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {stepType === "pattern" && (
            <div className="space-y-2">
              <Label>{CONTENT.steps.pattern}</Label>
              <Select
                value={side}
                onValueChange={(v) => setSide(v as "left" | "right")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">
                    {CONTENT.steps.patternLeft}
                  </SelectItem>
                  <SelectItem value="right">
                    {CONTENT.steps.patternRight}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {stepType === "etch" && (
            <div className="space-y-2">
              <Label>{CONTENT.steps.duration}</Label>
              <Input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            {CONTENT.sidebar.addStep}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
