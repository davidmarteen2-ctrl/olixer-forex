import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import MaskedAvatars from "./MaskedAvatars.jsx";

afterEach(cleanup);

describe("MaskedAvatars", () => {
  it("renders all five traders as individually Motion-owned avatars", () => {
    const { container } = render(<MaskedAvatars reducedMotionOverride />);

    expect(screen.getAllByRole("img")).toHaveLength(5);
    expect(container.querySelectorAll("[data-motion='trader-avatar']")).toHaveLength(
      5,
    );
    expect(screen.getByRole("group", { name: "Trader avatars" })).toBeTruthy();
  });

  it("keeps the social-proof caption in the same animated component", () => {
    const { container } = render(<MaskedAvatars reducedMotionOverride />);

    expect(screen.getByText("12,000+")).toBeTruthy();
    expect(screen.getByText("traders copy signals here")).toBeTruthy();
    expect(container.querySelector("[data-motion='trader-caption']")).toBeTruthy();
  });
});
