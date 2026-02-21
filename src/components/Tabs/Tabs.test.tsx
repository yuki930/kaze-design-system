import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tabs, Tab } from "./Tabs";

describe("Tabs", () => {
  it("renders with role='tablist'", () => {
    render(
      <Tabs>
        <Tab>タブ1</Tab>
        <Tab>タブ2</Tab>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("applies tabs class", () => {
    render(
      <Tabs>
        <Tab>タブ1</Tab>
      </Tabs>,
    );
    expect(screen.getByRole("tablist")).toHaveClass("tabs");
  });
});

describe("Tab", () => {
  it("renders with role='tab'", () => {
    render(
      <Tabs>
        <Tab>タブ1</Tab>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "タブ1" })).toBeInTheDocument();
  });

  it("active tab has aria-selected='true'", () => {
    render(
      <Tabs>
        <Tab active>アクティブ</Tab>
        <Tab>非アクティブ</Tab>
      </Tabs>,
    );
    const activeTab = screen.getByRole("tab", { name: "アクティブ" });
    expect(activeTab).toHaveAttribute("aria-selected", "true");
  });

  it("inactive tab has tabIndex=-1", () => {
    render(
      <Tabs>
        <Tab active>アクティブ</Tab>
        <Tab>非アクティブ</Tab>
      </Tabs>,
    );
    const inactiveTab = screen.getByRole("tab", { name: "非アクティブ" });
    expect(inactiveTab).toHaveAttribute("tabindex", "-1");
  });

  it("active tab has tabIndex=0", () => {
    render(
      <Tabs>
        <Tab active>アクティブ</Tab>
        <Tab>非アクティブ</Tab>
      </Tabs>,
    );
    const activeTab = screen.getByRole("tab", { name: "アクティブ" });
    expect(activeTab).toHaveAttribute("tabindex", "0");
  });

  it("applies tab--active class when active", () => {
    render(
      <Tabs>
        <Tab active>アクティブ</Tab>
      </Tabs>,
    );
    const tab = screen.getByRole("tab", { name: "アクティブ" });
    expect(tab).toHaveClass("tab", "tab--active");
  });
});
