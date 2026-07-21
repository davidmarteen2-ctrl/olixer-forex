import { afterEach, describe, expect, it, vi } from "vitest";

import { initCtaChoice } from "./cta-choice.js";

afterEach(() => {
  document.body.innerHTML = "";
});

function renderCta() {
  document.body.innerHTML = `
    <section class="cta">
      <button class="btn-yes" type="button" aria-pressed="false">Yes</button>
      <button class="btn-no" type="button" aria-pressed="false">No</button>
    </section>
  `;
}

describe("CTA choice controller", () => {
  it("gathers on Yes hover, stays gathered, and releases on No hover", () => {
    renderCta();
    initCtaChoice(document);

    const cta = document.querySelector(".cta");
    const yes = document.querySelector(".btn-yes");
    const no = document.querySelector(".btn-no");

    yes.dispatchEvent(new MouseEvent("mouseenter"));
    expect(cta.dataset.choice).toBe("yes");
    expect(cta.dataset.hoverChoice).toBe("yes");
    expect(yes.getAttribute("aria-pressed")).toBe("true");
    expect(no.getAttribute("aria-pressed")).toBe("false");

    yes.dispatchEvent(new MouseEvent("mouseleave"));
    expect(cta.dataset.choice).toBe("yes");
    expect(cta.dataset.hoverChoice).toBeUndefined();

    no.dispatchEvent(new MouseEvent("mouseenter"));
    expect(cta.dataset.choice).toBe("no");
    expect(cta.dataset.hoverChoice).toBe("no");
    expect(yes.getAttribute("aria-pressed")).toBe("false");
    expect(no.getAttribute("aria-pressed")).toBe("true");
  });

  it("does not replay the same hover choice on click and cleans up listeners", () => {
    renderCta();
    const onChoice = vi.fn();
    const cleanup = initCtaChoice(document, onChoice);
    const yes = document.querySelector(".btn-yes");

    yes.dispatchEvent(new MouseEvent("mouseenter"));
    yes.click();
    expect(onChoice).toHaveBeenLastCalledWith("yes");
    expect(onChoice).toHaveBeenCalledTimes(1);

    cleanup();
    yes.dispatchEvent(new MouseEvent("mouseenter"));
    expect(onChoice).toHaveBeenCalledTimes(1);
  });
});
