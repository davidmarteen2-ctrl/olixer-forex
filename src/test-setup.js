/**
 * Global test setup — polyfills browser APIs unavailable in jsdom.
 */

// ResizeObserver is not implemented in jsdom. Provide a no-op stub so
// components that use it don't crash in tests.
if (typeof ResizeObserver === "undefined") {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this._callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// IntersectionObserver is not implemented in jsdom. Provide a no-op stub so
// Framer Motion whileInView does not throw ReferenceError in tests.
if (typeof IntersectionObserver === "undefined") {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this._callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
