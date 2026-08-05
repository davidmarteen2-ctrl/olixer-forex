import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { JSDOM, requestInterceptor } from "jsdom";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");

const localStylesheetInterceptor = requestInterceptor((request) => {
  const resource = new URL(request.url);

  if (
    resource.origin === "http://olixer.test" &&
    resource.pathname.startsWith("/src/") &&
    resource.pathname.endsWith(".css")
  ) {
    return new Response(
      readFileSync(resolve(projectRoot, resource.pathname.slice(1))),
      { headers: { "Content-Type": "text/css" } },
    );
  }

  return new Response("", {
    status: 200,
    headers: { "Content-Type": "text/css" },
  });
});

function waitForLoad(window) {
  if (window.document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolveLoad) => {
    window.addEventListener("load", resolveLoad, { once: true });
  });
}

describe("page section shells", () => {
  it("styles every static section header before JavaScript mounts", async () => {
    const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");
    const source = new JSDOM(html, { runScripts: "outside-only" });
    const selectors = [
      ".step-flow-section__head",
      ".stats-section__head",
      ".signals-section__head",
      ".pricing-section__head",
    ];
    const stylesheetLinks = [
      ...source.window.document.querySelectorAll(
        'link[rel="stylesheet"][href^="/src/components/"]',
      ),
    ]
      .map((link) => link.outerHTML)
      .join("");
    const sectionHeaders = selectors
      .map(
        (selector) =>
          source.window.document.querySelector(selector).outerHTML,
      )
      .join("");
    source.window.close();

    const dom = new JSDOM(
      `<!doctype html><html><head>${stylesheetLinks}</head><body>${sectionHeaders}</body></html>`,
      {
      resources: { interceptors: [localStylesheetInterceptor] },
      runScripts: "outside-only",
      url: "http://olixer.test/",
      },
    );

    await waitForLoad(dom.window);

    selectors.forEach((selector) => {
      expect(
        dom.window.getComputedStyle(dom.window.document.querySelector(selector))
          .display,
        `${selector} should have its composed layout before JavaScript`,
      ).toBe("grid");
    });

    dom.window.close();
  });
});
