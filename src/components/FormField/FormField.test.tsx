import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";
import { Input } from "../Input/Input";
import { Checkbox } from "../Checkbox/Checkbox";

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
      <FormField label="メール" description="ヘルプテキスト" error="エラーです">
        <Input />
      </FormField>,
    );
    const input = screen.getByRole("textbox");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    // Verify the referenced elements exist
    const ids = (describedBy ?? "").split(" ");
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  describe("a11y attribute merging", () => {
    it("keeps the child's own id and derives the label / message ids from it", () => {
      render(
        <FormField label="メール" description="説明" error="エラー">
          <Input id="email" />
        </FormField>,
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "email");
      expect(screen.getByText("メール")).toHaveAttribute("for", "email");
      expect(screen.getByText("説明")).toHaveAttribute("id", "email-description");
      expect(screen.getByRole("alert")).toHaveAttribute("id", "email-error");
    });

    it("appends to the child's existing aria-describedby instead of replacing it", () => {
      render(
        <>
          <p id="external-hint">外部のヒント</p>
          <FormField label="メール" description="説明">
            <Input aria-describedby="external-hint" />
          </FormField>
        </>,
      );
      const ids = (screen.getByRole("textbox").getAttribute("aria-describedby") ?? "").split(" ");
      expect(ids).toContain("external-hint");
      expect(ids.some((id) => id.endsWith("-description"))).toBe(true);
    });

    it("passes required and aria-required to the control when required", () => {
      render(
        <FormField label="名前" required>
          <Input />
        </FormField>,
      );
      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("does not clear a required set on the child itself", () => {
      render(
        <FormField label="名前">
          <Input required />
        </FormField>,
      );
      expect(screen.getByRole("textbox")).toBeRequired();
    });

    it("only injects aria-invalid (no `error` attribute leaks into the DOM)", () => {
      render(
        <FormField label="同意" error="チェックしてください">
          <Checkbox label="利用規約に同意する" />
        </FormField>,
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-invalid", "true");
      expect(checkbox).not.toHaveAttribute("error");
      expect(checkbox.closest("label")).not.toHaveAttribute("error");
    });

    it("does not override aria-invalid the child already set when there is no error", () => {
      render(
        <FormField label="メール">
          <Input aria-invalid="true" />
        </FormField>,
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("character counter", () => {
    it("links the counter via aria-describedby", () => {
      render(
        <FormField label="本文" maxLength={100} currentLength={20}>
          <Input />
        </FormField>,
      );
      const ids = (screen.getByRole("textbox").getAttribute("aria-describedby") ?? "").split(" ");
      const counter = screen.getByText("20 / 100");
      expect(ids).toContain(counter.id);
      expect(counter).not.toHaveAttribute("aria-live");
    });

    it("becomes a polite live region when 10 or fewer characters remain", () => {
      const { rerender } = render(
        <FormField label="本文" maxLength={100} currentLength={89}>
          <Input />
        </FormField>,
      );
      expect(screen.getByText("89 / 100")).not.toHaveAttribute("aria-live");
      rerender(
        <FormField label="本文" maxLength={100} currentLength={90}>
          <Input />
        </FormField>,
      );
      expect(screen.getByText("90 / 100")).toHaveAttribute("aria-live", "polite");
    });
  });
});
