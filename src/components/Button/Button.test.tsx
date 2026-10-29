import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>クリック</Button>);
    expect(screen.getByRole("button", { name: "クリック" })).toBeInTheDocument();
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

  describe("asChild", () => {
    it("renders the child element with button classes and no button", () => {
      render(
        <Button asChild>
          <a href="/x">リンク</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "リンク" });
      expect(link).toHaveClass("btn", "btn--primary", "btn--md");
      expect(link).toHaveAttribute("href", "/x");
      expect(link).not.toHaveAttribute("type");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("merges className and runs both onClick handlers", async () => {
      const user = userEvent.setup();
      const own = vi.fn();
      const child = vi.fn();
      render(
        <Button asChild onClick={own}>
          <a
            href="/x"
            className="extra"
            onClick={(e) => {
              e.preventDefault();
              child(e.type);
            }}
          >
            リンク
          </a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "リンク" });
      expect(link).toHaveClass("btn", "extra");
      await user.click(link);
      expect(child).toHaveBeenCalledTimes(1);
      // 子が preventDefault したので Button 側は呼ばれない（Slot の規約）
      expect(own).not.toHaveBeenCalled();
    });

    it("runs Button onClick when the child does not prevent default", async () => {
      const user = userEvent.setup();
      const own = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
      render(
        <Button asChild onClick={own}>
          <a href="/x">リンク</a>
        </Button>,
      );
      await user.click(screen.getByRole("link", { name: "リンク" }));
      expect(own).toHaveBeenCalledTimes(1);
    });

    it("marks disabled with aria-disabled and blocks clicks", async () => {
      const user = userEvent.setup();
      const own = vi.fn();
      render(
        <Button asChild disabled onClick={own}>
          <a href="/x">リンク</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "リンク" });
      expect(link).not.toHaveAttribute("disabled");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("data-disabled", "");
      await user.click(link);
      expect(own).not.toHaveBeenCalled();
    });
  });

  describe("loading", () => {
    it("shows a hidden spinner first, sets aria-busy and keeps the label", () => {
      const { container } = render(<Button loading>保存</Button>);
      const button = screen.getByRole("button", { name: "保存" });
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).not.toBeDisabled();
      expect(button.firstElementChild).toHaveClass("spinner", "spinner--sm");
      expect(container.querySelector(".spinner")).toHaveAttribute("aria-hidden", "true");
    });

    it("ignores clicks but stays focusable", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button loading onClick={onClick}>
          保存
        </Button>,
      );
      const button = screen.getByRole("button", { name: "保存" });
      await user.click(button);
      button.focus();
      expect(button).toHaveFocus();
      expect(onClick).not.toHaveBeenCalled();
    });

    it("does not mark a normal button as busy", () => {
      render(<Button>保存</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    });

    it("puts the spinner inside the child with asChild and blocks navigation", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button asChild loading onClick={onClick}>
          <a href="/next">次へ</a>
        </Button>,
      );
      const link = screen.getByRole("link");
      expect(link.firstElementChild).toHaveClass("spinner");
      expect(link).toHaveAttribute("aria-busy", "true");
      await user.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
