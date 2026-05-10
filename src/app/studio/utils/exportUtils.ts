import { STORAGE_KEY_DESIGNS, STORAGE_KEY_DRAFT } from "../constants/defaults";
import { StudioProduct } from "../constants/products";

export interface SavedDesign {
  id: string;
  name: string;
  product: StudioProduct;
  areas: Record<string, string>; // area key -> Fabric JSON
  productColor: string;
  thumbnail: string; // small base64 preview
  createdAt: number;
  updatedAt: number;
}

// Download a data URL or blob URL as a file
export function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Save design to localStorage
export function saveDesign(design: SavedDesign) {
  const designs = getDesigns();
  const existing = designs.findIndex((d) => d.id === design.id);
  if (existing >= 0) {
    designs[existing] = { ...design, updatedAt: Date.now() };
  } else {
    designs.push(design);
  }
  localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(designs));
}

// Get all saved designs
export function getDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DESIGNS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Delete a saved design
export function deleteDesign(id: string) {
  const designs = getDesigns().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY_DESIGNS, JSON.stringify(designs));
}

// Save draft (auto-save)
export function saveDraft(data: Omit<SavedDesign, "id" | "name" | "createdAt" | "updatedAt">) {
  localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify({ ...data, updatedAt: Date.now() }));
}

// Load draft
export function loadDraft(): (Omit<SavedDesign, "id" | "name" | "createdAt" | "updatedAt"> & { updatedAt: number }) | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Clear draft
export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY_DRAFT);
}
