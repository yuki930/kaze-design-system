import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HelpButton } from "./HelpButton";

describe("HelpButton", () => {
  it("exposes data-state on the trigger and the popover", () => {
    render(<HelpButton title="ヘルプ">本文</HelpButton>);
    const trigger = screen.getByRole("button", { name: "ヘルプ" });
    expect(trigger).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");
  });
});
