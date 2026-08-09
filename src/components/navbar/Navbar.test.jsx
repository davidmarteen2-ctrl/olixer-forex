import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import NavbarShell from "./NavbarShell.jsx";

describe("Navbar Morphing Glass Architecture & Interaction Integrity", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders desktop floating navigation header with 3-zone grid and NO mobile trigger on desktop", () => {
    render(<NavbarShell shouldAnimate={false} />);

    const header = screen.getByRole("banner");
    expect(header).toBeTruthy();
    expect(header.classList.contains("navbar-shell")).toBe(true);

    const nav = screen.getByRole("navigation", { name: /primary navigation/i });
    expect(nav).toBeTruthy();

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

    // Mobile trigger MUST NOT exist on desktop
    expect(screen.queryByRole("button", { name: /open navigation menu/i })).toBeNull();
  });

  it("switches to MobileMorphNavbar under 1024px viewport width", () => {
    // Set viewport width to mobile
    window.innerWidth = 390;
    render(<NavbarShell shouldAnimate={false} />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Close")).toBeTruthy();

    // Reset window.innerWidth
    window.innerWidth = 1024;
  });
});
