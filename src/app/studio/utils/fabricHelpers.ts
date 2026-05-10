import * as fabric from "fabric";

// Create curved text (text on a circular path)
export function createCurvedText(
  text: string,
  options: {
    radius?: number;
    fontSize?: number;
    fill?: string;
    fontFamily?: string;
    startAngle?: number;
  } = {}
): fabric.Group {
  const {
    radius = 150,
    fontSize = 32,
    fill = "#FFFFFF",
    fontFamily = "Arial, sans-serif",
    startAngle = -90,
  } = options;

  const chars: fabric.FabricText[] = [];
  const anglePerChar = (fontSize * 0.7) / radius * (180 / Math.PI);
  const totalAngle = anglePerChar * text.length;
  let currentAngle = startAngle - totalAngle / 2;

  for (const char of text) {
    const angle = currentAngle + anglePerChar / 2;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    const charObj = new fabric.FabricText(char, {
      fontSize,
      fill,
      fontFamily,
      left: x,
      top: y,
      originX: "center",
      originY: "center",
      angle: angle + 90,
    });
    chars.push(charObj);
    currentAngle += anglePerChar;
  }

  const group = new fabric.Group(chars, {
    originX: "center",
    originY: "center",
  });

  return group;
}

// Generate a unique layer ID
export function generateLayerId(): string {
  return `layer_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
