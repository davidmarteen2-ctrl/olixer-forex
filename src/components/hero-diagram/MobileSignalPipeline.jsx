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

const inputModules = [
  { id: "tv", label: "TradingView", icon: ChartNoAxesColumnIncreasing, className: "mod-tv" },
  { id: "data", label: "Market Data", icon: Activity, className: "mod-data" },
  { id: "cal", label: "Calendar", icon: CalendarDays, className: "mod-cal" },
  { id: "liq", label: "Liquidity", icon: Landmark, className: "mod-liq" },
];

const actionPills = [
  { id: "copy", label: "COPY", icon: Layers },
  { id: "protect", label: "PROTECT", icon: ShieldCheck },
  { id: "exec", label: "EXECUTE", icon: Zap },
];

const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

export default function MobileSignalPipeline() {
  const shouldReduceMotion = useReducedMotion();
  const hasObserver =
    typeof window !== "undefined" && typeof window.IntersectionObserver !== "undefined";

  const stageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const leftInputVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.42, ease: EASE_EDITORIAL, delay: 0.14 },
    },
  };

  const rightInputVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.42, ease: EASE_EDITORIAL, delay: 0.18 },
    },
  };

  const engineVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 10,
      filter: shouldReduceMotion ? "none" : "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.48, ease: EASE_EDITORIAL, delay: 0.08 },
    },
  };

  const signalCardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
      scale: shouldReduceMotion ? 1 : 0.975,
      filter: shouldReduceMotion ? "none" : "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: EASE_EDITORIAL, delay: 0.36 },
    },
  };

  const actionsVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: EASE_EDITORIAL, delay: 0.68 },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.65,
      transition: { duration: 0.55, ease: EASE_EDITORIAL, delay: 0.28 },
    },
  };

  const animTrigger =
    hasObserver && !shouldReduceMotion
      ? { whileInView: "visible", viewport: { once: true, amount: 0.22 } }
      : { animate: "visible" };

  return (
    <motion.div
      className="mobile-signal-stage"
      initial={shouldReduceMotion ? "visible" : "hidden"}
      {...animTrigger}
      variants={stageVariants}
      aria-label="Olixer signal system showing market inputs feeding the signal engine and producing a live GBP/JPY trading signal."
    >
      {/* Background Layer: Tech Texture & Ambient Glow */}
      <div className="mobile-stage-bg" aria-hidden="true" />

      {/* System Traces SVG Layer */}
      <svg
        className="mobile-stage-traces"
        viewBox="0 0 366 420"
        fill="none"
        aria-hidden="true"
      >
        {/* Background static gray traces */}
        <path
          d="M 45 74 C 95 74, 135 110, 183 130"
          stroke="rgba(21, 23, 26, 0.14)"
          strokeWidth="1.2"
        />
        <path
          d="M 320 54 C 270 54, 230 100, 183 130"
          stroke="rgba(21, 23, 26, 0.14)"
          strokeWidth="1.2"
        />
        <path
          d="M 183 162 L 183 220"
          stroke="rgba(21, 23, 26, 0.14)"
          strokeWidth="1.2"
        />

        {/* Animated active orange signal traces */}
        {!shouldReduceMotion && (
          <>
            <motion.path
              d="M 45 74 C 95 74, 135 110, 183 130"
              stroke="#F0821E"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              variants={pathVariants}
            />
            <motion.path
              d="M 320 54 C 270 54, 230 100, 183 130"
              stroke="#F0821E"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              variants={pathVariants}
            />
            <motion.path
              d="M 183 162 L 183 220"
              stroke="#F0821E"
              strokeWidth="2"
              variants={pathVariants}
            />
          </>
        )}
      </svg>

      {/* Midground Layer: Signal Engine Puck */}
      <motion.div className="mobile-stage-engine" variants={engineVariants}>
        <div className="engine-puck-icon">
          <Cpu width={18} height={18} />
        </div>
        <div className="engine-puck-info">
          <div className="engine-puck-title">SIGNAL ENGINE</div>
          <div className="engine-puck-sub">AI-powered core</div>
        </div>
        <div className="engine-puck-status">
          <span className="engine-status-dot" />
          <span>LIVE</span>
        </div>
      </motion.div>

      {/* Input Layer: Cropped Edge Modules */}
      <div className="mobile-stage-inputs" aria-hidden="true">
        {inputModules.map((mod) => {
          const IconComp = mod.icon;
          const isLeft = mod.className === "mod-tv" || mod.className === "mod-cal";
          return (
            <motion.div
              key={mod.id}
              className={`mobile-input-module ${mod.className}`}
              variants={isLeft ? leftInputVariants : rightInputVariants}
            >
              <div className="mod-icon">
                <IconComp width={15} height={15} />
              </div>
              <span className="mod-label">{mod.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Foreground Hero Layer: Dark Smart Signal Card */}
      <motion.div className="mobile-stage-signal-card" variants={signalCardVariants}>
        <div className="signal-card-header">
          <span className="signal-card-tag">Smart Signal</span>
          <span className="signal-confidence-badge">
            <span className="conf-dot" /> HIGH CONFIDENCE
          </span>
        </div>

        <div className="signal-card-body">
          <div className="signal-pair-row">
            <span className="signal-pair-name">GBP / JPY</span>
            <span className="signal-direction-badge">BUY</span>
          </div>

          <div className="signal-price-hero">
            <div className="price-primary">195.842</div>
            <div className="price-label">Entry</div>
          </div>

          <div className="signal-stats-grid">
            <div className="signal-stat-col">
              <span className="stat-label">Stop Loss</span>
              <span className="stat-val sl">195.120</span>
            </div>
            <div className="signal-stat-col">
              <span className="stat-label">Take Profit</span>
              <span className="stat-val tp">196.850</span>
            </div>
          </div>
        </div>

        <div className="signal-card-footer">
          <span className="footer-live-dot" />
          <span>Live • Signal verified</span>
        </div>
      </motion.div>

      {/* Action Layer: Bottom Output Pills */}
      <motion.div className="mobile-stage-actions" variants={actionsVariants}>
        {actionPills.map((pill) => {
          const IconComp = pill.icon;
          return (
            <div key={pill.id} className="mobile-action-pill">
              <IconComp width={15} height={15} />
              <span>{pill.label}</span>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
