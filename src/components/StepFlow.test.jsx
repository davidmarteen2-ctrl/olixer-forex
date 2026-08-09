import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import StepFlow from "./StepFlow.jsx";

afterEach(() => {
  cleanup();
  setReducedMotion(false);
  setMobileFlow(false);
});

// framer-motion's useReducedMotion() lazily calls window.matchMedia() exactly
// once for the whole process and only ever updates via a "change" event fired
// on that same MediaQueryList — so the mock must be installed at module scope
// (before the first render in this file) and flipped through the same object,
// not by reassigning window.matchMedia later.
const reducedMotionQuery = {
  matches: false,
  media: "(prefers-reduced-motion)",
  listeners: new Set(),
  addEventListener(type, listener) {
    if (type === "change") this.listeners.add(listener);
  },
  removeEventListener(type, listener) {
    this.listeners.delete(listener);
  },
  addListener(listener) {
    this.listeners.add(listener);
  },
  removeListener(listener) {
    this.listeners.delete(listener);
  },
  dispatchEvent() {
    return true;
  },
};

const mobileFlowQuery = {
  matches: false,
  media: "(max-width: 900px)",
  listeners: new Set(),
  addEventListener(type, listener) {
    if (type === "change") this.listeners.add(listener);
  },
  removeEventListener(type, listener) {
    this.listeners.delete(listener);
  },
  addListener(listener) {
    this.listeners.add(listener);
  },
  removeListener(listener) {
    this.listeners.delete(listener);
  },
  dispatchEvent() {
    return true;
  },
};

window.matchMedia = (query) =>
  query.includes("prefers-reduced-motion")
    ? reducedMotionQuery
    : query.includes("max-width: 900px")
      ? mobileFlowQuery
    : {
        matches: false,
        media: query,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent() {
          return true;
        },
      };

function setReducedMotion(matches) {
  reducedMotionQuery.matches = matches;
  reducedMotionQuery.listeners.forEach((listener) => listener({ matches }));
}

function setMobileFlow(matches) {
  mobileFlowQuery.matches = matches;
  mobileFlowQuery.listeners.forEach((listener) => listener({ matches }));
}

describe("Olixer Step Flow", () => {
  it("renders four steps with the account step selected by default", () => {
    render(<StepFlow />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(
      screen.getByRole("tabpanel", { name: /create your account/i }),
    ).toBeTruthy();
  });

  it("selects a step on pointer hover", () => {
    render(<StepFlow />);

    fireEvent.mouseEnter(
      screen.getByRole("tab", { name: /connect your broker/i }),
    );

    expect(
      screen.getByRole("tabpanel", { name: /connect your broker/i }),
    ).toBeTruthy();
  });

  it("expands the selected mobile visual directly below its touch trigger", () => {
    setMobileFlow(true);
    render(<StepFlow />);

    const brokerTrigger = screen.getByRole("button", {
      name: /connect your broker/i,
    });
    fireEvent.click(brokerTrigger);

    const brokerPanel = screen.getByRole("region", {
      name: /connect your broker/i,
    });
    expect(brokerTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(brokerTrigger.nextElementSibling).toBe(brokerPanel);
    expect(screen.getByText("Broker connected")).toBeTruthy();
  });

  it("anchors a newly selected mobile step below the sticky navigation", () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const scrollCalls = [];
    window.HTMLElement.prototype.scrollIntoView = function scrollIntoView(options) {
      scrollCalls.push({ element: this, options });
    };

    try {
      setMobileFlow(true);
      render(<StepFlow />);

      const brokerTrigger = screen.getByRole("button", {
        name: /connect your broker/i,
      });
      fireEvent.click(brokerTrigger);

      expect(scrollCalls).toEqual([
        {
          element: brokerTrigger,
          options: { behavior: "smooth", block: "start" },
        },
      ]);
    } finally {
      if (originalScrollIntoView) {
        window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
      } else {
        delete window.HTMLElement.prototype.scrollIntoView;
      }
    }
  });

  it("supports keyboard navigation through the complete flow", () => {
    render(<StepFlow />);

    const brokerTab = screen.getByRole("tab", { name: /connect your broker/i });
    fireEvent.focus(brokerTab);
    fireEvent.keyDown(brokerTab, { key: "End" });

    expect(
      screen
        .getByRole("tab", { name: /copy trades automatically/i })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("shows the matching Olixer visual for every step", () => {
    render(<StepFlow />);

    expect(screen.getByText(/profile ready/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: /connect your broker/i }));
    expect(screen.getByText("Broker connected")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: /choose a proven trader/i }));
    expect(screen.getByText("Momentum Pro")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("tab", { name: /copy trades automatically/i }),
    );
    expect(screen.getByText("Copying live")).toBeTruthy();
  });

  it("renders final scene values instantly when reduced motion is preferred", () => {
    setReducedMotion(true);
    render(<StepFlow />);

    expect(screen.getByText("100%")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("tab", { name: /copy trades automatically/i }),
    );
    expect(screen.getByText("$24,860.20")).toBeTruthy();

    setReducedMotion(false);
  });

  it("stays stable when tabs are switched rapidly", () => {
    render(<StepFlow />);

    fireEvent.mouseEnter(screen.getByRole("tab", { name: /connect your broker/i }));
    fireEvent.mouseEnter(screen.getByRole("tab", { name: /choose a proven trader/i }));
    fireEvent.mouseEnter(screen.getByRole("tab", { name: /copy trades automatically/i }));
    fireEvent.mouseEnter(screen.getByRole("tab", { name: /create your account/i }));

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(
      screen.getByRole("tabpanel", { name: /create your account/i }),
    ).toBeTruthy();
  });
});
