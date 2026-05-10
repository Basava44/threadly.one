"use client";

import { useRef, useEffect, useCallback } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "../store/useEditorStore";
import { useHistoryStore } from "../store/useHistoryStore";
import { STUDIO_PRODUCTS } from "../constants/products";
import { DEFAULT_TEXT_OPTIONS, HISTORY_DEBOUNCE_MS } from "../constants/defaults";
import { DEFAULT_FONT } from "../constants/fonts";

export function useFabricCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onCanvasReady?: (el: HTMLCanvasElement) => void
) {
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const historyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = useRef(false);

  const { activeProduct, activeArea, saveCanvasState, getCanvasState, setLayers, setActiveLayer, activeTool } = useEditorStore();
  const { pushState } = useHistoryStore();

  const getCanvasSize = useCallback(() => {
    const config = STUDIO_PRODUCTS[activeProduct];
    const area = config.areas[activeArea];
    return { width: area.width, height: area.height };
  }, [activeProduct, activeArea]);

  // Sync layers from canvas objects to store
  const syncLayers = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const objects = canvas.getObjects();
    const layers = objects.map((obj, i) => ({
      id: (obj as any).__layerId || `layer_${i}`,
      name: obj.type === "i-text" ? `Text: ${(obj as fabric.IText).text?.slice(0, 12) || ""}` : `Shape ${i + 1}`,
      type: (obj.type === "i-text" ? "text" : "shape") as "text" | "shape",
      visible: obj.visible !== false,
      locked: obj.selectable === false,
    }));
    setLayers(layers);
  }, [setLayers]);

  // Push history with debounce
  const pushHistory = useCallback(() => {
    if (isLoadingRef.current) return;
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    historyTimeoutRef.current = setTimeout(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const json = JSON.stringify((canvas as any).toJSON(["__layerId"]));
      pushState(json);
      saveCanvasState(json);
    }, HISTORY_DEBOUNCE_MS);
  }, [pushState, saveCanvasState]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const { width, height } = getCanvasSize();
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Events
    canvas.on("object:modified", () => { pushHistory(); syncLayers(); });
    canvas.on("object:added", () => { pushHistory(); syncLayers(); });
    canvas.on("object:removed", () => { pushHistory(); syncLayers(); });
    canvas.on("selection:created", (e) => {
      const obj = e.selected?.[0];
      if (obj) setActiveLayer((obj as any).__layerId || null);
    });
    canvas.on("selection:updated", (e) => {
      const obj = e.selected?.[0];
      if (obj) setActiveLayer((obj as any).__layerId || null);
    });
    canvas.on("selection:cleared", () => setActiveLayer(null));

    // Notify parent of underlying canvas element for texture sync
    if (onCanvasReady) {
      onCanvasReady(canvas.lowerCanvasEl);
    }

    // Load saved state if exists
    const saved = getCanvasState();
    if (saved) {
      isLoadingRef.current = true;
      canvas.loadFromJSON(JSON.parse(saved)).then(() => {
        canvas.renderAll();
        syncLayers();
        isLoadingRef.current = false;
      });
    }

    return () => {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle product/area switch - save current, load new
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const { width, height } = getCanvasSize();
    canvas.setDimensions({ width, height });

    const saved = getCanvasState();
    isLoadingRef.current = true;
    if (saved) {
      canvas.loadFromJSON(JSON.parse(saved)).then(() => {
        canvas.renderAll();
        syncLayers();
        isLoadingRef.current = false;
      });
    } else {
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
      syncLayers();
      isLoadingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProduct, activeArea]);

  // Add text to canvas
  const addText = useCallback((text = "Your Text") => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const id = `layer_${Date.now()}`;
    const textObj = new fabric.IText(text, {
      fontSize: DEFAULT_TEXT_OPTIONS.fontSize,
      fontWeight: DEFAULT_TEXT_OPTIONS.fontWeight,
      fill: DEFAULT_TEXT_OPTIONS.fill,
      opacity: DEFAULT_TEXT_OPTIONS.opacity,
      charSpacing: DEFAULT_TEXT_OPTIONS.charSpacing,
      lineHeight: DEFAULT_TEXT_OPTIONS.lineHeight,
      textAlign: DEFAULT_TEXT_OPTIONS.textAlign,
      fontFamily: DEFAULT_FONT.family,
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: "center",
      originY: "center",
    });
    (textObj as any).__layerId = id;
    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
  }, []);

  // Add shape to canvas
  const addShape = useCallback((type: "rect" | "circle" | "triangle") => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const id = `layer_${Date.now()}`;
    const center = { left: canvas.width! / 2, top: canvas.height! / 2, originX: "center" as const, originY: "center" as const };
    let shape: fabric.FabricObject;

    switch (type) {
      case "rect":
        shape = new fabric.Rect({ ...center, width: 120, height: 120, fill: "#FFFFFF", rx: 4, ry: 4 });
        break;
      case "circle":
        shape = new fabric.Circle({ ...center, radius: 60, fill: "#FFFFFF" });
        break;
      case "triangle":
        shape = new fabric.Triangle({ ...center, width: 120, height: 120, fill: "#FFFFFF" });
        break;
    }

    (shape as any).__layerId = id;
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  }, []);

  // Delete selected object
  const deleteSelected = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
    }
  }, []);

  // Duplicate selected object
  const duplicateSelected = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    const cloned = await active.clone();
    cloned.set({ left: (active.left || 0) + 20, top: (active.top || 0) + 20 });
    (cloned as any).__layerId = `layer_${Date.now()}`;
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
  }, []);

  // Load state (for undo/redo)
  const loadState = useCallback((json: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    isLoadingRef.current = true;
    canvas.loadFromJSON(JSON.parse(json)).then(() => {
      canvas.renderAll();
      syncLayers();
      isLoadingRef.current = false;
    });
  }, [syncLayers]);

  // Get active object for properties panel
  const getActiveObject = useCallback(() => {
    return fabricRef.current?.getActiveObject() || null;
  }, []);

  // Update active object properties
  const updateActiveObject = useCallback((props: Record<string, any>) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.set(props);
    canvas.renderAll();
    pushHistory();
  }, [pushHistory]);

  // Export canvas as data URL
  const exportDataURL = useCallback((multiplier = 4) => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    return canvas.toDataURL({ multiplier, format: "png" });
  }, []);

  // Export canvas as JSON
  const exportJSON = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    return JSON.stringify((canvas as any).toJSON(["__layerId"]), null, 2);
  }, []);

  return {
    fabricRef,
    addText,
    addShape,
    deleteSelected,
    duplicateSelected,
    loadState,
    getActiveObject,
    updateActiveObject,
    exportDataURL,
    exportJSON,
  };
}
