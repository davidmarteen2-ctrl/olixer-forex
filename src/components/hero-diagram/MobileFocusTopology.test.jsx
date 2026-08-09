import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import MobileFocusTopology from "./MobileFocusTopology.jsx";

afterEach(() => {
  cleanup();
});

describe("MobileFocusTopology Component", () => {
  it("renders key mobile hierarchy elements (inputs, engine, smart signal, pills)", () => {
    const { getByText } = render(<MobileFocusTopology />);

    // Primary input chips
    expect(getByText(/Economic Calendar/i)).toBeTruthy();
    expect(getByText("Calendar")).toBeTruthy();
    expect(getByText(/TradingView/i)).toBeTruthy();

    // Signal engine
    expect(getByText("SIGNAL ENGINE")).toBeTruthy();
    expect(getByText(/Market structure aligned/i)).toBeTruthy();

    // Smart Signal Card
    expect(getByText("Smart Signal")).toBeTruthy();
    expect(getByText("HIGH CONFIDENCE")).toBeTruthy();
    expect(getByText("GBP / JPY")).toBeTruthy();
    expect(getByText("BUY")).toBeTruthy();
    expect(getByText("195.842")).toBeTruthy();
    expect(getByText(/195.542/)).toBeTruthy();
    expect(getByText(/196.442/)).toBeTruthy();

    // Outcome pills & progressive disclosure micro label
    expect(getByText("Copy")).toBeTruthy();
    expect(getByText("Risk")).toBeTruthy();
    expect(getByText("Execute")).toBeTruthy();
    expect(getByText("+ 2 more capabilities")).toBeTruthy();
  });

  it("has accessible aria label describing the mobile signal system", () => {
    const { getByTestId } = render(<MobileFocusTopology />);
    const stage = getByTestId("mobile-focus-stage");
    expect(stage.getAttribute("aria-label")).toContain("Olixer signal system");
  });

  it("keeps layout anchors separate from Motion transform surfaces", () => {
    const { container } = render(<MobileFocusTopology />);
    const engineAnchor = container.querySelector(".mobile-focus-engine");
    const signalAnchor = container.querySelector(".mobile-focus-signal-wrap");
    const engineMotionSurface = container.querySelector(".mobile-focus-engine-motion");
    const signalMotionSurface = container.querySelector(".mobile-focus-signal-motion");

    expect(engineMotionSurface?.parentElement).toBe(engineAnchor);
    expect(signalMotionSurface?.parentElement).toBe(signalAnchor);
  });

  it("keeps the in-view variant relay on both layout anchors", () => {
    const { container } = render(<MobileFocusTopology />);
    const engineAnchor = container.querySelector(".mobile-focus-engine");
    const signalAnchor = container.querySelector(".mobile-focus-signal-wrap");

    expect(engineAnchor?.getAttribute("data-variant-relay")).toBe("true");
    expect(signalAnchor?.getAttribute("data-variant-relay")).toBe("true");
  });

  it("shows a continuous engine handoff and one unified action rail", () => {
    const { container } = render(<MobileFocusTopology />);
    const handoff = container.querySelector(".mobile-focus-signal-link");
    const actionRail = container.querySelector(".outcome-action-rail");

    expect(handoff).toBeTruthy();
    expect(actionRail?.querySelectorAll(".outcome-action")).toHaveLength(3);
  });

  it("keeps the live status in the engine title row above the description", () => {
    const { container } = render(<MobileFocusTopology />);
    const titleRow = container.querySelector(".engine-title-row");
    const description = container.querySelector(".engine-desc");

    expect(titleRow?.querySelector(".engine-live-badge")).toBeTruthy();
    expect(titleRow?.nextElementSibling).toBe(description);
  });
});
