import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  ChartNoAxesCombined,
  Landmark,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";

import {
  getMobileDiagramGeometry,
  mCurveToPath,
} from "./mobile-hero-diagram-geometry.js";
import "./MobileHeroDiagram.css";

// ── Source cards (4 inputs) ──────────────────────────────────────────────────
const SOURCE_CARDS = [
  { id: "calendar",    label: "Economic Calendar", desc: "Global events",    Icon: CalendarDays },
  { id: "market",      label: "Live Market Data",  desc: "Real-time FX",     Icon: ChartNoAxesColumnIncreasing },
  { id: "tradingview", label: "TradingView",        desc: "Advanced charts",  Icon: ChartNoAxesColumnIncreasing },
  { id: "brokers",     label: "Top Brokers",        desc: "Deep liquidity",   Icon: Landmark },
];

// ── Outcome cards (5 outputs) ────────────────────────────────────────────────
const OUTCOME_CARDS = [
  { id: "copy",        label: "COPY TRADING",         preview: "Momentum Pro", Icon: UsersRound },
  { id: "execution",   label: "SMART EXECUTION",       preview: "Filled",       Icon: Zap },
  { id: "risk",        label: "RISK MANAGEMENT",       preview: "1.0%",         Icon: ShieldCheck },
  { id: "portfolio",   label: "PORTFOLIO INSIGHTS",    preview: "8",            Icon: ChartPie },
  { id: "performance", label: "PERFORMANCE ANALYTICS", preview: "78%",          Icon: ChartNoAxesCombined },
];

// ── Framer Motion variants ───────────────────────────────────────────────────
function makeSourceVariant(reducedMotion) {
  return {
    hidden:  { opacity: 0, x: reducedMotion ? 0 : -6 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
  };
}
function makeOutcomeVariant(reducedMotion) {
  return {
    hidden:  { opacity: 0, x: reducedMotion ? 0 : 6 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } },
  };
}
function makeEngineVariant(reducedMotion) {
  return {
    hidden:  { opacity: 0, scale: reducedMotion ? 1 : 0.96 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  };
}
function makeSignalVariant(reducedMotion) {
  return {
    hidden:  { opacity: 0, y: reducedMotion ? 0 : 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
  };
}
function makeWireVariant(reducedMotion) {
  return {
    hidden:  { pathLength: 0, opacity: reducedMotion ? 1 : 0.35 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 0.36, ease: "easeInOut" } },
  };
}

// ── Source rail connector line (left vertical spine) ────────────────────────
function SourceRailLine({ geo }) {
  const { sourceRail, srcLineTop, srcLineBottom } = geo;
  const lineX = sourceRail.x + 14; // aligns with icon center

  return (
    <div
      className="mhd-rail-line mhd-rail-line--source"
      aria-hidden="true"
      style={{
        left:   lineX,
        top:    srcLineTop,
        height: srcLineBottom - srcLineTop,
      }}
    />
  );
}

// ── Outcome rail connector line (right vertical spine) ──────────────────────
function OutcomeRailLine({ geo }) {
  const { outcomeRail, outLineTop, outLineBottom } = geo;
  const lineX = outcomeRail.x + 14;

  return (
    <div
      className="mhd-rail-line mhd-rail-line--outcome"
      aria-hidden="true"
      style={{
        left:   lineX,
        top:    outLineTop,
        height: outLineBottom - outLineTop,
      }}
    />
  );
}

// ── Connector SVG ────────────────────────────────────────────────────────────
function ConnectorSVG({ geo, reducedMotion }) {
  const { width, height, inputCurves, outputCurves, inputJunctions, outputJunctions, auxLine } = geo;
  const wireVariant = makeWireVariant(reducedMotion);
  const stagger     = (i) => ({ delay: reducedMotion ? 0 : 0.12 + i * 0.06 });

  return (
    <svg
      className="mhd-connectors"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Input wires (grey) */}
      {inputCurves.map((c, i) => (
        <motion.path
          key={`in-${i}`}
          d={mCurveToPath(c)}
          stroke="#BDB7AB"
          strokeWidth={1.8}
          strokeLinecap="round"
          variants={wireVariant}
          initial="hidden"
          animate="visible"
          transition={stagger(i)}
        />
      ))}

      {/* Output wires (orange) */}
      {outputCurves.map((c, i) => (
        <motion.path
          key={`out-${i}`}
          d={mCurveToPath(c)}
          stroke="#ED8730"
          strokeWidth={1.8}
          strokeLinecap="round"
          variants={wireVariant}
          initial="hidden"
          animate="visible"
          transition={stagger(i + 4)}
        />
      ))}

      {/* Auxiliary line: engine bottom → signal card */}
      <motion.line
        x1={auxLine.sx} y1={auxLine.sy}
        x2={auxLine.ex} y2={auxLine.ey}
        stroke="#D0CBC1"
        strokeWidth={1.25}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.85, duration: 0.4 }}
      />

      {/* Junction dots on input wires */}
      {inputJunctions.map((j, i) => (
        <motion.circle
          key={`ij-${i}`}
          cx={j.x} cy={j.y} r={3.2}
          fill="none"
          stroke="#BDB7AB"
          strokeWidth={1.4}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.22 + i * 0.06, duration: 0.28 }}
        />
      ))}

      {/* Junction dots on output wires */}
      {outputJunctions.map((j, i) => (
        <motion.circle
          key={`oj-${i}`}
          cx={j.x} cy={j.y} r={3.2}
          fill="#F0821E"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.52 + i * 0.06, duration: 0.28 }}
        />
      ))}
    </svg>
  );
}

