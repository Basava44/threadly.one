"use client";

import { useEditorStore } from "../store/useEditorStore";
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, GripVertical } from "lucide-react";

export default function LayerPanel() {
  const { layers, activeLayerId, setActiveLayer, updateLayer, removeLayer, reorderLayers } = useEditorStore();

  if (layers.length === 0) {
    return (
      <div className="p-4 border-t border-foreground/10">
        <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-3">Layers</h3>
        <p className="text-xs text-foreground/40 text-center py-4">No layers yet. Add text or shapes to begin.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-foreground/10">
      <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-3">
        Layers ({layers.length})
      </h3>
      <div className="flex flex-col gap-1">
        {[...layers].reverse().map((layer, i) => (
          <div
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeLayerId === layer.id
                ? "bg-foreground/10"
                : "hover:bg-foreground/5"
            }`}
          >
            <GripVertical size={12} className="text-foreground/30 cursor-grab" />
            <span className="flex-1 text-xs truncate text-foreground/80">{layer.name}</span>

            <button
              onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
              className="p-0.5 text-foreground/40 hover:text-foreground/70"
              title={layer.visible ? "Hide" : "Show"}
            >
              {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
              className="p-0.5 text-foreground/40 hover:text-foreground/70"
              title={layer.locked ? "Unlock" : "Lock"}
            >
              {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
              className="p-0.5 text-foreground/40 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
