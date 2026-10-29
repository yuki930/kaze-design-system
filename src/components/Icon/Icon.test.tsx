import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";

function FakeIcon({
  size,
  strokeWidth,
}: {
  size?: number | string;
  strokeWidth?: number | string;
}) {
  return <svg data-testid="svg" data-size={size} data-stroke={strokeWidth} />;
}

describe("Icon", () => {
  it("is decorative (aria-hidden) without a label and uses md size", () => {
    const { container } = render(<Icon icon={FakeIcon} />);
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveAttribute("aria-hidden", "true");
    expect(span).not.toHaveAttribute("role");
    expect(span).toHaveClass("icon", "icon--md");
    const svg = screen.getByTestId("svg");
    expect(svg).toHaveAttribute("data-size", "16");
    expect(svg).toHaveAttribute("data-stroke", "2");
  });

  it("is exposed as an image with an accessible name when labelled", () => {
    render(<Icon icon={FakeIcon} label="検索" />);
    const img = screen.getByRole("img", { name: "検索" });
    expect(img).not.toHaveAttribute("aria-hidden");
  });

  it.each([
    ["xs", "12"],
    ["sm", "14"],
    ["lg", "20"],
    ["xl", "24"],
  ] as const)("maps size %s to %spx", (size, px) => {
    const { container } = render(<Icon icon={FakeIcon} size={size} />);
    expect(container.firstChild).toHaveClass(`icon--${size}`);
    expect(screen.getByTestId("svg")).toHaveAttribute("data-size", px);
  });

  it("forwards ref, merges className and passes rest props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref} icon={FakeIcon} className="extra" data-testid="i" title="t" />);
    const el = screen.getByTestId("i");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("icon", "extra");
    expect(el).toHaveAttribute("title", "t");
  });
});
