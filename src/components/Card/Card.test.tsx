import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
} from "./Card";

describe("Card", () => {
  it("renders with correct className", () => {
    render(<Card data-testid="card">カード内容</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("card");
    expect(card).toHaveTextContent("カード内容");
  });

  it("does not add variant class for default variant", () => {
    render(<Card data-testid="card">デフォルト</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("card");
    expect(card).not.toHaveClass("card--interactive");
    expect(card).not.toHaveClass("card--compact");
  });

  it("interactive variant adds correct class", () => {
    render(
      <Card variant="interactive" data-testid="card">
        インタラクティブ
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("card", "card--interactive");
  });

  it("compact variant adds correct class", () => {
    render(
      <Card variant="compact" data-testid="card">
        コンパクト
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveClass("card", "card--compact");
  });
});

describe("CardHeader", () => {
  it("renders with correct className", () => {
    render(<CardHeader data-testid="header">ヘッダー</CardHeader>);
    const header = screen.getByTestId("header");
    expect(header).toHaveClass("card__header");
    expect(header).toHaveTextContent("ヘッダー");
  });
});

describe("CardTitle", () => {
  it("renders as h3 heading", () => {
    render(<CardTitle>タイトル</CardTitle>);
    const title = screen.getByRole("heading", { level: 3, name: "タイトル" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("card__title");
  });
});

describe("CardBody", () => {
  it("renders with correct className", () => {
    render(<CardBody data-testid="body">本文</CardBody>);
    const body = screen.getByTestId("body");
    expect(body).toHaveClass("card__body");
    expect(body).toHaveTextContent("本文");
  });
});

describe("CardFooter", () => {
  it("renders with correct className", () => {
    render(<CardFooter data-testid="footer">フッター</CardFooter>);
    const footer = screen.getByTestId("footer");
    expect(footer).toHaveClass("card__footer");
    expect(footer).toHaveTextContent("フッター");
  });
});
