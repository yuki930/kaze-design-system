import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormSection } from "./FormSection";

describe("FormSection", () => {
  it("groups fields under a legend that names the group", () => {
    render(
      <FormSection title="連絡先" description="請求書の送付先です。">
        <label>
          メール
          <input />
        </label>
      </FormSection>,
    );
    const group = screen.getByRole("group", { name: "連絡先" });
    expect(group.tagName).toBe("FIELDSET");
    expect(screen.getByText("請求書の送付先です。")).toHaveClass("form-section__description");
    expect(screen.getByLabelText("メール")).toBeInTheDocument();
  });
  it("passes disabled to the fieldset", () => {
    render(<FormSection title="x" disabled />);
    expect(screen.getByRole("group")).toBeDisabled();
  });
});
