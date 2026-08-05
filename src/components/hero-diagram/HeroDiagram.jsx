import { useEffect } from "react";
import {
  animate as motionAnimate,
  motion,
  useAnimate,
  useReducedMotion,
} from "framer-motion";
import { CalendarDays, ChartNoAxesColumnIncreasing, Landmark } from "lucide-react";

import FeatureRail from "../FeatureRail.jsx";
import {
  curveToPath,
  HERO_DIAGRAM_GEOMETRY,
  HERO_DIAGRAM_VISUAL_TOKENS,
  inputCurves,
  inputJunctions,
  outputCurves,
  outputJunctions,
} from "./hero-diagram-geometry.js";
import {
  buildHeroMotionSequence,
  startSignalPacketFlow,
} from "./hero-motion-timeline.js";
import "./HeroDiagram.css";

const sourceCards = [
  {
    title: "Economic Calendar",
    description: "Global events & impact",
    top: -4,
    icon: "calendar",
  },
  {
    title: "Live Market Data",
    description: "Real-time FX prices",
    top: 84,
    icon: "market",
  },
  {
    title: "TradingView",
    description: "Advanced charting",
    top: 173,
    icon: "tradingview",
  },
  {
    title: "Top Brokers",
    description: "Deep liquidity access",
    top: 265,
    icon: "broker",
  },
];

const packetPaths = [
  "input-1",
  "input-3",
  "output-0",
  "output-2",
  "output-4",
];

function SourceIcon({ type }) {
  if (type === "calendar") {
    return <CalendarDays size={24} strokeWidth={2} />;
  }
  if (type === "market") {
    return (
      <ChartNoAxesColumnIncreasing
        size={24}
        stroke="#1FA357"
        strokeWidth={2}
      />
    );
  }
  if (type === "broker") {
    return <Landmark size={24} strokeWidth={2} />;
  }

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="#2962FF"
      role="img"
      aria-label="TradingView"
    >
      <path d="M15.8654 8.2789c0 1.3541-1.0978 2.4519-2.452 2.4519-1.354 0-2.4519-1.0978-2.4519-2.452 0-1.354 1.0978-2.4518 2.452-2.4518 1.3541 0 2.4519 1.0977 2.4519 2.4519zM9.75 6H0v4.9038h4.8462v7.2692H9.75Zm8.5962 0H24l-5.1058 12.173h-5.6538z" />
    </svg>
  );
}

function SourceCard({ source, reducedMotion }) {
  return (
    <motion.div
      className="abs feat left"
      data-motion="source"
      data-testid="source-card"
      initial={
        reducedMotion ? false : { opacity: 0, x: -8, scale: 0.98 }
      }
      style={{ left: 0, top: source.top }}
    >
      <div className="feat-text">
        <div className="t">{source.title}</div>
        <div className="s">{source.description}</div>
      </div>
      <div className="feat-icon">
        <SourceIcon type={source.icon} />
      </div>
    </motion.div>
  );
}

function SourceRail({ reducedMotion }) {
  const { sourceRail, height } = HERO_DIAGRAM_GEOMETRY;

  return (
    <div
      className="source-rail"
      data-layout="source-rail"
      style={{
        left: sourceRail.x,
        top: 0,
        width: sourceRail.width,
        height,
      }}
    >
      {sourceCards.map((source) => (
        <SourceCard
          source={source}
          reducedMotion={reducedMotion}
          key={source.title}
        />
      ))}
    </div>
  );
}

function ConnectorNetwork({ reducedMotion }) {
  const { width, height, engine } = HERO_DIAGRAM_GEOMETRY;
  const visuals = HERO_DIAGRAM_VISUAL_TOKENS;
  const hiddenPath = reducedMotion ? false : { pathLength: 0, opacity: 0.35 };
  const hiddenNode = reducedMotion ? false : { opacity: 0, scale: 0.7 };
  const junctions = [...inputJunctions, ...outputJunctions];

  return (
    <motion.svg
      className="connectors"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      {inputCurves.map((curve, index) => (
        <motion.path
          className="wire l"
          data-motion="input-wire"
          data-path-id={`input-${index}`}
          data-testid="input-wire"
          d={curveToPath(curve)}
          stroke={visuals.inputWireColor}
          strokeWidth={visuals.wireStrokeWidth}
          initial={hiddenPath}
          key={`input-${index}`}
        />
      ))}

      {outputCurves.map((curve, index) => (
        <motion.path
          className="wire r"
          data-motion="output-wire"
          data-path-id={`output-${index}`}
          data-testid="output-wire"
          d={curveToPath(curve)}
          stroke={visuals.outputWireColor}
          strokeWidth={visuals.wireStrokeWidth}
          initial={hiddenPath}
          key={`output-${index}`}
        />
      ))}

      <motion.path
        className="wire f"
        d={`M${width / 2} ${engine.y + engine.height} C${width / 2} 244, ${width / 2} 253, ${width / 2} 260`}
        stroke={visuals.auxiliaryWireColor}
        strokeWidth={visuals.auxiliaryWireStrokeWidth}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 1.22, duration: 0.6 }}
      />

      {junctions.map(({ x: cx, y: cy, type }, index) => {
        const solid = type === "right-dot";
        const left = type === "left";
        return (
          <motion.circle
            data-motion="junction"
            cx={cx}
            cy={cy}
            r={
              solid
                ? visuals.junctionDotRadius
                : visuals.junctionRingRadius
            }
            fill={solid ? "#F0821E" : "#fff"}
            stroke={solid ? undefined : left ? "#BFB9AD" : "#EF9C50"}
            strokeWidth={solid ? undefined : visuals.junctionStrokeWidth}
            initial={hiddenNode}
            key={`${cx}-${cy}-${index}`}
          />
        );
      })}

      {packetPaths.map((path) => (
        <motion.circle
          className="signal-packet"
          data-motion="packet"
          data-path={path}
          cx="0"
          cy="0"
          r={visuals.packetRadius}
          fill={path.startsWith("input") ? "#8D887F" : "#F0821E"}
          opacity="0"
          key={path}
        />
      ))}
    </motion.svg>
  );
}

