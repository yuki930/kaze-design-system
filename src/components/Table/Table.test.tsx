import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

function Sample(props: { compact?: boolean; className?: string }) {
  return (
    <Table aria-label="メンバー" {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead scope="row">役職</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>相楽 実咲</TableCell>
          <TableCell>SRE</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders a table wrapped in a scroll container", () => {
    render(<Sample />);
    const table = screen.getByRole("table", { name: "メンバー" });
    expect(table).toHaveClass("table");
    expect(table).not.toHaveClass("table--compact");
    expect(table.parentElement).toHaveClass("table-wrapper");
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "相楽 実咲" })).toBeInTheDocument();
  });

  it("applies the compact modifier and merges className", () => {
    render(<Sample compact className="extra" />);
    expect(screen.getByRole("table")).toHaveClass("table", "table--compact", "extra");
  });

  it("defaults TableHead scope to col and allows overriding it", () => {
    render(<Sample />);
    expect(screen.getByRole("columnheader", { name: "名前" })).toHaveAttribute("scope", "col");
    expect(screen.getByText("役職")).toHaveAttribute("scope", "row");
  });

  it("forwards refs, className and rest props on every part", () => {
    const refs = {
      table: createRef<HTMLTableElement>(),
      thead: createRef<HTMLTableSectionElement>(),
      tbody: createRef<HTMLTableSectionElement>(),
      tr: createRef<HTMLTableRowElement>(),
      th: createRef<HTMLTableCellElement>(),
      td: createRef<HTMLTableCellElement>(),
    };
    render(
      <Table ref={refs.table} data-testid="table">
        <TableHeader ref={refs.thead} className="h" data-testid="thead">
          <TableRow>
            <TableHead ref={refs.th} className="th" aria-sort="ascending">
              H
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={refs.tbody} className="b" data-testid="tbody">
          <TableRow ref={refs.tr} className="r" data-testid="tr">
            <TableCell ref={refs.td} className="td" colSpan={2}>
              D
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(refs.table.current).toBe(screen.getByTestId("table"));
    expect(refs.thead.current).toBe(screen.getByTestId("thead"));
    expect(refs.thead.current?.tagName).toBe("THEAD");
    expect(refs.thead.current).toHaveClass("h");
    expect(refs.tbody.current).toBe(screen.getByTestId("tbody"));
    expect(refs.tbody.current?.tagName).toBe("TBODY");
    expect(refs.tbody.current).toHaveClass("b");
    expect(refs.tr.current).toBe(screen.getByTestId("tr"));
    expect(refs.tr.current).toHaveClass("r");
    const th = screen.getByRole("columnheader", { name: "H" });
    expect(refs.th.current).toBe(th);
    expect(th).toHaveClass("th");
    expect(th).toHaveAttribute("aria-sort", "ascending");
    const td = screen.getByRole("cell", { name: "D" });
    expect(refs.td.current).toBe(td);
    expect(td).toHaveClass("td");
    expect(td).toHaveAttribute("colspan", "2");
  });
});

describe("TableHead sorting", () => {
  function renderHead(props: Parameters<typeof TableHead>[0]) {
    render(
      <Table aria-label="売上">
        <TableHeader>
          <TableRow>
            <TableHead {...props}>売上</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    return screen.getByRole("columnheader");
  }

  it("is plain text without onSort", () => {
    const th = renderHead({});
    expect(th.querySelector("button")).toBeNull();
    expect(th).not.toHaveAttribute("aria-sort");
  });

  it("wraps the heading in a button and calls onSort", async () => {
    const onSort = vi.fn();
    const th = renderHead({ onSort });
    const button = screen.getByRole("button", { name: "売上" });
    expect(button).toHaveClass("table__sort");
    expect(button).toHaveAttribute("type", "button");
    expect(th).not.toHaveAttribute("aria-sort");
    expect(th.querySelector(".table__sort-icon--idle")).not.toBeNull();
    await userEvent.click(button);
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it.each(["ascending", "descending"] as const)("sets aria-sort for %s", (sortDirection) => {
    const th = renderHead({ onSort: () => {}, sortDirection });
    expect(th).toHaveAttribute("aria-sort", sortDirection);
    expect(th.querySelector(".table__sort-icon--idle")).toBeNull();
    expect(th.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the numeric class on the th", () => {
    const th = renderHead({ onSort: () => {}, className: "table__cell--numeric" });
    expect(th).toHaveClass("table__cell--numeric");
  });
});
