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
import "./MobileSignalPipeline.css";

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

export default function MobileSignalPipeline() {
  const shouldReduceMotion = useReducedMotion();
  const hasIntersectionObserver =
    typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.38,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const engineVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 10,
      filter: shouldReduceMotion ? "none" : "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.52,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const signalCardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
      scale: shouldReduceMotion ? 1 : 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.52,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.42,
        ease: EASE_EDITORIAL,
      },
    },
  };

  const packetVariants = {
    hidden: { y: -18, opacity: 0 },
    visible: {
      y: 18,
      opacity: [0, 1, 1, 0],
      transition: {
        duration: shouldReduceMotion ? 0.2 : 1.2,
        repeat: shouldReduceMotion ? 0 : Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const animationProp = hasIntersectionObserver && !shouldReduceMotion
    ? { whileInView: "visible", viewport: { once: true, amount: 0.25 } }
    : { animate: "visible" };

  return (
    <motion.div
      className="mobile-signal-pipeline"
      initial={shouldReduceMotion ? "visible" : "hidden"}
      {...animationProp}
      variants={containerVariants}
    >
      <div className="mobile-pipeline-center-guide" aria-hidden="true" />

      {/* Input Section */}
      <motion.div className="mobile-pipeline-section-label" variants={itemVariants}>
        Market Inputs
      </motion.div>

      <div className="mobile-input-grid">
        {inputChips.map((chip) => {
          const IconComp = chip.icon;
          return (
            <motion.div
              key={chip.id}
              className="mobile-input-chip"
              variants={itemVariants}
            >
              <div className="mobile-chip-icon">
                <IconComp width={15} height={15} />
              </div>
              <span className="mobile-chip-text">{chip.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Connector Stage 1 */}
      <div className="mobile-connector-stage" aria-hidden="true">
        <motion.div
          className="mobile-signal-line"
          style={{ originY: 0 }}
          variants={lineVariants}
        />
        {!shouldReduceMotion && (
          <motion.div className="mobile-signal-packet" variants={packetVariants} />
        )}
      </div>

      {/* Signal Engine Processing Card */}
      <motion.div className="mobile-signal-engine" variants={engineVariants}>
        <div className="mobile-engine-left">
          <div className="mobile-engine-icon-wrap">
            <Cpu width={18} height={18} />
          </div>
          <div>
            <div className="mobile-engine-title">Olixer Signal Engine</div>
            <div className="mobile-engine-sub">Market structure aligned</div>
          </div>
        </div>
        <div className="mobile-engine-status">
          <span className="mobile-status-dot" />
          <span>Active</span>
        </div>
      </motion.div>

      {/* Connector Stage 2 */}
      <div className="mobile-connector-stage" aria-hidden="true">
        <motion.div
          className="mobile-signal-line"
          style={{ originY: 0 }}
          variants={lineVariants}
        />
        {!shouldReduceMotion && (
          <motion.div className="mobile-signal-packet" variants={packetVariants} />
        )}
      </div>

      {/* Smart Signal Card */}
      <motion.div className="mobile-smart-signal" variants={signalCardVariants}>
        <div className="mobile-signal-header">
          <div className="mobile-signal-pair">GBP / JPY</div>
          <div className="mobile-signal-direction">BUY</div>
        </div>

        <div className="mobile-signal-grid">
          <div className="mobile-signal-metric">
            <span className="mobile-metric-label">Entry</span>
            <span className="mobile-metric-val">198.420</span>
          </div>
          <div className="mobile-signal-metric">
            <span className="mobile-metric-label">Stop Loss</span>
            <span className="mobile-metric-val sl">198.120</span>
          </div>
          <div className="mobile-signal-metric">
            <span className="mobile-metric-label">Take Profit</span>
            <span className="mobile-metric-val tp">199.020</span>
          </div>
        </div>
      </motion.div>

      {/* Outcome Row */}
      <div className="mobile-outcome-row">
        {outcomes.map((outcome) => {
          const IconComp = outcome.icon;
          return (
            <motion.div
              key={outcome.id}
              className="mobile-outcome-card"
              variants={itemVariants}
            >
              <div className="mobile-outcome-icon">
                <IconComp width={15} height={15} />
              </div>
              <span className="mobile-outcome-label">{outcome.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
