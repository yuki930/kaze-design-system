import type { Meta, StoryObj } from "@storybook/nextjs";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "../Button/Button";

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">表示設定</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="表示設定">
        <p style={{ marginBottom: "var(--space-3)" }}>一覧の密度と並び順を変更できます。</p>
        <PopoverClose asChild>
          <Button size="sm">閉じる</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-4)", padding: "8rem 4rem" }}>
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{side}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} aria-label={`${side} に表示`}>
            {side} に表示されます。
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button>担当者を変更</Button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="担当者の変更">
        相楽 実咲さんが担当しています。
      </PopoverContent>
    </Popover>
  ),
};
