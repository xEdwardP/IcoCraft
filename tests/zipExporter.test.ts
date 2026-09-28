import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { createIconsZip } from "../src/lib/zipExporter";
import type { GeneratedIcon } from "../src/types";

describe("createIconsZip", () => {
  it("packs one PNG per icon, named by size", async () => {
    const icons: GeneratedIcon[] = [
      { size: 16, pngData: new Uint8Array([1, 2, 3]) },
      { size: 32, pngData: new Uint8Array([4, 5, 6, 7]) },
    ];

    const zipBytes = await createIconsZip(icons, "logo");
    const zip = await JSZip.loadAsync(zipBytes);

    expect(Object.keys(zip.files).sort()).toEqual([
      "logo-16.png",
      "logo-32.png",
    ]);
  });

  it("preserves each icon's exact bytes inside the zip", async () => {
    const icons: GeneratedIcon[] = [
      { size: 48, pngData: new Uint8Array([9, 8, 7]) },
    ];

    const zipBytes = await createIconsZip(icons, "icon");
    const zip = await JSZip.loadAsync(zipBytes);
    const entry = zip.file("icon-48.png");

    expect(entry).not.toBeNull();
    const content = await entry?.async("uint8array");
    expect(Array.from(content ?? [])).toEqual([9, 8, 7]);
  });

  it("produces an empty (but valid) zip when there are no icons", async () => {
    const zipBytes = await createIconsZip([], "empty");
    const zip = await JSZip.loadAsync(zipBytes);

    expect(Object.keys(zip.files)).toHaveLength(0);
  });
});
