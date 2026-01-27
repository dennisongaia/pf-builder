import { memo, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Layer, ResistPosition } from "@/lib/materials";
import { WaferLayer } from "./WaferLayer";
import { Pattern } from "./Pattern";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { CameraController } from "./CameraController";
import { Substrate } from "./Substrate";

interface WaferViewerProps {
  layers: Layer[];
  resist: ResistPosition;
  cameraPosition: [number, number, number];
  cameraKey: number;
  controlsRef: RefObject<OrbitControlsType | null>;
}

const WAFER_WIDTH = 4;
const WAFER_DEPTH = 4;
const NM_SCALE = 0.1; //larger to accomodate label

export const WaferViewer = memo(function WaferViewer({
  layers,
  resist,
  cameraPosition,
  cameraKey,
  controlsRef,
}: WaferViewerProps) {
  const leftSurfaceHeight = layers.reduce((max, layer) => {
    return Math.max(max, layer.leftTop);
  }, 0);

  const rightSurfaceHeight = layers.reduce((max, layer) => {
    return Math.max(max, layer.rightTop);
  }, 0);

  const resistYPosition =
    resist === "left"
      ? leftSurfaceHeight * NM_SCALE
      : rightSurfaceHeight * NM_SCALE;

  return (
    <Canvas
      camera={{
        position: cameraPosition,
        fov: 50,
      }}
      className="w-full h-full"
    >
      <CameraController
        position={cameraPosition}
        cameraKey={cameraKey}
        controlsRef={controlsRef}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.4} />
      <directionalLight position={[0, -5, 5]} intensity={0.3} />
      <Substrate width={WAFER_WIDTH} depth={WAFER_DEPTH} />
      {layers.map((layer) => (
        <WaferLayer
          key={layer.id}
          layer={layer}
          waferWidth={WAFER_WIDTH}
          waferDepth={WAFER_DEPTH}
          scale={NM_SCALE}
        />
      ))}
      {resist && (
        <Pattern
          side={resist}
          yPosition={resistYPosition}
          waferWidth={WAFER_WIDTH}
          waferDepth={WAFER_DEPTH}
        />
      )}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={100}
      />
      <gridHelper args={[10, 10, "#444", "#333"]} position={[0, -0.5, 0]} />
    </Canvas>
  );
});
