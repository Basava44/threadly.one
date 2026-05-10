"use client";

import { useEffect } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "../store/useEditorStore";
import { constrainToBounds } from "../utils/printAreas";

// Attach boundary enforcement to canvas objects
export function usePrintBounds(fabricRef: React.MutableRefObject<fabric.Canvas | null>) {
  const { activeProduct, activeArea } = useEditorStore();

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleMoving = (e: any) => {
      const obj = e.target;
      if (!obj) return;

      const bounded = obj.getBoundingRect();
      const constrained = constrainToBounds(
        { left: obj.left, top: obj.top, width: bounded.width, height: bounded.height },
        activeProduct,
        activeArea
      );

      obj.set({ left: constrained.left, top: constrained.top });
    };

    canvas.on("object:moving", handleMoving);

    return () => {
      canvas.off("object:moving", handleMoving);
    };
  }, [fabricRef, activeProduct, activeArea]);
}
