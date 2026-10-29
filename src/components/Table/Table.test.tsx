import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
