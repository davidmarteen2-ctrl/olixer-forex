import { describe, expect, it, vi } from "vitest";

import {
  buildHeroMotionSequence,
  HERO_MOTION_TIMING,
  startSignalPacketFlow,
} from "./hero-motion-timeline.js";

describe("hero diagram Motion timeline", () => {
  it("orders inputs before engine, outputs, and outcome details", () => {
    const sequence = buildHeroMotionSequence();

    expect(sequence.map(([selector]) => selector)).toEqual([
      "[data-motion='source']",
      "[data-motion='input-wire']",
      "[data-motion='engine']",
      "[data-motion='signal-card']",
      "[data-motion='output-wire']",
      "[data-motion='outcome-rail-line']",
      "[data-motion='outcome-row']",
      "[data-motion='outcome-icon']",
      "[data-motion='outcome-copy']",
      "[data-motion='outcome-preview']",
      "[data-motion='junction']",
    ]);
    expect(HERO_MOTION_TIMING.stagger).toBe(0.08);
  });

  it("moves signal packets with Motion and returns a cleanup function", () => {
    const path = {
      getTotalLength: () => 100,
      getPointAtLength: (length) => ({ x: length, y: length / 2 }),
    };
    const packet = {
      dataset: { path: "output-0" },
      setAttribute: vi.fn(),
    };
    const root = {
      querySelectorAll: () => [packet],
      querySelector: () => path,
    };
    const stop = vi.fn();
    const animateValue = vi.fn((_from, _to, options) => {
      options.onUpdate(0.5);
      return { stop };
    });

    const cleanup = startSignalPacketFlow(root, animateValue);

    expect(animateValue).toHaveBeenCalledWith(
      0,
      1,
      expect.objectContaining({
        duration: HERO_MOTION_TIMING.packetDuration,
        repeat: Infinity,
      }),
    );
    expect(packet.setAttribute).toHaveBeenCalledWith("cx", "50");
    expect(packet.setAttribute).toHaveBeenCalledWith("cy", "25");

    cleanup();
    expect(stop).toHaveBeenCalledOnce();
  });
});
