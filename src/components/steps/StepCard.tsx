import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  GripVertical,
  X,
  Layers,
  Shield,
  CircleX,
  Pencil,
  AlertTriangle,
  Info,
} from "lucide-react";
import { MATERIALS, type Material } from "@/lib/materials";
import { CONTENT } from "@/constants/content";
import type { Step } from "@/lib/steps";
import { EditStepDialog } from "./EditStepDialog";
import type { StepWarning } from "@/lib/validation";

interface StepCardProps {
  step: Step;
  index: number;
  warnings: StepWarning[];
  onDelete: () => void;
  onUpdateDeposit: (updates: { material?: Material; layers?: number }) => void;
  onUpdatePattern: (updates: { side?: "left" | "right" }) => void;
  onUpdateEtch: (updates: { time?: number }) => void;
}

export function StepCard({
  step,
  index,
  warnings,
  onDelete,
  onUpdateDeposit,
  onUpdatePattern,
  onUpdateEtch,
}: StepCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const getStepDetails = () => {
    switch (step.type) {
      case "deposit": {
        const material = MATERIALS[step.material];
        const thickness = step.layers * material.thickness;
        return {
          icon: (
            <Layers className="h-4 w-4" style={{ color: material.color }} />
          ),
          title: CONTENT.steps.deposit,
          subtitle: `${material.name} • ${step.layers} layers`,
          result: `${thickness.toFixed(1)} nm`,
        };
      }
      case "pattern": {
        return {
          icon: <Shield className="h-4 w-4 text-yellow-500" />,
          title:
            step.side === "left"
              ? CONTENT.steps.patternLeft
              : CONTENT.steps.patternRight,
          subtitle: `Protect ${step.side} side`,
          result: `Resist applied`,
        };
      }
      case "etch": {
        return {
          icon: <CircleX className="h-4 w-4 text-red-500" />,
          title: CONTENT.steps.etch,
          subtitle: `${step.time} seconds`,
          result: `Etch unprotected`,
        };
      }
    }
  };

  const { icon, title, subtitle, result } = getStepDetails();

  const hasWarning = warnings.some((w) => w.severity === "warning");

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`group ${isDragging ? "shadow-lg ring-2 ring-primary" : ""} ${
          hasWarning ? "border-yellow-500/50" : ""
        }`}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                {...attributes}
                {...listeners}
                className="text-muted-foreground cursor-grab hover:text-foreground transition-colors touch-none"
              >
                <GripVertical className="h-4 w-4" />
              </span>
              {icon}
              <div className="min-w-0">
                <div className="text-sm font-medium flex items-center gap-1.5">
                  {index + 1}. {title}
                  {warnings.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {hasWarning ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                            ) : (
                              <Info className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <ul className="space-y-1">
                            {warnings.map((warning, i) => (
                              <li
                                key={i}
                                className={`text-xs flex items-start gap-1.5 ${
                                  warning.severity === "warning"
                                    ? "text-yellow-400 dark:text-yellow-600"
                                    : "text-blue-400 dark:text-blue-600"
                                }`}
                              >
                                {warning.severity === "warning" ? (
                                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-none" />
                                ) : (
                                  <Info className="h-3 w-3 mt-0.5 flex-none" />
                                )}
                                {warning.message}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-destructive"
                onClick={onDelete}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="mt-2 text-xs text-muted-foreground bg-muted rounded px-2 py-1 ml-6">
            {result}
          </div>
        </CardContent>
      </Card>

      <EditStepDialog
        step={step}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdateDeposit={onUpdateDeposit}
        onUpdatePattern={onUpdatePattern}
        onUpdateEtch={onUpdateEtch}
      />
    </>
  );
}
