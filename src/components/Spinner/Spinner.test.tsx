import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status with the default label", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("spinner", "spinner--md");
    expect(el).toHaveTextContent("読み込み中");
  });

  it.each(["sm", "md", "lg"] as const)("applies the %s size", (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole("status")).toHaveClass(`spinner--${size}`);
  });

  it("accepts a custom label", () => {
    render(<Spinner label="同期しています" />);
    expect(screen.getByRole("status")).toHaveTextContent("同期しています");
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} className="extra" />);
    expect(ref.current).toHaveClass("spinner", "extra");
  });
});
