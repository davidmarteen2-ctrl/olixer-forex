import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import FeatureRail, { featureRows } from "./FeatureRail.jsx";

afterEach(cleanup);

describe("Olixer feature rail", () => {
  it("keeps all five feature outcomes in separate reusable rows", () => {
    render(<FeatureRail />);

    const rail = screen.getByRole("list", { name: /platform features/i });
    const rows = within(rail).getAllByRole("listitem");

    expect(rows).toHaveLength(5);
    expect(featureRows.map((feature) => feature.title)).toEqual([
      "COPY TRADING",
      "SMART EXECUTION",
      "RISK MANAGEMENT",
      "PORTFOLIO INSIGHTS",
      "PERFORMANCE ANALYTICS",
    ]);

    rows.forEach((row, index) => {
      expect(
        within(row).getByRole("heading", {
          level: 3,
          name: featureRows[index].title,
        }),
      ).toBeTruthy();
      expect(
        within(row).getByText(featureRows[index].description),
      ).toBeTruthy();
      expect(
        within(row).getByLabelText(`${featureRows[index].title} preview`),
      ).toBeTruthy();
    });
  });

  it("exposes Motion hooks when the hero owns the choreography", () => {
    const { container } = render(
      <FeatureRail motionManaged reducedMotion={false} />,
    );

    const rail = screen.getByRole("list", { name: /platform features/i });
    const rows = within(rail).getAllByRole("listitem");

    expect(rows.every((row) => !row.classList.contains("pop"))).toBe(true);
    expect(container.querySelectorAll("[data-motion='outcome-icon']")).toHaveLength(
      5,
    );
    expect(container.querySelectorAll("[data-motion='outcome-copy']")).toHaveLength(
      5,
    );
    expect(
      container.querySelectorAll("[data-motion='outcome-preview']"),
    ).toHaveLength(5);
  });

  it("hides each complete outcome surface until its entrance begins", () => {
    render(<FeatureRail motionManaged reducedMotion={false} />);

    const rows = screen.getAllByRole("listitem");

    rows.forEach((row) => {
      expect(row.getAttribute("data-motion")).toBe("outcome-row");
      expect(row.style.opacity).toBe("0");
    });
  });

  it("marks each row with its stable feature identifier", () => {
    render(<FeatureRail />);

    const rows = screen.getAllByRole("listitem");

    expect(rows.map((row) => row.getAttribute("data-feature-id"))).toEqual(
      featureRows.map((feature) => feature.id),
    );
  });

  it("uses the reference portfolio value", () => {
    render(<FeatureRail />);

    const preview = screen.getByLabelText("PORTFOLIO INSIGHTS preview");
    expect(within(preview).getByText("Open Positions")).toBeTruthy();
    expect(within(preview).getByText("8")).toBeTruthy();
  });

  it("preserves the contextual payload for every right-aligned preview", () => {
    render(<FeatureRail />);

    const expectations = [
      {
        label: "COPY TRADING preview",
        type: "copy",
        content: ["Strategy: Momentum Pro", "Provider: @AlexFX"],
      },
      {
        label: "SMART EXECUTION preview",
        type: "execution",
        content: ["Market Order", "Filled"],
      },
      {
        label: "RISK MANAGEMENT preview",
        type: "risk",
        content: ["Risk per trade", "1.00%"],
      },
      {
        label: "PORTFOLIO INSIGHTS preview",
        type: "portfolio",
        content: ["Open Positions", "8"],
      },
      {
        label: "PERFORMANCE ANALYTICS preview",
        type: "performance",
        content: ["Win Rate", "78%"],
      },
    ];

    expectations.forEach(({ label, type, content }) => {
      const preview = screen.getByLabelText(label);

      expect(preview.getAttribute("data-preview-type")).toBe(type);
      content.forEach((text) => {
        expect(within(preview).getByText(text)).toBeTruthy();
      });
    });
  });
});
