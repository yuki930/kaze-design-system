import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "../Link";
import { AnnouncementBar } from "./AnnouncementBar";

describe("AnnouncementBar", () => {
  it("renders the message in a named aside", () => {
    render(<AnnouncementBar>v1.1 を公開しました。</AnnouncementBar>);
    const bar = screen.getByRole("complementary", { name: "お知らせ" });
    expect(bar).toHaveClass("announcement-bar");
    expect(bar).not.toHaveAttribute("role");
    expect(screen.getByText("v1.1 を公開しました。")).toHaveClass("announcement-bar__text");
  });

  it("lets label rename the landmark", () => {
    render(
      <AnnouncementBar label="メンテナンスのお知らせ">本日 23 時から停止します。</AnnouncementBar>,
    );
    expect(
      screen.getByRole("complementary", { name: "メンテナンスのお知らせ" }),
    ).toBeInTheDocument();
  });

  it("renders the action after the message", () => {
    render(
      <AnnouncementBar action={<Link href="/changelog">変更点を見る</Link>}>
        公開しました。
      </AnnouncementBar>,
    );
    const link = screen.getByRole("link", { name: "変更点を見る" });
    expect(link).toHaveClass("link");
    expect(link.previousElementSibling).toHaveClass("announcement-bar__text");
  });

  it("merges className, forwards ref and rest props", () => {
    const ref = createRef<HTMLElement>();
    render(
      <AnnouncementBar ref={ref} className="extra" data-testid="bar">
        t
      </AnnouncementBar>,
    );
    const bar = screen.getByTestId("bar");
    expect(bar).toHaveClass("announcement-bar", "extra");
    expect(ref.current).toBe(bar);
  });
});
