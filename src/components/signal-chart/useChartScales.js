import { useMemo } from "react";

import { DEFAULT_PLOT } from "./chartConstants.js";

// Larger price -> smaller SVG y (SVG y grows downward, prices don't).
// extraValues (entry/target/stop/current) are folded into the domain so
// reference lines are never clipped and never derived from the visible
// chart range alone. `plot` carries the measured drawable rect; it defaults
// so the direct createYScale(values, extras) test calls keep working.
export function createYScale(values, extraValues = [], plot = DEFAULT_PLOT) {
  const all = [...values, ...extraValues];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min;
  const padding = range === 0 ? Math.max(Math.abs(min) * 0.05, 1) : range * 0.14;
  const domainMin = min - padding;
  const domainMax = max + padding;
  const domainSpan = domainMax - domainMin || 1;

  return (value) =>
    plot.bottom - ((value - domainMin) / domainSpan) * (plot.bottom - plot.top);
}

export function createXScale(count, plot = DEFAULT_PLOT) {
  if (count <= 1) return () => plot.left;
  const step = (plot.right - plot.left) / (count - 1);
  return (index) => plot.left + index * step;
}

export function useChartScales(signal, plot = DEFAULT_PLOT) {
  const { chart, entryPrice, targetPrice, stopPrice, currentPrice } = signal;

  return useMemo(() => {
    const yScale = createYScale(chart, [entryPrice, targetPrice, stopPrice, currentPrice], plot);
    const xScale = createXScale(chart.length, plot);
    return { xScale, yScale };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, entryPrice, targetPrice, stopPrice, currentPrice, plot.left, plot.right, plot.top, plot.bottom]);
}
