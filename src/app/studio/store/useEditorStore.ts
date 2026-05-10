import { create } from "zustand";
import { StudioProduct, DEFAULT_PRODUCT, DEFAULT_AREA, DEFAULT_COLOR } from "../constants/products";

export type ToolType = "select" | "text" | "shape";

export interface Layer {
  id: string;
  name: string;
  type: "text" | "shape";
  visible: boolean;
  locked: boolean;
}

interface EditorState {
  // Product
  activeProduct: StudioProduct;
  activeArea: string;
  productColor: string;

  // Tools
  activeTool: ToolType;

  // Layers
  layers: Layer[];
  activeLayerId: string | null;

  // Canvas state per product/area (serialized Fabric JSON)
  canvasStates: Record<string, string>;

  // UI panels
  showLayers: boolean;
  showProperties: boolean;

  // Actions
  setProduct: (product: StudioProduct) => void;
  setArea: (area: string) => void;
  setProductColor: (color: string) => void;
  setTool: (tool: ToolType) => void;
  setActiveLayer: (id: string | null) => void;
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  saveCanvasState: (json: string) => void;
  getCanvasState: () => string | undefined;
  toggleLayers: () => void;
  toggleProperties: () => void;
}

function getStateKey(product: StudioProduct, area: string) {
  return `${product}_${area}`;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeProduct: DEFAULT_PRODUCT,
  activeArea: DEFAULT_AREA,
  productColor: DEFAULT_COLOR,
  activeTool: "select",
  layers: [],
  activeLayerId: null,
  canvasStates: {},
  showLayers: true,
  showProperties: true,

  setProduct: (product) => set({ activeProduct: product, activeArea: "front", layers: [], activeLayerId: null }),
  setArea: (area) => set({ activeArea: area, layers: [], activeLayerId: null }),
  setProductColor: (color) => set({ productColor: color }),
  setTool: (tool) => set({ activeTool: tool }),
  setActiveLayer: (id) => set({ activeLayerId: id }),
  setLayers: (layers) => set({ layers }),

  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),

  removeLayer: (id) => set((state) => ({
    layers: state.layers.filter((l) => l.id !== id),
    activeLayerId: state.activeLayerId === id ? null : state.activeLayerId,
  })),

  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
  })),

  reorderLayers: (fromIndex, toIndex) => set((state) => {
    const newLayers = [...state.layers];
    const [moved] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, moved);
    return { layers: newLayers };
  }),

  saveCanvasState: (json) => {
    const { activeProduct, activeArea } = get();
    const key = getStateKey(activeProduct, activeArea);
    set((state) => ({ canvasStates: { ...state.canvasStates, [key]: json } }));
  },

  getCanvasState: () => {
    const { activeProduct, activeArea, canvasStates } = get();
    return canvasStates[getStateKey(activeProduct, activeArea)];
  },

  toggleLayers: () => set((state) => ({ showLayers: !state.showLayers })),
  toggleProperties: () => set((state) => ({ showProperties: !state.showProperties })),
}));
