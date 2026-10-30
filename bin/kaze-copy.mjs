#!/usr/bin/env node
/**
 * kaze-copy: Kaze の文言ガイドに反した日本語を見つける（--fix で直せるものは直す）。
 *
 *   npx kaze-copy src README.md
 *   npx kaze-copy src --fix
 *   npx kaze-copy src --enable notation/number-spacing-tight --disable notation/latin-spacing
 *   npx kaze-copy src --json
 *
 * 終了コード: error の指摘があれば 1。--strict を付けると warning でも 1。
 * 行に `kaze-copy-ignore` と書くとその行を、`kaze-copy-ignore-next-line` と書くと次の行を読み飛ばす。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(here, "../dist/writing.js");
if (!fs.existsSync(entry)) {
  console.error(
    "kaze-copy: dist/writing.js が見つかりません。リポジトリ内で使うときは先に npm run build:lib を実行してください。",
  );
  process.exit(2);
}
const { checkCopy, fixCopy, copyRules } = await import(entry);

const CODE_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".vue",
  ".svelte",
  ".astro",
]);
const MARKDOWN_EXT = new Set([".md", ".mdx"]);
const TEXT_EXT = new Set([".txt", ".html", ".json"]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  "storybook-static",
  "generated",
]);
const SKIP_FILE = /\.(test|spec|stories)\.[a-z]+$/;

function parseArgs(argv) {
  const opts = { paths: [], fix: false, json: false, strict: false, rules: {} };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--fix") opts.fix = true;
    else if (arg === "--json") opts.json = true;
    else if (arg === "--strict") opts.strict = true;
    else if (arg === "--enable" || arg === "--disable") {
      for (const id of (argv[++i] ?? "").split(",").filter(Boolean))
        opts.rules[id] = arg === "--enable";
    } else if (arg === "--rules") {
      for (const r of copyRules) {
        console.log(`${r.id}\t${r.level}\t${r.default ? "on" : "off"}\t${r.message}`);
      }
      process.exit(0);
    } else if (arg === "-h" || arg === "--help") {
      console.log(
        "使い方: kaze-copy <パス...> [--fix] [--json] [--strict] [--enable id,id] [--disable id,id] [--rules]",
      );
      process.exit(0);
    } else opts.paths.push(arg);
  }
  if (opts.paths.length === 0) opts.paths.push(".");
  return opts;
}

function modeFor(file) {
  const ext = path.extname(file);
  if (CODE_EXT.has(ext)) return "code";
  if (MARKDOWN_EXT.has(ext)) return "markdown";
  if (TEXT_EXT.has(ext)) return "text";
  return null;
}

function* walk(target) {
  const stat = fs.statSync(target, { throwIfNoEntry: false });
  if (!stat) {
    console.error(`kaze-copy: ${target} が見つかりません`);
    return;
  }
  if (stat.isFile()) {
    if (modeFor(target)) yield target;
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith("."))
        yield* walk(path.join(target, entry.name));
    } else if (modeFor(entry.name) && !SKIP_FILE.test(entry.name)) {
      yield path.join(target, entry.name);
    }
  }
}

const opts = parseArgs(process.argv.slice(2));
const results = [];
let errors = 0;
let warnings = 0;
let fixedFiles = 0;

for (const target of opts.paths) {
  for (const file of walk(target)) {
    const mode = modeFor(file);
    let text = fs.readFileSync(file, "utf8");
    const options = { mode, rules: opts.rules };
    if (opts.fix) {
      const fixed = fixCopy(text, options);
      if (fixed !== text) {
        fs.writeFileSync(file, fixed);
        text = fixed;
        fixedFiles++;
      }
    }
    for (const issue of checkCopy(text, options)) {
      results.push({ file, ...issue });
      if (issue.level === "error") errors++;
      else warnings++;
    }
  }
}

if (opts.json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const where = `${r.file}:${r.line}:${r.column}`;
    const shown = r.match ? `「${r.match}」` : "";
    const hint =
      r.suggestion !== undefined && r.suggestion !== r.match ? ` → 「${r.suggestion}」` : "";
    console.log(
      `${where}  ${r.level === "error" ? "error" : "warn "}  ${r.ruleId}  ${shown}${hint}  ${r.message}`,
    );
  }
  const summary = [`error ${errors} 件`, `warning ${warnings} 件`];
  if (opts.fix) summary.push(`${fixedFiles} ファイルを修正`);
  console.log(`\nkaze-copy: ${summary.join(" / ")}`);
}

// exitCode (not exit()) so a large report piped to another process is flushed first
process.exitCode = errors > 0 || (opts.strict && warnings > 0) ? 1 : 0;
