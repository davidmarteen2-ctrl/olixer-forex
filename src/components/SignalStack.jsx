import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { startTransition, useEffect, useState } from "react";

import SignalChart from "./SignalChart.jsx";
import "./SignalStack.css";

export const signalCards = [
  {
    id: "eurusd",
    pair: "EUR/USD",
    side: "Buy",
    setup: "Trend continuation",
    summary: "Price holds above intraday support as momentum rebuilds toward the session high.",
    entry: "1.0842",
    stop: "1.0790",
    target: "1.0920",
    risk: "1.0%",
    category: "Major FX",
    accent: "#36c978",
    chart: [302, 286, 296, 254, 268, 224, 238, 194, 210, 166, 178, 132],
  },
  {
    id: "xauusd",
    pair: "XAU/USD",
    side: "Buy",
    setup: "Momentum breakout",
    summary: "Gold clears a compressed range with rising participation and a defined invalidation level.",
    entry: "2,336.8",
    stop: "2,318.0",
    target: "2,372.0",
    risk: "0.8%",
    category: "Metals",
    accent: "#f0a33a",
    chart: [286, 268, 276, 258, 264, 232, 242, 218, 224, 176, 148, 112],
  },
  {
    id: "gbpjpy",
    pair: "GBP/JPY",
    side: "Sell",
    setup: "Resistance rejection",
    summary: "A failed push through resistance leaves a lower high and opens room toward prior support.",
    entry: "198.42",
    stop: "199.18",
    target: "196.90",
    risk: "0.7%",
    category: "Cross FX",
    accent: "#f06464",
    chart: [128, 142, 120, 156, 148, 186, 174, 218, 206, 252, 238, 290],
  },
  {
    id: "nas100",
    pair: "NAS100",
    side: "Buy",
    setup: "Session breakout",
    summary: "The index reclaims the opening range after a shallow pullback and renewed buying pressure.",
    entry: "19,842",
    stop: "19,690",
    target: "20,180",
    risk: "0.6%",
    category: "Indices",
    accent: "#7698ff",
    chart: [310, 292, 274, 288, 254, 236, 246, 206, 184, 196, 152, 118],
  },
];

const clampIndex = (index) => Math.max(0, Math.min(signalCards.length - 1, index));

export function getCardPose(
  index,
  activeIndex,
  isMobile = false,
  reducedMotion = false,
) {
  const offset = index - activeIndex;

  if (index < activeIndex) {
    return {
      x: 0,
      y: reducedMotion ? 0 : isMobile ? 600 : 800,
      scale: reducedMotion ? 1 : 0.9,
      opacity: 0,
      rotateX: reducedMotion ? 0 : 15,
      rotateZ: 0,
      zIndex: signalCards.length + index + 100,
    };
  }

  if (isMobile) {
    return {
      x: 0,
      y: reducedMotion ? 0 : offset * -8,
      scale: reducedMotion ? 1 : Math.max(0.7, 1 - offset * 0.05),
      opacity: 1,
      rotateX: 0,
      rotateZ: 0,
      zIndex: signalCards.length - offset,
    };
  }

  return {
    x: 0,
    y: reducedMotion ? 0 : offset * -40,
    scale: reducedMotion ? 1 : Math.max(0.6, 1 - offset * 0.08),
    opacity: 1,
    rotateX: 0,
    rotateZ: 0,
    zIndex: signalCards.length - offset,
  };
}

export default function SignalStack({ reducedMotion }) {
  const dragX = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotion ?? prefersReducedMotion;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      startTransition(() => setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectCard = (index) => {
    startTransition(() => setActiveIndex(clampIndex(index)));
  };

  const handleKeyDown = (event) => {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      selectCard(activeIndex + 1);
    } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      selectCard(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectCard(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectCard(signalCards.length - 1);
    }
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);

    if (info.offset.x > 50) selectCard(activeIndex - 1);
    if (info.offset.x < -50) selectCard(activeIndex + 1);

    animate(dragX, 0, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <div
      className="signal-stack"
      role="region"
      aria-label="Olixer example signals"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <p className="signal-stack__position" aria-live="polite">
        Example signal {activeIndex + 1} of {signalCards.length}
      </p>

      <button
        className="signal-stack__arrow signal-stack__arrow--previous"
        type="button"
        aria-label="Previous signal"
        aria-controls="signal-stack-cards"
        disabled={activeIndex === 0}
        onClick={() => selectCard(activeIndex - 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m14.5 6-6 6 6 6" />
        </svg>
      </button>

      <button
        className="signal-stack__arrow signal-stack__arrow--next"
        type="button"
        aria-label="Next signal"
        aria-controls="signal-stack-cards"
        disabled={activeIndex === signalCards.length - 1}
        onClick={() => selectCard(activeIndex + 1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </button>

      <div className="signal-stack__cards" id="signal-stack-cards">
        {signalCards.map((signal, index) => {
          const isActive = index === activeIndex;
          const isViewed = index < activeIndex;

          return (
            <motion.article
              className="signal-stack__card"
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!isActive && !isDragging) selectCard(index);
              }}
              animate={getCardPose(index, activeIndex, isMobile, reduceMotion)}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : isViewed
                    ? { type: "spring", stiffness: 80, damping: 20 }
                    : { type: "spring", stiffness: 260, damping: 30 }
              }
              style={{
                "--signal-accent": signal.accent,
                cursor: isActive ? "grab" : "pointer",
                pointerEvents: isViewed ? "none" : "auto",
              }}
              aria-hidden={isViewed ? "true" : undefined}
              aria-labelledby={`signal-title-${signal.id}`}
              key={signal.id}
            >
              <div className="signal-card__visual">
                <div className="signal-card__visual-top">
                  <span>Olixer / Signal desk</span>
                  <span>Example data</span>
                </div>
                <SignalChart signal={signal} />
                <div className="signal-card__visual-bottom">
                  <span>{signal.pair}</span>
                  <span className={`signal-card__bias signal-card__bias--${signal.side.toLowerCase()}`}>
                    {signal.side} setup
                  </span>
                </div>
              </div>

              <div className="signal-card__content">
                <div>
                  <div className="signal-card__meta">
                    <span>Illustrative signal</span>
                    <span>{signal.category}</span>
                  </div>

                  <div className="signal-card__heading">
                    <div>
                      <span>Market setup</span>
                      <h3 id={`signal-title-${signal.id}`}>{signal.pair}</h3>
                    </div>
                    <span className={`signal-card__side signal-card__side--${signal.side.toLowerCase()}`}>
                      {signal.side}
                    </span>
                  </div>

                  <p className="signal-card__setup">{signal.setup}</p>
                  <p className="signal-card__summary">{signal.summary}</p>
                </div>

                <dl className="signal-card__metrics">
                  <div>
                    <dt>Entry</dt>
                    <dd>{signal.entry}</dd>
                  </div>
                  <div>
                    <dt>Stop loss</dt>
                    <dd>{signal.stop}</dd>
                  </div>
                  <div>
                    <dt>Target</dt>
                    <dd>{signal.target}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{signal.risk}</dd>
                  </div>
                </dl>

                <div className="signal-card__footer">
                  <span>For interface demonstration only</span>
                  <button type="button" onClick={(event) => event.stopPropagation()}>
                    Inspect setup
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="signal-stack__dots" aria-label="Choose an example signal">
        {signalCards.map((signal, index) => (
          <button
            type="button"
            aria-label={`Go to ${signal.pair} signal`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => selectCard(index)}
            key={signal.id}
          />
        ))}
      </div>
    </div>
  );
}
