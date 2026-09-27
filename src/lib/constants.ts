import type { IconSize } from "../types";

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const AVAILABLE_SIZES: IconSize[] = [16, 24, 32, 48, 64, 128, 256];

export const DEFAULT_SIZES: IconSize[] = [16, 32, 48, 256];

export const MAX_ICON_DIMENSION = 256;

export const DEFAULT_CHROMA_KEY_TOLERANCE = 32;
