import { render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import ResponsiveHeroVisual from "./ResponsiveHeroVisual.jsx";

const originalInnerWidth = window.innerWidth;

afterEach(() => {
  Object.defineProperty(window, "innerWidth", {
    writable: true, configurable: true, value: originalInnerWidth,
  });
});

describe("ResponsiveHeroVisual Component", () => {
  it("renders MobileFocusTopology on mobile (<768px)", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 390 });
    render(<ResponsiveHeroVisual />);

    // MobileFocusTopology specific elements
    expect(screen.getByText("Smart Signal")).toBeTruthy();
    expect(screen.getByText("HIGH CONFIDENCE")).toBeTruthy();
    expect(screen.getByText("GBP / JPY")).toBeTruthy();
    expect(screen.getByText("195.842")).toBeTruthy();
    expect(screen.getByText("Copy")).toBeTruthy();
    expect(screen.getByText("Risk")).toBeTruthy();
    expect(screen.getByText("Execute")).toBeTruthy();
    expect(screen.getByText("+ 2 more capabilities")).toBeTruthy();
  });

  it("renders TabletSignalDiagram on tablet (768–1023px)", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });
    render(<ResponsiveHeroVisual />);
    expect(screen.getByText(/institutional execution/i)).toBeTruthy();
  });

  it("renders DesktopHeroDiagram on desktop (≥1024px)", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
    render(<ResponsiveHeroVisual />);
    expect(screen.getAllByText(/economic calendar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("SIGNAL ENGINE").length).toBeGreaterThan(0);
  });
});
