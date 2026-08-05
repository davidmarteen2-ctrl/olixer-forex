import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import NavbarShell from "./NavbarShell.jsx";

describe("Navbar Morphing Glass Architecture & Interaction Integrity", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders floating navigation header with semantic nav aria-label", () => {
    render(<NavbarShell shouldAnimate={false} />);

    const header = screen.getByRole("banner");
    expect(header).toBeTruthy();
    expect(header.classList.contains("navbar-shell")).toBe(true);

    const nav = screen.getByRole("navigation", { name: /primary navigation/i });
    expect(nav).toBeTruthy();
  });

  it("renders 3-zone grid components: brand lockup, desktop links, actions, and mobile trigger", () => {
    render(<NavbarShell shouldAnimate={false} />);

    // Brand lockup
    const brandLink = screen.getByRole("link", { name: /olixer forex homepage/i });
    expect(brandLink).toBeTruthy();

    // Navigation links
    expect(screen.getByRole("link", { name: /product/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /features/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /resources/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /company/i })).toBeTruthy();

    // Actions
    expect(screen.getByRole("link", { name: /log in/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /start free trial/i })).toBeTruthy();

    // Mobile menu trigger button
    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles mobile menu panel when trigger button is clicked", () => {
    render(<NavbarShell shouldAnimate={false} />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(document.getElementById("mobile-menu-panel")).toBeNull();

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById("mobile-menu-panel");
    expect(panel).toBeTruthy();

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes mobile menu panel when Escape key is pressed", () => {
    render(<NavbarShell shouldAnimate={false} />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(trigger);
    expect(document.getElementById("mobile-menu-panel")).toBeTruthy();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
