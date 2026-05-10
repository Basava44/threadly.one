"use client";

import { X, Download, FileJson, Camera } from "lucide-react";

interface ExportManagerProps {
  onClose: () => void;
}

export default function ExportManager({ onClose }: ExportManagerProps) {
  const handleExportPNG = () => {
    // Will be connected to useFabricCanvas.exportDataURL
    const event = new CustomEvent("studio:export", { detail: { type: "png" } });
    window.dispatchEvent(event);
  };

  const handleExportJSON = () => {
    const event = new CustomEvent("studio:export", { detail: { type: "json" } });
    window.dispatchEvent(event);
  };

  const handleScreenshot = () => {
    const event = new CustomEvent("studio:export", { detail: { type: "screenshot" } });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <h2 className="text-sm font-semibold text-foreground">Export Design</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-foreground/5">
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="p-5 flex flex-col gap-3">
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-3 p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left"
          >
            <div className="w-9 h-9 bg-foreground/5 rounded-lg flex items-center justify-center">
              <Download size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Print-Ready PNG</p>
              <p className="text-[11px] text-foreground/50">High-resolution export (4x)</p>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-3 p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left"
          >
            <div className="w-9 h-9 bg-foreground/5 rounded-lg flex items-center justify-center">
              <FileJson size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Design JSON</p>
              <p className="text-[11px] text-foreground/50">Save design data for later editing</p>
            </div>
          </button>

          <button
            onClick={handleScreenshot}
            className="flex items-center gap-3 p-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-left"
          >
            <div className="w-9 h-9 bg-foreground/5 rounded-lg flex items-center justify-center">
              <Camera size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">3D Preview Screenshot</p>
              <p className="text-[11px] text-foreground/50">Capture current 3D view as PNG</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
