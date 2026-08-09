import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MobileSignalPipeline from "./MobileSignalPipeline.jsx";

describe("MobileSignalPipeline Component", () => {
  it("renders Mobile Signal Product Stage narrative elements", () => {
    render(<MobileSignalPipeline />);

    // Cropped input modules
    expect(screen.getByText(/tradingview/i)).toBeTruthy();
    expect(screen.getByText(/market data/i)).toBeTruthy();
    expect(screen.getByText(/calendar/i)).toBeTruthy();
    expect(screen.getByText(/liquidity/i)).toBeTruthy();

    // Signal engine puck
    expect(screen.getByText(/signal engine/i)).toBeTruthy();

    // Smart signal foreground hero card
    expect(screen.getByText(/smart signal/i)).toBeTruthy();
    expect(screen.getByText(/gbp \/ jpy/i)).toBeTruthy();
    expect(screen.getByText(/buy/i)).toBeTruthy();
    expect(screen.getByText("195.842")).toBeTruthy();
    expect(screen.getByText("195.120")).toBeTruthy();
    expect(screen.getByText("196.850")).toBeTruthy();

    // Action pills
    expect(screen.getByText(/copy/i)).toBeTruthy();
    expect(screen.getByText(/protect/i)).toBeTruthy();
    expect(screen.getByText(/execute/i)).toBeTruthy();
  });
});
