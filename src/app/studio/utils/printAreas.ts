import { STUDIO_PRODUCTS, StudioProduct } from "../constants/products";

// Get print boundary in pixels (with margin)
export function getPrintBounds(product: StudioProduct, area: string) {
  const config = STUDIO_PRODUCTS[product];
  const areaConfig = config.areas[area];
  if (!areaConfig) return null;

  // 5% margin from edges as safe print area
  const margin = 0.05;
  return {
    left: areaConfig.width * margin,
    top: areaConfig.height * margin,
    right: areaConfig.width * (1 - margin),
    bottom: areaConfig.height * (1 - margin),
    width: areaConfig.width * (1 - 2 * margin),
    height: areaConfig.height * (1 - 2 * margin),
  };
}

// Check if an object is within print bounds
export function isWithinBounds(
  obj: { left: number; top: number; width: number; height: number; scaleX?: number; scaleY?: number; angle?: number },
  product: StudioProduct,
  area: string
): boolean {
  const bounds = getPrintBounds(product, area);
  if (!bounds) return true;

  const scaleX = obj.scaleX || 1;
  const scaleY = obj.scaleY || 1;
  const w = obj.width * scaleX;
  const h = obj.height * scaleY;

  return (
    obj.left >= bounds.left &&
    obj.top >= bounds.top &&
    obj.left + w <= bounds.right &&
    obj.top + h <= bounds.bottom
  );
}

// Constrain object to print bounds
export function constrainToBounds(
  obj: { left: number; top: number; width: number; height: number; scaleX?: number; scaleY?: number },
  product: StudioProduct,
  area: string
): { left: number; top: number } {
  const bounds = getPrintBounds(product, area);
  if (!bounds) return { left: obj.left, top: obj.top };

  const scaleX = obj.scaleX || 1;
  const scaleY = obj.scaleY || 1;
  const w = obj.width * scaleX;
  const h = obj.height * scaleY;

  return {
    left: Math.max(bounds.left, Math.min(obj.left, bounds.right - w)),
    top: Math.max(bounds.top, Math.min(obj.top, bounds.bottom - h)),
  };
}
