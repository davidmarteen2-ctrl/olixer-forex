import { useMemo, useRef } from "react";
import { motion } from "framer-motion";

import "./SignalChart.css";
import { ChartXAxis } from "./ChartXAxis.jsx";
import { CurrentPriceMarker } from "./CurrentPriceMarker.jsx";
import { PricePath } from "./PricePath.jsx";
import { ReferenceLevels } from "./ReferenceLevels.jsx";
import { plotFromSize } from "./chartConstants.js";
import { useChartScales } from "./useChartScales.js";
import { useContainerSize } from "./useContainerSize.js";
import { useSceneStarted } from "./useSceneStarted.js";

// SignalContextChart: mood + level context for a trade, not a second data
// table. Entry/Stop/Target/Risk already live as text in the card's own
// metrics grid (SignalStack.jsx). Design: a container-filling price chart
// (measured, no letterbox) built from three quiet layers —
//   1. ReferenceLevels — thin Entry / Target / Stop lines (no color blocks)
//   2. PricePath        — a neutral warm-white line over a soft gradient fill
//   3. CurrentPriceMarker — a single "you are here" dot whose ring is the
//      chart's one point of brand color
// No dot field, no floating level chips, no hover tooltip.
export default function SignalChart({ signal, reduceMotion = false }) {
  const svgRef = useRef(null);
  const started = useSceneStarted(svgRef, reduceMotion);
  const { width, height } = useContainerSize(svgRef);
  const plot = useMemo(() => plotFromSize(width, height), [width, height]);
  const { xScale, yScale } = useChartScales(signal, plot);

  const lastIndex = signal.chart.length - 1;
  const markerX = xScale(lastIndex);
  const markerY = yScale(signal.currentPrice);

  return (
    <svg
      ref={svgRef}
      className="signal-chart"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`signal-chart-title-${signal.id}`}
    >
      <title id={`signal-chart-title-${signal.id}`}>
        {signal.pair} {signal.side.toLowerCase()} signal example price chart with entry, target
        and stop levels.
      </title>

      <motion.g initial={reduceMotion ? false : "hidden"} animate={reduceMotion || started ? "show" : "hidden"}>
        <ReferenceLevels
          plot={plot}
          yScale={yScale}
          entryPrice={signal.entryPrice}
          targetPrice={signal.targetPrice}
          stopPrice={signal.stopPrice}
        />
        <PricePath plot={plot} xScale={xScale} yScale={yScale} values={signal.chart} />
        <ChartXAxis plot={plot} xScale={xScale} count={signal.chart.length} />
        <CurrentPriceMarker x={markerX} y={markerY} accent={signal.accent} />
      </motion.g>
    </svg>
  );
}
