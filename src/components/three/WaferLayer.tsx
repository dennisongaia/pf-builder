import { memo } from "react";
import { Html } from "@react-three/drei";
import { MATERIALS, type Layer } from "@/lib/materials";

interface WaferLayerProps {
  layer: Layer;
  waferWidth: number;
  waferDepth: number;
  scale: number;
}

export const WaferLayer = memo(function WaferLayer({
  layer,
  waferWidth,
  waferDepth,
  scale,
}: WaferLayerProps) {
  const material = MATERIALS[layer.material];
  const halfWidth = waferWidth / 2;

  const leftBottom = layer.leftBottom * scale;
  const leftTop = layer.leftTop * scale;
  const rightBottom = layer.rightBottom * scale;
  const rightTop = layer.rightTop * scale;

  const leftHeight = leftTop - leftBottom;
  const rightHeight = rightTop - rightBottom;

  const leftThickness = layer.leftTop - layer.leftBottom;
  const rightThickness = layer.rightTop - layer.rightBottom;

  const hasLeft = leftHeight > 0;
  const hasRight = rightHeight > 0;
  const isUniform =
    leftThickness === rightThickness && layer.leftBottom === layer.rightBottom;

  const labelY = Math.max(leftTop, rightTop);
  const labelX = waferWidth / 2 + 0.5;

  return (
    <group>
      {hasLeft && (
        <mesh position={[-halfWidth / 2, leftBottom + leftHeight / 2, 0]}>
          <boxGeometry args={[halfWidth, leftHeight, waferDepth]} />
          <meshStandardMaterial
            color={material.color}
            metalness={material.metalness}
            roughness={material.roughness}
          />
        </mesh>
      )}

      {hasRight && (
        <mesh position={[halfWidth / 2, rightBottom + rightHeight / 2, 0]}>
          <boxGeometry args={[halfWidth, rightHeight, waferDepth]} />
          <meshStandardMaterial
            color={material.color}
            metalness={material.metalness}
            roughness={material.roughness}
          />
        </mesh>
      )}

      <Html
        position={[labelX, labelY - leftHeight / 2, 0]}
        center
        zIndexRange={[0, 10]} // Low z-index range
      >
        <div className="bg-background/90 border border-border text-foreground text-xs px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full flex-none"
            style={{ backgroundColor: material.color }}
          />
          <span className="font-semibold">{material.name}</span>
          {isUniform ? (
            <span className="text-muted-foreground">
              {leftThickness.toFixed(1)} nm
            </span>
          ) : (
            <span className="text-muted-foreground">
              L: {leftThickness.toFixed(1)} nm / R: {rightThickness.toFixed(1)}{" "}
              nm
            </span>
          )}
        </div>
      </Html>
    </group>
  );
});
