import { readFileSync } from "node:fs";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CardShuffle from "./components/CardShuffle.jsx";
import MobileFocusTopology from "./components/hero-diagram/MobileFocusTopology.jsx";
import PricingSection from "./components/PricingSection.jsx";
import SignalStack from "./components/SignalStack.jsx";
import StepFlow from "./components/StepFlow.jsx";

afterEach(cleanup);

describe("Olixer surface pattern roles", () => {
  it.each([
    { name: "Card Shuffle", component: <CardShuffle reducedMotion />, selector: ".card-shuffle", role: "grid" },
    { name: "How It Works", component: <StepFlow reducedMotion />, selector: ".step-ui", role: "dots" },
    { name: "Signal Stack", component: <SignalStack reducedMotion />, selector: ".signal-stack", role: "dots" },
    { name: "Pricing", component: <PricingSection reducedMotion />, selector: ".pricing-selector", role: "plain" },
    { name: "mobile hero", component: <MobileFocusTopology />, selector: ".mobile-focus-topology", role: "dots" },
  ])("maps $name to the approved $role surface", ({ component, selector, role }) => {
    const { container } = render(component);

    expect(container.querySelector(selector)?.getAttribute("data-surface-pattern")).toBe(role);
  });

  it("maps every How It Works preview to product dots", () => {
    const { container } = render(<StepFlow reducedMotion />);
    const tabs = [...container.querySelectorAll('[role="tab"]')];

    expect(tabs).toHaveLength(4);
    tabs.forEach((tab) => {
      fireEvent.click(tab);
      expect(
        container.querySelector(".step-flow__visual .step-ui")?.getAttribute("data-surface-pattern"),
      ).toBe("dots");
    });
  });

  it("maps the static stats, CTA, and footer surfaces", () => {
    const page = new DOMParser().parseFromString(
      readFileSync("index.html", "utf8"),
      "text/html",
    );

    expect(page.querySelector(".stats-section")?.getAttribute("data-surface-pattern")).toBe("plain");
    expect(page.querySelector(".cta")?.getAttribute("data-surface-pattern")).toBe("dots");
    expect(page.querySelector(".foot")?.getAttribute("data-surface-pattern")).toBe("plain");
  });
});
