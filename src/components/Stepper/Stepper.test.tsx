import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Stepper } from "./Stepper";

const steps = [{ label: "アカウント情報" }, { label: "プロフィール設定" }, { label: "確認" }];

describe("Stepper", () => {
  it("renders the steps as an ordered list", () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the current step with aria-current=step", () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[2]).not.toHaveAttribute("aria-current");
  });

  it("announces completed steps as 完了 and keeps the check icon hidden", () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("完了");
    expect(items[0]?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    // Pending steps read their number instead
    expect(items[2]).toHaveTextContent("3");
    expect(items[2]).not.toHaveTextContent("完了");
  });

  it("forwards className and props to the root", () => {
    render(<Stepper steps={steps} currentStep={0} className="custom" data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveClass("stepper", "custom");
  });
});
