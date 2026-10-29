"use client";

import { useCallback, useMemo, useState } from "react";
import type { SortDirection } from "../components/Table/Table";

type ActiveDirection = Exclude<SortDirection, "none">;

export interface UseTableSortOptions<T> {
  /** 最初から並べ替えておく列と向き */
  initial?: { key: keyof T; direction: ActiveDirection };
  /** 比較関数。昇順の結果を返す（降順は呼び出し側が反転する）。既定は数値は数値、文字列は日本語の辞書順 */
  compare?: (a: T, b: T, key: keyof T) => number;
}

export interface TableSortProps {
  sortDirection: SortDirection;
  onSort: () => void;
}

export interface UseTableSortResult<T> {
  rows: T[];
  getSortProps: (key: keyof T) => TableSortProps;
}

function defaultCompare(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "ja");
}

const isEmpty = (value: unknown) => value === null || value === undefined;

/**
 * 並べ替えの状態を持ち、並べ替え済みの行と TableHead に渡す props を返す。
 * 同じ列を押すたびに 昇順 → 降順 → 解除（元の順）と進む。
 */
export function useTableSort<T>(
  rows: readonly T[],
  options: UseTableSortOptions<T> = {},
): UseTableSortResult<T> {
  const { initial, compare } = options;
  const [sort, setSort] = useState<{ key: keyof T; direction: ActiveDirection } | null>(
    initial ?? null,
  );

  const sorted = useMemo(() => {
    if (!sort) return [...rows];
    const sign = sort.direction === "ascending" ? 1 : -1;
    const { key } = sort;
    return [...rows].sort((a, b) => {
      if (compare) return sign * compare(a, b, key);
      const x = a[key];
      const y = b[key];
      // null / undefined は向きに関わらず末尾に置く
      if (isEmpty(x) || isEmpty(y)) return Number(isEmpty(x)) - Number(isEmpty(y));
      return sign * defaultCompare(x, y);
    });
  }, [rows, sort, compare]);

  const getSortProps = useCallback(
    (key: keyof T): TableSortProps => ({
      sortDirection: sort?.key === key ? sort.direction : "none",
      onSort: () =>
        setSort((current) => {
          if (current?.key !== key) return { key, direction: "ascending" };
          return current.direction === "ascending" ? { key, direction: "descending" } : null;
        }),
    }),
    [sort],
  );

  return { rows: sorted, getSortProps };
}
