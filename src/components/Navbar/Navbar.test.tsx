import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavbarLink, NavbarLinks } from "./Navbar";

describe("NavbarLink", () => {
  it("renders an anchor by default", () => {
    render(
      <NavbarLinks>
        <NavbarLink href="/a">A</NavbarLink>
      </NavbarLinks>,
    );
    expect(screen.getByRole("link", { name: "A" })).toHaveClass("navbar__link");
  });

  it("lends class and aria-current to the child when asChild", () => {
    render(
      <NavbarLinks>
        <NavbarLink asChild active>
          <a href="/a">A</a>
        </NavbarLink>
      </NavbarLinks>,
    );
    const link = screen.getByRole("link", { name: "A" });
    expect(link).toHaveClass("navbar__link", "navbar__link--active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("href", "/a");
  });
});
