export const SCENE_EASE = [0.22, 1, 0.36, 1];

// Plot margins in px inside the (now dynamically-sized) chart. Tight, so the
// price action fills the panel instead of floating in the middle.
export const MARGIN = { top: 20, right: 18, bottom: 24, left: 18 };

// Fallback dimensions used before the container is measured, and in jsdom
// (no layout engine) so tests stay deterministic. Roughly the desktop
// visual-panel aspect.
export const DEFAULT_WIDTH = 440;
export const DEFAULT_HEIGHT = 470;

// A "plot rect" is the drawable area inside the margins, in the same pixel
// space as the SVG's viewBox (which now matches the container 1:1).
export function plotFromSize(width, height) {
  return {
    left: MARGIN.left,
    right: width - MARGIN.right,
    top: MARGIN.top,
    bottom: height - MARGIN.bottom,
  };
}

export const DEFAULT_PLOT = plotFromSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