// ── Source card ──────────────────────────────────────────────────────────────
function SourceCard({ card, top, geo, reducedMotion, index }) {
  const { Icon } = card;
  const variant  = makeSourceVariant(reducedMotion);
  const { sourceRail, srcCardH } = geo;

  return (
    <motion.div
      className="mhd-source-card"
      style={{ left: sourceRail.x, top, width: sourceRail.width, height: srcCardH }}
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{ delay: reducedMotion ? 0 : 0.08 + index * 0.07 }}
      data-testid="mhd-source-card"
    >
      <span className="mhd-card-icon" aria-hidden="true">
        <Icon size={13} strokeWidth={2} />
      </span>
      <span className="mhd-card-text">
        <span className="mhd-card-title">{card.label}</span>
        <span className="mhd-card-desc">{card.desc}</span>
      </span>
    </motion.div>
  );
}

// ── Outcome card ─────────────────────────────────────────────────────────────
function OutcomeCard({ card, top, geo, reducedMotion, index }) {
  const { Icon } = card;
  const variant  = makeOutcomeVariant(reducedMotion);
  const { outcomeRail, outCardH } = geo;

  return (
    <motion.div
      className="mhd-outcome-card"
      style={{ left: outcomeRail.x, top, width: outcomeRail.width, height: outCardH }}
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{ delay: reducedMotion ? 0 : 0.44 + index * 0.07 }}
      data-testid="mhd-outcome-card"
    >
      <span className="mhd-card-icon mhd-card-icon--orange" aria-hidden="true">
        <Icon size={13} strokeWidth={2} />
      </span>
      <span className="mhd-card-text">
        <span className="mhd-card-title">{card.label}</span>
        <span className="mhd-card-desc mhd-card-desc--preview">{card.preview}</span>
      </span>
    </motion.div>
  );
}

// ── Signal engine puck ───────────────────────────────────────────────────────
function EngineNode({ geo, reducedMotion }) {
  const { engine } = geo;
  const variant    = makeEngineVariant(reducedMotion);

  return (
    <motion.div
      className="mhd-engine"
      style={{ left: engine.x, top: engine.y, width: engine.width, height: engine.height }}
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{ delay: reducedMotion ? 0 : 0.32 }}
      data-testid="mhd-engine"
    >
      {/* Candlestick icon — matches desktop SVG style */}
      <svg
        className="mhd-engine-icon"
        width={engine.width * 0.62}
        height={engine.width * 0.62}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path d="M16 13v38" stroke="#15171A" strokeWidth="2.8" strokeLinecap="round" />
        <rect x="11" y="22" width="10" height="20" rx="2.5" fill="#15171A" />
        <path d="M32 7v50" stroke="#F0821E" strokeWidth="3" strokeLinecap="round" />
        <rect x="26.5" y="16" width="11" height="30" rx="2.8" fill="#F0821E" />
        <path d="M48 17v34" stroke="#15171A" strokeWidth="2.8" strokeLinecap="round" />
        <rect x="43" y="26" width="10" height="16" rx="2.5" fill="#15171A" />
      </svg>
      <span className="mhd-engine-label">ENGINE</span>
    </motion.div>
  );
}

// ── Signal card (below engine) ───────────────────────────────────────────────
function SignalCard({ geo, reducedMotion }) {
  const { signalCard } = geo;
  const variant        = makeSignalVariant(reducedMotion);

  return (
    <motion.div
      className="mhd-signal-card"
      style={{ left: signalCard.x, top: signalCard.y, width: signalCard.width }}
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{ delay: reducedMotion ? 0 : 0.76 }}
      data-testid="mhd-signal-card"
    >
      <div className="mhd-signal-header">
        <span className="mhd-signal-dot" aria-hidden="true" />
        <span className="mhd-signal-pair">GBP/JPY</span>
        <span className="mhd-signal-buy">BUY</span>
      </div>
      <div className="mhd-signal-row">
        <span className="mhd-signal-key">Entry</span>
        <span className="mhd-signal-val">195.842</span>
      </div>
    </motion.div>
  );
}

// ── Root component ───────────────────────────────────────────────────────────
export default function MobileHeroDiagram() {
  const containerRef    = useRef(null);
  const reducedMotion   = useReducedMotion();
  const [geo, setGeo]   = useState(() => getMobileDiagramGeometry(390));

  // Measure container width and (re-)compute geometry
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setGeo(getMobileDiagramGeometry(w));
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="mhd-frame"
      aria-label="Olixer signal system: market inputs feed the signal engine which outputs live trading signals"
      role="img"
    >
      <div
        className="mhd-stage"
        style={{ width: geo.width, height: geo.height }}
      >
        {/* Connector SVG — rendered behind the cards */}
        <ConnectorSVG geo={geo} reducedMotion={reducedMotion} />

        {/* Source rail vertical spine */}
        <SourceRailLine geo={geo} />

        {/* Source cards (left rail) */}
        {SOURCE_CARDS.map((card, i) => (
          <SourceCard
            key={card.id}
            card={card}
            top={geo.sourceTops[i]}
            geo={geo}
            reducedMotion={reducedMotion}
            index={i}
          />
        ))}

        {/* Signal engine (centre) */}
        <EngineNode geo={geo} reducedMotion={reducedMotion} />

        {/* Outcome rail vertical spine */}
        <OutcomeRailLine geo={geo} />

        {/* Outcome cards (right rail) */}
        {OUTCOME_CARDS.map((card, i) => (
          <OutcomeCard
            key={card.id}
            card={card}
            top={geo.outcomeTops[i]}
            geo={geo}
            reducedMotion={reducedMotion}
            index={i}
          />
        ))}

        {/* Signal card (below engine) */}
        <SignalCard geo={geo} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}
