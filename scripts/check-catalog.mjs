/**
 * Checks that every place that states the component count, and the component
 * table in README.md, matches the catalog in ComponentsOverview.tsx.
 *
 *   node scripts/check-catalog.mjs
 *
 * Each pattern below must match at least once. If you reword one of these
 * sentences, update its pattern here so the check keeps covering it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCategories } from "./catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const categories = parseCategories();
const isMarketing = (c) => c.layer === "marketing";
const count = (list) => list.reduce((sum, c) => sum + c.components.length, 0);
const counts = {
  total: count(categories),
  application: count(categories.filter((c) => !isMarketing(c))),
  marketing: count(categories.filter(isMarketing)),
};

/** [file, pattern with one capture group for the number, which count it states] */
const COUNT_SITES = [
  ["README.md", /\*\*(\d+) のコンポーネント\*\*/g, "total"],
  ["README.md", /`llms-full\.txt` には (\d+) コンポーネント/g, "total"],
  ["README.md", /管理画面・アプリ向けの (\d+) コンポーネント/g, "application"],
  ["README.md", /LP・キャンペーンページ向けの (\d+) コンポーネント/g, "marketing"],
  ["README.md", /## コンポーネント一覧（(\d+) コンポーネント）/g, "total"],
  ["README.md", /### Application UI（(\d+)）/g, "application"],
  ["README.md", /### Marketing（(\d+)）/g, "marketing"],
  ["package.json", /, (\d+) components,/g, "total"],
  [".github/ISSUE_TEMPLATE/config.yml", /(\d+) コンポーネントのプレビュー/g, "total"],
  [
    "src/views/landing/LandingPage/LandingPage.tsx",
    /value: "(\d+)", label: "コンポーネント"/g,
    "total",
  ],
  ["CLAUDE.md", /\*\*コンポーネント数\*\*: (\d+)/g, "total"],
  ["CLAUDE.md", /画面を組む(\d+)コンポーネント/g, "application"],
  ["CLAUDE.md", /正準(\d+)コンポーネント/g, "marketing"],
  ["CLAUDE.md", /コンポーネント総数は (\d+)（/g, "total"],
  ["CLAUDE.md", /総数は \d+（(\d+) \+/g, "application"],
  ["CLAUDE.md", /総数は \d+（\d+ \+ (\d+)）/g, "marketing"],
  ["CLAUDE.md", /docs:llms` で(\d+)個出力/g, "total"],
];

const errors = [];

for (const [file, pattern, kind] of COUNT_SITES) {
  const matches = [...read(file).matchAll(pattern)];
  if (matches.length === 0) {
    errors.push(
      `${file}: ${pattern} が見つかりません。文言を変えたときは scripts/check-catalog.mjs も直してください`,
    );
    continue;
  }
  for (const match of matches) {
    const stated = Number(match[1]);
    if (stated !== counts[kind]) {
      errors.push(`${file}: 「${match[0]}」は ${counts[kind]} のはずです（${kind}）`);
    }
  }
}

// README's component table lists the same names as the catalog.
// "Layout (AppLayout)" in the catalog is written "AppLayout" in README.
const catalogName = (name) => name.match(/\(([^)]+)\)/)?.[1] ?? name;
const catalogNames = new Set(
  categories.flatMap((c) => c.components.map((x) => catalogName(x.name))),
);

const readme = read("README.md");
const tableStart = readme.indexOf("## コンポーネント一覧");
const tableEnd = readme.indexOf("\n## ", tableStart + 1);
if (tableStart === -1) {
  errors.push("README.md: 「## コンポーネント一覧」の節が見つかりません");
} else {
  const readmeNames = new Set();
  for (const line of readme.slice(tableStart, tableEnd === -1 ? undefined : tableEnd).split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim());
    // | **カテゴリ** | A, B, C |
    if (cells.length < 4 || !cells[1]?.startsWith("**")) continue;
    for (const name of cells[2].split(",")) if (name.trim()) readmeNames.add(name.trim());
  }
  const missing = [...catalogNames].filter((name) => !readmeNames.has(name));
  const extra = [...readmeNames].filter((name) => !catalogNames.has(name));
  if (missing.length) errors.push(`README.md の一覧表に足りない: ${missing.join(", ")}`);
  if (extra.length) errors.push(`README.md の一覧表にあるがカタログにない: ${extra.join(", ")}`);
}

if (errors.length) {
  console.error(
    `[catalog] カタログは ${counts.total}（Application UI ${counts.application} + Marketing ${counts.marketing}）です。次を直してください:`,
  );
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `[catalog] OK: ${counts.total} components (Application UI ${counts.application} + Marketing ${counts.marketing}), ${COUNT_SITES.length} count sites and the README table match`,
);
