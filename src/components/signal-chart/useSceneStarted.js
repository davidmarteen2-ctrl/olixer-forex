import { useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useSceneStarted(ref, reduceMotion) {
  const [started, setStarted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (started) return undefined;

    if (reduceMotion || !("IntersectionObserver" in window) || !ref.current) {
      setStarted(true);
      return undefined;
    }

    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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
