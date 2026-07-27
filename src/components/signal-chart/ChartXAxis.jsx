import { motion } from "framer-motion";

const axisVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 1.3, duration: 0.3 } },
};

// Minimal tick marks along the plot baseline — no fabricated dates on
// illustrative "example data". Ticks every 3rd sample (plus the last) are
// enough to read "time passes left to right" without inventing calendar
// values.
export function ChartXAxis({ plot, xScale, count }) {
  const tickIndices = [];
  for (let index = 0; index < count; index += 3) tickIndices.push(index);
  if (tickIndices.at(-1) !== count - 1) tickIndices.push(count - 1);

  return (
    <motion.g className="signal-chart__axis" variants={axisVariants} aria-hidden="true">
      {tickIndices.map((index) => (
        <line
          key={index}
          className="signal-chart__axis-tick"
          x1={xScale(index)}
          x2={xScale(index)}
          y1={plot.bottom + 6}
          y2={plot.bottom + 11}
        />
      ))}
    </motion.g>
  );
}
