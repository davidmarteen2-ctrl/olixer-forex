import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import StatsSection, { formatStatValue } from "./StatsSection.jsx";

afterEach(cleanup);

describe("Olixer Stats Section", () => {
  it("renders the four Olixer platform metrics", () => {
    render(<StatsSection />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Traders connected")).toBeTruthy();
    expect(screen.getByText("Market coverage")).toBeTruthy();
    expect(screen.getByText("Guided workflow")).toBeTruthy();
    expect(screen.getByText("Unified workspace")).toBeTruthy();
  });

  it("formats animated values with prefixes, suffixes, and separators", () => {
    expect(formatStatValue(12000, { suffix: "+" })).toBe("12,000+");
    expect(formatStatValue(24, { suffix: "/5" })).toBe("24/5");
    expect(formatStatValue(4, { prefix: "0" })).toBe("04");
  });

  it("exposes the final values to assistive technology before animation ends", () => {
    render(<StatsSection />);

    expect(screen.getByLabelText("12,000+ Traders connected")).toBeTruthy();
    expect(screen.getByLabelText("24/5 Market coverage")).toBeTruthy();
  });
});
