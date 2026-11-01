import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders an h1 with description, actions and breadcrumb", () => {
    const { container } = render(
      <PageHeader
        title="請求書"
        description="今月発行した請求書の一覧です。"
        actions={<button type="button">新規作成</button>}
        breadcrumb={<nav aria-label="パンくず">ホーム</nav>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "請求書" })).toBeInTheDocument();
    expect(screen.getByText("今月発行した請求書の一覧です。")).toHaveClass(
      "page-header__description",
    );
    expect(container.querySelector(".page-header__actions")).toHaveTextContent("新規作成");
    expect(screen.getByRole("navigation", { name: "パンくず" })).toBeInTheDocument();
  });
  it("can render the title as h2 and skips empty slots", () => {
    const { container } = render(<PageHeader title="設定" level={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(container.querySelector(".page-header__actions")).toBeNull();
    expect(container.querySelector(".page-header__breadcrumb")).toBeNull();
  });
});
