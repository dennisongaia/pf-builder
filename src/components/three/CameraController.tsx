import { useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

interface CameraControllerProps {
  position: [number, number, number];
  cameraKey: number;
  controlsRef: RefObject<OrbitControlsType | null>;
}

export function CameraController({
  position,
  cameraKey,
  controlsRef,
}: CameraControllerProps) {
  const { camera } = useThree();
  const lastPosition = useRef<string>(position.join(","));
  const lastCameraKey = useRef<number>(cameraKey);

  useEffect(() => {
    const positionKey = position.join(",");
    const positionChanged = positionKey !== lastPosition.current;
    const resetTriggered = cameraKey !== lastCameraKey.current;

    if (positionChanged || resetTriggered) {
      lastPosition.current = positionKey;
      lastCameraKey.current = cameraKey;

      camera.position.set(...position);
      camera.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [position, cameraKey, controlsRef, camera]);

  return null;
}
