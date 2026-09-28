import type { GeneratedIcon } from "../types";

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;

export function encodeIco(icons: GeneratedIcon[]): Uint8Array {
  if (icons.length === 0) {
    throw new Error("No hay iconos para codificar.");
  }

  const headerSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE * icons.length;
  const totalSize =
    headerSize +
    icons.reduce((sum, icon) => sum + icon.pngData.length, 0);

  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, icons.length, true);

  let dataOffset = headerSize;

  icons.forEach((icon, index) => {
    const entryOffset = ICONDIR_SIZE + index * ICONDIRENTRY_SIZE;
    const sizeByte = icon.size >= 256 ? 0 : icon.size;

    buffer[entryOffset] = sizeByte;
    buffer[entryOffset + 1] = sizeByte;
    buffer[entryOffset + 2] = 0;
    buffer[entryOffset + 3] = 0;
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, icon.pngData.length, true);
    view.setUint32(entryOffset + 12, dataOffset, true);

    buffer.set(icon.pngData, dataOffset);
    dataOffset += icon.pngData.length;
  });

  return buffer;
}