import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>クリック</Button>);
    expect(
      screen.getByRole("button", { name: "クリック" }),
    ).toBeInTheDocument();
  });

  it("applies primary variant class by default", () => {
    render(<Button>プライマリ</Button>);
    const button = screen.getByRole("button", { name: "プライマリ" });
    expect(button).toHaveClass("btn", "btn--primary", "btn--md");
  });

  it("applies secondary variant class", () => {
    render(<Button variant="secondary">セカンダリ</Button>);
    const button = screen.getByRole("button", { name: "セカンダリ" });
    expect(button).toHaveClass("btn--secondary");
  });

  it("applies outline variant class", () => {
    render(<Button variant="outline">アウトライン</Button>);
    const button = screen.getByRole("button", { name: "アウトライン" });
    expect(button).toHaveClass("btn--outline");
  });

  it("applies ghost variant class", () => {
    render(<Button variant="ghost">ゴースト</Button>);
    const button = screen.getByRole("button", { name: "ゴースト" });
    expect(button).toHaveClass("btn--ghost");
  });

  it("applies destructive variant class", () => {
    render(<Button variant="destructive">削除</Button>);
    const button = screen.getByRole("button", { name: "削除" });
    expect(button).toHaveClass("btn--destructive");
  });

  it("applies xs size class", () => {
    render(<Button size="xs">極小</Button>);
    const button = screen.getByRole("button", { name: "極小" });
    expect(button).toHaveClass("btn--xs");
  });

  it("applies sm size class", () => {
    render(<Button size="sm">小</Button>);
    const button = screen.getByRole("button", { name: "小" });
    expect(button).toHaveClass("btn--sm");
  });

  it("applies md size class by default", () => {
    render(<Button>中</Button>);
    const button = screen.getByRole("button", { name: "中" });
    expect(button).toHaveClass("btn--md");
  });

  it("applies lg size class", () => {
    render(<Button size="lg">大</Button>);
    const button = screen.getByRole("button", { name: "大" });
    expect(button).toHaveClass("btn--lg");
  });

  it("handles onClick", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>クリック</Button>);

    await user.click(screen.getByRole("button", { name: "クリック" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as disabled", () => {
    render(<Button disabled>無効</Button>);
    const button = screen.getByRole("button", { name: "無効" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>全幅</Button>);
    const button = screen.getByRole("button", { name: "全幅" });
    expect(button).toHaveClass("btn--full");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>参照</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
