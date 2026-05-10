"use client";

import { useState } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { Layers, SlidersHorizontal, ChevronUp } from "lucide-react";
import LayerPanel from "./LayerPanel";
import PropertiesPanel from "./PropertiesPanel";

interface MobileEditorProps {
  getActiveObject: () => any;
  updateActiveObject: (props: Record<string, any>) => void;
}

export default function MobileEditor({ getActiveObject, updateActiveObject }: MobileEditorProps) {
  const [activeSheet, setActiveSheet] = useState<"layers" | "properties" | null>(null);
  const { activeLayerId } = useEditorStore();

  return (
    <>
      {/* Bottom tab bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-foreground/10 flex items-center justify-around py-2 px-4 lg:hidden z-40">
        <button
          onClick={() => setActiveSheet(activeSheet === "properties" ? null : "properties")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            activeSheet === "properties" ? "bg-foreground/10" : ""
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="text-[9px] uppercase tracking-wider">Properties</span>
        </button>
        <button
          onClick={() => setActiveSheet(activeSheet === "layers" ? null : "layers")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
            activeSheet === "layers" ? "bg-foreground/10" : ""
          }`}
        >
          <Layers size={18} />
          <span className="text-[9px] uppercase tracking-wider">Layers</span>
        </button>
      </div>

      {/* Slide-up sheet */}
      {activeSheet && (
        <div className="fixed bottom-12 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-foreground/10 max-h-[50vh] overflow-y-auto z-30 lg:hidden">
          <div className="flex items-center justify-center pt-2 pb-1">
            <button
              onClick={() => setActiveSheet(null)}
              className="w-8 h-1 bg-foreground/20 rounded-full"
            />
          </div>
          {activeSheet === "properties" && (
            <PropertiesPanel getActiveObject={getActiveObject} updateActiveObject={updateActiveObject} />
          )}
          {activeSheet === "layers" && <LayerPanel />}
        </div>
      )}
    </>
  );
}
