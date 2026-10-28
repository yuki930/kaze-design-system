import type { Meta, StoryObj } from "@storybook/nextjs";
import { Heatmap } from "./Heatmap";

/** Deterministic PRNG (mulberry32) so stories never change between renders. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const days = ["月", "火", "水", "木", "金", "土", "日"];
const hours = Array.from({ length: 24 }, (_, h) => String(h));

const matrixValues = (() => {
  const next = rng(7);
  return days.map((_, d) =>
    hours.map((_, h) => {
      const work = d < 5 ? 1 : 0.35;
      const peak = Math.exp(-(((h - 14) / 5) ** 2));
      return Math.round(next() * 40 * work + 160 * work * peak);
    }),
  );
})();

const fmt = (d: Date) => d.toISOString().slice(0, 10);
const calendarEnd = "2026-10-29";
const calendarData = (() => {
  const next = rng(42);
  const end = Date.UTC(2026, 9, 29);
  const out: { date: string; value: number }[] = [];
  for (let i = 0; i < 183; i++) {
    const day = new Date(end - i * 86_400_000);
    const weekday = day.getUTCDay();
    const r = next();
    if (r < 0.3) continue;
    out.push({ date: fmt(day), value: Math.round(r * (weekday === 0 || weekday === 6 ? 4 : 12)) });
  }
  return out;
})();

const meta = {
  title: "Components/Heatmap",
  component: Heatmap,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Matrix: Story = {
  args: {
    "aria-label": "曜日と時間帯別のアクセス数",
    variant: "matrix",
    rows: days,
    columns: hours,
    values: matrixValues,
    formatValue: (v) => `${v.toLocaleString("ja-JP")} 件`,
  },
};

export const Calendar: Story = {
  args: {
    "aria-label": "直近 6 か月の日別アクティビティ",
    variant: "calendar",
    data: calendarData,
    startDate: "2026-05-01",
    endDate: calendarEnd,
    formatValue: (v) => `${v} 件`,
  },
};

export const SundayStart: Story = {
  args: { ...Calendar.args, weekStartsOn: 0 },
};

export const CustomColor: Story = {
  args: { ...Matrix.args, color: "var(--chart-4)", levels: 4, cellSize: 20 },
};
