import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Watermark } from "./Watermark";

describe("Watermark", () => {
  it("renders children and a hidden, non-interactive overlay of repeated text", () => {
    const { container } = render(
      <Watermark text="社外秘">
        <p>機密資料</p>
      </Watermark>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("watermark");
    expect(root.style.position).toBe("relative");
    expect(screen.getByText("機密資料")).toBeInTheDocument();

    const overlay = root.querySelector(".watermark__overlay") as HTMLElement;
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay.style.pointerEvents).toBe("none");
    const tiles = overlay.querySelectorAll(".watermark__pattern > span");
    expect(tiles).toHaveLength(200);
    expect(tiles[0]).toHaveTextContent("社外秘");
  });

  it("applies the default layout parameters", () => {
    const { container } = render(<Watermark text="W" />);
    const pattern = container.querySelector(".watermark__pattern") as HTMLElement;
    expect(pattern.style.transform).toBe("rotate(-22deg)");
    expect(pattern.style.gap).toBe("100px");
    expect(pattern.style.inset).toBe("-100px");
    const tile = pattern.firstElementChild as HTMLElement;
    expect(tile.style.fontSize).toBe("16px");
    expect(tile.style.opacity).toBe("0.08");
  });

  it("applies custom fontSize, rotate, gap, color and opacity", () => {
    const { container } = render(
      <Watermark text="W" fontSize={24} rotate={45} gap={40} color="red" opacity={0.5} />,
    );
    const pattern = container.querySelector(".watermark__pattern") as HTMLElement;
    expect(pattern.style.transform).toBe("rotate(45deg)");
    expect(pattern.style.gap).toBe("40px");
    const tile = pattern.firstElementChild as HTMLElement;
    expect(tile.style.fontSize).toBe("24px");
    expect(tile.style.color).toBe("red");
    expect(tile.style.opacity).toBe("0.5");
  });

  it("forwards ref, merges className and style, and passes rest props", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Watermark
        ref={ref}
        text="W"
        className="extra"
        style={{ minHeight: "200px", position: "absolute" }}
        data-testid="wm"
      />,
    );
    const el = screen.getByTestId("wm");
    expect(ref.current).toBe(el);
    expect(el).toHaveClass("watermark", "extra");
    expect(el.style.minHeight).toBe("200px");
    expect(el.style.position).toBe("absolute");
  });
});
