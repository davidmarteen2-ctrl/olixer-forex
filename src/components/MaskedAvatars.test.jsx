import { readFileSync } from "node:fs";

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

  it("gives the mobile proof and partner rail room to stay legible", () => {
    const page = readFileSync("index.html", "utf8");

    expect(page).toMatch(/\.social-proof \.cap\s*\{[^}]*white-space:\s*nowrap/s);
    expect(page).toMatch(
      /@media \(max-width:\s*389px\)[\s\S]*?\.social-proof\s*\{[^}]*flex-direction:\s*column/s,
    );
    expect(page).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?\.marquee::before,[\s\S]*?\.marquee::after\s*\{[^}]*width:\s*32px/s,
    );
  });

  it("centers the narrow mobile proof inside the hero column", () => {
    const page = readFileSync("index.html", "utf8");

    expect(page).toMatch(
      /@media \(max-width:\s*760px\)[\s\S]*?#masked-avatars-root\s*\{[^}]*width:\s*100%;[^}]*justify-content:\s*center/s,
    );
    expect(page).toMatch(
      /@media \(max-width:\s*420px\)[\s\S]*?\.social-proof\s*\{[^}]*flex-direction:\s*column;[^}]*align-items:\s*center;[^}]*width:\s*100%/s,
    );
    expect(page).toMatch(
      /@media \(max-width:\s*420px\)[\s\S]*?\.social-proof \.cap\s*\{[^}]*text-align:\s*center/s,
    );
  });
});
