import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import HeroHeader, {
  badgeVariants,
  containerVariants,
  line1Variants,
  line2Variants,
  lineVariants,
  subtextVariants,
} from "./HeroHeader.jsx";

const projectRoot = resolve(import.meta.dirname, "../..");

describe("HeroHeader Production Hardening & Hydration Integrity", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("hydrates cleanly without recoverable error or whitespace text-node mismatches", async () => {
    const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");

    const rootMatch = html.match(/<div id="hero-header-root">[\s\S]*?<\/div><\/div>/);
    expect(rootMatch).toBeTruthy();

    const containerDiv = document.createElement("div");
    containerDiv.innerHTML = rootMatch[0];
    document.body.appendChild(containerDiv);

    const root = document.getElementById("hero-header-root");
    expect(root).toBeTruthy();

    const initialContent = root.querySelector(".hero-header-content");
    expect(initialContent).toBeTruthy();

    const errorSpy = vi.fn();

    await act(async () => {
      hydrateRoot(
        root,
        <HeroHeader shouldAnimate={false} reducedMotionOverride={true} />,
        { onRecoverableError: errorSpy },
      );
    });

    expect(errorSpy).not.toHaveBeenCalled();

    const hydratedContent = root.querySelector(".hero-header-content");
    expect(hydratedContent).toBe(initialContent);

    const contentChildren = Array.from(hydratedContent.childNodes);
    const contentElementNames = contentChildren.map((n) =>
      n.nodeType === 3 ? `#text("${n.nodeValue}")` : n.tagName,
    );
    expect(contentElementNames).toEqual(["DIV", "H1", "P"]);

    const h1Children = Array.from(hydratedContent.querySelector("h1").childNodes);
    const h1ElementNames = h1Children.map((n) =>
      n.nodeType === 3 ? `#text("${n.nodeValue}")` : n.tagName,
    );
    expect(h1ElementNames).toEqual(["SPAN", "SPAN"]);

    const subChildren = Array.from(hydratedContent.querySelector("p.sub").childNodes);
    const subElementNames = subChildren.map((n) =>
      n.nodeType === 3 ? `#text("${n.nodeValue}")` : n.tagName,
    );
    expect(subElementNames).toEqual(["SPAN", "BR", "SPAN"]);
  });

  it("uses clipped typography initial state y: 105%, opacity: 0, filter: blur(5px) for desktop headline lines", () => {
    const hiddenState = line1Variants.hidden(false);
    expect(hiddenState.y).toBe("105%");
    expect(hiddenState.opacity).toBe(0);
    expect(hiddenState.filter).toBe("blur(5px)");
  });

  it("uses reduced travel y: 90% and filter: blur(3px) for mobile headline lines", () => {
    const hiddenState = line1Variants.hidden(true);
    expect(hiddenState.y).toBe("90%");
    expect(hiddenState.opacity).toBe(0);
    expect(hiddenState.filter).toBe("blur(3px)");
  });

  it("staggers headline line 1 at 0.18s and line 2 at 0.30s", () => {
    expect(line1Variants.visible.transition.delay).toBe(0.18);
    expect(line2Variants.visible.transition.delay).toBe(0.30);
  });

  it("uses y: 12, opacity: 0, and filter: blur(3px) with delay: 0.62s for subtext hidden state", () => {
    const hiddenSub = subtextVariants.hidden(false);
    expect(hiddenSub.y).toBe(12);
    expect(hiddenSub.opacity).toBe(0);
    expect(hiddenSub.filter).toBe("blur(3px)");
    expect(subtextVariants.visible.transition.delay).toBe(0.62);
    expect(subtextVariants.visible.transition.duration).toBe(0.65);
  });

  it("uses y: 4 and opacity: 0.92 for badge hidden state", () => {
    expect(badgeVariants.hidden.y).toBe(4);
    expect(badgeVariants.hidden.opacity).toBeGreaterThanOrEqual(0.92);
  });

  it("resolves blur to blur(0px) in visible state", () => {
    expect(line1Variants.visible.filter).toBe("blur(0px)");
    expect(subtextVariants.visible.filter).toBe("blur(0px)");
  });

  it("uses staggerChildren: 0.12 on parent containerVariants", () => {
    expect(containerVariants.visible.transition.staggerChildren).toBe(0.12);
  });

  it("uses hydrateRoot and passes shouldAnimate in hero-header-main.jsx", () => {
    const heroMain = readFileSync(
      resolve(projectRoot, "src/hero-header-main.jsx"),
      "utf8",
    );

    expect(heroMain).toContain("hydrateRoot");
    expect(heroMain).not.toContain("createRoot");
    expect(heroMain).toContain("shouldAnimate");
    expect(heroMain).toContain("onRecoverableError");
  });

  it("uses animation fill-mode both on .rise elements to prevent CTA backward jump", () => {
    const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");

    expect(html).toMatch(/\.rise\s*\{[^}]*animation:\s*rise\s+0?\.55s[^{}]*both/s);
  });
});
