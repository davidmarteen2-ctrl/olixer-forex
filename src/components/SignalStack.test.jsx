import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import SignalStack, { signalCards } from "./SignalStack.jsx";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Olixer signal stack", () => {
  it("renders four example signals with the first active", () => {
    render(<SignalStack reducedMotion />);

    expect(signalCards).toHaveLength(4);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    expect(cards.every((card) => card.classList.contains("signal-stack__card"))).toBe(
      true,
    );
    expect(screen.getByRole("heading", { name: "EUR/USD" })).toBeTruthy();
    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });

  it("supports direct dot navigation", () => {
    render(<SignalStack reducedMotion />);

    fireEvent.click(
      screen.getByRole("button", { name: /go to xau\/usd signal/i }),
    );

    expect(screen.getByText("Example signal 2 of 4")).toBeTruthy();
  });

  it("supports keyboard navigation", () => {
    render(<SignalStack reducedMotion />);
    const carousel = screen.getByRole("region", { name: /example signals/i });

    fireEvent.keyDown(carousel, { key: "End" });
    expect(screen.getByText("Example signal 4 of 4")).toBeTruthy();

    fireEvent.keyDown(carousel, { key: "Home" });
    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });

  it("does not change the active card when the page is scrolled", () => {
    vi.useFakeTimers();
    render(<SignalStack reducedMotion />);
    const carousel = screen.getByRole("region", { name: /example signals/i });

    fireEvent.wheel(carousel, { deltaY: -120 });
    act(() => vi.advanceTimersByTime(700));

    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });

  it("moves between cards with the previous and next arrows", () => {
    render(<SignalStack reducedMotion />);

    const previous = screen.getByRole("button", { name: /previous signal/i });
    const next = screen.getByRole("button", { name: /next signal/i });

    expect(previous.disabled).toBe(true);
    fireEvent.click(next);
    expect(screen.getByText("Example signal 2 of 4")).toBeTruthy();

    fireEvent.click(previous);
    expect(screen.getByText("Example signal 1 of 4")).toBeTruthy();
  });

  it("renders one labelled local chart for every signal", () => {
    render(<SignalStack reducedMotion />);

    expect(
      screen.getAllByRole("img", { name: /example price chart/i }),
    ).toHaveLength(4);
  });
});
