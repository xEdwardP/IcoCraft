import { describe, expect, it } from "vitest";
import { encodeIco } from "../src/lib/icoEncoder";
import type { GeneratedIcon } from "../src/types";

function fakePng(byteLength: number): Uint8Array {
  return new Uint8Array(byteLength).fill(1);
}

describe("encodeIco", () => {
  it("throws when there are no icons to encode", () => {
    expect(() => encodeIco([])).toThrow();
  });

  it("writes a correct ICONDIR header for a single icon", () => {
    const icons: GeneratedIcon[] = [{ size: 16, pngData: fakePng(10) }];
    const buffer = encodeIco(icons);
    const view = new DataView(buffer.buffer);

    expect(view.getUint16(0, true)).toBe(0);
    expect(view.getUint16(2, true)).toBe(1);
    expect(view.getUint16(4, true)).toBe(1);
  });

  it("writes correct entries and byte offsets for multiple icons", () => {
    const icons: GeneratedIcon[] = [
      { size: 16, pngData: fakePng(10) },
      { size: 256, pngData: fakePng(20) },
    ];
    const buffer = encodeIco(icons);
    const view = new DataView(buffer.buffer);

    const headerSize = 6 + 2 * 16;

    const entry0 = 6;
    expect(buffer[entry0]).toBe(16);
    expect(buffer[entry0 + 1]).toBe(16);
    expect(view.getUint16(entry0 + 4, true)).toBe(1);
    expect(view.getUint16(entry0 + 6, true)).toBe(32);
    expect(view.getUint32(entry0 + 8, true)).toBe(10);
    expect(view.getUint32(entry0 + 12, true)).toBe(headerSize);

    const entry1 = 6 + 16;
    expect(buffer[entry1]).toBe(0);
    expect(buffer[entry1 + 1]).toBe(0);
    expect(view.getUint32(entry1 + 8, true)).toBe(20);
    expect(view.getUint32(entry1 + 12, true)).toBe(headerSize + 10);

    expect(buffer.length).toBe(headerSize + 10 + 20);
  });

  it("embeds each icon's PNG bytes at its declared offset", () => {
    const icons: GeneratedIcon[] = [
      { size: 32, pngData: new Uint8Array([1, 2, 3]) },
      { size: 48, pngData: new Uint8Array([9, 8, 7, 6]) },
    ];
    const buffer = encodeIco(icons);
    const view = new DataView(buffer.buffer);

    const offset0 = view.getUint32(6 + 12, true);
    const offset1 = view.getUint32(6 + 16 + 12, true);

    expect(Array.from(buffer.slice(offset0, offset0 + 3))).toEqual([1, 2, 3]);
    expect(Array.from(buffer.slice(offset1, offset1 + 4))).toEqual([
      9, 8, 7, 6,
    ]);
  });
});
