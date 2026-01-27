import type { Step, StepInput } from "@/lib/steps";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { Material } from "@/lib/materials";

interface LayoutProps {
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

export function Layout({
  steps,
  onAddStep,
  onDeleteStep,
  onReorderSteps,
  onUpdateDeposit,
  onUpdatePattern,
  onUpdateEtch,
}: LayoutProps) {
  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          steps={steps}
          onAddStep={onAddStep}
          onDeleteStep={onDeleteStep}
          onReorderSteps={onReorderSteps}
          onUpdateDeposit={onUpdateDeposit}
          onUpdatePattern={onUpdatePattern}
          onUpdateEtch={onUpdateEtch}
        />
      </div>
    </div>
  );
}
