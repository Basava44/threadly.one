"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { useHistoryStore } from "../store/useHistoryStore";
import { useFabricCanvas } from "../hooks/useFabricCanvas";
import { STUDIO_PRODUCTS } from "../constants/products";
import ProductSelector from "./ProductSelector";
import PrintAreaSelector from "./PrintAreaSelector";
import Toolbar from "./Toolbar";
import DesignEditor from "./DesignEditor";
import ProductViewer from "./ProductViewer";
import LayerPanel from "./LayerPanel";
import PropertiesPanel from "./PropertiesPanel";
import ExportManager from "./ExportManager";
import MobileEditor from "./MobileEditor";
import { Layers, SlidersHorizontal, Download, ShoppingCart } from "lucide-react";

export default function StudioLayout() {
  const { showLayers, showProperties, toggleLayers, toggleProperties } = useEditorStore();
  const [showExport, setShowExport] = useState(false);
  const [fabricCanvasEl, setFabricCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    addText,
    addShape,
    deleteSelected,
    duplicateSelected,
    loadState,
    getActiveObject,
    updateActiveObject,
    exportDataURL,
    exportJSON,
  } = useFabricCanvas(canvasRef, setFabricCanvasEl);

  const { undo, redo, canUndo, canRedo } = useHistoryStore();

  // Handle undo/redo
  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) loadState(state);
  }, [undo, loadState]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) loadState(state);
  }, [redo, loadState]);

  // Handle export events
  useEffect(() => {
    const handleExport = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === "png") {
        const dataUrl = exportDataURL(4);
        if (dataUrl) downloadFile(dataUrl, "design-print.png");
      } else if (detail.type === "json") {
        const json = exportJSON();
        if (json) {
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          downloadFile(url, "design.json");
          URL.revokeObjectURL(url);
        }
      }
    };

    window.addEventListener("studio:export", handleExport);
    return () => window.removeEventListener("studio:export", handleExport);
  }, [exportDataURL, exportJSON]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Delete" || (e.key === "Backspace" && !(e.target as HTMLElement)?.closest("canvas"))) {
        deleteSelected();
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); handleUndo(); }
        if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); handleRedo(); }
        if (e.key === "d") { e.preventDefault(); duplicateSelected(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected, duplicateSelected, handleUndo, handleRedo]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/10 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 overflow-x-auto">
          <ProductSelector />
          <PrintAreaSelector />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleLayers}
            className={`p-2 rounded-lg transition-colors hidden lg:flex ${showLayers ? "bg-foreground text-cream" : "hover:bg-foreground/5"}`}
            title="Layers"
          >
            <Layers size={18} />
          </button>
          <button
            onClick={toggleProperties}
            className={`p-2 rounded-lg transition-colors hidden lg:flex ${showProperties ? "bg-foreground text-cream" : "hover:bg-foreground/5"}`}
            title="Properties"
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
            title="Export"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left toolbar */}
        <Toolbar
          onAddText={() => addText()}
          onAddShape={addShape}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={deleteSelected}
          onDuplicate={duplicateSelected}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        {/* Center: Editor + 3D Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* 2D Editor */}
          <div className="flex-1 flex items-center justify-center p-4 bg-warm/30 min-h-[250px] lg:min-h-0">
            <DesignEditor canvasRef={canvasRef} />
          </div>

          {/* 3D Preview */}
          <div className="flex-1 flex items-center justify-center p-4 bg-cream min-h-[250px] lg:min-h-0 border-t lg:border-t-0 lg:border-l border-foreground/5">
            <ProductViewer canvasElement={fabricCanvasEl} />
          </div>
        </div>

        {/* Right panels */}
        {(showLayers || showProperties) && (
          <div className="w-64 border-l border-foreground/10 bg-white/50 backdrop-blur-sm overflow-y-auto hidden lg:block">
            {showProperties && (
              <PropertiesPanel
                getActiveObject={getActiveObject}
                updateActiveObject={updateActiveObject}
              />
            )}
            {showLayers && <LayerPanel />}
          </div>
        )}
      </div>

      {/* Export modal */}
      {showExport && <ExportManager onClose={() => setShowExport(false)} />}

      {/* Mobile panels */}
      <MobileEditor getActiveObject={getActiveObject} updateActiveObject={updateActiveObject} />
    </div>
  );
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
