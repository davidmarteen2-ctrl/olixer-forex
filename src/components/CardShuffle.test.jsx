import { readFileSync } from "node:fs";

import { cleanup, render, screen } from "@testing-library/react";
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

});
