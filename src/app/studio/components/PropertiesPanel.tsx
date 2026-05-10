"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { STUDIO_FONTS } from "../constants/fonts";

interface PropertiesPanelProps {
  getActiveObject: () => any;
  updateActiveObject: (props: Record<string, any>) => void;
}

export default function PropertiesPanel({ getActiveObject, updateActiveObject }: PropertiesPanelProps) {
  const { activeLayerId, layers } = useEditorStore();
  const [refreshKey, setRefreshKey] = useState(0);

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  // Refresh panel when selection changes
  useEffect(() => {
    setRefreshKey((k) => k + 1);
  }, [activeLayerId]);

  if (!activeLayer) {
    return (
      <div className="p-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-3">Properties</h3>
        <p className="text-xs text-foreground/40 text-center py-6">Select an element to edit properties.</p>
      </div>
    );
  }

  return (
    <div className="p-4" key={refreshKey}>
      <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-3">Properties</h3>

      {activeLayer.type === "text" && (
        <TextProperties getActiveObject={getActiveObject} updateActiveObject={updateActiveObject} />
      )}
      {activeLayer.type === "shape" && (
        <ShapeProperties getActiveObject={getActiveObject} updateActiveObject={updateActiveObject} />
      )}

      {/* Common: Opacity */}
      <div className="mt-4 pt-4 border-t border-foreground/10">
        <PropRange
          label="Opacity"
          min={0} max={1} step={0.05}
          getDefault={() => getActiveObject()?.opacity ?? 1}
          onChange={(v) => updateActiveObject({ opacity: v })}
        />
      </div>
    </div>
  );
}

function TextProperties({ getActiveObject, updateActiveObject }: { getActiveObject: () => any; updateActiveObject: (p: Record<string, any>) => void }) {
  const obj = getActiveObject();

  return (
    <div className="flex flex-col gap-3">
      {/* Font */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Font</label>
        <select
          defaultValue={obj?.fontFamily || STUDIO_FONTS[0].family}
          onChange={(e) => updateActiveObject({ fontFamily: e.target.value })}
          className="w-full text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {STUDIO_FONTS.map((font) => (
            <option key={font.name} value={font.family}>{font.name}</option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Size</label>
        <input
          type="number"
          min={8} max={200}
          defaultValue={obj?.fontSize || 40}
          onChange={(e) => updateActiveObject({ fontSize: parseInt(e.target.value) || 40 })}
          className="w-full text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>

      {/* Weight */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Weight</label>
        <select
          defaultValue={obj?.fontWeight || "400"}
          onChange={(e) => updateActiveObject({ fontWeight: parseInt(e.target.value) })}
          className="w-full text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
          <option value="800">Extra Bold</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            defaultValue={obj?.fill || "#FFFFFF"}
            onChange={(e) => updateActiveObject({ fill: e.target.value })}
            className="w-8 h-8 rounded border border-foreground/10 cursor-pointer"
          />
          <input
            type="text"
            defaultValue={obj?.fill || "#FFFFFF"}
            onBlur={(e) => updateActiveObject({ fill: e.target.value })}
            className="flex-1 text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20 font-mono"
          />
        </div>
      </div>

      {/* Letter Spacing */}
      <PropRange
        label="Letter Spacing"
        min={-100} max={500} step={10}
        getDefault={() => obj?.charSpacing ?? 0}
        onChange={(v) => updateActiveObject({ charSpacing: v })}
      />

      {/* Alignment */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Align</label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => updateActiveObject({ textAlign: align })}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors capitalize ${
                obj?.textAlign === align ? "bg-foreground text-cream" : "bg-foreground/5 hover:bg-foreground/10"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShapeProperties({ getActiveObject, updateActiveObject }: { getActiveObject: () => any; updateActiveObject: (p: Record<string, any>) => void }) {
  const obj = getActiveObject();

  return (
    <div className="flex flex-col gap-3">
      {/* Fill */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Fill Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            defaultValue={obj?.fill || "#FFFFFF"}
            onChange={(e) => updateActiveObject({ fill: e.target.value })}
            className="w-8 h-8 rounded border border-foreground/10 cursor-pointer"
          />
          <input
            type="text"
            defaultValue={obj?.fill || "#FFFFFF"}
            onBlur={(e) => updateActiveObject({ fill: e.target.value })}
            className="flex-1 text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20 font-mono"
          />
        </div>
      </div>

      {/* Stroke */}
      <div>
        <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">Stroke</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            defaultValue={obj?.stroke || "#000000"}
            onChange={(e) => updateActiveObject({ stroke: e.target.value })}
            className="w-8 h-8 rounded border border-foreground/10 cursor-pointer"
          />
          <input
            type="number"
            min={0} max={20}
            defaultValue={obj?.strokeWidth || 0}
            onChange={(e) => updateActiveObject({ strokeWidth: parseInt(e.target.value) || 0 })}
            placeholder="Width"
            className="flex-1 text-xs bg-foreground/5 border border-foreground/10 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>
    </div>
  );
}

function PropRange({
  label,
  min,
  max,
  step,
  getDefault,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  getDefault: () => number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-foreground/50 block mb-1.5">{label}</label>
      <input
        type="range"
        min={min} max={max} step={step}
        defaultValue={getDefault()}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-foreground/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
      />
    </div>
  );
}
