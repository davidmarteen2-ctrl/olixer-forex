import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HeroDiagram from "./HeroDiagram.jsx";

afterEach(cleanup);

function cubicPointAt(numbers, t) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = numbers;
  const inverse = 1 - t;

  return {
    x:
      inverse ** 3 * x0 +
      3 * inverse ** 2 * t * x1 +
      3 * inverse * t ** 2 * x2 +
      t ** 3 * x3,
    y:
      inverse ** 3 * y0 +
      3 * inverse ** 2 * t * y1 +
      3 * inverse * t ** 2 * y2 +
      t ** 3 * y3,
  };
}

function pointAtX(pathData, targetX) {
  const numbers = pathData.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let lower = 0;
  let upper = 1;

  for (let index = 0; index < 60; index += 1) {
    const middle = (lower + upper) / 2;
    if (cubicPointAt(numbers, middle).x < targetX) {
      lower = middle;
    } else {
      upper = middle;
    }
  }

  return cubicPointAt(numbers, (lower + upper) / 2);
}

describe("Motion-owned hero diagram", () => {
  it("renders the complete input, engine, and outcome network", () => {
    render(<HeroDiagram reducedMotionOverride />);

    expect(screen.getAllByTestId("source-card")).toHaveLength(4);
    expect(screen.getAllByTestId("input-wire")).toHaveLength(4);
    expect(screen.getAllByTestId("output-wire")).toHaveLength(5);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("SIGNAL ENGINE")).toBeTruthy();
    expect(screen.getByText("AI-Powered Core")).toBeTruthy();
  });

  it("uses the approved full-bleed rail and centered-engine geometry", () => {
    const { container } = render(<HeroDiagram reducedMotionOverride />);
    const connectors = container.querySelector(".connectors");
    const engine = container.querySelector("[data-motion='engine']");
    const sourceRail = container.querySelector(".source-rail");
    const outcomeRail = container.querySelector(".diagram-feature-root");

    expect(connectors.getAttribute("width")).toBe("1360");
    expect(connectors.getAttribute("viewBox")).toBe("0 0 1360 400");
    expect(engine.style.left).toBe("626px");
    expect(sourceRail.style.left).toBe("-30px");
    expect(sourceRail.style.width).toBe("346px");
    expect(outcomeRail.style.left).toBe("1044px");
  });

  it("renders the approved stronger visual-weight contract", () => {
    const { container } = render(<HeroDiagram reducedMotionOverride />);
    const diagram = container.querySelector(".hero-diagram");
    const inputWire = container.querySelector("[data-motion='input-wire']");
    const outputWire = container.querySelector("[data-motion='output-wire']");
    const junctions = container.querySelectorAll("[data-motion='junction']");

    expect(inputWire.getAttribute("stroke-width")).toBe("2.35");
    expect(inputWire.getAttribute("stroke")).toBe("#BDB7AB");
    expect(outputWire.getAttribute("stroke-width")).toBe("2.35");
    expect(outputWire.getAttribute("stroke")).toBe("#ED8730");
    expect(junctions[8].getAttribute("r")).toBe("4.8");
    expect(junctions[9].getAttribute("r")).toBe("4.1");
    expect(diagram.style.getPropertyValue("--diagram-source-title-size")).toBe(
      "12px",
    );
    expect(
      diagram.style.getPropertyValue("--diagram-outcome-title-size"),
    ).toBe("11.75px");
    expect(diagram.style.getPropertyValue("--diagram-preview-size")).toBe(
      "10px",
    );
  });

  it("uses Framer Motion data hooks without legacy pop animation ownership", () => {
    const { container } = render(<HeroDiagram reducedMotionOverride />);

    expect(container.querySelectorAll("[data-motion='input-wire']")).toHaveLength(
      4,
    );
    expect(
      container.querySelectorAll("[data-motion='output-wire']"),
    ).toHaveLength(5);
    expect(container.querySelectorAll("[data-motion='outcome-icon']")).toHaveLength(
      5,
    );
    expect(container.querySelectorAll(".diagram .pop")).toHaveLength(0);
    const packetPaths = [
      ...container.querySelectorAll("[data-motion='packet']"),
    ].map((packet) => packet.getAttribute("data-path"));

    expect(packetPaths).toEqual([
      "input-1",
      "input-3",
      "output-0",
      "output-2",
      "output-4",
    ]);
  });

  it("matches the reference structure without an upper market card", () => {
    const { container } = render(<HeroDiagram reducedMotionOverride />);

    expect(screen.queryByText("EUR/USD")).toBeNull();
    expect(container.querySelectorAll(".wire.f")).toHaveLength(1);
    expect(screen.getByText("High Confidence")).toBeTruthy();
    expect(screen.getByText("Entry")).toBeTruthy();
    expect(screen.getByText("SL")).toBeTruthy();
    expect(screen.getByText("TP")).toBeTruthy();
  });

  it("keeps every outcome junction centered on its output curve", () => {
    const { container } = render(<HeroDiagram reducedMotionOverride />);
    const paths = [
      ...container.querySelectorAll("[data-motion='output-wire']"),
    ];
    const outcomeJunctions = [
      ...container.querySelectorAll("[data-motion='junction']"),
    ].slice(8);

    paths.forEach((path, pathIndex) => {
      const pair = outcomeJunctions.slice(pathIndex * 2, pathIndex * 2 + 2);

      pair.forEach((junction) => {
        const cx = Number(junction.getAttribute("cx"));
        const cy = Number(junction.getAttribute("cy"));
        const expected = pointAtX(path.getAttribute("d"), cx);

        expect(Math.abs(cy - expected.y)).toBeLessThan(0.01);
      });
    });
  });
});
