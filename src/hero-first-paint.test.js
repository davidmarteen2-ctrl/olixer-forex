import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const htmlContent = readFileSync(resolve(projectRoot, "index.html"), "utf8");

describe("hero first-paint layout reservation & stability", () => {
  it("reserves a base desktop height of 400px on .diagram-outer before JavaScript mounts", () => {
    expect(htmlContent).toMatch(
      /\.diagram-outer\s*\{[^}]*margin-top:\s*-34px;\s*height:\s*400px;?/s,
    );
  });

  it("reserves 400px footprint on #hero-diagram-root before React mounts", () => {
    expect(htmlContent).toMatch(
      /#hero-diagram-root\s*\{[^}]*width:\s*1360px;\s*height:\s*400px;\s*min-height:\s*400px;?/s,
    );
  });

  it("reserves social proof height on #masked-avatars-root before React mounts", () => {
    expect(htmlContent).toMatch(
      /#masked-avatars-root\s*\{[^}]*min-height:\s*48px;?/s,
    );
  });

  it("makes hero copy visible without JavaScript", () => {
    expect(htmlContent).toMatch(
      /\.headline-line,\s*\.sub,\s*\.badge\s*\{[^}]*opacity:\s*1;\s*transform:\s*none;?/s,
    );
  });

  it("uses pre-paint hero-intro-pending script for first-paint animation safety", () => {
    expect(htmlContent).toContain("hero-intro-pending");
    expect(htmlContent).toContain("window.__heroIntroFallback");
  });

  it("does not wrap standalone visual islands in StrictMode that re-trigger entrance animations", () => {
    const heroMain = readFileSync(
      resolve(projectRoot, "src/hero-diagram-main.jsx"),
      "utf8",
    );
    const avatarMain = readFileSync(
      resolve(projectRoot, "src/masked-avatars-main.jsx"),
      "utf8",
    );
    const headerMain = readFileSync(
      resolve(projectRoot, "src/hero-header-main.jsx"),
      "utf8",
    );

    expect(heroMain).not.toContain("<StrictMode>");
    expect(avatarMain).not.toContain("<StrictMode>");
    expect(headerMain).not.toContain("<StrictMode>");
  });

  it("uses a single scroll-restoration entry module", () => {
    const dom = new JSDOM(htmlContent);
    const inlineScripts = [
      ...dom.window.document.querySelectorAll(
        "head script:not([type='module'])",
      ),
    ];
    const scrollRestorationMatches = inlineScripts.filter((script) =>
      script.textContent.includes("scrollRestoration"),
    );

    expect(scrollRestorationMatches).toHaveLength(0);
  });
});
