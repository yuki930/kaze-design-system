import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Radio, RadioGroup } from "./Radio";

describe("RadioGroup", () => {
  it("is exposed as a radiogroup named by its legend", () => {
    render(
      <RadioGroup label="お支払い方法">
        <Radio label="クレジットカード" name="payment" value="credit" />
        <Radio label="銀行振込" name="payment" value="bank" />
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup", { name: "お支払い方法" });
    expect(group.tagName).toBe("FIELDSET");
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("marks every radio invalid and describes it with the error message", () => {
    render(
      <RadioGroup label="お支払い方法" error errorMessage="選択してください">
        <Radio label="クレジットカード" name="payment" value="credit" />
        <Radio label="銀行振込" name="payment" value="bank" />
      </RadioGroup>,
    );
    const message = screen.getByText("選択してください");
    expect(message.id).toBeTruthy();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-invalid", "true");
      expect(radio).toHaveAttribute("aria-describedby", message.id);
    }
  });

  it("does not describe or invalidate radios when there is no error", () => {
    render(
      <RadioGroup label="お支払い方法">
        <Radio label="クレジットカード" name="payment" value="credit" />
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio");
    expect(radio).not.toHaveAttribute("aria-invalid");
    expect(radio).not.toHaveAttribute("aria-describedby");
  });
});

describe("Radio", () => {
  it("merges its own aria-describedby with the group error id", () => {
    render(
      <>
        <p id="hint">ヒント</p>
        <RadioGroup label="方法" error errorMessage="必須です">
          <Radio label="A" name="m" value="a" aria-describedby="hint" />
        </RadioGroup>
      </>,
    );
    const ids = (screen.getByRole("radio").getAttribute("aria-describedby") ?? "").split(" ");
    expect(ids).toContain("hint");
    expect(ids).toContain(screen.getByText("必須です").id);
  });

  it("supports its own error prop outside a group", () => {
    render(<Radio label="A" error />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-invalid", "true");
  });
});
