#!/usr/bin/env node
/**
 * Lists every content placeholder ("[TODO…" or <Todo>) in the site's content.
 *
 *   node scripts/check-todos.mjs            # fails (exit 1) if any placeholder remains
 *   node scripts/check-todos.mjs --report   # lists them, never fails
 *
 * Runs automatically before `npm run build` (the "prebuild" script), so a
 * production build can't ship visible placeholders. To build anyway — e.g. a
 * preview deploy — set ALLOW_TODOS=1. Vercel preview deployments
 * (VERCEL_ENV=preview) are allowed automatically; production ones are not.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TARGETS = ["content", "messages", "src/config"];
const EXTENSIONS = new Set([".mdx", ".md", ".json", ".ts", ".tsx"]);
const PATTERN = /\[TODO\b|<Todo[\s>/]/;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTENSIONS.has(path.extname(entry.name))) yield full;
  }
}

const findings = [];
for (const target of TARGETS) {
  for await (const file of walk(path.join(ROOT, target))) {
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, index) => {
      if (PATTERN.test(line)) {
        findings.push(`${path.relative(ROOT, file)}:${index + 1}  ${line.trim().slice(0, 140)}`);
      }
    });
  }
}

const reportOnly = process.argv.includes("--report");
const allowed =
  reportOnly || process.env.ALLOW_TODOS === "1" || process.env.VERCEL_ENV === "preview";

if (findings.length === 0) {
  console.log("✓ No content placeholders left.");
  process.exit(0);
}

const header = `${findings.length} content placeholder(s) still to fill in:`;
if (allowed) {
  console.warn(`⚠ ${header}\n\n${findings.join("\n")}\n`);
  if (!reportOnly) console.warn("Building anyway (ALLOW_TODOS=1 or Vercel preview).\n");
  process.exit(0);
}

console.error(
  `✗ ${header}\n\n${findings.join("\n")}\n\n` +
    "Production builds are blocked until these are filled in (see docs/PORTFOLIO_SPEC.md §12).\n" +
    "To build a preview anyway: ALLOW_TODOS=1 npm run build\n",
);
process.exit(1);
