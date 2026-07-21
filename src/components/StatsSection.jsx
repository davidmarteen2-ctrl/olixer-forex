import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import "./StatsSection.css";

const STATS = [
  { value: 12000, suffix: "+", label: "Traders connected" },
  { value: 24, suffix: "/5", label: "Market coverage" },
  { value: 4, prefix: "0", label: "Guided workflow" },
  { value: 1, label: "Unified workspace" },
];

const easeOutExpo = (progress) =>
  progress === 1 ? 1 : 1 - 2 ** (-10 * progress);

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
          </li>
        );
      })}
    </ul>
  );
}
