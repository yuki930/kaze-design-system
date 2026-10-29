#!/usr/bin/env node
/**
 * Type-checks every `usage` snippet in src/views/docs/ComponentPage.tsx against
 * the real component types, so the examples on the docs site (and in
 * llms-full.txt) cannot drift from the API.
 *
 * Snippets are fragments: they use variables such as `open` or `setOpen` that
 * are never declared. Those "Cannot find name" errors for lower-case
 * identifiers are ignored; anything else (an unknown prop, a wrong value type,
 * a missing export) fails the check.
 *
 *   npm run docs:check-usage
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = path.join(root, "src/views/docs/ComponentPage.tsx");
const OUT_DIR = path.join(root, "node_modules/.cache/kaze-usage");

function readUsages() {
  const source = ts.createSourceFile(
    PAGE,
    fs.readFileSync(PAGE, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const usages = [];
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === "componentDocs" &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const entry of node.initializer.properties) {
        if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer))
          continue;
        const slug = entry.name.getText().replace(/^["']|["']$/g, "");
        for (const field of entry.initializer.properties) {
          if (ts.isPropertyAssignment(field) && field.name.getText() === "usage") {
            const init = field.initializer;
            if (ts.isNoSubstitutionTemplateLiteral(init) || ts.isStringLiteral(init)) {
              usages.push({
                slug,
                code: init.text,
                line: source.getLineAndCharacterOfPosition(init.getStart()).line + 1,
              });
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return usages;
}

/** Turns a snippet into a module: imports stay on top, JSX goes inside a component. */
function toModule({ code }) {
  const lines = code.split("\n");
  const imports = [];
  const body = [];
  let inImport = false;
  for (const line of lines) {
    if (/^import\s/.test(line) || inImport) {
      imports.push(
        line.replace(/from\s+["']kaze-design-system(\/[a-z]+)?["']/, 'from "@/components"'),
      );
      inImport = !/;\s*$|from\s+["'][^"']+["']\s*;?\s*$/.test(line);
      continue;
    }
    body.push(line);
  }
  const rest = body.join("\n").trim();
  // Snippets without imports get every component in scope
  const header = imports.length
    ? imports.join("\n")
    : 'import * as Kaze from "@/components";\nconst { ...__all } = Kaze;';
  const usesAllImplicitly = imports.length === 0;
  const prelude = usesAllImplicitly ? implicitImports(rest) : "";
  // Split at the first line that starts with "<" at column 0: statements before it,
  // one JSX block (possibly several siblings) after it.
  const firstJsx = rest.startsWith("<") ? 0 : rest.search(/\n</) + 1;
  let fn;
  if (/^(export\s+)?function\s/m.test(rest) && !/^</m.test(rest)) {
    // complete component definitions: check them as module code
    fn = rest;
  } else if (firstJsx === 0 && !rest.startsWith("<")) {
    fn = `export function __Usage() {\n${rest}\n  return null;\n}`;
  } else {
    fn = `export function __Usage() {\n${rest.slice(0, firstJsx)}\n  return (\n    <>\n${rest.slice(firstJsx)}\n    </>\n  );\n}`;
  }
  const declared = new Set(
    [...(usesAllImplicitly ? prelude : header).matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g)].map(
      (m) => m[1],
    ),
  );
  const icons = [...new Set([...rest.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1]))].filter(
    (n) => !declared.has(n) && !exportedNames.has(n) && lucideNames.has(n),
  );
  const iconImport = icons.length ? `import { ${icons.join(", ")} } from "lucide-react";` : "";
  // Free variables in snippets must not resolve to DOM globals such as window.open
  const freeVars = [
    ...new Set([...rest.matchAll(/\b([a-z][A-Za-z0-9]*)\b/g)].map((m) => m[1])),
  ].filter((n) => DOM_GLOBALS.has(n));
  const shadow = freeVars.map((n) => `declare const ${n}: any;`).join("\n");
  return `${usesAllImplicitly ? prelude : header}\n${iconImport}\n${shadow}\n\n${fn}\n`;
}

const exportedNames = (() => {
  const index = fs.readFileSync(path.join(root, "src/components/index.ts"), "utf8");
  const names = new Set();
  for (const m of index.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (name) names.add(name);
    }
  }
  return names;
})();

const lucideNames = new Set(Object.keys(await import("lucide-react")));
// Names snippets use as plain variables that would otherwise resolve to browser globals
const DOM_GLOBALS = new Set([
  "open",
  "close",
  "name",
  "status",
  "event",
  "length",
  "parent",
  "top",
  "self",
  "origin",
  "history",
  "location",
  "scroll",
  "focus",
  "blur",
  "print",
  "stop",
  "find",
  "toast",
]);

function implicitImports(code) {
  const used = new Set([...code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map((m) => m[1]));
  const known = [...used].filter((n) => exportedNames.has(n));
  return known.length ? `import { ${known.join(", ")} } from "@/components";` : "";
}

const usages = readUsages();
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
const files = usages.map((u) => {
  const file = path.join(OUT_DIR, `${u.slug}.tsx`);
  fs.writeFileSync(file, toModule(u));
  return file;
});

const config = ts.getParsedCommandLineOfConfigFile(
  path.join(root, "tsconfig.json"),
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
);
const program = ts.createProgram(files, {
  ...config.options,
  noEmit: true,
  noUnusedLocals: false,
  noUnusedParameters: false,
  incremental: false,
});
const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .filter((d) => d.file && files.includes(path.resolve(d.file.fileName)));

const IGNORED = new Set([
  2304, // Cannot find name 'x' (undeclared snippet variables)
  2552, // Cannot find name 'x'. Did you mean 'y'?
  7006, // Parameter implicitly has an 'any' type (callbacks in snippets)
  7031, // Binding element implicitly has an 'any' type
  1108, // A 'return' statement can only be used within a function body
]);
const problems = diagnostics.filter((d) => {
  if (!IGNORED.has(d.code)) return true;
  const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
  // only lower-case free variables are tolerated; an unknown Component is an error
  const name = message.match(/name '([^']+)'/)?.[1];
  return d.code !== 7006 && d.code !== 7031 && d.code !== 1108 && !!name && /^[A-Z]/.test(name);
});

const bySlug = new Map(usages.map((u) => [u.slug, u]));
for (const d of problems) {
  const slug = path.basename(d.file.fileName, ".tsx");
  const { line } = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
  const text = d.file.text.split("\n")[line]?.trim();
  console.log(
    `✗ ${slug} (ComponentPage.tsx:${bySlug.get(slug)?.line}) TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}\n    ${text}`,
  );
}
console.log(`[usage] checked ${usages.length} snippets, ${problems.length} problem(s)`);
process.exit(problems.length ? 1 : 0);
