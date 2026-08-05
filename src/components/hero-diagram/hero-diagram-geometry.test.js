import { describe, expect, it } from "vitest";

import {
  HERO_DIAGRAM_GEOMETRY,
  curveToPath,
  inputCurves,
  inputJunctions,
  outputCurves,
  outputJunctions,
} from "./hero-diagram-geometry.js";

function pointOnCurve(curve, t) {
  const inverse = 1 - t;
  const coordinate = (key) =>
    inverse ** 3 * curve.start[key] +
    3 * inverse ** 2 * t * curve.control1[key] +
    3 * inverse * t ** 2 * curve.control2[key] +
    t ** 3 * curve.end[key];

  return { x: coordinate("x"), y: coordinate("y") };
}

describe("full-bleed hero diagram geometry", () => {
  it("keeps the engine centered while moving both rails to mirrored symmetrical reaches", () => {
    const { width, sourceRail, engine, outcomeRail } = HERO_DIAGRAM_GEOMETRY;
    const diagramCentre = width / 2;
    const rightReach = (outcomeRail.x + outcomeRail.width) - diagramCentre;
    const leftReach = diagramCentre - sourceRail.x;

    expect(width).toBe(1360);
    expect(sourceRail).toEqual({ x: -30, width: 346 });
    expect(engine.x + engine.width / 2).toBe(diagramCentre);
    expect(outcomeRail).toEqual({ x: 1044, width: 346 });
    expect(leftReach).toBe(rightReach);
    expect(leftReach).toBe(710);
  });

  it("connects four source curves and five outcome curves to the widened rails", () => {
    expect(inputCurves).toHaveLength(4);
    expect(outputCurves).toHaveLength(5);
    expect(inputCurves.every((curve) => curve.start.x === 316)).toBe(true);
    expect(inputCurves.every((curve) => curve.end.x === 673)).toBe(true);
    expect(outputCurves.every((curve) => curve.start.x === 688)).toBe(true);
    expect(outputCurves.every((curve) => curve.end.x === 1072)).toBe(true);
    expect(curveToPath(outputCurves[0])).toBe(
      "M688 170 C858 168, 953 37, 1072 37",
    );
  });

  it("derives every junction from its associated cubic curve", () => {
    expect(inputJunctions).toHaveLength(8);
    expect(outputJunctions).toHaveLength(10);

    inputCurves.forEach((curve, curveIndex) => {
      [0.29, 0.66].forEach((t, junctionIndex) => {
        const expected = pointOnCurve(curve, t);
        const actual = inputJunctions[curveIndex * 2 + junctionIndex];

        expect(actual.x).toBeCloseTo(expected.x, 6);
        expect(actual.y).toBeCloseTo(expected.y, 6);
      });
    });

    outputCurves.forEach((curve, curveIndex) => {
      [0.43, 0.71].forEach((t, junctionIndex) => {
        const expected = pointOnCurve(curve, t);
        const actual = outputJunctions[curveIndex * 2 + junctionIndex];

        expect(actual.x).toBeCloseTo(expected.x, 6);
        expect(actual.y).toBeCloseTo(expected.y, 6);
      });
    });
  });
});
