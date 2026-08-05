import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MobileSignalPipeline from "./MobileSignalPipeline.jsx";

describe("MobileSignalPipeline Component", () => {
  it("renders mobile signal pipeline narrative elements", () => {
    render(<MobileSignalPipeline />);

    // Section label
    expect(screen.getByText(/market inputs/i)).toBeTruthy();

    // Input chips
    expect(screen.getByText(/market data/i)).toBeTruthy();
    expect(screen.getByText(/calendar/i)).toBeTruthy();
    expect(screen.getByText(/tradingview/i)).toBeTruthy();
    expect(screen.getByText(/liquidity/i)).toBeTruthy();

    // Signal engine card
    expect(screen.getByText(/olixer signal engine/i)).toBeTruthy();
    expect(screen.getByText(/market structure aligned/i)).toBeTruthy();

    // Smart signal card
    expect(screen.getByText(/gbp \/ jpy/i)).toBeTruthy();
    expect(screen.getByText(/buy/i)).toBeTruthy();
    expect(screen.getByText("198.420")).toBeTruthy();
    expect(screen.getByText("198.120")).toBeTruthy();
    expect(screen.getByText("199.020")).toBeTruthy();

    // Outcome row
    expect(screen.getByText(/copy trade/i)).toBeTruthy();
    expect(screen.getByText(/risk control/i)).toBeTruthy();
    expect(screen.getByText(/auto execute/i)).toBeTruthy();
  });
});
