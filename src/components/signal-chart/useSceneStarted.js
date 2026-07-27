import { useEffect, useState } from "react";

// Mirrors the viewport-gate hook already used in StepFlow.jsx / StatsSection.jsx
// in this project: one-time IntersectionObserver reveal with a jsdom-safe
// fallback so every test in this codebase keeps rendering synchronously.
export function useSceneStarted(ref, reduceMotion) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return undefined;

    if (reduceMotion || !("IntersectionObserver" in window) || !ref.current) {
      setStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, reduceMotion, started]);

  return started;
}
