import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb current page", () => {
  it("marks only the last item as the current page", () => {
    render(
      <Breadcrumb
        items={[{ label: "ホーム", href: "/" }, { label: "設定" }, { label: "プロフィール" }]}
      />,
    );
    const current = document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("プロフィール");
  });
});
