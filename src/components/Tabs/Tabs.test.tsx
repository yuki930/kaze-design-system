import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { TabGroup, Tabs, Tab, TabPanel } from "./Tabs";

function Group({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <TabGroup defaultValue="a" onValueChange={onValueChange}>
      <Tabs>
        <Tab value="a">タブ1</Tab>
        <Tab value="b">タブ2</Tab>
      </Tabs>
      <TabPanel value="a">内容A</TabPanel>
      <TabPanel value="b">内容B</TabPanel>
    </TabGroup>
  );
}

function Parent() {
  const [v, setV] = useState("a");
  return (
    <TabGroup value={v} onValueChange={setV}>
      <Tabs>
        <Tab value="a">タブ1</Tab>
        <Tab value="b">タブ2</Tab>
      </Tabs>
      <TabPanel value="b">内容B</TabPanel>
    </TabGroup>
  );
}

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

describe("TabGroup value", () => {
  it("follows the controlled value and reports clicks without switching by itself", () => {
    const onValueChange = vi.fn();
    render(
      <TabGroup value="a" onValueChange={onValueChange}>
        <Tabs>
          <Tab value="a">タブ1</Tab>
          <Tab value="b">タブ2</Tab>
        </Tabs>
        <TabPanel value="a">内容A</TabPanel>
        <TabPanel value="b">内容B</TabPanel>
      </TabGroup>,
    );
    const first = screen.getByRole("tab", { name: "タブ1" });
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(first).toHaveAttribute("tabindex", "0");
    expect(first).toHaveClass("tab", "tab--active");
    expect(first).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("tabindex", "-1");
    fireEvent.click(screen.getByRole("tab", { name: "タブ2" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("内容A")).toBeInTheDocument();
  });

  it("switches tabs and panels with defaultValue (uncontrolled)", () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    expect(screen.getByText("内容A")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "タブ2" }));
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("data-state", "inactive");
    expect(screen.queryByText("内容A")).toBeNull();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("data-state", "active");
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("works as a controlled state in a parent", () => {
    render(<Parent />);
    fireEvent.click(screen.getByRole("tab", { name: "タブ2" }));
    expect(screen.getByText("内容B")).toBeInTheDocument();
  });

  it("composes the user's onClick with selection", () => {
    const onClick = vi.fn();
    render(
      <TabGroup defaultValue="a">
        <Tabs>
          <Tab value="a">タブ1</Tab>
          <Tab value="b" onClick={onClick}>
            タブ2
          </Tab>
        </Tabs>
      </TabGroup>,
    );
    fireEvent.click(screen.getByRole("tab", { name: "タブ2" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("aria-selected", "true");
  });

  it("renders a link as the tab with asChild", () => {
    const onValueChange = vi.fn();
    render(
      <TabGroup defaultValue="a" onValueChange={onValueChange}>
        <Tabs>
          <Tab value="a" asChild>
            <a href="/a">タブ1</a>
          </Tab>
          <Tab value="b" asChild>
            <a href="/b">タブ2</a>
          </Tab>
        </Tabs>
      </TabGroup>,
    );
    const tab = screen.getByRole("tab", { name: "タブ2" });
    expect(tab.tagName).toBe("A");
    expect(tab).not.toHaveAttribute("type");
    expect(tab).toHaveClass("tab");
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(tab);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});

describe("Tab / TabPanel outside a TabGroup", () => {
  it("renders every Tab unselected and hides every TabPanel without crashing", () => {
    render(
      <>
        <Tabs>
          <Tab value="a">タブ1</Tab>
          <Tab>タブ2</Tab>
        </Tabs>
        <TabPanel value="a">内容</TabPanel>
      </>,
    );
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-selected", "false");
      expect(tab).not.toHaveClass("tab--active");
    }
    expect(screen.queryByText("内容")).toBeNull();
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
      <TabGroup>
        <Tabs>
          <Tab value="a">タブ1</Tab>
          <Tab value="b">タブ2</Tab>
        </Tabs>
      </TabGroup>,
    );
    rerender(
      <TabGroup value="b">
        <Tabs>
          <Tab value="a">タブ1</Tab>
          <Tab value="b">タブ2</Tab>
        </Tabs>
      </TabGroup>,
    );
    expect(screen.getByRole("tab", { name: "タブ1" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("tabindex", "0");
  });

  it("sets aria-orientation and makes the panel focusable", () => {
    render(
      <TabGroup defaultValue="a">
        <Tabs>
          <Tab value="a">タブ1</Tab>
        </Tabs>
        <TabPanel value="a">内容</TabPanel>
      </TabGroup>,
    );
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
  });

  it("moves focus and selection with arrow keys and still calls a user onKeyDown", () => {
    const onKeyDown = vi.fn();
    render(
      <TabGroup defaultValue="a">
        <Tabs onKeyDown={onKeyDown}>
          <Tab value="a">タブ1</Tab>
          <Tab value="b">タブ2</Tab>
        </Tabs>
      </TabGroup>,
    );
    const first = screen.getByRole("tab", { name: "タブ1" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "タブ2" })).toHaveAttribute("aria-selected", "true");
  });
});
