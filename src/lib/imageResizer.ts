import type {
  BackgroundConfig,
  FitMode,
  GeneratedIcon,
  GenerationOptions,
} from "../types";
import { applyChromaKey } from "./backgroundRemoval";

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar la imagen."));
    };
    image.src = objectUrl;
  });
}

export interface SquareContentBox {
  size: number;
  drawX: number;
  drawY: number;
  sourceX: number;
  sourceY: number;
  sourceSize: number;
}

export function computeSquareContentBox(
  width: number,
  height: number,
  fitMode: FitMode,
): SquareContentBox {
  if (fitMode === "crop") {
    const sourceSize = Math.min(width, height);
    return {
      size: sourceSize,
      drawX: 0,
      drawY: 0,
      sourceX: (width - sourceSize) / 2,
      sourceY: (height - sourceSize) / 2,
      sourceSize,
    };
  }

  const size = Math.max(width, height);
  return {
    size,
    drawX: (size - width) / 2,
    drawY: (size - height) / 2,
    sourceX: 0,
    sourceY: 0,
    sourceSize: 0,
  };
}

function createCanvas(size: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo crear el contexto de canvas.");
  }

  return { canvas, ctx };
}

function extractSquareSource(
  image: HTMLImageElement,
  fitMode: FitMode,
): HTMLCanvasElement {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const box = computeSquareContentBox(width, height, fitMode);
  const { canvas, ctx } = createCanvas(box.size);

  if (fitMode === "crop") {
    ctx.drawImage(
      image,
      box.sourceX,
      box.sourceY,
      box.sourceSize,
      box.sourceSize,
      0,
      0,
      box.sourceSize,
      box.sourceSize,
    );
  } else {
    ctx.drawImage(image, box.drawX, box.drawY, width, height);
  }

  return canvas;
}

function resizeSquareCanvas(
  source: HTMLCanvasElement,
  targetSize: number,
): HTMLCanvasElement {
  let current = source;

  while (current.width > targetSize * 2) {
    const nextSize = Math.floor(current.width / 2);
    const { canvas, ctx } = createCanvas(nextSize);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, nextSize, nextSize);
    current = canvas;
  }

  const { canvas, ctx } = createCanvas(targetSize);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, targetSize, targetSize);
  return canvas;
}

function applyBackground(
  content: HTMLCanvasElement,
  background: BackgroundConfig,
): HTMLCanvasElement {
  if (background.mode === "transparent") {
    return content;
  }

  const { canvas, ctx } = createCanvas(content.width);
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(content, 0, 0);
  return canvas;
}

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("No se pudo generar el PNG."));
        return;
      }
      void blob
        .arrayBuffer()
        .then((buffer) => resolve(new Uint8Array(buffer)))
        .catch(reject);
    }, "image/png");
  });
}

export async function generateIcons(
  file: File,
  options: GenerationOptions,
  onProgress?: (done: number, total: number) => void,
): Promise<GeneratedIcon[]> {
  const image = await loadImageElement(file);
  const squareSource = extractSquareSource(image, options.fitMode);

  const icons: GeneratedIcon[] = [];

  if (options.chromaKey.enabled) {
    applyChromaKey(squareSource, options.chromaKey.tolerance);
  }

  for (const [index, size] of options.sizes.entries()) {
    const resized = resizeSquareCanvas(squareSource, size);
    const withBackground = applyBackground(resized, options.background);
    const pngData = await canvasToPngBytes(withBackground);
    icons.push({ size, pngData });
    onProgress?.(index + 1, options.sizes.length);
  }

  return icons;
}
