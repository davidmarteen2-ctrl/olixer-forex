export const HERO_DIAGRAM_GEOMETRY = Object.freeze({
  width: 1360,
  height: 400,
  sourceRail: { x: -30, width: 346 },
  engine: {
    x: 626,
    y: 126,
    width: 108,
    height: 108,
    inputX: 673,
    outputX: 688,
  },
  signalCard: { x: 586, y: 262, width: 188 },
  outcomeRail: { x: 1044, width: 346 },
  notes: {
    market: { x: 348, y: 0 },
    execution: { x: 828, y: 36 },
    validated: { x: 366, y: 310 },
    risk: { x: 828, y: 310 },
  },
});

export const HERO_DIAGRAM_VISUAL_TOKENS = Object.freeze({
  wireStrokeWidth: 2.35,
  inputWireColor: "#BDB7AB",
  outputWireColor: "#ED8730",
  auxiliaryWireColor: "#D0CBC1",
  auxiliaryWireStrokeWidth: 1.25,
  junctionRingRadius: 4.8,
  junctionDotRadius: 4.1,
  junctionStrokeWidth: 1.8,
  packetRadius: 3.5,
  typography: {
    sourceTitleSize: "12px",
    sourceDescriptionSize: "12px",
    outcomeTitleSize: "11.75px",
    outcomeDescriptionSize: "10.5px",
    previewSize: "10px",
    engineTitleSize: "7.5px",
    engineDescriptionSize: "7px",
  },
  surface: {
    borderStrong: "#DED9D0",
    shadowStrong:
      "0 2px 5px rgba(21,23,26,.06), 0 10px 24px -15px rgba(21,23,26,.22)",
  },
});

function createCurve(start, control1, control2, end) {
  return { start, control1, control2, end };
}

export const inputCurves = [
  createCurve(
    { x: 316, y: 22 },
    { x: 435, y: 22 },
    { x: 530, y: 168 },
    { x: 673, y: 172 },
  ),
  createCurve(
    { x: 316, y: 110 },
    { x: 435, y: 110 },
    { x: 530, y: 174 },
    { x: 673, y: 177 },
  ),
  createCurve(
    { x: 316, y: 199 },
    { x: 435, y: 199 },
    { x: 530, y: 182 },
    { x: 673, y: 183 },
  ),
  createCurve(
    { x: 316, y: 291 },
    { x: 435, y: 291 },
    { x: 530, y: 189 },
    { x: 673, y: 188 },
  ),
];

export const outputCurves = [
  createCurve(
    { x: 688, y: 170 },
    { x: 858, y: 168 },
    { x: 953, y: 37 },
    { x: 1072, y: 37 },
  ),
  createCurve(
    { x: 688, y: 175 },
    { x: 858, y: 174 },
    { x: 953, y: 111 },
    { x: 1072, y: 111 },
  ),
  createCurve(
    { x: 688, y: 180 },
    { x: 858, y: 180 },
    { x: 953, y: 185 },
    { x: 1072, y: 185 },
  ),
  createCurve(
    { x: 688, y: 185 },
    { x: 858, y: 186 },
    { x: 953, y: 259 },
    { x: 1072, y: 259 },
  ),
  createCurve(
    { x: 688, y: 190 },
    { x: 858, y: 194 },
    { x: 953, y: 333 },
    { x: 1072, y: 333 },
  ),
];

export function curveToPath(curve) {
  const { start, control1, control2, end } = curve;
  return `M${start.x} ${start.y} C${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
}

function pointOnCurve(curve, t) {
  const inverse = 1 - t;
  const coordinate = (key) =>
    inverse ** 3 * curve.start[key] +
    3 * inverse ** 2 * t * curve.control1[key] +
    3 * inverse * t ** 2 * curve.control2[key] +
    t ** 3 * curve.end[key];

  return {
    x: coordinate("x"),
    y: coordinate("y"),
  };
}

export const inputJunctions = inputCurves.flatMap((curve) =>
  [0.29, 0.66].map((t) => ({
    ...pointOnCurve(curve, t),
    type: "left",
  })),
);

export const outputJunctions = outputCurves.flatMap((curve) =>
  [0.43, 0.71].map((t, index) => ({
    ...pointOnCurve(curve, t),
    type: index === 0 ? "right-ring" : "right-dot",
  })),
);
