import { describe, expect, it } from "vitest";
import { computeSquareContentBox } from "../src/lib/imageResizer";

describe("computeSquareContentBox", () => {
  it("returns the full image unchanged when it is already square", () => {
    const fit = computeSquareContentBox(300, 300, "fit");
    const crop = computeSquareContentBox(300, 300, "crop");

    expect(fit).toEqual({
      size: 300,
      drawX: 0,
      drawY: 0,
      sourceX: 0,
      sourceY: 0,
      sourceSize: 0,
    });
    expect(crop).toEqual({
      size: 300,
      drawX: 0,
      drawY: 0,
      sourceX: 0,
      sourceY: 0,
      sourceSize: 300,
    });
  });

  it("crops a centered square from a wide image", () => {
    const box = computeSquareContentBox(400, 200, "crop");

    expect(box.size).toBe(200);
    expect(box.sourceSize).toBe(200);
    expect(box.sourceX).toBe(100);
    expect(box.sourceY).toBe(0);
  });

  it("crops a centered square from a tall image", () => {
    const box = computeSquareContentBox(200, 500, "crop");

    expect(box.size).toBe(200);
    expect(box.sourceSize).toBe(200);
    expect(box.sourceX).toBe(0);
    expect(box.sourceY).toBe(150);
  });

  it("letterboxes a wide image inside a square in fit mode", () => {
    const box = computeSquareContentBox(400, 200, "fit");

    expect(box.size).toBe(400);
    expect(box.drawX).toBe(0);
    expect(box.drawY).toBe(100);
  });

  it("letterboxes a tall image inside a square in fit mode", () => {
    const box = computeSquareContentBox(200, 500, "fit");

    expect(box.size).toBe(500);
    expect(box.drawY).toBe(0);
    expect(box.drawX).toBe(150);
  });
});
