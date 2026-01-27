import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CONTENT } from "@/constants/content";
import type { Step } from "@/lib/steps";
import type { Material } from "@/lib/materials";
import { StepCard } from "./StepCard";

interface StepListProps {
  steps: Step[];
  onDelete: (id: string) => void;
  onReorder: (steps: Step[]) => void;
  onUpdateDeposit: (
    id: string,
    updates: { material?: Material; layers?: number },
  ) => void;
  onUpdatePattern: (id: string, updates: { side?: "left" | "right" }) => void;
  onUpdateEtch: (id: string, updates: { time?: number }) => void;
}

export function StepList({
  steps,
  onDelete,
  onReorder,
  onUpdateDeposit,
  onUpdatePattern,
  onUpdateEtch,
}: StepListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((s) => s.id === active.id);
      const newIndex = steps.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(steps, oldIndex, newIndex));
    }
  };

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
        <span>{CONTENT.sidebar.emptyState.title}</span>
        <span className="text-xs mt-1">
          {CONTENT.sidebar.emptyState.description}
        </span>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={steps.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              onDelete={() => onDelete(step.id)}
              onUpdateDeposit={(updates) => onUpdateDeposit(step.id, updates)}
              onUpdatePattern={(updates) => onUpdatePattern(step.id, updates)}
              onUpdateEtch={(updates) => onUpdateEtch(step.id, updates)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
