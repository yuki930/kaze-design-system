import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetDeprecationWarnings } from "@/lib/deprecate";
import { Hero } from "./Hero";

function getSection(container: HTMLElement) {
  return container.querySelector("section") as HTMLElement;
}

describe("Hero", () => {
  it("renders the title as the page h1 with no optional parts", () => {
    const { container } = render(<Hero title="チームの仕事を速く" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "チームの仕事を速く" }),
    ).toBeInTheDocument();
    const section = getSection(container);
    expect(section).toHaveClass("hero");
    expect(section).not.toHaveClass("hero--colored");
    expect(container.querySelector(".hero__badge")).toBeNull();
    expect(container.querySelector(".hero__subtitle")).toBeNull();
    expect(container.querySelector(".hero__actions")).toBeNull();
    expect(container.querySelector(".hero__overlay")).toBeNull();
  });

  it("renders badge, subtitle and actions", () => {
    render(
      <Hero badge="新機能" title="t" subtitle="サブコピー">
        <a href="/start">始める</a>
      </Hero>,
    );
    expect(screen.getByText("新機能")).toHaveClass("hero__badge");
    expect(screen.getByText("サブコピー")).toHaveClass("hero__subtitle");
    const link = screen.getByRole("link", { name: "始める" });
    expect(link).toHaveAttribute("href", "/start");
    expect(link.parentElement).toHaveClass("hero__actions");
  });

  it("warns once in development that badge is deprecated, and still renders it", () => {
    resetDeprecationWarnings();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Hero badge="新機能" title="t" />);
    rerender(<Hero badge="新機能" title="t2" />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("AnnouncementBar");
    expect(screen.getByText("新機能")).toHaveClass("hero__badge");
    warn.mockRestore();
  });

  it("does not warn when badge is not used", () => {
    resetDeprecationWarnings();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Hero title="t" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("applies bg as the background and marks the hero as colored", () => {
    const { container } = render(<Hero title="t" bg="rgb(1, 2, 3)" />);
    const section = getSection(container);
    expect(section).toHaveClass("hero--colored");
    expect(section.style.background).toContain("rgb(1, 2, 3)");
  });

  it("wraps a bare bgImage URL in url() and covers the area", () => {
    const { container } = render(<Hero title="t" bgImage="/hero.jpg" />);
    const section = getSection(container);
    expect(section).toHaveClass("hero--colored");
    expect(section.style.backgroundImage).toMatch(/^url\("?\/hero\.jpg"?\)$/);
    expect(section.style.backgroundSize).toBe("cover");
    expect(section.style.backgroundPosition).toMatch(/^center( center)?$/);
  });

  it("keeps a bgImage that is already url(...) as is", () => {
    const { container } = render(<Hero title="t" bgImage="url(/a.png)" />);
    expect(getSection(container).style.backgroundImage).toMatch(/^url\("?\/a\.png"?\)$/);
  });

  it("uses 0.5 opacity for overlay={true}", () => {
    const { container } = render(<Hero title="t" bg="black" overlay />);
    const overlay = container.querySelector(".hero__overlay") as HTMLElement;
    expect(overlay).not.toBeNull();
    expect(overlay.style.opacity).toBe("0.5");
  });

  it("uses the numeric overlay opacity", () => {
    const { container } = render(<Hero title="t" bgImage="/a.png" overlay={0.3} />);
    expect((container.querySelector(".hero__overlay") as HTMLElement).style.opacity).toBe("0.3");
  });

  it("omits the overlay when it is 0, false, or there is no background", () => {
    const { container: a } = render(<Hero title="t" bg="black" overlay={0} />);
    const { container: b } = render(<Hero title="t" bg="black" overlay={false} />);
    const { container: c } = render(<Hero title="t" overlay />);
    for (const c2 of [a, b, c]) expect(c2.querySelector(".hero__overlay")).toBeNull();
  });

  it("merges style, className, forwards ref and rest props", () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Hero
        ref={ref}
        title="t"
        className="extra"
        aria-label="ヒーロー"
        style={{ minHeight: "400px" }}
        bg="black"
      />,
    );
    const section = getSection(container);
    expect(ref.current).toBe(section);
    expect(section).toHaveClass("hero", "hero--colored", "extra");
    expect(section).toHaveAttribute("aria-label", "ヒーロー");
    expect(section.style.minHeight).toBe("400px");
  });
});

describe("Hero bgImage with gradients", () => {
  it("passes a gradient through instead of wrapping it in url()", () => {
    const { container } = render(<Hero title="t" bgImage="linear-gradient(180deg, #000, #333)" />);
    const section = container.firstElementChild as HTMLElement;
    expect(section.style.backgroundImage).toContain("linear-gradient");
    expect(section.style.backgroundImage).not.toContain("url(linear");
  });
});
