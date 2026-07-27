import { motion } from "framer-motion";

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { delay: 1.55, duration: 0.3, type: "spring", stiffness: 320, damping: 26 } },
};

const ringVariants = {
  hidden: { scale: 0.7, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { delay: 1.7, duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// "You are here" — the latest price point. A quiet white dot with a single
// thin accent ring: this is the ONE point of brand color in an otherwise
// neutral chart (the price path is warm-white, the semantic color lives in
// the zones). Lands once on reveal — no continuous pulse, no expanding halo.
export function CurrentPriceMarker({ x, y, accent }) {
  return (
    <motion.g className="signal-chart__marker" style={{ transformOrigin: `${x}px ${y}px` }} aria-hidden="true">
      <motion.circle
        className="signal-chart__marker-ring"
        cx={x}
        cy={y}
        r="7"
        style={{ stroke: accent, transformOrigin: `${x}px ${y}px` }}
        variants={ringVariants}
      />
      <motion.circle
        cx={x}
        cy={y}
        r="4"
        fill="#fff"
        style={{ transformOrigin: `${x}px ${y}px` }}
        variants={dotVariants}
      />
    </motion.g>
  );
}
