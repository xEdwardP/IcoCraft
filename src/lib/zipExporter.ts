import JSZip from "jszip";
import type { GeneratedIcon } from "../types";

export async function createIconsZip(
  icons: GeneratedIcon[],
  fileNameBase: string,
): Promise<Uint8Array> {
  const zip = new JSZip();

  for (const icon of icons) {
    zip.file(`${fileNameBase}-${icon.size}.png`, icon.pngData);
  }

  return zip.generateAsync({ type: "uint8array" });
}
