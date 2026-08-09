import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";

import copyTradingImage from "../assets/card-shuffle/copy-trading-network.jpg";
import marketIntelligenceImage from "../assets/card-shuffle/market-intelligence.jpg";
import mobileExecutionImage from "../assets/card-shuffle/mobile-execution.jpg";
import performanceAnalyticsImage from "../assets/card-shuffle/performance-analytics.jpg";
import "./CardShuffle.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const cardShuffleItems = [
  {
    id: "market",
    number: "01",
    heading: "Live Market Intelligence",
    supportingText:
      "Read institutional-grade signals and real-time charts before the market moves.",
    image: marketIntelligenceImage,
    imagePosition: "58% center",
    alt: "Institutional market data across a precision trading workstation",
  },
  {
    id: "copy",
    number: "02",
    heading: "Copy Trading Network",
    supportingText:
      "Follow proven traders and mirror their strategies automatically in your own account.",
    image: copyTradingImage,
    imagePosition: "62% center",
    alt: "Two synchronized trading terminals connected by an orange signal line",
  },
  {
    id: "mobile",
    number: "03",
    heading: "Mobile Execution",
    supportingText:
      "Monitor signals, manage risk, and control open positions wherever the day takes you.",
    image: mobileExecutionImage,
    imagePosition: "68% center",
    alt: "Mobile trading interface on a matte black phone",
  },
  {
    id: "analytics",
    number: "04",
    heading: "Performance Analytics",
    supportingText:
      "See account growth, drawdown, and risk in one clear performance workspace.",
    image: performanceAnalyticsImage,
    imagePosition: "56% center",
    alt: "Layered glass panels displaying performance analytics",
  },
];

const bentoPositions = [
  { x: "-25.5%", y: "-25.5%" },
  { x: "25.5%", y: "-25.5%" },
  { x: "-25.5%", y: "25.5%" },
  { x: "25.5%", y: "25.5%" },
];

const settleRanges = [
  [0.04, 0.7],
  [0.08, 0.78],
  [0.12, 0.86],
  [0.16, 0.94],
];

function ShuffleCard({ card, index, progress, reduceMotion }) {
  const range = settleRanges[index];
  const position = bentoPositions[index];
  const initialRotation = (index - 1.5) * 1.25;

  const x = useTransform(progress, range, ["0%", position.x]);
  const y = useTransform(progress, range, ["0%", position.y]);
  const scale = useTransform(progress, range, [1, 0.49]);
  const rotate = useTransform(
    progress,
    range,
    [initialRotation, 0],
  );

  const staticPosition = reduceMotion
    ? {
        x: position.x,
        y: position.y,
        scale: 0.49,
        rotate: 0,
      }
    : { x, y, scale, rotate };

  return (
    <motion.article
      className="card-shuffle__card"
      style={{ ...staticPosition, zIndex: cardShuffleItems.length - index }}
      aria-labelledby={`shuffle-title-${card.id}`}
    >
      <img
        src={card.image}
        alt={card.alt}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        width="1536"
        height="1024"
        style={{ objectPosition: card.imagePosition }}
        draggable="false"
      />
      <span className="card-shuffle__scrim" aria-hidden="true" />
      <div className="card-shuffle__topline" style={{ fontWeight: 700 }}>
        <span>Olixer / Platform</span>
        <span>{card.number}</span>
      </div>
      <div className="card-shuffle__copy">
        <p style={{ fontWeight: 700 }}>{card.supportingText}</p>
        <h3 id={`shuffle-title-${card.id}`}>{card.heading}</h3>
      </div>
    </motion.article>
  );
}

export default function CardShuffle({ reducedMotion }) {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = reducedMotion ?? prefersReducedMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 500,
    damping: 60,
    mass: 1,
  });

  useIsomorphicLayoutEffect(() => {
    smoothProgress.set(scrollYProgress.get());
  }, [scrollYProgress, smoothProgress]);

  return (
    <section
      ref={sectionRef}
      className={`card-shuffle${reduceMotion ? " card-shuffle--reduced" : ""}`}
      data-surface-pattern="grid"
      role="region"
      aria-label="Olixer platform capabilities"
    >
      <div className="card-shuffle__sticky">
        <div className="card-shuffle__guide" aria-hidden="true">
          <span className="card-shuffle__guide-line" />
          <span>Scroll to shuffle</span>
        </div>

        <div className="card-shuffle__counter" aria-label="Four platform capabilities">
          <span>01 / 04</span>
        </div>

        <div className="card-shuffle__deck">
          {cardShuffleItems.map((card, index) => (
            <ShuffleCard
              key={card.id}
              card={card}
              index={index}
              progress={smoothProgress}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
