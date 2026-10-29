import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("applies tone", () => {
    const { container } = render(<Progress value={30} tone="positive" />);
    expect(container.firstElementChild).toHaveAttribute("data-tone", "positive");
    expect(container.querySelector(".progress__fill--positive")).not.toBeNull();
  });
});
