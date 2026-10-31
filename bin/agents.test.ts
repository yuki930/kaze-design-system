import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkCopy } from "../src/writing";
import { END, START, mergeAgents, mergeClaude, mergeGeminiSettings } from "./agents.mjs";

const root = path.resolve(__dirname, "..");
const template = fs.readFileSync(path.join(root, "templates/AGENTS.kaze.md"), "utf8");

describe("mergeAgents", () => {
  it("creates AGENTS.md with a heading", () => {
    const out = mergeAgents(null, template);
    expect(out.startsWith("# AGENTS.md\n\n<!-- kaze:start")).toBe(true);
    expect(out.trimEnd().endsWith(END)).toBe(true);
  });

  it("appends to an AGENTS.md without a Kaze section and keeps the rest", () => {
    const out = mergeAgents("# AGENTS.md\n\n## Build\n\nnpm run build\n", template);
    expect(out).toContain("## Build\n\nnpm run build\n\n<!-- kaze:start");
  });

  it("replaces only the Kaze section on a second run", () => {
    const before = `# AGENTS.md\n\nintro\n\n${START} old -->\nold rules\n${END}\n\n## Tail\n`;
    const out = mergeAgents(before, template);
    expect(out).not.toContain("old rules");
    expect(out).toContain("intro\n\n<!-- kaze:start");
    expect(out).toContain(`${END}\n\n## Tail\n`);
    expect(mergeAgents(out, template)).toBe(out);
  });
});

describe("mergeClaude", () => {
  it("creates CLAUDE.md that imports AGENTS.md", () => {
    expect(mergeClaude(null)).toBe("@AGENTS.md\n");
  });
  it("appends the import once", () => {
    expect(mergeClaude("# Rules\n")).toBe("# Rules\n\n@AGENTS.md\n");
    expect(mergeClaude("# Rules\n\n@AGENTS.md\n")).toBeNull();
  });
});

describe("mergeGeminiSettings", () => {
  it("creates settings that read AGENTS.md in every Gemini CLI version", () => {
    const { content } = mergeGeminiSettings(null);
    expect(JSON.parse(content ?? "")).toEqual({
      contextFileName: ["AGENTS.md", "GEMINI.md"],
      context: { fileName: ["AGENTS.md", "GEMINI.md"] },
    });
  });

  it("keeps other settings and existing context files", () => {
    const before = JSON.stringify({
      theme: "Dracula",
      context: { fileName: "TEAM.md", includeDirectories: ["../x"] },
    });
    const after = JSON.parse(mergeGeminiSettings(before).content ?? "");
    expect(after.theme).toBe("Dracula");
    expect(after.context.includeDirectories).toEqual(["../x"]);
    expect(after.context.fileName).toEqual(["TEAM.md", "AGENTS.md", "GEMINI.md"]);
    expect(after.contextFileName).toEqual(["AGENTS.md", "GEMINI.md"]);
  });

  it("changes nothing on a second run", () => {
    const once = mergeGeminiSettings(null).content;
    expect(mergeGeminiSettings(once).content).toBeNull();
  });

  it("leaves broken JSON alone", () => {
    expect(mergeGeminiSettings("{ not json")).toEqual({ content: null, error: "invalid JSON" });
  });
});

describe("templates/AGENTS.kaze.md", () => {
  it("is wrapped in the markers", () => {
    expect(template.startsWith(START)).toBe(true);
    expect(template.trimEnd().endsWith(END)).toBe(true);
  });

  it("follows the Kaze writing rules", () => {
    expect(checkCopy(template, { mode: "markdown" })).toEqual([]);
  });

  it("matches the AGENTS.md in the Next.js example", () => {
    const example = fs.readFileSync(path.join(root, "examples/nextjs/AGENTS.md"), "utf8");
    expect(example).toBe(mergeAgents(null, template));
  });
});
