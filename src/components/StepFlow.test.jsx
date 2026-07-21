import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import StepFlow from "./StepFlow.jsx";

afterEach(cleanup);

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
});
