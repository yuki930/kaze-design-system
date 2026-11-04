import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SaveBar } from "./SaveBar";
describe("SaveBar", () => {
  it("saves dirty changes, suppresses duplicate requests while saving, and permits retry", () => {
    const onSave = vi.fn(),
      onReset = vi.fn();
    const { rerender } = render(<SaveBar state="dirty" onSave={onSave} onReset={onReset} />);
    fireEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    rerender(<SaveBar state="saving" onSave={onSave} onReset={onReset} />);
    fireEvent.click(screen.getByRole("button", { name: "保存する" }));
    fireEvent.click(screen.getByRole("button", { name: "変更を戻す" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onReset).not.toHaveBeenCalled();
    rerender(
      <SaveBar state="error" message="接続を確認してください" onSave={onSave} onReset={onReset} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("接続を確認してください");
    fireEvent.click(screen.getByRole("button", { name: "保存する" }));
    expect(onSave).toHaveBeenCalledTimes(2);
  });
  it.each(["idle", "saved"] as const)("does not save unchanged %s state", (state) => {
    render(<SaveBar state={state} onSave={vi.fn()} />);
    expect(screen.getByRole("button", { name: "保存する" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "変更を戻す" })).not.toBeInTheDocument();
  });
  it("keeps reset available for invalid input and does not submit a surrounding form", () => {
    const reset = vi.fn(),
      submit = vi.fn();
    render(
      <form onSubmit={submit}>
        <SaveBar state="dirty" disabled onSave={vi.fn()} onReset={reset} />
      </form>,
    );
    expect(screen.getByRole("button", { name: "保存する" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "変更を戻す" }));
    expect(reset).toHaveBeenCalledOnce();
    expect(submit).not.toHaveBeenCalled();
  });
});
