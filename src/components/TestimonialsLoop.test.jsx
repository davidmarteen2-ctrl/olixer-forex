import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import TestimonialsLoop, { testimonials } from "./TestimonialsLoop.jsx";

afterEach(cleanup);

describe("Olixer testimonial marquee", () => {
  it("renders the section head and illustrative trader stories", () => {
    render(<TestimonialsLoop reducedMotion />);

    expect(testimonials).toHaveLength(6);
    expect(screen.getByText("A calmer way to stay in the market.")).toBeTruthy();
    expect(screen.getByText(/illustrative trader stories/i)).toBeTruthy();
    // each story appears twice per set, in two sets (visible + duplicate)
    expect(screen.getAllByText("Maya Okafor")).toHaveLength(4);
    expect(screen.getAllByText("Daniel Brooks")).toHaveLength(4);
  });

  it("renders a single seamless marquee row", () => {
    render(<TestimonialsLoop reducedMotion />);

    const marquee = screen.getByTestId("testimonial-marquee");
    expect(marquee.querySelectorAll(".testimonial-card")).toHaveLength(24);
  });

  it("marks duplicated cards as hidden from assistive technology", () => {
    render(<TestimonialsLoop reducedMotion />);

    expect(document.querySelectorAll('.testimonial-card[aria-hidden="true"]')).toHaveLength(12);
    expect(screen.getAllByRole("article")).toHaveLength(12);
  });

  it("disables continuous movement when reduced motion is requested", () => {
    render(<TestimonialsLoop reducedMotion />);

    expect(screen.getByTestId("testimonial-marquee").getAttribute("data-reduced-motion")).toBe("true");
  });
});
