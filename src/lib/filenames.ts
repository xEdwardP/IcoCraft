export function getBaseFileName(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}