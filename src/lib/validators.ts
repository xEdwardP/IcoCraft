import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_ICON_DIMENSION,
} from "./constants";

export interface ImageValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function isAcceptedMimeType(type: string): boolean {
  return (ACCEPTED_MIME_TYPES as readonly string[]).includes(type);
}

function isWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

/**
 * Loads an image just to read its natural dimensions, without touching the DOM.
 * The object URL is revoked as soon as loading finishes (success or failure).
 */
function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen."));
    };
    image.src = objectUrl;
  });
}

/**
 * Validates an uploaded file end to end: MIME type, size, then (only if those
 * pass) dimensions — square-ness and minimum resolution produce warnings, not
 * hard failures, since IcoCraft can still generate icons from them.
 */
export async function validateImageFile(
  file: File,
): Promise<ImageValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isAcceptedMimeType(file.type)) {
    errors.push("Formato no soportado. Usa una imagen PNG, JPG o WebP.");
  }

  if (!isWithinSizeLimit(file)) {
    errors.push(`El archivo supera el límite de ${MAX_FILE_SIZE_MB} MB.`);
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  let dimensions: { width: number; height: number };
  try {
    dimensions = await readImageDimensions(file);
  } catch {
    return {
      valid: false,
      errors: ["El archivo no es una imagen válida o está corrupto."],
      warnings,
    };
  }

  if (dimensions.width !== dimensions.height) {
    warnings.push(
      "La imagen no es cuadrada: se ajustará según el modo de ajuste elegido (recortar o rellenar).",
    );
  }

  if (Math.min(dimensions.width, dimensions.height) < MAX_ICON_DIMENSION) {
    warnings.push(
      `La imagen es menor a ${MAX_ICON_DIMENSION}px: los tamaños grandes pueden verse borrosos.`,
    );
  }

  return { valid: true, errors, warnings };
}
