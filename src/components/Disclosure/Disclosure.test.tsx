import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Disclosure } from "./Disclosure";

describe("Disclosure", () => {
  it("exposes data-state on the trigger and the content", () => {
    render(<Disclosure title="詳細">本文</Disclosure>);
    const trigger = screen.getByRole("button", { name: "詳細" });
    const content = document.querySelector(".disclosure__content");
    expect(trigger).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("data-state", "closed");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-state", "open");
  });
});
