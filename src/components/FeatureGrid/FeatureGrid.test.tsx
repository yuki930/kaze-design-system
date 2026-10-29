import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureCard, FeatureGrid } from "./FeatureGrid";

describe("FeatureGrid", () => {
  it("uses 3 columns by default without a modifier class", () => {
    render(<FeatureGrid data-testid="grid" />);
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("feature-grid");
    expect(grid.className).not.toMatch(/feature-grid--cols-/);
  });

  it.each([2, 4] as const)("adds a modifier for %i columns", (columns) => {
    render(<FeatureGrid data-testid="grid" columns={columns} />);
    expect(screen.getByTestId("grid")).toHaveClass(`feature-grid--cols-${columns}`);
  });

  it("merges className, forwards ref and renders children", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FeatureGrid ref={ref} className="extra" aria-label="機能一覧">
        <FeatureCard title="高速" description="すぐ動く" />
      </FeatureGrid>,
    );
    const grid = screen.getByLabelText("機能一覧");
    expect(grid).toHaveClass("feature-grid", "extra");
    expect(ref.current).toBe(grid);
    expect(screen.getByRole("heading", { level: 3, name: "高速" })).toBeInTheDocument();
  });
});

describe("FeatureGrid spotlight", () => {
  function renderSpotlight() {
    return render(
      <FeatureGrid variant="spotlight" columns={4} data-testid="grid">
        <FeatureCard
          data-testid="lead"
          icon={<svg data-testid="lead-icon" />}
          figure={
            <>
              23<small>KB</small>
            </>
          }
          title="圧倒的な軽量さ"
          description="CSS だけで動く"
        >
          <pre>import "kaze-design-system/css/all";</pre>
        </FeatureCard>
        <FeatureCard
          icon={<svg data-testid="minor-icon" />}
          title="トークン"
          description="一元管理"
        />
        <FeatureCard title="ダークモード" description="切り替えは属性ひとつ" />
      </FeatureGrid>,
    );
  }

  it("adds the spotlight modifier and ignores columns", () => {
    renderSpotlight();
    const grid = screen.getByTestId("grid");
    expect(grid).toHaveClass("feature-grid", "feature-grid--spotlight");
    expect(grid.className).not.toMatch(/feature-grid--cols-/);
  });

  it("puts the first child in the lead slot and the rest in a minor column", () => {
    const { container } = renderSpotlight();
    expect(screen.getByTestId("lead")).toHaveClass("feature-card--lead");
    const minor = container.querySelector(".feature-grid__minor") as HTMLElement;
    expect(minor.children).toHaveLength(2);
    for (const card of Array.from(minor.children)) expect(card).toHaveClass("feature-card--minor");
    expect(screen.getByTestId("lead").parentElement).toBe(screen.getByTestId("grid"));
  });

  it("never renders icons, and renders the figure and extra content on the lead", () => {
    const { container } = renderSpotlight();
    expect(container.querySelector(".feature-card__icon")).toBeNull();
    expect(screen.queryByTestId("lead-icon")).toBeNull();
    expect(screen.queryByTestId("minor-icon")).toBeNull();
    expect(container.querySelector(".feature-card__figure")).toHaveTextContent("23KB");
    expect(container.querySelector(".feature-card__extra pre")).toBeInTheDocument();
  });

  it("keeps every title as h3 so the outline stays under the section h2", () => {
    renderSpotlight();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.queryByRole("heading", { level: 4 })).toBeNull();
  });

  it("omits the minor column when there is only one card", () => {
    const { container } = render(
      <FeatureGrid variant="spotlight">
        <FeatureCard title="t" description="d" />
      </FeatureGrid>,
    );
    expect(container.querySelector(".feature-grid__minor")).toBeNull();
  });

  it("leaves the default grid unchanged", () => {
    const { container } = render(
      <FeatureGrid variant="grid">
        <FeatureCard icon={<svg data-testid="i" />} title="t" description="d" />
      </FeatureGrid>,
    );
    expect(container.querySelector(".feature-grid--spotlight")).toBeNull();
    expect(container.querySelector(".feature-card--lead")).toBeNull();
    expect(screen.getByTestId("i").parentElement).toHaveClass("feature-card__icon");
  });
});

describe("FeatureCard", () => {
  it("renders title as h3 and the description, without an icon by default", () => {
    const { container } = render(<FeatureCard title="安全" description="暗号化して保存" />);
    expect(screen.getByRole("heading", { level: 3, name: "安全" })).toHaveClass(
      "feature-card__title",
    );
    expect(screen.getByText("暗号化して保存")).toHaveClass("feature-card__description");
    expect(container.querySelector(".feature-card__icon")).toBeNull();
  });

  it("renders the icon slot, merges className, forwards ref and rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FeatureCard
        ref={ref}
        data-testid="card"
        className="extra"
        icon={<svg data-testid="icon" />}
        title="t"
        description="d"
      />,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("feature-card", "extra");
    expect(ref.current).toBe(card);
    expect(screen.getByTestId("icon").parentElement).toHaveClass("feature-card__icon");
  });
});
