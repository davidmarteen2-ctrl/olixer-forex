import { useLayoutEffect, useState } from "react";

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "./chartConstants.js";

// Measures the chart's real rendered size so the SVG can fill its container
// exactly — the ParentSize/ResponsiveContainer pattern every real charting
// library uses. Without this, a fixed viewBox letterboxes: the chart gets
// pinned to one aspect ratio and floats as a band in the middle of a taller
// panel (the "marooned chart" bug). Measures before paint (useLayoutEffect
// + getBoundingClientRect) to avoid a default-size flash, then keeps in sync
// via ResizeObserver. jsdom has no layout engine, so the fallback dimensions
// keep tests deterministic.
export function useContainerSize(ref) {
  const [size, setSize] = useState({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize((previous) =>
          previous.width === rect.width && previous.height === rect.height
            ? previous
            : { width: rect.width, height: rect.height },
        );
      }
    };

    measure();

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
