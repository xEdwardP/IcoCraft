export type FitMode = "fit" | "crop";
export type BackgroundMode = "transparent" | "solid";

export interface BackgroundConfig {
  mode: BackgroundMode;
  color: string;
}

export type IconSize = number;

export interface GeneratedIcon {
  size: IconSize;
  pngData: Uint8Array;
}

export interface ChromaKeyConfig {
  enabled: boolean;
  tolerance: number;
}

export interface GenerationOptions {
  sizes: IconSize[];
  fitMode: FitMode;
  background: BackgroundConfig;
  chromaKey: ChromaKeyConfig;
}
