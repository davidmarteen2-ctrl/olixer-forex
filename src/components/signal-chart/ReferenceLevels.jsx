import { motion } from "framer-motion";

import { SCENE_EASE } from "./chartConstants.js";

const entryVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { delay: 0.45, duration: 0.35, ease: SCENE_EASE } },
};

const boundaryVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { delay: 0.6, duration: 0.4, ease: SCENE_EASE } },
};

// Three thin, precise horizontal reference lines — the way a real trading
// terminal marks Entry / Target / Stop. Deliberately NOT color blocks
// (those read cheap); the hierarchy is Entry strongest (warm-white dashed,
// the pivot) with Target/Stop as faint semantic hairlines. Numbers live in
// the card's metrics readout, so these lines carry no labels.
export function ReferenceLevels({ plot, yScale, entryPrice, targetPrice, stopPrice }) {
  const midX = (plot.left + plot.right) / 2;
  const line = (key, price, variants) => {
    const y = yScale(price);
    return (
      <motion.line
        key={key}
        className={`signal-chart__level signal-chart__level--${key}`}
        x1={plot.left}
        x2={plot.right}
        y1={y}
        y2={y}
        variants={variants}
        style={{ transformOrigin: `${midX}px ${y}px` }}
      />
    );
  };

  return (
    <g className="signal-chart__levels" aria-hidden="true">
      {line("target", targetPrice, boundaryVariants)}
      {line("stop", stopPrice, boundaryVariants)}
      {line("entry", entryPrice, entryVariants)}
    </g>
  );
}
