import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { MATERIALS, type Material } from "@/lib/materials";
import type { Step } from "@/lib/steps";

interface EditStepDialogProps {
  step: Step;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateDeposit: (updates: { material?: Material; layers?: number }) => void;
  onUpdatePattern: (updates: { side?: "left" | "right" }) => void;
  onUpdateEtch: (updates: { time?: number }) => void;
}

export function EditStepDialog({
  step,
  open,
  onOpenChange,
  onUpdateDeposit,
  onUpdatePattern,
  onUpdateEtch,
}: EditStepDialogProps) {
  const [material, setMaterial] = useState<Material>("A");
  const [layers, setLayers] = useState(10);
  const [side, setSide] = useState<"left" | "right">("left");
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (open) {
      switch (step.type) {
        case "deposit":
          setMaterial(step.material);
          setLayers(step.layers);
          break;
        case "pattern":
          setSide(step.side);
          break;
        case "etch":
          setTime(step.time);
          break;
      }
    }
  }, [open, step]);

  const handleSave = () => {
    switch (step.type) {
      case "deposit":
        onUpdateDeposit({ material, layers });
        break;
      case "pattern":
        onUpdatePattern({ side });
        break;
      case "etch":
        onUpdateEtch({ time });
        break;
    }
    onOpenChange(false);
  };

  const renderFields = () => {
    switch (step.type) {
      case "deposit":
        return (
          <>
            <div className="space-y-2">
              <Label>Material</Label>
              <Select
                value={material}
                onValueChange={(v) => setMaterial(v as Material)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MATERIALS).map(([key, mat]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mat.color }}
                        />
                        {mat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Layers</Label>
              <Input
                type="number"
                min={1}
                value={layers}
                onChange={(e) => setLayers(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Thickness: {(layers * MATERIALS[material].thickness).toFixed(1)}{" "}
                nm
              </p>
            </div>
          </>
        );

      case "pattern":
        return (
          <div className="space-y-2">
            <Label>Protect Side</Label>
            <Select
              value={side}
              onValueChange={(v) => setSide(v as "left" | "right")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "etch":
        return (
          <div className="space-y-2">
            <Label>Duration (seconds)</Label>
            <Input
              type="number"
              min={1}
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (step.type) {
      case "deposit":
        return "Edit Deposit Step";
      case "pattern":
        return "Edit Pattern Step";
      case "etch":
        return "Edit Etch Step";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">{renderFields()}</div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
