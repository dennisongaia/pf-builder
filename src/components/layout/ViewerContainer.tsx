import { CONTENT } from "@/constants/content";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw } from "lucide-react";
import { WaferViewer } from "../three/WaferViewer";
import type { Layer, ResistPosition } from "@/lib/materials";
import { useRef, useState } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

type ViewMode = "side" | "top" | "3d";

interface ViewerContainerProps {
  layers: Layer[];
  resist: ResistPosition;
}

const CAMERA_POSITIONS: Record<ViewMode, [number, number, number]> = {
  side: [12, 0, 0],
  top: [0, 12, 0],
  "3d": [8, 6, 8],
};

export function ViewerContainer({ layers, resist }: ViewerContainerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [cameraKey, setCameraKey] = useState(0);
  const controlsRef = useRef<OrbitControlsType>(null);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleResetCamera = () => {
    setCameraKey((prev) => prev + 1);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-background">
      <div className="flex-none h-12 border-b border-border flex items-center justify-between px-4">
        <div className="w-10 lg:hidden" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {CONTENT.viewer.viewLabel}
          </span>
          <Tabs
            value={viewMode}
            onValueChange={(v) => handleViewChange(v as ViewMode)}
          >
            <TabsList className="h-8">
              <TabsTrigger value="side" className="text-xs px-2 sm:px-3">
                {CONTENT.viewer.views.side}
              </TabsTrigger>
              <TabsTrigger value="top" className="text-xs px-2 sm:px-3">
                {CONTENT.viewer.views.top}
              </TabsTrigger>
              <TabsTrigger value="3d" className="text-xs px-2 sm:px-3">
                {CONTENT.viewer.views.threeD}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleResetCamera}
        >
          <RotateCcw className="h-3 w-3 sm:mr-2" />
          <span className="hidden sm:inline">{CONTENT.viewer.resetCamera}</span>
        </Button>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <WaferViewer
            layers={layers}
            resist={resist}
            cameraPosition={CAMERA_POSITIONS[viewMode]}
            cameraKey={cameraKey}
            controlsRef={controlsRef}
          />
        </div>
      </div>
    </main>
  );
}
