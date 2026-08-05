import { describe, expect, it } from "vitest";

import { preparePageLoad } from "./page-load.js";

describe("page reload preparation", () => {
  it("starts a non-anchor reload at the top of the landing page once", () => {
    const historyState = { scrollRestoration: "auto" };
    const scrollCalls = [];
    const listeners = new Map();

    preparePageLoad({
      eventTarget: {
        addEventListener: (type, listener) => listeners.set(type, listener),
      },
      historyState,
      locationState: { hash: "" },
      scrollTo: (...args) => scrollCalls.push(args),
    });

    expect(historyState.scrollRestoration).toBe("manual");
    expect(scrollCalls).toEqual([[0, 0]]);

    // Non-persisted (regular reload) pageshow does not trigger extra scrollTo
    listeners.get("pageshow")({ persisted: false });
    expect(scrollCalls).toEqual([[0, 0]]);

    // Persisted (bfcache back-forward) pageshow triggers reset
    listeners.get("pageshow")({ persisted: true });
    expect(scrollCalls).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("preserves explicit anchor navigation", () => {
    const historyState = { scrollRestoration: "auto" };
    const scrollCalls = [];
    const listeners = new Map();

    preparePageLoad({
      eventTarget: {
        addEventListener: (type, listener) => listeners.set(type, listener),
      },
      historyState,
      locationState: { hash: "#pricing" },
      scrollTo: (...args) => scrollCalls.push(args),
    });

    expect(historyState.scrollRestoration).toBe("manual");
    expect(scrollCalls).toEqual([]);

    listeners.get("pageshow")({ persisted: true });
    expect(scrollCalls).toEqual([]);
  });
});
