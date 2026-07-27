import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import SignalChart from "./SignalChart.jsx";
import { createXScale, createYScale } from "./useChartScales.js";

afterEach(cleanup);

const buySignal = {
  id: "eurusd",
  pair: "EUR/USD",
  side: "Buy",
  entry: "1.0842",
  accent: "#36c978",
  entryPrice: 1.0842,
  stopPrice: 1.079,
  targetPrice: 1.092,
  currentPrice: 1.0838,
  chart: [1.0806, 1.0812, 1.0808, 1.0817, 1.0814, 1.0823, 1.0819, 1.0828, 1.0825, 1.0833, 1.0829, 1.0838],
};

const sellSignal = {
  id: "gbpjpy",
  pair: "GBP/JPY",
  side: "Sell",
  entry: "198.42",
  accent: "#f06464",
  entryPrice: 198.42,
  stopPrice: 199.18,
  targetPrice: 196.9,
  currentPrice: 198.3,
  chart: [199.62, 199.20, 199.45, 198.95, 199.10, 198.70, 198.85, 198.55, 198.68, 198.40, 198.50, 198.30],
};

describe("Signal chart scales", () => {
  it("maps a Buy signal so Target renders above Entry above Stop (smaller y = higher on screen)", () => {
    const yScale = createYScale(buySignal.chart, [
      buySignal.entryPrice,
      buySignal.targetPrice,
      buySignal.stopPrice,
      buySignal.currentPrice,
    ]);

    expect(yScale(buySignal.targetPrice)).toBeLessThan(yScale(buySignal.entryPrice));
    expect(yScale(buySignal.entryPrice)).toBeLessThan(yScale(buySignal.stopPrice));
  });

  it("maps a Sell signal so Target renders below Entry below Stop (reversed vs. Buy)", () => {
    const yScale = createYScale(sellSignal.chart, [
      sellSignal.entryPrice,
      sellSignal.targetPrice,
      sellSignal.stopPrice,
      sellSignal.currentPrice,
    ]);

    expect(yScale(sellSignal.targetPrice)).toBeGreaterThan(yScale(sellSignal.entryPrice));
    expect(yScale(sellSignal.entryPrice)).toBeGreaterThan(yScale(sellSignal.stopPrice));
  });

  it("never divides by zero when every value in the domain is identical", () => {
    const flatScale = createYScale([5, 5, 5], [5, 5, 5]);
    expect(Number.isFinite(flatScale(5))).toBe(true);
  });

  it("maps chart indices evenly across the plot width", () => {
    const xScale = createXScale(4);
    expect(xScale(0)).toBeLessThan(xScale(1));
    expect(xScale(1)).toBeLessThan(xScale(2));
    expect(xScale(3) - xScale(2)).toBeCloseTo(xScale(1) - xScale(0), 5);
  });
});

describe("SignalChart", () => {
  it("keeps the accessible chart name and title used by SignalStack's tests", () => {
    render(<SignalChart signal={buySignal} reduceMotion />);

    expect(
      screen.getByRole("img", { name: /example price chart/i }),
    ).toBeTruthy();
  });

  it("renders the complete chart instantly when reduced motion is requested", () => {
    const { container } = render(<SignalChart signal={buySignal} reduceMotion />);

    expect(container.querySelector(".signal-chart__line")).toBeTruthy();
    expect(container.querySelector(".signal-chart__level--entry")).toBeTruthy();
    expect(container.querySelector(".signal-chart__level--target")).toBeTruthy();
    expect(container.querySelector(".signal-chart__level--stop")).toBeTruthy();
  });

  it("stays purely atmospheric — no dot field, floating level chips, or hover tooltip competing with the card's own metrics grid", () => {
    const { container } = render(<SignalChart signal={buySignal} reduceMotion />);

    expect(container.querySelector(".signal-chart__grid-dot")).toBeNull();
    expect(container.querySelector(".signal-chart__chip-surface")).toBeNull();
    expect(container.querySelector(".signal-chart__tooltip-layer")).toBeNull();
    expect(screen.queryByText("TARGET")).toBeNull();
  });

  it("renders reference lines for entry, target, and stop levels", () => {
    const { container } = render(<SignalChart signal={buySignal} reduceMotion />);

    expect(container.querySelector(".signal-chart__level--entry")).toBeTruthy();
    expect(container.querySelector(".signal-chart__level--target")).toBeTruthy();
    expect(container.querySelector(".signal-chart__level--stop")).toBeTruthy();
  });

  it("uses a neutral (non-brand) price line so a Sell signal's line never reads as a loss", () => {
    const { container } = render(<SignalChart signal={sellSignal} reduceMotion />);

    const line = container.querySelector(".signal-chart__line");
    // The line must not carry the signal's red brand accent inline — its
    // color is a fixed neutral set in CSS, not signal.accent.
    expect(line.getAttribute("style") ?? "").not.toContain(sellSignal.accent);
  });

  it("positions target and stop levels correctly for a Sell signal", () => {
    const { container } = render(<SignalChart signal={sellSignal} reduceMotion />);

    const targetLine = container.querySelector(".signal-chart__level--target");
    const stopLine = container.querySelector(".signal-chart__level--stop");
    const entryLine = container.querySelector(".signal-chart__level--entry");

    const targetY = Number(targetLine.getAttribute("y1"));
    const stopY = Number(stopLine.getAttribute("y1"));
    const entryY = Number(entryLine.getAttribute("y1"));

    // Sell: target is below entry (larger y), stop is above entry (smaller y)
    expect(targetY).toBeGreaterThan(entryY);
    expect(stopY).toBeLessThan(entryY);
  });
});

