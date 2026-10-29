import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PENDING_LEDGER, pendingPaths } from "../../../../../test/pending.mjs";

/**
 * The pending ledger may only shrink.
 *
 * It started at 134 files on 2026-10-23, when Phase 2 landed the identified-table track and every
 * later-phase suite could no longer typecheck or run. The end-to-end product path needed no plugin,
 * so it was ported rather than filed. The Phase 2 fix-up un-pended `engine-teardown-ownership` and
 * split nine mixed files into running originals plus pended siblings. S7 un-pended thirteen
 * lifecycle and scheduling suites. S8 resolves every remaining Phase 4 entry: 21 files are ported
 * or merged, tests of removed APIs are deleted with them, and plugin-blocked suites are moved to
 * Phase 5 with exact reasons, leaving 79 files: 73 Phase 5, 4 Phase 6 and 2 Phase 7.
 * Lower this number in the slice that resolves entries; raising it re-opens the gate this closes.
 */
const PENDING_CEILING = 5;

const ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const MARKER = "// @ts-nocheck";
const PHASES = new Set([3, 4, 5, 6, 7]);

function firstLine(path: string): string {
  return (
    readFileSync(path, "utf8")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)[0] ?? ""
  );
}

function typescriptFiles(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...typescriptFiles(path));
    else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) found.push(path);
  }
  return found;
}

describe("pending ledger", () => {
  it("names one existing test file per entry, with an owning phase and a reason", () => {
    expect(PENDING_LEDGER.length).toBeLessThanOrEqual(PENDING_CEILING);
    const seen = new Set<string>();
    for (const entry of PENDING_LEDGER) {
      expect(entry.path, "every entry names a test file").toMatch(/\.test\.ts$/);
      expect(seen.has(entry.path), `duplicate ledger entry ${entry.path}`).toBe(false);
      seen.add(entry.path);
      expect(PHASES.has(entry.phase), `unknown phase for ${entry.path}`).toBe(true);
      expect(entry.reason.length, `missing reason for ${entry.path}`).toBeGreaterThan(0);
      expect(firstLine(join(ROOT, entry.path)), `${entry.path} is not marked`).toBe(MARKER);
    }
  });

  it("excludes exactly the ledger from the suite", () => {
    expect(pendingPaths()).toEqual(PENDING_LEDGER.map((entry) => entry.path));
  });

  it("leaves no marked file outside the ledger", () => {
    const listed = new Set(PENDING_LEDGER.map((entry) => entry.path));
    const marked: string[] = [];
    for (const directory of ["packages", "apps", "test"])
      for (const file of typescriptFiles(join(ROOT, directory)))
        if (firstLine(file) === MARKER) marked.push(file.slice(ROOT.length).replaceAll("\\", "/"));
    for (const file of marked)
      expect(listed.has(file), `${file} is marked but not listed`).toBe(true);
  });
});
