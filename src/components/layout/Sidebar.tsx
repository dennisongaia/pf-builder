import { CONTENT } from "@/constants/content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import type { Step, StepInput } from "@/lib/steps";
import { useState } from "react";
import type { Material } from "@/lib/materials";
import { AddStepDialog } from "../steps/AddStepDialog";
import { StepList } from "../steps/StepList";

interface SidebarProps {
  steps: Step[];
  onAddStep: (step: StepInput) => void;
  onDeleteStep: (id: string) => void;
  onReorderSteps: (steps: Step[]) => void;
  onUpdateDeposit: (
    id: string,
    updates: { material?: Material; layers?: number },
  ) => void;
  onUpdatePattern: (id: string, updates: { side?: "left" | "right" }) => void;
  onUpdateEtch: (id: string, updates: { time?: number }) => void;
}

function SidebarContent({
  steps,
  onAddStep,
  onDeleteStep,
  onReorderSteps,
  onUpdateDeposit,
  onUpdatePattern,
  onUpdateEtch,
}: SidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <div className="flex-none p-4 border-b border-border flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">
          {CONTENT.sidebar.title}
        </h2>
        <AddStepDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAddStep={(step) => {
            onAddStep(step);
            setDialogOpen(false);
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <StepList
          steps={steps}
          onDelete={onDeleteStep}
          onReorder={onReorderSteps}
          onUpdateDeposit={onUpdateDeposit}
          onUpdatePattern={onUpdatePattern}
          onUpdateEtch={onUpdateEtch}
        />
      </div>

      <div className="flex-none p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground">
          {CONTENT.sidebar.summary.totalSteps}: {steps.length}
        </div>
      </div>
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      <div className="lg:hidden absolute top-16 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <SheetHeader className="sr-only">
              <SheetTitle>{CONTENT.sidebar.title}</SheetTitle>
            </SheetHeader>
            <SidebarContent {...props} />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:flex w-80 flex-none border-r border-border flex-col bg-background">
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
