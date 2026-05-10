"use client";

import { useEditorStore } from "../store/useEditorStore";
import { STUDIO_PRODUCTS, StudioProduct } from "../constants/products";

export default function ProductSelector() {
  const { activeProduct, setProduct, productColor, setProductColor } = useEditorStore();
  const config = STUDIO_PRODUCTS[activeProduct];

  return (
    <div className="flex items-center gap-3">
      {/* Product tabs */}
      <div className="flex items-center bg-foreground/5 rounded-lg p-0.5">
        {(Object.keys(STUDIO_PRODUCTS) as StudioProduct[]).map((key) => (
          <button
            key={key}
            onClick={() => setProduct(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeProduct === key
                ? "bg-white text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {STUDIO_PRODUCTS[key].label}
          </button>
        ))}
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1.5 ml-2">
        {config.colors.map((color) => (
          <button
            key={color}
            onClick={() => setProductColor(color)}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              productColor === color ? "border-foreground scale-110" : "border-foreground/20 hover:border-foreground/40"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
