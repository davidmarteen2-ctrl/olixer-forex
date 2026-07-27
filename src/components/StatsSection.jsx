import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import "./StatsSection.css";

const SCENE_EASE = [0.22, 1, 0.36, 1];

// Illustrative growth trend for the "Traders connected" area sparkline —
// same "example data" framing as the Signal Desk cards, not a live feed.
const TRADERS_TREND = [3200, 4100, 4800, 5600, 6900, 7800, 8900, 9700, 10600, 11400, 12000];

// Structural only — no fabricated completion/drop-off percentages on a
// marketing page. Mirrors StepFlow's own four onboarding steps.
const WORKFLOW_STAGES = [
  { label: "Create account", width: 100 },
  { label: "Connect broker", width: 78 },
  { label: "Choose trader", width: 56 },
  { label: "Copy trades", width: 38 },
];

const WORKSPACE_SEGMENTS = [
  { label: "Pipeline", color: "#f0821e" },
  { label: "Signals", color: "#7698ff" },
  { label: "Copy engine", color: "#36c978" },
  { label: "Broker network", color: "#f06464" },
];

const STATS = [
  {
    value: 12000,
    suffix: "+",
    label: "Traders connected",
    accent: "#36c978",
    chart: { type: "area", data: TRADERS_TREND },
  },
  {
    value: 24,
    suffix: "/5",
    label: "Market coverage",
    accent: "#f0821e",
    chart: { type: "gauge", value: 96 },
  },
  {
    value: 4,
    prefix: "0",
    label: "Guided workflow",
    accent: "#7698ff",
    chart: { type: "funnel" },
  },
  {
    value: 1,
    label: "Unified workspace",
    accent: "#f0821e",
    chart: { type: "ring" },
  },
];

const easeOutExpo = (progress) =>
  progress === 1 ? 1 : 1 - 2 ** (-10 * progress);

const SPARK_WIDTH = 120;
const SPARK_HEIGHT = 36;
const SPARK_PAD = 2;

// Area sparkline — restrained straight-segment trend line (no curve
// smoothing library) beneath "Traders connected". Draws via pathLength,
// same technique as the Signal Desk chart, just far smaller in scope.
function AreaSparkline({ values, accent, gradientId, started, reducedMotion }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => ({
    x: SPARK_PAD + (index / (values.length - 1)) * (SPARK_WIDTH - SPARK_PAD * 2),
    y: SPARK_HEIGHT - SPARK_PAD - ((value - min) / range) * (SPARK_HEIGHT - SPARK_PAD * 2),
  }));
  const linePath = points.map((point, i) => `${i === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const areaPath = `${linePath} L${points.at(-1).x},${SPARK_HEIGHT} L${points[0].x},${SPARK_HEIGHT} Z`;

  return (
    <svg
      className="stats-chart stats-chart--area"
      viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#${gradientId})`}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion || started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={
          reducedMotion || started
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{
          pathLength: { delay: 0.3, duration: 0.9, ease: "easeOut" },
          opacity: { delay: 0.3, duration: 0.01 },
        }}
      />
    </svg>
  );
}

const GAUGE_SIZE = 76;
const GAUGE_RADIUS = 30;
const GAUGE_NOTCH_LENGTH = 6;
const GAUGE_TOTAL_NOTCHES = 24;
const GAUGE_START_ANGLE = 135;
const GAUGE_END_ANGLE = 405;

function polarPoint(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angleRad), y: cy + radius * Math.sin(angleRad) };
}

