import { describe, expect, it } from "vitest";
import {
  colorDistance,
  toleranceToDistanceThreshold,
} from "../src/lib/backgroundRemoval";

describe("colorDistance", () => {
  it("is zero for identical colors", () => {
    expect(
      colorDistance({ r: 10, g: 20, b: 30 }, { r: 10, g: 20, b: 30 }),
    ).toBe(0);
  });

  it("computes the Euclidean distance between two colors", () => {
    const distance = colorDistance({ r: 0, g: 0, b: 0 }, { r: 3, g: 4, b: 0 });
    expect(distance).toBe(5);
  });
});

describe("toleranceToDistanceThreshold", () => {
  it("maps 0 to a threshold of 0 (nothing removed)", () => {
    expect(toleranceToDistanceThreshold(0)).toBe(0);
  });

  it("maps 100 to the maximum possible RGB distance", () => {
    const maxDistance = Math.sqrt(255 ** 2 * 3);
    expect(toleranceToDistanceThreshold(100)).toBeCloseTo(maxDistance, 5);
  });

  it("scales linearly in between", () => {
    const maxDistance = Math.sqrt(255 ** 2 * 3);
    expect(toleranceToDistanceThreshold(50)).toBeCloseTo(maxDistance / 2, 5);
  });
});
