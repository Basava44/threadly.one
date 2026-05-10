export type StudioProduct = "tee" | "cap" | "tote";
export type PrintArea = string;

export interface AreaConfig {
  label: string;
  width: number;
  height: number;
  // UV mapping coordinates for texture placement on 3D model
  uvOffset: [number, number];
  uvScale: [number, number];
}

export interface ProductConfig {
  label: string;
  model: string;
  scale: number;
  cameraPosition: [number, number, number];
  areas: Record<string, AreaConfig>;
  colors: string[];
  price: number;
}

export const STUDIO_PRODUCTS: Record<StudioProduct, ProductConfig> = {
  tee: {
    label: "Oversized Tee",
    model: "/models/tee.glb",
    scale: 2.5,
    cameraPosition: [0, 0.3, 3],
    areas: {
      front: { label: "Front", width: 1024, height: 1024, uvOffset: [0.25, 0.25], uvScale: [0.5, 0.5] },
      back: { label: "Back", width: 1024, height: 1024, uvOffset: [0.75, 0.25], uvScale: [0.5, 0.5] },
      sleeve: { label: "Sleeve", width: 512, height: 256, uvOffset: [0.1, 0.7], uvScale: [0.2, 0.15] },
    },
    colors: ["#1A1A1A", "#FFFFFF", "#D4C5A9", "#4A5D3A", "#2D3A4A"],
    price: 999,
  },
  cap: {
    label: "Bucket Hat",
    model: "/models/bucket_hat.glb",
    scale: 1.8,
    cameraPosition: [0, 0.2, 2.5],
    areas: {
      front: { label: "Front", width: 512, height: 512, uvOffset: [0.3, 0.3], uvScale: [0.4, 0.4] },
      side: { label: "Side", width: 512, height: 256, uvOffset: [0.0, 0.3], uvScale: [0.3, 0.4] },
      back: { label: "Back", width: 512, height: 512, uvOffset: [0.7, 0.3], uvScale: [0.3, 0.4] },
    },
    colors: ["#1A1A1A", "#FFFFFF", "#D4C5A9", "#4A5D3A", "#8B4513"],
    price: 899,
  },
  tote: {
    label: "Tote Bag",
    model: "/models/tote.glb",
    scale: 0.3,
    cameraPosition: [0, 0.3, 3],
    areas: {
      front: { label: "Front", width: 1024, height: 1024, uvOffset: [0.25, 0.2], uvScale: [0.5, 0.6] },
      back: { label: "Back", width: 1024, height: 1024, uvOffset: [0.75, 0.2], uvScale: [0.5, 0.6] },
    },
    colors: ["#1A1A1A", "#F5F0E8", "#D4C5A9", "#4A5D3A"],
    price: 599,
  },
};

export const DEFAULT_PRODUCT: StudioProduct = "tee";
export const DEFAULT_AREA = "front";
export const DEFAULT_COLOR = "#1A1A1A";
