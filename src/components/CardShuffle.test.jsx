import { readFileSync } from "node:fs";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CardShuffle, { cardShuffleItems } from "./CardShuffle.jsx";

afterEach(cleanup);

describe("Olixer card shuffle", () => {
  it("renders four non-interactive Olixer cards", () => {
    render(<CardShuffle />);

    expect(
      screen.getByRole("region", { name: /Olixer platform capabilities/i }),
    ).toBeTruthy();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.queryAllByRole("button")).toHaveLength(0);

    cardShuffleItems.forEach(({ heading }) => {
      expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    });
  });

  it("labels the shuffle progress for assistive technology", () => {
    render(<CardShuffle />);

    expect(screen.getByText("Scroll to shuffle")).toBeTruthy();
    expect(screen.getByText("01 / 04")).toBeTruthy();
  });

  it("keeps the scaled supporting labels visually assertive", () => {
    render(<CardShuffle reducedMotion />);

    const card = screen.getByRole("article", {
      name: "Live Market Intelligence",
    });
    const supportingText = within(card).getByText(
      /Read institutional-grade signals/i,
    );
    const topline = within(card).getByText("Olixer / Platform");

    expect(getComputedStyle(supportingText).fontWeight).toBe("700");
    expect(getComputedStyle(topline).fontWeight).toBe("700");
  });

  it("uses a unique, locally owned campaign image for every capability", () => {
    render(<CardShuffle />);

    const images = screen.getAllByRole("img");
    const sources = images.map((image) => image.getAttribute("src"));

    expect(images).toHaveLength(4);
    expect(new Set(sources)).toHaveLength(4);
    sources.forEach((source) => {
      expect(source).toBeTruthy();
      expect(source).not.toMatch(/^https?:\/\//);
    });
    images.forEach((image) => {
      expect(image.style.objectPosition).toMatch(/% center$/);
    });
  });

  it("uses aligned 2x2 Bento targets for reduced motion", () => {
    render(<CardShuffle reducedMotion />);

    const cards = screen.getAllByRole("article");
    const [firstCard] = cards;
    const lastCard = cards.at(-1);

    expect(firstCard.style.transform).toContain("translateX(-25.5%)");
    expect(firstCard.style.transform).toContain("translateY(-25.5%)");
    expect(firstCard.style.transform).toContain("scale(0.49)");
    expect(firstCard.style.transform).not.toContain("rotate(");
    expect(lastCard.style.transform).toContain("translateX(25.5%)");
    expect(lastCard.style.transform).toContain("translateY(25.5%)");
  });

  it("keeps the deck viewport-safe and removes the long scroll tail", () => {
    const css = readFileSync("src/components/CardShuffle.css", "utf8");
    const page = readFileSync("index.html", "utf8");

    expect(css).toContain(".card-shuffle__card:hover img");
    expect(css).toContain("transform: scale(1.055)");
    expect(css).toContain("height: 260vh");
    expect(css).toContain("calc((100svh - 150px) * 1.5)");
    expect(page).not.toContain("overflow-x:hidden");
    expect(page).toContain("overflow-x:clip");
  });

  it("keeps the reserved root height synchronized with each responsive shuffle height", () => {
    const css = readFileSync("src/components/CardShuffle.css", "utf8");
    const page = readFileSync("index.html", "utf8");

    expect(css).toMatch(
      /@media \(max-width:\s*900px\)[\s\S]*?#card-shuffle-root\s*\{[^}]*min-height:\s*240vh/s,
    );
    expect(css).toMatch(
      /@media \(max-width:\s*600px\)[\s\S]*?#card-shuffle-root\s*\{[^}]*min-height:\s*220vh/s,
    );
    expect(page).toMatch(
      /@media \(max-width:\s*600px\)[\s\S]*?#card-shuffle-root\s*\{[^}]*min-height:\s*220vh/s,
    );
  });

});
