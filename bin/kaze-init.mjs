#!/usr/bin/env node
/**
 * kaze-init: AI コーディングアシスタント（Claude Code、Codex、Cursor など）が
 * Kaze で画面を組めるように、AGENTS.md に Kaze の節を書き込み、CLAUDE.md と
 * Gemini CLI（.gemini/settings.json）から読ませる。
 *
 *   npx kaze-init            # カレントディレクトリに書く
 *   npx kaze-init --dir app  # 別のディレクトリに書く
 *   npx kaze-init --dry-run  # 書き込まずに内容を表示する
 *
 * もう一度実行すると、AGENTS.md の Kaze の節だけを最新のテンプレートに差し替える。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeAgents, mergeClaude, mergeGeminiSettings } from "./agents.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const template = fs.readFileSync(path.join(here, "../templates/AGENTS.kaze.md"), "utf8");

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  console.log("使い方: kaze-init [--dir <ディレクトリ>] [--dry-run]");
  process.exit(0);
}
const dirIndex = args.indexOf("--dir");
const dir = path.resolve(dirIndex === -1 ? "." : (args[dirIndex + 1] ?? "."));
const dryRun = args.includes("--dry-run");

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null);

const agentsPath = path.join(dir, "AGENTS.md");
const claudePath = path.join(dir, "CLAUDE.md");
const agentsBefore = read(agentsPath);
const claudeBefore = read(claudePath);
const agentsAfter = mergeAgents(agentsBefore, template);
const claudeAfter = mergeClaude(claudeBefore);

const report = [];
if (agentsAfter !== agentsBefore) {
  report.push(
    `${agentsBefore === null ? "作成" : "更新"}: ${path.relative(process.cwd(), agentsPath) || "AGENTS.md"}`,
  );
  if (!dryRun) fs.writeFileSync(agentsPath, agentsAfter);
} else {
  report.push("変更なし: AGENTS.md は最新です");
}
if (claudeAfter !== null) {
  report.push(
    `${claudeBefore === null ? "作成" : "更新"}: ${path.relative(process.cwd(), claudePath) || "CLAUDE.md"}（AGENTS.md を読み込む）`,
  );
  if (!dryRun) fs.writeFileSync(claudePath, claudeAfter);
}

const geminiPath = path.join(dir, ".gemini", "settings.json");
const geminiBefore = read(geminiPath);
const gemini = mergeGeminiSettings(geminiBefore);
if (gemini.error) {
  report.push(
    `そのまま: .gemini/settings.json（${gemini.error}のため読み込めませんでした。AGENTS.md を context.fileName に足してください）`,
  );
} else if (gemini.content !== null) {
  report.push(
    `${geminiBefore === null ? "作成" : "更新"}: .gemini/settings.json（Gemini CLI が AGENTS.md を読み込む）`,
  );
  if (!dryRun) {
    fs.mkdirSync(path.dirname(geminiPath), { recursive: true });
    fs.writeFileSync(geminiPath, gemini.content);
  }
}

if (dryRun) {
  console.log(agentsAfter);
  console.log("（--dry-run のため書き込んでいません）");
}
console.log(report.join("\n"));
console.log(`
次にすること
  1. CSS を入口で読み込む: import "kaze-design-system/css/all";
  2. AI に頼む: 「Kaze で請求書の一覧画面を作って」
  3. 文言を検査する: npx kaze-copy src`);
