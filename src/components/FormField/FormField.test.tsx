import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";
import { Input } from "../Input/Input";

describe("FormField", () => {
  it("renders label text", () => {
    render(
      <FormField label="メールアドレス">
        <Input />
      </FormField>,
    );
    expect(screen.getByText("メールアドレス")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(
      <FormField label="メール" error="入力してください">
        <Input />
      </FormField>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("入力してください");
  });

  it("shows description", () => {
    render(
      <FormField label="パスワード" description="8文字以上入力してください">
        <Input />
      </FormField>,
    );
    expect(screen.getByText("8文字以上入力してください")).toBeInTheDocument();
  });

  it("adds required indicator", () => {
    render(
      <FormField label="名前" required>
        <Input />
      </FormField>,
    );
    const label = screen.getByText("名前");
    expect(label).toHaveClass("form-field__label--required");
  });

  it("associates label with input via id", () => {
    render(
      <FormField label="ユーザー名">
        <Input />
      </FormField>,
    );
    const label = screen.getByText("ユーザー名");
    const htmlFor = label.getAttribute("for");
    expect(htmlFor).toBeTruthy();

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", htmlFor);
  });

  it("sets aria-invalid on child input when error is provided", () => {
    render(
      <FormField label="メール" error="エラーです">
        <Input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-describedby linking to error and description", () => {
    render(
      <FormField
        label="メール"
        description="ヘルプテキスト"
        error="エラーです"
      >
        <Input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    // Verify the referenced elements exist
    const ids = describedBy!.split(" ");
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });
});
