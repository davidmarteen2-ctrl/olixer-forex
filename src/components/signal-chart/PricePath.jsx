import { motion } from "framer-motion";
import { useId } from "react";

// Monotone cubic (Fritsch-Carlson) interpolation — the same overshoot
// guarantee d3's curveMonotoneX provides, without pulling in d3-shape.
function monotoneCubicPath(points) {
  const n = points.length;
  if (n < 2) return "";
  if (n === 2) {
    return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;
  }

  const dx = [];
  const slope = [];
  for (let i = 0; i < n - 1; i += 1) {
    dx[i] = points[i + 1].x - points[i].x;
    slope[i] = (points[i + 1].y - points[i].y) / dx[i];
  }

  const tangent = [slope[0]];
  for (let i = 1; i < n - 1; i += 1) {
    tangent[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  tangent[n - 1] = slope[n - 2];

  for (let i = 0; i < n - 1; i += 1) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const magnitude = a * a + b * b;
    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude);
      tangent[i] = scale * a * slope[i];
      tangent[i + 1] = scale * b * slope[i];
    }
  }

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const step = dx[i] / 3;
    const c1x = p0.x + step;
    const c1y = p0.y + tangent[i] * step;
    const c2x = p1.x - step;
    const c2y = p1.y - tangent[i + 1] * step;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p1.x},${p1.y}`;
  }
  return d;
}

const strokeVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: 0.9, duration: 1.05, ease: "easeOut" },
      opacity: { delay: 0.9, duration: 0.01 },
    },
  },
};

const areaVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 1.5, duration: 0.45 } },
};

// The hero: a warm-white price line (neutral — semantic color belongs to the
// level lines, and a neutral line never reads as win/loss) over a soft
// vertical gradient that fades to transparent. The gradient reads far more
// premium than a flat fill or a color block. useId keeps the gradient id
// unique across the 4 cards that mount simultaneously.
export function PricePath({ plot, xScale, yScale, values }) {
  const gradientId = useId();
  const points = values.map((value, index) => ({ x: xScale(index), y: yScale(value) }));
  const linePath = monotoneCubicPath(points);
  const areaPath = `${linePath} L${points.at(-1).x},${plot.bottom} L${points[0].x},${plot.bottom} Z`;

  return (
    <g className="signal-chart__price-path">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9e7e2" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#e9e7e2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        className="signal-chart__area"
        d={areaPath}
        fill={`url(#${gradientId})`}
        variants={areaVariants}
        aria-hidden="true"
      />
      <motion.path className="signal-chart__line" d={linePath} variants={strokeVariants} aria-hidden="true" />
    </g>
  );
}
