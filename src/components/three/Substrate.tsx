import { memo } from "react";
import { Html } from "@react-three/drei";

interface SubstrateProps {
  width: number;
  depth: number;
}

export const Substrate = memo(function Substrate({
  width,
  depth,
}: SubstrateProps) {
  return (
    <group position={[0, -0.25, 0]}>
      <mesh>
        <boxGeometry args={[width, 0.5, depth]} />
        <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.7} />
      </mesh>

      <Html position={[width / 2 + 0.5, 0, 0]} center zIndexRange={[0, 10]}>
        <div className="bg-background/90 border border-border text-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none">
          Substrate
        </div>
      </Html>
    </group>
  );
});
