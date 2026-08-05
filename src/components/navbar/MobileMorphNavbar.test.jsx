import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import MobileMorphNavbar from "./MobileMorphNavbar.jsx";

describe("MobileMorphNavbar Component", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders closed state menu capsule trigger button", () => {
    render(<MobileMorphNavbar />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("Menu")).toBeTruthy();
    expect(screen.getByText("+")).toBeTruthy();
  });

  it("toggles to open state and displays integrated unfolding nav content & page veil", () => {
    render(<MobileMorphNavbar />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(screen.queryByRole("navigation")).toBeNull();

    // Click trigger
    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Close")).toBeTruthy();

    // Links present
    expect(screen.getByText("Product")).toBeTruthy();
    expect(screen.getByText("Features")).toBeTruthy();
    expect(screen.getByText("Pricing")).toBeTruthy();
    expect(screen.getByText("Resources")).toBeTruthy();
    expect(screen.getByText("Company")).toBeTruthy();

    // Actions present
    expect(screen.getByRole("link", { name: /log in/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /start free trial/i })).toBeTruthy();

    // Page veil present
    const veil = document.querySelector(".mobile-menu-veil");
    expect(veil).toBeTruthy();

    // Click veil closes menu
    fireEvent.click(veil);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes menu when Escape key is pressed", () => {
    render(<MobileMorphNavbar />);

    const trigger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(trigger);
    expect(screen.getByText("Product")).toBeTruthy();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
