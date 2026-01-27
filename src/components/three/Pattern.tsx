import { Html } from "@react-three/drei";

interface PatternProps {
  side: "left" | "right";
  yPosition: number;
  waferWidth: number;
  waferDepth: number;
}

export function Pattern({
  side,
  yPosition,
  waferWidth,
  waferDepth,
}: PatternProps) {
  const halfWidth = waferWidth / 2;
  const xPosition = side === "left" ? -halfWidth / 2 : halfWidth / 2;
  const indicatorHeight = 0.05;

  return (
    <group position={[xPosition, yPosition + indicatorHeight / 2, 0]}>
      <mesh>
        <boxGeometry args={[halfWidth, indicatorHeight, waferDepth]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.4} />
      </mesh>

      <Html
        position={[
          side === "left" ? -halfWidth / 2 - 0.3 : halfWidth / 2 + 0.3,
          0,
          0,
        ]}
        zIndexRange={[0, 10]}
      >
        <div className="bg-yellow-500/90 text-black text-xs px-2 py-0.5 rounded whitespace-nowrap font-medium">
          Resist ({side})
        </div>
      </Html>
    </group>
  );
}
