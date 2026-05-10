"use client";

import { useEditorStore } from "../store/useEditorStore";
import { STUDIO_PRODUCTS } from "../constants/products";

export default function PrintAreaSelector() {
  const { activeProduct, activeArea, setArea } = useEditorStore();
  const config = STUDIO_PRODUCTS[activeProduct];

  return (
    <div className="flex items-center gap-1 bg-foreground/5 rounded-lg p-0.5">
      {Object.entries(config.areas).map(([key, area]) => (
        <button
          key={key}
          onClick={() => setArea(key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeArea === key
              ? "bg-white text-foreground shadow-sm"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {area.label}
        </button>
      ))}
    </div>
  );
}
