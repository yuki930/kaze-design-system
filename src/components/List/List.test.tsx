import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List, ListItem } from "./List";

describe("ListItem", () => {
  it("renders a plain row", () => {
    render(
      <List>
        <ListItem title="項目" />
      </List>,
    );
    expect(screen.getByRole("listitem")).toHaveClass("list-item");
  });

  it("puts the row on the child link when asChild", () => {
    render(
      <List>
        <ListItem interactive asChild title="項目" trailing="›">
          <a href="/x">説明</a>
        </ListItem>
      </List>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("list-item", "list-item--interactive");
    expect(link).toHaveAttribute("href", "/x");
    expect(link).toHaveTextContent("項目説明›");
    expect(screen.getByRole("listitem")).not.toHaveClass("list-item");
  });
});
