import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ResponsiveHeroVisual from "./ResponsiveHeroVisual.jsx";

describe("ResponsiveHeroVisual Component", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it("renders MobileSignalPipeline when viewport is mobile (<768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<ResponsiveHeroVisual />);
    expect(screen.getByText(/market inputs/i)).toBeTruthy();
    expect(screen.getByText(/gbp \/ jpy/i)).toBeTruthy();
  });

  it("renders TabletSignalDiagram when viewport is tablet (768px - 1023px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(<ResponsiveHeroVisual />);
    expect(screen.getByText(/institutional execution/i)).toBeTruthy();
  });

  it("renders DesktopHeroDiagram when viewport is desktop (>=1024px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(<ResponsiveHeroVisual />);
    expect(screen.getByText(/economic calendar/i)).toBeTruthy();
  });
});
