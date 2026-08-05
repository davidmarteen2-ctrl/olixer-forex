import { stagger } from "framer-motion";

export const HERO_EASE = [0.22, 1, 0.36, 1];

export const HERO_MOTION_TIMING = {
  stagger: 0.08,
  cardDuration: 0.52,
  pathDuration: 1.05,
  engineDuration: 0.45,
  packetDuration: 1.8,
  packetPause: 4,
};

export function buildHeroMotionSequence() {
  const {
    stagger: staggerDelay,
    cardDuration,
    pathDuration,
    engineDuration,
  } = HERO_MOTION_TIMING;

  return [
    [
      "[data-motion='source']",
      { opacity: [0, 1], x: [-8, 0], scale: [0.98, 1] },
      {
        at: 0,
        delay: stagger(staggerDelay),
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='input-wire']",
      { pathLength: [0, 1], opacity: [0.35, 1] },
      {
        at: 0.16,
        delay: stagger(staggerDelay),
        duration: pathDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='engine']",
      { opacity: [0, 1], scale: [0.96, 1, 1.025, 1] },
      {
        at: 0.72,
        duration: engineDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='signal-card']",
      { opacity: [0, 1], y: [6, 0] },
      { at: 1, duration: cardDuration, ease: HERO_EASE },
    ],
    [
      "[data-motion='output-wire']",
      { pathLength: [0, 1], opacity: [0.35, 1] },
      {
        at: 0.9,
        delay: stagger(staggerDelay),
        duration: pathDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='outcome-rail-line']",
      { opacity: [0, 1] },
      {
        at: 1.2,
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='outcome-row']",
      { opacity: [0, 1], x: [-6, 0], scale: [0.99, 1] },
      {
        at: 1.2,
        delay: stagger(staggerDelay),
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='outcome-icon']",
      { opacity: [0, 1], x: [-8, 0], scale: [0.96, 1] },
      {
        at: 1.2,
        delay: stagger(staggerDelay),
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='outcome-copy']",
      { opacity: [0, 1], x: [-8, 0] },
      {
        at: 1.28,
        delay: stagger(staggerDelay),
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='outcome-preview']",
      { opacity: [0, 1], x: [-8, 0] },
      {
        at: 1.36,
        delay: stagger(staggerDelay),
        duration: cardDuration,
        ease: HERO_EASE,
      },
    ],
    [
      "[data-motion='junction']",
      { opacity: [0, 1], scale: [0.7, 1] },
      {
        at: 1.42,
        delay: stagger(0.025),
        duration: 0.35,
        ease: HERO_EASE,
      },
    ],
  ];
}

export function startSignalPacketFlow(root, animateValue) {
  if (!root) return () => {};

  const packets = [...root.querySelectorAll("[data-motion='packet'][data-path]")];
  const controls = packets.flatMap((packet, index) => {
    const path = root.querySelector(`[data-path-id="${packet.dataset.path}"]`);
    if (
      !path ||
      typeof path.getTotalLength !== "function" ||
      typeof path.getPointAtLength !== "function"
    ) {
      return [];
    }

    const pathLength = path.getTotalLength();
    const control = animateValue(0, 1, {
      delay: 2.1 + index * 0.45,
      duration: HERO_MOTION_TIMING.packetDuration,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: HERO_MOTION_TIMING.packetPause,
      onUpdate: (progress) => {
        const point = path.getPointAtLength(pathLength * progress);
        packet.setAttribute("cx", String(point.x));
        packet.setAttribute("cy", String(point.y));
        packet.setAttribute(
          "opacity",
          String(Math.min(progress * 8, (1 - progress) * 8, 1)),
        );
      },
    });

    return [control];
  });

  return () => {
    controls.forEach((control) => control.stop());
  };
}
