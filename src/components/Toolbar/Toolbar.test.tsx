import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toolbar } from "./Toolbar";

describe("Toolbar", () => {
  it("is a named toolbar with start and end groups", () => {
    const { container } = render(
      <Toolbar aria-label="表示の切り替え" end={<button type="button">書き出す</button>}>
        <button type="button">月</button>
      </Toolbar>,
    );
    expect(screen.getByRole("toolbar", { name: "表示の切り替え" })).toBeInTheDocument();
    expect(container.querySelector(".toolbar__start")).toHaveTextContent("月");
    expect(container.querySelector(".toolbar__end")).toHaveTextContent("書き出す");
  });
  it("omits the end group when empty", () => {
    const { container } = render(<Toolbar aria-label="t">a</Toolbar>);
    expect(container.querySelector(".toolbar__end")).toBeNull();
  });
});
