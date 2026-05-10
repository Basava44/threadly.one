"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { TEXTURE_SYNC_FPS } from "../constants/defaults";

export function useTextureSync(canvasElement: HTMLCanvasElement | null) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const frameIdRef = useRef<number>(0);

  // Create texture from canvas element
  useEffect(() => {
    if (!canvasElement) {
      textureRef.current = null;
      return;
    }

    const texture = new THREE.CanvasTexture(canvasElement);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.needsUpdate = true;
    textureRef.current = texture;

    // Throttled update loop
    const interval = 1000 / TEXTURE_SYNC_FPS;
    let lastTime = 0;

    const update = (time: number) => {
      if (time - lastTime >= interval) {
        if (textureRef.current) {
          textureRef.current.needsUpdate = true;
        }
        lastTime = time;
      }
      frameIdRef.current = requestAnimationFrame(update);
    };

    frameIdRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      texture.dispose();
      textureRef.current = null;
    };
  }, [canvasElement]);

  return textureRef;
}
