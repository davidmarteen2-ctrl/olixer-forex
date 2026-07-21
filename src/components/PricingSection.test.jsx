import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import PricingSection, { pricingPlans } from "./PricingSection.jsx";

afterEach(cleanup);

describe("Olixer pricing section", () => {
  it("starts on the Pro monthly plan", () => {
    render(<PricingSection reducedMotion />);

    expect(pricingPlans).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Pro" })).toBeTruthy();
    expect(screen.getByTestId("pricing-amount").textContent).toContain("$49");
    expect(screen.getByText("Most popular")).toBeTruthy();
  });

  it("uses the discrete slider to select the Elite plan", () => {
    render(<PricingSection reducedMotion />);
    const slider = screen.getByRole("slider", { name: /choose pricing plan/i });

    fireEvent.change(slider, { target: { value: "2" } });

    expect(slider.getAttribute("aria-valuetext")).toBe("Elite");
    expect(screen.getByRole("heading", { name: "Elite" })).toBeTruthy();
    expect(screen.getByTestId("pricing-amount").textContent).toContain("$99");
  });

  it("switches the selected plan to its yearly equivalent", () => {
    render(<PricingSection reducedMotion />);
    const slider = screen.getByRole("slider", { name: /choose pricing plan/i });

    fireEvent.change(slider, { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Yearly" }));

    expect(screen.getByTestId("pricing-amount").textContent).toContain("$79");
    expect(screen.getByText("Billed yearly · save 20%")).toBeTruthy();
  });

  it("supports direct plan selection from the plan rail", () => {
    render(<PricingSection reducedMotion />);

    fireEvent.click(screen.getByRole("button", { name: /select starter plan/i }));

    expect(screen.getByRole("heading", { name: "Starter" })).toBeTruthy();
    expect(screen.getByTestId("pricing-amount").textContent).toContain("$19");
  });
});
