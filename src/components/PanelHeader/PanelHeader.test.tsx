import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PanelHeader } from "./PanelHeader";

describe("PanelHeader", () => {
  it("renders an h2 by default with actions", () => {
    const { container } = render(
      <PanelHeader
        title="最近の注文"
        description="直近30日"
        actions={<button type="button">すべて見る</button>}
      />,
    );
    const h = screen.getByRole("heading", { level: 2, name: "最近の注文" });
    expect(h).toHaveClass("panel-header__title--2");
    expect(screen.getByText("直近30日")).toBeInTheDocument();
    expect(container.querySelector(".panel-header__actions")).toHaveTextContent("すべて見る");
  });
  it("follows the requested level", () => {
    render(<PanelHeader title="内訳" level={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "内訳" })).toHaveClass(
      "panel-header__title--3",
    );
  });
});
