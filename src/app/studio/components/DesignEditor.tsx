"use client";

import { useRef } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { STUDIO_PRODUCTS } from "../constants/products";

interface DesignEditorProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function DesignEditor({ canvasRef }: DesignEditorProps) {
  const { activeProduct, activeArea } = useEditorStore();
  const productConfig = STUDIO_PRODUCTS[activeProduct];
  const areaConfig = productConfig.areas[activeArea];

  // Scale canvas to fit container (max 450px display)
  const displayScale = Math.min(450 / areaConfig.width, 450 / areaConfig.height);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Area label */}
      <div className="text-xs uppercase tracking-wider text-foreground/50 font-medium">
        {productConfig.label} &mdash; {areaConfig.label}
      </div>

      {/* Canvas container with print area boundary */}
      <div
        className="relative border-2 border-dashed border-foreground/20 rounded-lg bg-white/50 overflow-hidden shadow-sm"
        style={{
          width: areaConfig.width * displayScale,
          height: areaConfig.height * displayScale,
        }}
      >
        <div
          style={{
            transform: `scale(${displayScale})`,
            transformOrigin: "top left",
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Print boundary indicator */}
        <div className="absolute inset-3 border border-foreground/10 rounded pointer-events-none" />
        <div className="absolute top-1.5 left-2 text-[9px] uppercase tracking-wider text-foreground/25 pointer-events-none select-none">
          Safe Area
        </div>
      </div>

      {/* Dimensions */}
      <div className="text-[10px] text-foreground/40 font-mono">
        {areaConfig.width} &times; {areaConfig.height}px
      </div>
    </div>
  );
}