function SignalEngine({ reducedMotion }) {
  const { engine } = HERO_DIAGRAM_GEOMETRY;

  return (
    <motion.div
      className="abs tile"
      data-motion="engine"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
      style={{ left: engine.x, top: engine.y }}
    >
      <svg width="54" height="54" viewBox="0 0 64 64" fill="none">
        <path
          d="M16 13v38"
          stroke="#15171A"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <rect x="11" y="22" width="10" height="20" rx="2.5" fill="#15171A" />
        <path
          d="M32 7v50"
          stroke="#F0821E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="26.5" y="16" width="11" height="30" rx="2.8" fill="#F0821E" />
        <path
          d="M48 17v34"
          stroke="#15171A"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <rect x="43" y="26" width="10" height="16" rx="2.5" fill="#15171A" />
      </svg>
      <span className="tile-label">
        <strong>SIGNAL ENGINE</strong>
        <span>AI-Powered Core</span>
      </span>
    </motion.div>
  );
}

function SignalCard({ reducedMotion }) {
  const { signalCard } = HERO_DIAGRAM_GEOMETRY;

  return (
    <motion.div
      className="abs signal-card"
      data-motion="signal-card"
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      style={{ left: signalCard.x, top: signalCard.y }}
    >
      <div className="head">
        <span className="gdot" style={{ width: 5, height: 5 }} />
        <span className="k">Smart Signal</span>
        <span className="status signal-confidence">High Confidence</span>
      </div>
      <div className="pair-row">
        <span className="pair">GBP/JPY</span>
        <span className="pill-buy">BUY</span>
      </div>
      <div className="levels">
        <div className="lvl">
          <div className="lk">Entry</div>
          <div className="lv">195.842</div>
        </div>
        <div className="lvl">
          <div className="lk">SL</div>
          <div className="lv">196.850</div>
        </div>
        <div className="lvl">
          <div className="lk">TP</div>
          <div className="lv">194.820</div>
        </div>
      </div>
    </motion.div>
  );
}

function DiagramNotes({ reducedMotion }) {
  const { notes } = HERO_DIAGRAM_GEOMETRY;
  const noteInitial = reducedMotion ? false : { opacity: 0 };

  return (
    <>
      <motion.div
        className="diagram-note diagram-note--market"
        initial={noteInitial}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.72, duration: 0.45 }}
        style={{ left: notes.market.x, top: notes.market.y }}
      >
        Market data in <span>↓</span>
      </motion.div>
      <motion.div
        className="diagram-note diagram-note--execution"
        initial={noteInitial}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.82, duration: 0.45 }}
        style={{ left: notes.execution.x, top: notes.execution.y }}
      >
        Execution routed <span>↓</span>
      </motion.div>
      <motion.div
        className="diagram-note diagram-note--validated"
        initial={noteInitial}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 1.15, duration: 0.45 }}
        style={{ left: notes.validated.x, top: notes.validated.y }}
      >
        <span>✓</span> Signal validated
      </motion.div>
      <motion.div
        className="diagram-note diagram-note--risk"
        initial={noteInitial}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 1.23, duration: 0.45 }}
        style={{ left: notes.risk.x, top: notes.risk.y }}
      >
        <span>♢</span> Risk monitored
      </motion.div>
    </>
  );
}

function OutcomeRail({ reducedMotion }) {
  const { outcomeRail } = HERO_DIAGRAM_GEOMETRY;

  return (
    <div
      className="diagram-feature-root"
      data-layout="outcome-rail"
      style={{ left: outcomeRail.x, width: outcomeRail.width }}
    >
      <FeatureRail
        motionManaged
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

export default function HeroDiagram({ reducedMotionOverride }) {
  const [scope, animateSequence] = useAnimate();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;
  const { typography, surface } = HERO_DIAGRAM_VISUAL_TOKENS;

  useEffect(() => {
    if (reducedMotion || !scope.current) return undefined;

    const entrance = animateSequence(buildHeroMotionSequence());
    const stopPackets = startSignalPacketFlow(scope.current, motionAnimate);

    return () => {
      entrance.stop();
      stopPackets();
    };
  }, [animateSequence, reducedMotion, scope]);

  return (
    <div
      className="diagram hero-diagram"
      ref={scope}
      style={{
        "--diagram-source-title-size": typography.sourceTitleSize,
        "--diagram-source-description-size": typography.sourceDescriptionSize,
        "--diagram-outcome-title-size": typography.outcomeTitleSize,
        "--diagram-outcome-description-size": typography.outcomeDescriptionSize,
        "--diagram-preview-size": typography.previewSize,
        "--diagram-engine-title-size": typography.engineTitleSize,
        "--diagram-engine-description-size": typography.engineDescriptionSize,
        "--diagram-border-strong": surface.borderStrong,
        "--diagram-shadow-strong": surface.shadowStrong,
      }}
    >
      <ConnectorNetwork reducedMotion={reducedMotion} />

      <SourceRail reducedMotion={reducedMotion} />
      <SignalEngine reducedMotion={reducedMotion} />
      <SignalCard reducedMotion={reducedMotion} />
      <DiagramNotes reducedMotion={reducedMotion} />
      <OutcomeRail reducedMotion={reducedMotion} />
    </div>
  );
}