// Arc gauge — notches distributed around a 270deg sweep, same technique as
// bklit's Gauge component (notches, not a filled arc stroke), hand-rolled.
function GaugeArc({ value, accent, started, reducedMotion }) {
  const cx = GAUGE_SIZE / 2;
  const cy = GAUGE_SIZE / 2;
  const activeCount = Math.round((value / 100) * GAUGE_TOTAL_NOTCHES);

  const notches = Array.from({ length: GAUGE_TOTAL_NOTCHES }, (_, index) => {
    const angle =
      GAUGE_START_ANGLE + (index / (GAUGE_TOTAL_NOTCHES - 1)) * (GAUGE_END_ANGLE - GAUGE_START_ANGLE);
    const inner = polarPoint(cx, cy, GAUGE_RADIUS - GAUGE_NOTCH_LENGTH, angle);
    const outer = polarPoint(cx, cy, GAUGE_RADIUS, angle);
    return { inner, outer, active: index < activeCount, index };
  });

  return (
    <svg className="stats-chart stats-chart--gauge" viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`} aria-hidden="true">
      {notches.map((notch) => (
        <motion.line
          key={notch.index}
          x1={notch.inner.x}
          y1={notch.inner.y}
          x2={notch.outer.x}
          y2={notch.outer.y}
          className={notch.active ? "stats-chart__notch stats-chart__notch--active" : "stats-chart__notch"}
          style={notch.active ? { stroke: accent } : undefined}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={reducedMotion || started ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 + notch.index * 0.014, duration: 0.2 }}
        />
      ))}
    </svg>
  );
}

// Structural funnel — four narrowing bars, one per onboarding step. No
// completion/drop-off numbers: this is a marketing page, not an analytics
// dashboard, so the taper is illustrative of sequence only.
function WorkflowFunnel({ accent, started, reducedMotion }) {
  return (
    <div className="stats-chart stats-chart--funnel" aria-hidden="true">
      {WORKFLOW_STAGES.map((stage, index) => (
        <motion.div
          key={stage.label}
          className="stats-chart__funnel-row"
          style={{
            width: `${stage.width}%`,
            transformOrigin: "center",
            background: index === WORKFLOW_STAGES.length - 1 ? accent : undefined,
          }}
          initial={reducedMotion ? false : { scaleX: 0 }}
          animate={reducedMotion || started ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: SCENE_EASE }}
        />
      ))}
    </div>
  );
}

const RING_SIZE = 76;
const RING_RADIUS = 28;
const RING_STROKE = 8;
const RING_GAP_DEG = 5;

// Ring — one ring split into segments (Pipeline / Signals / Copy engine /
// Broker network) converging into a single "1" workspace, adapted from
// bklit's RingChart technique for a "many parts, one whole" story rather
// than RingChart's literal multi-ring channel comparison.
function WorkspaceRing({ started, reducedMotion }) {
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;
  const circumference = 2 * Math.PI * RING_RADIUS;
  const gapLength = (RING_GAP_DEG / 360) * circumference;
  const segmentLength = circumference / WORKSPACE_SEGMENTS.length - gapLength;

  let rotation = -90;

  return (
    <svg className="stats-chart stats-chart--ring" viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true">
      <circle
        className="stats-chart__ring-track"
        cx={cx}
        cy={cy}
        r={RING_RADIUS}
        strokeWidth={RING_STROKE}
      />
      {WORKSPACE_SEGMENTS.map((segment, index) => {
        const segmentRotation = rotation;
        rotation += 360 / WORKSPACE_SEGMENTS.length;

        return (
          <motion.circle
            key={segment.label}
            cx={cx}
            cy={cy}
            r={RING_RADIUS}
            strokeWidth={RING_STROKE}
            className="stats-chart__ring-segment"
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            style={{
              stroke: segment.color,
              transform: `rotate(${segmentRotation}deg)`,
              transformOrigin: "50% 50%",
            }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={reducedMotion || started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.35, ease: SCENE_EASE }}
          />
        );
      })}
      <text className="stats-chart__ring-center" x={cx} y={cy + 4} textAnchor="middle">
        1
      </text>
    </svg>
  );
}

function StatChart({ stat, started, reducedMotion }) {
  const { chart, accent } = stat;

  if (chart.type === "area") {
    return (
      <AreaSparkline
        values={chart.data}
        accent={accent}
        gradientId={`stats-spark-${stat.label.replace(/\s+/g, "-").toLowerCase()}`}
        started={started}
        reducedMotion={reducedMotion}
      />
    );
  }
  if (chart.type === "gauge") {
    return <GaugeArc value={chart.value} accent={accent} started={started} reducedMotion={reducedMotion} />;
  }
  if (chart.type === "funnel") {
    return <WorkflowFunnel accent={accent} started={started} reducedMotion={reducedMotion} />;
  }
  return <WorkspaceRing started={started} reducedMotion={reducedMotion} />;
}

export function formatStatValue(
  value,
  { prefix = "", suffix = "", decimals = 0, separator = true } = {},
) {
  const number = separator
    ? Number(value).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : Number(value).toFixed(decimals);

  return `${prefix}${number}${suffix}`;
}

function AnimatedNumber({ stat, started, reducedMotion }) {
  const [current, setCurrent] = useState(reducedMotion ? stat.value : 0);

  useEffect(() => {
    if (!started) return undefined;

    if (reducedMotion) {
      setCurrent(stat.value);
      return undefined;
    }

    let frame;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(stat.value * easeOutExpo(progress));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, started, stat.value]);

  return (
    <span className="stats-band__value" aria-hidden="true">
      {formatStatValue(current, stat)}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      setStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStarted(true);
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <ul className="stats-band" ref={sectionRef} aria-label="Olixer platform stats">
      {STATS.map((stat) => {
        const finalValue = formatStatValue(stat.value, stat);

        return (
          <li
            className="stats-band__item"
            aria-label={`${finalValue} ${stat.label}`}
            key={stat.label}
          >
            <AnimatedNumber
              stat={stat}
              started={started}
              reducedMotion={reducedMotion}
            />
            <span className="stats-band__label" aria-hidden="true">
              {stat.label}
            </span>
            <div className="stats-chart-slot">
              <StatChart stat={stat} started={started} reducedMotion={reducedMotion} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
