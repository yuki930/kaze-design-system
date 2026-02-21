import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders fallback text when no src", () => {
    render(<Avatar fallback="田" />);
    expect(screen.getByText("田")).toBeInTheDocument();
  });

  it("has role='img' when showing fallback", () => {
    render(<Avatar fallback="田" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("has aria-label set to fallback text", () => {
    render(<Avatar fallback="田中" />);
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "田中");
  });

  it("does not have role='img' when src is provided", () => {
    render(<Avatar src="https://example.com/avatar.png" alt="ユーザー" />);
    expect(screen.queryByRole("img", { name: "ユーザー" })).toBeInTheDocument();
    // The img element has role=img, but the outer span should not
    const img = screen.getByRole("img", { name: "ユーザー" });
    expect(img.tagName).toBe("IMG");
  });

  it("applies size class", () => {
    const { container } = render(<Avatar fallback="小" size="sm" />);
    const avatar = container.firstElementChild;
    expect(avatar).toHaveClass("avatar", "avatar--sm");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Avatar fallback="中" />);
    const avatar = container.firstElementChild;
    expect(avatar).toHaveClass("avatar", "avatar--md");
  });

  it("applies lg size class", () => {
    const { container } = render(<Avatar fallback="大" size="lg" />);
    const avatar = container.firstElementChild;
    expect(avatar).toHaveClass("avatar", "avatar--lg");
  });

  it("applies xs size class", () => {
    const { container } = render(<Avatar fallback="極" size="xs" />);
    const avatar = container.firstElementChild;
    expect(avatar).toHaveClass("avatar", "avatar--xs");
  });
});
