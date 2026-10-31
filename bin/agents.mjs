/**
 * Pure helpers for kaze-init: merge the Kaze section into AGENTS.md and make
 * CLAUDE.md read AGENTS.md. No I/O here so the logic can be unit tested.
 */

export const START = "<!-- kaze:start";
export const END = "<!-- kaze:end -->";

/**
 * Put `section` into an AGENTS.md body.
 * - no file yet: a new file with a heading and the section
 * - file with a Kaze section: that section is replaced, the rest is kept
 * - file without one: the section is appended
 * @param {string | null} existing current AGENTS.md, or null when missing
 * @param {string} section the template, from START to END
 * @returns {string}
 */
export function mergeAgents(existing, section) {
  const body = section.trim();
  if (existing === null) return `# AGENTS.md\n\n${body}\n`;
  const start = existing.indexOf(START);
  const end = existing.indexOf(END);
  if (start !== -1 && end > start) {
    return `${existing.slice(0, start)}${body}${existing.slice(end + END.length)}`;
  }
  const separator = existing.endsWith("\n\n") ? "" : existing.endsWith("\n") ? "\n" : "\n\n";
  return `${existing}${separator}${body}\n`;
}

/**
 * Make CLAUDE.md import AGENTS.md (Claude Code reads `@path` imports).
 * @param {string | null} existing current CLAUDE.md, or null when missing
 * @returns {string | null} the new content, or null when nothing changes
 */
export function mergeClaude(existing) {
  if (existing === null) return "@AGENTS.md\n";
  if (existing.includes("AGENTS.md")) return null;
  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  return `${existing}${separator}@AGENTS.md\n`;
}

const GEMINI_FILES = ["AGENTS.md", "GEMINI.md"];

function withAgents(names) {
  const list = Array.isArray(names) ? [...names] : typeof names === "string" ? [names] : [];
  for (const name of GEMINI_FILES) if (!list.includes(name)) list.push(name);
  return list;
}

/**
 * Make Gemini CLI read AGENTS.md (it reads GEMINI.md by default).
 * Writes both the current key (context.fileName) and the legacy v1 key
 * (contextFileName) so every Gemini CLI version picks it up. Other settings are kept.
 * @param {string | null} existing current .gemini/settings.json, or null when missing
 * @returns {{ content: string | null, error?: string }} content is null when nothing changes
 */
export function mergeGeminiSettings(existing) {
  let settings = {};
  if (existing !== null) {
    try {
      settings = JSON.parse(existing);
    } catch {
      return { content: null, error: "invalid JSON" };
    }
    if (settings === null || typeof settings !== "object" || Array.isArray(settings)) {
      return { content: null, error: "not a JSON object" };
    }
  }
  const context = settings.context && typeof settings.context === "object" ? settings.context : {};
  const next = {
    ...settings,
    contextFileName: withAgents(settings.contextFileName),
    context: { ...context, fileName: withAgents(context.fileName) },
  };
  const content = `${JSON.stringify(next, null, 2)}\n`;
  return { content: content === existing ? null : content };
}
