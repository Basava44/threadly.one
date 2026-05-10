export interface FontOption {
  name: string;
  family: string;
  weights: number[];
}

export const STUDIO_FONTS: FontOption[] = [
  { name: "Geist Sans", family: "var(--font-geist-sans)", weights: [400, 500, 600, 700, 800] },
  { name: "Arial", family: "Arial, sans-serif", weights: [400, 700] },
  { name: "Georgia", family: "Georgia, serif", weights: [400, 700] },
  { name: "Courier New", family: "'Courier New', monospace", weights: [400, 700] },
  { name: "Impact", family: "Impact, sans-serif", weights: [400] },
  { name: "Comic Sans", family: "'Comic Sans MS', cursive", weights: [400, 700] },
  { name: "Times New Roman", family: "'Times New Roman', serif", weights: [400, 700] },
  { name: "Verdana", family: "Verdana, sans-serif", weights: [400, 700] },
  { name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif", weights: [400, 700] },
  { name: "Palatino", family: "'Palatino Linotype', serif", weights: [400, 700] },
];

export const DEFAULT_FONT = STUDIO_FONTS[0];
