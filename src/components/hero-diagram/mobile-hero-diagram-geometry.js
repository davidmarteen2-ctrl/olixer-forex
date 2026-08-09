/**
 * Mobile hero diagram geometry — SEPARATE from desktop HERO_DIAGRAM_GEOMETRY.
 *
 * Desktop geometry (hero-diagram-geometry.js) is NOT referenced or mutated here.
 * All values are native to a compressed mobile canvas.
 *
 * Layout model (horizontal):
 *   [sidePad][sourceRail][runway][engine][runway][outcomeRail][sidePad]
 *
 * At 390px:  8 + 128 + 24 + 58 + 24 + 128 + 8 = 378px  (12px margin)
 * At 360px:  6 + 118 + 20 + 54 + 20 + 118 + 6 = 342px  (18px margin)
 * At 320px:  5 + 108 + 16 + 50 + 16 + 108 + 5 = 308px  (12px margin)
 */

/** Convert a 4-point Bézier descriptor to an SVG path string. */
export function mCurveToPath({ sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey }) {
  return `M${sx} ${sy} C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;
}

/**
 * Evaluate a point on a cubic Bézier at parameter t ∈ [0,1].
 */
function pointOnCubic(sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey, t) {
  const u = 1 - t;
  return {
    x: u ** 3 * sx + 3 * u ** 2 * t * cp1x + 3 * u * t ** 2 * cp2x + t ** 3 * ex,
    y: u ** 3 * sy + 3 * u ** 2 * t * cp1y + 3 * u * t ** 2 * cp2y + t ** 3 * ey,
  };
}

/**
 * Returns mobile diagram geometry computed from the actual container width.
 * Safe to call on every ResizeObserver tick — pure function, no side effects.
 *
 * @param {number} containerWidth  Measured width of the diagram's parent element.
 * @returns {MobileDiagramGeometry}
 */
export function getMobileDiagramGeometry(containerWidth) {
  const w = Math.min(430, Math.max(300, containerWidth || 390));

  // ── Responsive sizing tiers ────────────────────────────────────────────────
  const sidePad = w <= 340 ? 5 : 8;
  const railW   = w <= 340 ? 108 : w <= 375 ? 118 : 128;
  const engineW = w <= 340 ? 50  : w <= 375 ? 54  : 58;
  const runway  = w <= 340 ? 16  : w <= 375 ? 20  : 24;

  // ── Derived horizontal positions ───────────────────────────────────────────
  const engineX   = sidePad + railW + runway;        // engine left edge
  const engineH   = engineW;                          // square puck
  const engineY   = 74;
  const outcomeX  = engineX + engineW + runway;       // outcome rail left edge
  const engineCX  = engineX + engineW / 2;            // engine horizontal center

  // ── Source card grid (4 cards) ─────────────────────────────────────────────
  const srcCardH  = 36;
  const srcGap    = w <= 340 ? 10 : 14;
  const sourceTops = Array.from({ length: 4 }, (_, i) => 8 + i * (srcCardH + srcGap));
  // 390px → [8, 58, 108, 158]

  // ── Outcome card grid (5 cards) ────────────────────────────────────────────
  const outCardH  = 36;
  const outGap    = w <= 340 ? 8 : 10;
  const outcomeTops = Array.from({ length: 5 }, (_, i) => 8 + i * (outCardH + outGap));
  // 390px → [8, 54, 100, 146, 192]

  // ── Engine fan points ──────────────────────────────────────────────────────
  // Input fan: 4 evenly spaced entries on the engine's left side
  const inputFanYs = [0.25, 0.40, 0.60, 0.75].map(
    (ratio) => engineY + ratio * engineH,
  );
  // Output fan: 5 evenly spaced exits on the engine's right side
  const outputFanYs = [0.20, 0.35, 0.50, 0.65, 0.80].map(
    (ratio) => engineY + ratio * engineH,
  );

  // ── Source rail right edge / Outcome rail left edge ────────────────────────
  const srcRight = sidePad + railW;   // where connector starts on the left
  const outLeft  = outcomeX;          // where connector ends on the right

  // Midpoint x for control points (roughly midway along each runway)
  const inMidX  = srcRight + runway * 0.55;
  const outMidX = engineX + engineW + runway * 0.45;

  // ── Input curves: source card center → engine left fan ────────────────────
  const inputCurves = sourceTops.map((top, i) => {
    const sy  = top + srcCardH / 2;
    const ey  = inputFanYs[i];
    return { sx: srcRight, sy, cp1x: inMidX, cp1y: sy, cp2x: inMidX, cp2y: ey, ex: engineX, ey };
  });

  // ── Output curves: engine right fan → outcome card center ─────────────────
  const outputCurves = outcomeTops.map((top, i) => {
    const sy  = outputFanYs[i];
    const ey  = top + outCardH / 2;
    return { sx: engineX + engineW, sy, cp1x: outMidX, cp1y: sy, cp2x: outMidX, cp2y: ey, ex: outLeft, ey };
  });

  // ── Junction dots (midpoints of each curve) ────────────────────────────────
  const inputJunctions = inputCurves.map((c) => ({
    ...pointOnCubic(c.sx, c.sy, c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.ex, c.ey, 0.5),
    type: "left",
  }));
  const outputJunctions = outputCurves.map((c) => ({
    ...pointOnCubic(c.sx, c.sy, c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.ex, c.ey, 0.5),
    type: "right",
  }));

  // ── Signal card (below engine, centred) ────────────────────────────────────
  const sigW   = w <= 340 ? 76 : 88;
  const sigH   = 50;
  const sigY   = engineY + engineH + 14;
  const sigX   = engineCX - sigW / 2;

  // ── Auxiliary connector (engine bottom → signal card) ─────────────────────
  const auxLine = {
    sx: engineCX, sy: engineY + engineH,
    ex: engineCX, ey: sigY,
  };

  // ── Canvas height ──────────────────────────────────────────────────────────
  const srcBottom = sourceTops.at(-1)  + srcCardH;
  const outBottom = outcomeTops.at(-1) + outCardH;
  const sigBottom = sigY + sigH;
  const height    = Math.max(srcBottom, outBottom, sigBottom) + 14;

  // ── Source rail line extents (top/bottom of first→last card center) ────────
  const srcLineTop    = sourceTops[0]  + srcCardH / 2;
  const srcLineBottom = sourceTops.at(-1) + srcCardH / 2;
  const outLineTop    = outcomeTops[0]    + outCardH / 2;
  const outLineBottom = outcomeTops.at(-1) + outCardH / 2;

  return {
    /** Total logical canvas width (matches container width, capped 300–430) */
    width: w,
    /** Total logical canvas height */
    height,
    sourceRail:  { x: sidePad,  width: railW },
    engine:      { x: engineX, y: engineY, width: engineW, height: engineH, cx: engineCX },
    signalCard:  { x: sigX,    y: sigY,    width: sigW,    height: sigH },
    outcomeRail: { x: outcomeX, width: railW },
    sourceTops,
    outcomeTops,
    srcCardH,
    outCardH,
    inputCurves,
    outputCurves,
    inputJunctions,
    outputJunctions,
    auxLine,
    /** Vertical extents for source/outcome rail connector lines */
    srcLineTop,
    srcLineBottom,
    outLineTop,
    outLineBottom,
  };
}
