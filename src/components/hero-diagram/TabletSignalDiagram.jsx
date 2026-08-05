import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Cpu,
  Landmark,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import "./TabletSignalDiagram.css";

const inputChips = [
  { id: "data", label: "Market Data", icon: Activity },
  { id: "cal", label: "Calendar", icon: CalendarDays },
  { id: "tv", label: "TradingView", icon: ChartNoAxesColumnIncreasing },
  { id: "liq", label: "Liquidity", icon: Landmark },
];

const outcomes = [
  { id: "copy", label: "Copy Trade", icon: Layers },
  { id: "risk", label: "Risk Control", icon: ShieldCheck },
  { id: "exec", label: "Auto Execute", icon: Zap },
];

const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

export default function TabletSignalDiagram() {
  const shouldReduceMotion = useReducedMotion();
  const hasIntersectionObserver =
    typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const animationProp = hasIntersectionObserver && !shouldReduceMotion
    ? { whileInView: "visible", viewport: { once: true, amount: 0.25 } }
    : { animate: "visible" };

  return (
    <motion.div
      className="tablet-signal-diagram"
      initial={shouldReduceMotion ? "visible" : "hidden"}
      {...animationProp}
      variants={containerVariants}
    >
      <div className="tablet-diagram-grid">
        {/* Left Inputs Column */}
        <div className="tablet-input-col">
          {inputChips.map((chip) => {
            const IconComp = chip.icon;
            return (
              <motion.div
                key={chip.id}
                className="tablet-chip"
                variants={itemVariants}
              >
                <div className="tablet-chip-icon">
                  <IconComp width={16} height={16} />
                </div>
                <span>{chip.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Center Signal Engine */}
        <motion.div className="tablet-engine-col" variants={itemVariants}>
          <div className="tablet-engine-icon-wrap">
            <Cpu width={22} height={22} />
          </div>
          <div className="tablet-engine-title">Olixer Signal Engine</div>
          <div className="tablet-engine-sub">Institutional execution</div>
        </motion.div>

        {/* Right Smart Signal Card */}
        <motion.div className="tablet-signal-card" variants={itemVariants}>
          <div className="tablet-signal-header">
            <div className="tablet-signal-pair">GBP / JPY</div>
            <div className="tablet-signal-badge">BUY</div>
          </div>
          <div className="tablet-signal-metric">
            <span className="tablet-metric-lbl">Entry</span>
            <span className="tablet-metric-val">198.420</span>
          </div>
          <div className="tablet-signal-metric">
            <span className="tablet-metric-lbl">Stop Loss</span>
            <span className="tablet-metric-val sl">198.120</span>
          </div>
          <div className="tablet-signal-metric">
            <span className="tablet-metric-lbl">Take Profit</span>
            <span className="tablet-metric-val tp">199.020</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Outcomes Row */}
      <div className="tablet-outcomes-row">
        {outcomes.map((outcome) => {
          const IconComp = outcome.icon;
          return (
            <motion.div
              key={outcome.id}
              className="tablet-outcome-card"
              variants={itemVariants}
            >
              <div className="tablet-outcome-icon">
                <IconComp width={16} height={16} />
              </div>
              <span>{outcome.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
