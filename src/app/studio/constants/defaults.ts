// Canvas display dimensions (actual canvas is larger for print quality)
export const CANVAS_DISPLAY_WIDTH = 500;
export const CANVAS_DISPLAY_HEIGHT = 500;

// Print quality multiplier for exports
export const EXPORT_MULTIPLIER = 4;

// History
export const MAX_HISTORY_STATES = 50;
export const HISTORY_DEBOUNCE_MS = 300;

// Texture sync
export const TEXTURE_SYNC_FPS = 30;

// Auto-save
export const AUTO_SAVE_INTERVAL_MS = 30000;

// Default text properties
export const DEFAULT_TEXT_OPTIONS = {
  fontSize: 40,
  fontWeight: 400,
  fill: "#FFFFFF",
  opacity: 1,
  charSpacing: 0,
  lineHeight: 1.2,
  textAlign: "center" as const,
  shadow: "",
};

// Default shape properties
export const DEFAULT_SHAPE_OPTIONS = {
  fill: "#FFFFFF",
  stroke: "",
  strokeWidth: 0,
  opacity: 1,
};

// localStorage keys
export const STORAGE_KEY_DESIGNS = "threadly_studio_designs";
export const STORAGE_KEY_DRAFT = "threadly_studio_draft";
