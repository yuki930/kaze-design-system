import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

const root = (container: HTMLElement) => container.querySelector(".alert") as HTMLElement;

describe("Alert", () => {
  it("applies tone class and data-tone", () => {
    render(<Alert tone="negative">x</Alert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("alert--negative");
    expect(el).toHaveAttribute("data-tone", "negative");
  });

  it("defaults to info", () => {
    const { container } = render(<Alert>x</Alert>);
    expect(root(container)).toHaveAttribute("data-tone", "info");
  });
});

describe("Alert live region", () => {
  it("interrupts only for negative by default", () => {
    render(<Alert tone="negative">送信できませんでした</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("送信できませんでした");
  });

  it.each(["info", "positive", "warning", "default"] as const)(
    "does not add a live role to a %s note by default",
    (tone) => {
      const { container } = render(<Alert tone={tone}>デモ環境です</Alert>);
      expect(root(container)).not.toHaveAttribute("role");
    },
  );

  it("maps live to alert / status / none", () => {
    const { container, rerender } = render(
      <Alert tone="warning" live="assertive">
        x
      </Alert>,
    );
    expect(root(container)).toHaveAttribute("role", "alert");
    rerender(
      <Alert tone="warning" live="polite">
        x
      </Alert>,
    );
    expect(root(container)).toHaveAttribute("role", "status");
    rerender(
      <Alert tone="negative" live="off">
        x
      </Alert>,
    );
    expect(root(container)).not.toHaveAttribute("role");
  });

  it("still lets an explicit role win", () => {
    const { container } = render(
      <Alert tone="negative" role="note">
        x
      </Alert>,
    );
    expect(root(container)).toHaveAttribute("role", "note");
  });
});
