import { motion } from "framer-motion";
import {
  ChartNoAxesCombined,
  ChartPie,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";

import "./FeatureRail.css";

export const featureRows = [
  {
    id: "copy-trading",
    title: "COPY TRADING",
    description: "Follow top traders",
    icon: UsersRound,
    preview: "copy",
  },
  {
    id: "smart-execution",
    title: "SMART EXECUTION",
    description: "Low latency fills",
    icon: Zap,
    preview: "execution",
  },
  {
    id: "risk-management",
    title: "RISK MANAGEMENT",
    description: "Protect your capital",
    icon: ShieldCheck,
    preview: "risk",
  },
  {
    id: "portfolio-insights",
    title: "PORTFOLIO INSIGHTS",
    description: "Track & optimize",
    icon: ChartPie,
    preview: "portfolio",
  },
  {
    id: "performance-analytics",
    title: "PERFORMANCE ANALYTICS",
    description: "Measure & improve",
    icon: ChartNoAxesCombined,
    preview: "performance",
  },
];

function CopyTradingPreview() {
  return (
    <div className="feature-preview feature-preview--copy">
      <img
        className="feature-preview__avatar"
        src="https://i.pravatar.cc/150?u=a"
        alt=""
        aria-hidden="true"
      />
      <span className="feature-preview__identity">
        <strong>Strategy: Momentum Pro</strong>
        <span>Provider: @AlexFX</span>
      </span>
      <svg
        className="feature-preview__sparkline"
        width="68"
        height="24"
        viewBox="0 0 68 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 18C9 18 11 12 17 14C23 16 26 20 32 14C38 8 42 5 47 8C53 11 58 6 66 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function ExecutionPreview() {
  return (
    <div className="feature-preview feature-preview--execution">
      <strong>Market Order</strong>
      <span className="feature-preview__status">
        <i aria-hidden="true" />
        Filled
      </span>
    </div>
  );
}

function RiskPreview() {
  return (
    <div className="feature-preview feature-preview--risk">
      <span className="feature-preview__risk-head">
        <span>Risk per trade</span>
        <strong>1.00%</strong>
      </span>
      <span className="feature-preview__slider" aria-hidden="true">
        <i className="feature-preview__slider-fill" />
        <i className="feature-preview__slider-thumb" />
        <i className="feature-preview__slider-rest" />
      </span>
    </div>
  );
}

function PortfolioPreview() {
  return (
    <div className="feature-preview feature-preview--portfolio">
      <span>Open Positions</span>
      <strong>8</strong>
      <span className="feature-preview__bars" aria-hidden="true">
        {[5, 9, 7, 12, 8, 15].map((height, index) => (
          <i key={`${height}-${index}`} style={{ height }} />
        ))}
      </span>
    </div>
  );
}

function PerformancePreview() {
  return (
    <div className="feature-preview feature-preview--performance">
      <span>Win Rate</span>
      <i className="feature-preview__progress" aria-hidden="true" />
      <strong>78%</strong>
    </div>
  );
}

function FeaturePreview({ type }) {
  if (type === "execution") return <ExecutionPreview />;
  if (type === "risk") return <RiskPreview />;
  if (type === "portfolio") return <PortfolioPreview />;
  if (type === "performance") return <PerformancePreview />;
  return <CopyTradingPreview />;
}

export function FeatureRow({
  feature,
  motionManaged = false,
  reducedMotion = false,
}) {
  const Icon = feature.icon;
  const hiddenRow = motionManaged && !reducedMotion
    ? { opacity: 0, x: -6, scale: 0.99 }
    : false;
  const hiddenIcon = motionManaged && !reducedMotion
    ? { opacity: 0, x: -8, scale: 0.96 }
    : false;
  const hiddenPart = motionManaged && !reducedMotion
    ? { opacity: 0, x: -8 }
    : false;

  return (
    <motion.article
      className="feature-row"
      role="listitem"
      data-feature-id={feature.id}
      data-motion={motionManaged ? "outcome-row" : undefined}
      initial={hiddenRow}
    >
      <motion.span
        className="feature-row__icon"
        data-motion={motionManaged ? "outcome-icon" : undefined}
        initial={hiddenIcon}
        aria-hidden="true"
      >
        <Icon size={26} strokeWidth={1.9} />
      </motion.span>

      <motion.div
        className="feature-row__copy"
        data-motion={motionManaged ? "outcome-copy" : undefined}
        initial={hiddenPart}
      >
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </motion.div>

      <motion.div
        className="feature-row__preview"
        data-motion={motionManaged ? "outcome-preview" : undefined}
        data-preview-type={feature.preview}
        initial={hiddenPart}
        aria-label={`${feature.title} preview`}
      >
        <FeaturePreview type={feature.preview} />
      </motion.div>
    </motion.article>
  );
}

export default function FeatureRail({
  motionManaged = false,
  reducedMotion = false,
}) {
  const hiddenRailLine = motionManaged && !reducedMotion
    ? { opacity: 0 }
    : false;

  return (
    <div className="feature-rail" role="list" aria-label="Platform features">
      <motion.div
        className="feature-rail__line"
        data-motion={motionManaged ? "outcome-rail-line" : undefined}
        initial={hiddenRailLine}
        aria-hidden="true"
      />
      {featureRows.map((feature) => (
        <FeatureRow
          key={feature.id}
          feature={feature}
          motionManaged={motionManaged}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
