export type FitMode = "fit" | "crop";
export type BackgroundMode = "transparent" | "solid";

export interface BackgroundConfig {
  mode: BackgroundMode;
  color: string;
}

export type IconSize = 16 | 24 | 32 | 48 | 64 | 128 | 256;

export interface GeneratedIcon {
  size: IconSize;
  pngData: Uint8Array;
}

export interface GenerationOptions {
  sizes: IconSize[];
  fitMode: FitMode;
  background: BackgroundConfig;
}