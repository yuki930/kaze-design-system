import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, Tab, TabPanel } from "./Tabs";

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

describe("Tabs keyboard and a11y", () => {
  it("makes the first tab tabbable when no tab is active", () => {
    render(
      <Tabs>
        <Tab>タブ1</Tab>
        <Tab>タブ2</Tab>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("tabindex", "-1");
  });

  it("hands tabIndex back to the active tab once one exists", () => {
    const { rerender } = render(
      <Tabs>
        <Tab>タブ1</Tab>
        <Tab>タブ2</Tab>
      </Tabs>,
    );
    rerender(
      <Tabs>
        <Tab>タブ1</Tab>
        <Tab active>タブ2</Tab>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("tabindex", "0");
  });

  it("sets aria-orientation and makes the panel focusable", () => {
    render(
      <>
        <Tabs>
          <Tab active>タブ1</Tab>
        </Tabs>
        <TabPanel value="a" selected="a">
          内容
        </TabPanel>
      </>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
  });

  it("moves focus with arrow keys and still calls a user onKeyDown", () => {
    const onKeyDown = vi.fn();
    render(
      <Tabs onKeyDown={onKeyDown}>
        <Tab active>タブ1</Tab>
        <Tab>タブ2</Tab>
      </Tabs>,
    );
    const first = screen.getByRole("tab", { name: "タブ1" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveFocus();
  });
});
