import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTableSort } from "./useTableSort";

interface Row {
  name: string;
  sales: number | null;
}

const rows: Row[] = [
  { name: "梅田", sales: 3915000 },
  { name: "渋谷", sales: 4820000 },
  { name: "福岡", sales: null },
  { name: "天神", sales: 2140000 },
];

describe("useTableSort", () => {
  it("keeps the original order until a column is pressed", () => {
    const { result } = renderHook(() => useTableSort(rows));
    expect(result.current.rows).toEqual(rows);
    expect(result.current.getSortProps("sales").sortDirection).toBe("none");
  });

  it("cycles ascending, descending, then back to the original order", () => {
    const { result } = renderHook(() => useTableSort(rows));
    act(() => result.current.getSortProps("sales").onSort());
    expect(result.current.getSortProps("sales").sortDirection).toBe("ascending");
    expect(result.current.rows.map((r) => r.name)).toEqual(["天神", "梅田", "渋谷", "福岡"]);
    act(() => result.current.getSortProps("sales").onSort());
    expect(result.current.getSortProps("sales").sortDirection).toBe("descending");
    expect(result.current.rows.map((r) => r.name)).toEqual(["渋谷", "梅田", "天神", "福岡"]);
    act(() => result.current.getSortProps("sales").onSort());
    expect(result.current.getSortProps("sales").sortDirection).toBe("none");
    expect(result.current.rows).toEqual(rows);
  });

  it("starts a new column at ascending and clears the previous one", () => {
    const { result } = renderHook(() => useTableSort(rows));
    act(() => result.current.getSortProps("sales").onSort());
    act(() => result.current.getSortProps("name").onSort());
    expect(result.current.getSortProps("sales").sortDirection).toBe("none");
    expect(result.current.getSortProps("name").sortDirection).toBe("ascending");
  });

  it("sorts strings with the Japanese collator", () => {
    const { result } = renderHook(() =>
      useTableSort([{ name: "う" }, { name: "あ" }, { name: "い" }], {
        initial: { key: "name", direction: "ascending" },
      }),
    );
    expect(result.current.rows.map((r) => r.name)).toEqual(["あ", "い", "う"]);
  });

  it("honours initial and does not mutate the input", () => {
    const input = [...rows];
    const { result } = renderHook(() =>
      useTableSort(input, { initial: { key: "sales", direction: "descending" } }),
    );
    expect(result.current.rows[0]?.name).toBe("渋谷");
    expect(input).toEqual(rows);
  });

  it("uses a custom compare for the ascending order", () => {
    const { result } = renderHook(() =>
      useTableSort(rows, {
        initial: { key: "name", direction: "ascending" },
        compare: (a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name),
      }),
    );
    expect(result.current.rows).toHaveLength(4);
  });
});
