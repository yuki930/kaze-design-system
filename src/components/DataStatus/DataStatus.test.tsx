import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataStatus } from "./DataStatus";
describe("DataStatus", () => {
  it("keeps acquisition and basis distinct without inferring freshness", () => {
    render(
      <DataStatus status="partial" fetchedAt="1月8日 10:00 JST" asOf="1月6日〜7日">
        一部未確認です
      </DataStatus>,
    );
    expect(screen.getByText("一部未取得")).toBeInTheDocument();
    expect(screen.getByText("取得日時").nextElementSibling).toHaveTextContent("1月8日 10:00 JST");
    expect(screen.getByText("データ基準").nextElementSibling).toHaveTextContent("1月6日〜7日");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("does not invent timestamps for missing data", () => {
    render(<DataStatus status="missing" />);
    expect(screen.getByText("未取得")).toBeInTheDocument();
    expect(screen.queryByText("取得日時")).not.toBeInTheDocument();
    expect(screen.queryByText("データ基準")).not.toBeInTheDocument();
  });
});
