import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAB } from "./FAB";

describe("FAB", () => {
  it("renders a labelled button", () => {
    render(<FAB label="追加" />);
    expect(screen.getByRole("button", { name: "追加" })).toHaveClass("fab", "fab--primary");
  });

  it("renders the child element with fab classes when asChild", () => {
    render(
      <FAB asChild label="追加">
        <a href="/new">+</a>
      </FAB>,
    );
    const link = screen.getByRole("link", { name: "追加" });
    expect(link).toHaveClass("fab", "fab--md");
    expect(link).toHaveAttribute("href", "/new");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("blocks clicks and sets aria-disabled when asChild + disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FAB asChild disabled label="追加" onClick={onClick}>
        <a href="/x">+</a>
      </FAB>,
    );
    const link = screen.getByRole("link", { name: "追加" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("disabled");
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
