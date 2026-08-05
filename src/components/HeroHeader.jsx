import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

const EASE_EDITORIAL = [0.22, 1, 0.36, 1];

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.0,
      staggerChildren: 0.12,
    },
  },
};

export const badgeVariants = {
  hidden: { y: 4, opacity: 0.92 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.36, ease: EASE_EDITORIAL },
  },
};

export const line1Variants = {
  hidden: (isMobile) => ({
    y: isMobile ? "90%" : "105%",
    opacity: 0,
    filter: isMobile ? "blur(3px)" : "blur(5px)",
  }),
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_EDITORIAL, delay: 0.18 },
  },
};

export const line2Variants = {
  hidden: (isMobile) => ({
    y: isMobile ? "90%" : "105%",
    opacity: 0,
    filter: isMobile ? "blur(3px)" : "blur(5px)",
  }),
  visible: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE_EDITORIAL, delay: 0.30 },
  },
};

export const lineVariants = line1Variants;

export const subtextVariants = {
  hidden: (isMobile) => ({
    y: isMobile ? 8 : 12,
    opacity: 0,
    filter: "blur(3px)",
  }),
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_EDITORIAL, delay: 0.62 },
  },
};

export const reducedLineVariants = {
  hidden: { y: "0%", opacity: 0, filter: "none" },
  visible: {
    y: "0%",
    opacity: 1,
    filter: "none",
    transition: { duration: 0.2, ease: "linear" },
  },
};

export const reducedSubtextVariants = {
  hidden: { y: 0, opacity: 0, filter: "none" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "none",
    transition: { duration: 0.2, ease: "linear" },
  },
};

export default function HeroHeader({ shouldAnimate = true, reducedMotionOverride }) {
  const controls = useAnimationControls();

  const [reducedMotion, setReducedMotion] = useState(
    () =>
      reducedMotionOverride ??
      (typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false),
  );

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 760px)").matches,
  );

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (reducedMotionOverride !== undefined) {
      setReducedMotion(reducedMotionOverride);
    } else if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = (e) => setReducedMotion(e.matches);
      mediaQuery.addEventListener?.("change", handleChange);
      return () => mediaQuery.removeEventListener?.("change", handleChange);
    }
  }, [reducedMotionOverride]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(max-width: 760px)");
      const handleChange = (e) => setIsMobile(e.matches);
      mediaQuery.addEventListener?.("change", handleChange);
      return () => mediaQuery.removeEventListener?.("change", handleChange);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frameId1;
    let frameId2;
    let safetyTimeoutId;

    const clearPendingState = () => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("hero-intro-pending");
      }
      if (typeof window !== "undefined" && window.__heroIntroFallback) {
        clearTimeout(window.__heroIntroFallback);
      }
    };

    if (reducedMotion || !shouldAnimate) {
      clearPendingState();
      controls.set("visible");
      setIsAnimating(false);
      return;
    }

    controls.set("hidden");
    setIsAnimating(true);
    clearPendingState();

    safetyTimeoutId = setTimeout(() => {
      if (!cancelled) {
        controls.set("visible");
        setIsAnimating(false);
      }
    }, 1400);

    const startChoreography = async () => {
      if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
        try {
          await Promise.race([
            document.fonts.ready,
            new Promise((res) => setTimeout(res, 500)),
          ]);
        } catch {
          // ignore font load error
        }
      }
      if (cancelled) return;

      frameId1 = requestAnimationFrame(() => {
        if (cancelled) return;
        frameId2 = requestAnimationFrame(() => {
          if (cancelled) return;

          controls.start("visible").then(() => {
            if (!cancelled) {
              setIsAnimating(false);
              if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
            }
          });
        });
      });
    };

    startChoreography();

    return () => {
      cancelled = true;
      if (frameId1) cancelAnimationFrame(frameId1);
      if (frameId2) cancelAnimationFrame(frameId2);
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
    };
  }, [controls, reducedMotion, shouldAnimate]);

  const initialMode = shouldAnimate && !reducedMotion ? "hidden" : false;

  const activeLine1Variants = reducedMotion ? reducedLineVariants : line1Variants;
  const activeLine2Variants = reducedMotion ? reducedLineVariants : line2Variants;
  const activeSubtextVariants = reducedMotion ? reducedSubtextVariants : subtextVariants;

  return (
    <motion.div
      className="hero-header-content"
      data-animating={isAnimating ? "true" : undefined}
      initial={initialMode}
      animate={controls}
      variants={containerVariants}
    >
      <motion.div className="badge" variants={badgeVariants}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#15171A">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
        Trusted by traders worldwide
      </motion.div>

      <h1>
        <span className="headline-line-mask">
          <motion.span
            className="headline-line"
            custom={isMobile}
            variants={activeLine1Variants}
          >
            Smart Forex Signals. Copy Top Traders.
          </motion.span>
        </span>
        <span className="headline-line-mask">
          <motion.span
            className="headline-line"
            custom={isMobile}
            variants={activeLine2Variants}
          >
            Execute with Confidence.
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="sub"
        custom={isMobile}
        variants={activeSubtextVariants}
      >
        <span>Real-time market intelligence, institutional-grade execution,</span>
        <br />
        <span>and copy trading — all in one powerful platform.</span>
      </motion.p>
    </motion.div>
  );
}
