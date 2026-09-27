export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const MAX_RGB_DISTANCE = Math.sqrt(255 ** 2 * 3);

export function colorDistance(a: RgbColor, b: RgbColor): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function toleranceToDistanceThreshold(tolerancePercent: number): number {
  return (tolerancePercent / 100) * MAX_RGB_DISTANCE;
}

function sampleCornerColor(imageData: ImageData): RgbColor {
  const { data, width, height } = imageData;
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4,
  ];

  let r = 0;
  let g = 0;
  let b = 0;

  for (const offset of corners) {
    r += data[offset] ?? 0;
    g += data[offset + 1] ?? 0;
    b += data[offset + 2] ?? 0;
  }

  return {
    r: r / corners.length,
    g: g / corners.length,
    b: b / corners.length,
  };
}

export function applyChromaKey(
  canvas: HTMLCanvasElement,
  tolerance: number,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo crear el contexto de canvas.");
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const keyColor = sampleCornerColor(imageData);
  const threshold = toleranceToDistanceThreshold(tolerance);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const pixel: RgbColor = {
      r: data[i] ?? 0,
      g: data[i + 1] ?? 0,
      b: data[i + 2] ?? 0,
    };

    if (colorDistance(pixel, keyColor) <= threshold) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
