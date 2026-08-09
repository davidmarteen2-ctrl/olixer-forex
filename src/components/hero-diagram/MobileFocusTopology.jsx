import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import "./MobileFocusTopology.css";

const EASE_EDITORIAL = [0.22, 1, 0.36, 1];
const VARIANT_RELAY = { hidden: {}, visible: {} };

export default function MobileFocusTopology() {
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

  const inputLeftVariant = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.36, ease: EASE_EDITORIAL },
    },
  };

  const inputRightVariant = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.36, ease: EASE_EDITORIAL },
    },
  };

  const pathVariant = {
    hidden: { pathLength: 0, opacity: shouldReduceMotion ? 1 : 0.2 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: "easeInOut" },
    },
  };

  const handoffVariant = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0.35,
      scaleY: shouldReduceMotion ? 1 : 0,
    },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.32, ease: EASE_EDITORIAL },
    },
  };

  const engineVariant = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
      filter: shouldReduceMotion ? "none" : "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.44, ease: EASE_EDITORIAL },
    },
  };

  const signalCardVariant = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
      scale: shouldReduceMotion ? 1 : 0.98,
      filter: shouldReduceMotion ? "none" : "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.52, ease: EASE_EDITORIAL },
    },
  };

  const pillGroupVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.4, ease: EASE_EDITORIAL },
    },
  };

  const animationProps = hasIntersectionObserver && !shouldReduceMotion
    ? { whileInView: "visible", viewport: { once: true, amount: 0.25 } }
    : { animate: "visible" };

  return (
    <motion.div
      className="mobile-focus-topology"
      data-testid="mobile-focus-stage"
      aria-label="Olixer signal system showing market inputs feeding the signal engine and producing a live GBP/JPY trading signal with copy, risk and execution controls."
      role="img"
      initial={shouldReduceMotion ? "visible" : "hidden"}
      {...animationProps}
      variants={containerVariants}
    >
      {/* ── Background Layer ──────────────────────────────────────────────── */}
      <div className="mobile-focus-bg-glow" aria-hidden="true" />

      {/* SVG Short Connectors */}
      <svg
        className="mobile-focus-connectors"
        viewBox="0 0 366 410"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Left connector: Calendar chip -> Engine */}
        <motion.path
          d="M 84 56 C 112 65, 138 76, 158 92"
          stroke="#F0821E"
          strokeWidth="1.25"
          strokeLinecap="round"
          variants={pathVariant}
        />
        {/* Right connector: TradingView chip -> Engine */}
        <motion.path
          d="M 282 56 C 254 65, 228 76, 208 92"
          stroke="#F0821E"
          strokeWidth="1.25"
          strokeLinecap="round"
          variants={pathVariant}
        />
      </svg>

      {/* ── Input Layer ─────────────────────────────────────────────────── */}
      <div className="mobile-focus-inputs">
        <motion.div className="mobile-focus-chip chip-calendar" variants={inputLeftVariant}>
          <div className="chip-icon">
            <CalendarDays size={14} strokeWidth={2} />
          </div>
          <div className="chip-label-wrap">
            <span className="chip-title chip-title-full">Economic Calendar</span>
            <span className="chip-title chip-title-short">Calendar</span>
            <span className="chip-sub">Global events</span>
          </div>
        </motion.div>

        <motion.div className="mobile-focus-chip chip-tradingview" variants={inputRightVariant}>
          <div className="chip-icon">
            <ChartNoAxesColumnIncreasing size={14} strokeWidth={2} />
          </div>
          <div className="chip-label-wrap">
            <span className="chip-title">TradingView</span>
            <span className="chip-sub">Live feed</span>
          </div>
        </motion.div>
      </div>

      {/* ── Engine Layer ────────────────────────────────────────────────── */}
      <motion.div
        className="mobile-focus-engine"
        data-variant-relay="true"
        variants={VARIANT_RELAY}
      >
        <motion.div className="mobile-focus-engine-motion" variants={engineVariant}>
          <div className="engine-card">
            <div className="engine-mark">
              <svg
                className="engine-candlestick-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M7 4v16" stroke="#15171A" strokeWidth="2" strokeLinecap="round" />
                <rect x="5" y="8" width="4" height="8" rx="1" fill="#15171A" />
                <path d="M17 3v18" stroke="#F0821E" strokeWidth="2" strokeLinecap="round" />
                <rect x="15" y="7" width="4" height="10" rx="1" fill="#F0821E" />
              </svg>
            </div>
            <div className="engine-copy">
              <div className="engine-title-row">
                <span className="engine-title">SIGNAL ENGINE</span>
                <span className="engine-live-badge">
                  <i aria-hidden="true" /> Live
                </span>
              </div>
              <span className="engine-desc">Market structure aligned</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mobile-focus-signal-link"
        variants={handoffVariant}
        aria-hidden="true"
      >
        <span />
      </motion.div>

      {/* ── Foreground Layer: Smart Signal Card ─────────────────────────── */}
      <motion.div
        className="mobile-focus-signal-wrap"
        data-variant-relay="true"
        variants={VARIANT_RELAY}
      >
        <motion.div className="mobile-focus-signal-motion" variants={signalCardVariant}>
          <div className="smart-signal-card">
            <div className="smart-signal-header">
              <span className="smart-signal-tag">Smart Signal</span>
              <span className="smart-signal-confidence">HIGH CONFIDENCE</span>
            </div>

            <div className="smart-signal-instrument-row">
              <div className="instrument-pair">
                <span className="pair-symbol">GBP / JPY</span>
              </div>
              <span className="buy-badge">BUY</span>
            </div>

            <div className="smart-signal-price-row">
              <div className="price-label-col">
                <span className="price-entry-label">Entry</span>
                <span className="price-value">195.842</span>
              </div>
              <div className="price-targets-col">
                <div className="target-item sl">
                  <span className="target-lbl">SL</span>
                  <span className="target-val">195.542</span>
                </div>
                <div className="target-item tp">
                  <span className="target-lbl">TP</span>
                  <span className="target-val">196.442</span>
                </div>
              </div>
            </div>

            <div className="smart-signal-footer">
              <span className="footer-status">
                <i aria-hidden="true" /> Live • Signal verified
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Outcome Layer: 3 Action Pills + Progressive Micro Label ─────── */}
      <motion.div className="mobile-focus-outcomes" variants={pillGroupVariant}>
        <div className="outcome-action-rail">
          <div className="outcome-action">
            <UsersRound size={14} strokeWidth={2} className="pill-icon" />
            <span>Copy</span>
          </div>
          <div className="outcome-action">
            <ShieldCheck size={14} strokeWidth={2} className="pill-icon" />
            <span>Risk</span>
          </div>
          <div className="outcome-action">
            <Zap size={14} strokeWidth={2} className="pill-icon" />
            <span>Execute</span>
          </div>
        </div>

        <div className="progressive-disclosure-label">
          <span>+ 2 more capabilities</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
