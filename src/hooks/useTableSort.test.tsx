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
  describe("sortBy", () => {
    interface Person {
      name: string;
      kana: string | null;
      age: number;
    }
    // 辞書順（コード順）では 斎藤 < 佐藤 < 渡辺 < 伊藤 にならず、読みの順とずれる
    const people: Person[] = [
      { name: "渡辺", kana: "わたなべ", age: 41 },
      { name: "佐藤", kana: "さとう", age: 28 },
      { name: "伊藤", kana: "いとう", age: 35 },
      { name: "斎藤", kana: "さいとう", age: 52 },
    ];
    const byKana = { name: (row: Person) => row.kana };

    it("sorts a kanji column by the reading it returns", () => {
      const { result } = renderHook(() => useTableSort(people, { sortBy: byKana }));
      act(() => result.current.getSortProps("name").onSort());
      expect(result.current.rows.map((r) => r.name)).toEqual(["伊藤", "斎藤", "佐藤", "渡辺"]);
      act(() => result.current.getSortProps("name").onSort());
      expect(result.current.rows.map((r) => r.name)).toEqual(["渡辺", "佐藤", "斎藤", "伊藤"]);
    });

    it("puts rows without a reading last in both directions", () => {
      const withMissing = [{ name: "未登録", kana: null, age: 20 }, ...people];
      const { result } = renderHook(() => useTableSort(withMissing, { sortBy: byKana }));
      act(() => result.current.getSortProps("name").onSort());
      expect(result.current.rows[withMissing.length - 1]?.name).toBe("未登録");
      act(() => result.current.getSortProps("name").onSort());
      expect(result.current.rows[withMissing.length - 1]?.name).toBe("未登録");
    });

    it("leaves other columns on their own values", () => {
      const { result } = renderHook(() =>
        useTableSort(people, { sortBy: byKana, initial: { key: "age", direction: "ascending" } }),
      );
      expect(result.current.rows.map((r) => r.age)).toEqual([28, 35, 41, 52]);
    });

    it("lets compare take precedence", () => {
      const { result } = renderHook(() =>
        useTableSort(people, {
          sortBy: byKana,
          compare: (a, b) => a.age - b.age,
          initial: { key: "name", direction: "ascending" },
        }),
      );
      expect(result.current.rows.map((r) => r.name)).toEqual(["佐藤", "伊藤", "渡辺", "斎藤"]);
    });
  });
});
