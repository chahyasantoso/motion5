import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  BASE_RULE_IDS,
  CONTRIBUTION_RULE_IDS,
  CONTRIBUTION_RULE_ID_ALIASES,
  CONTRIBUTION_RULE_ID_PREFIX,
  KEYFRAME_RULE_IDS,
  RULE_IDS,
  isRuleId,
} from "../../src/contract/rule-id";

// The enumeration in `contract/rule-id.ts` is a hand-maintained list of subjects, so it gets the
// gate that shape earned in issue #283: a case scans the tree and asserts the list covers the ids
// actually present. Two audits of this union were wrong before it landed, in both directions, so
// the number is never asserted. Coverage is, and so is the scan having found its own subject: a
// scan that matched nothing answers absent for every spelling, which is the one way this gate
// could pass while proving nothing. See ADR-097.
//
// Extraction is anchored to constructor positions rather than to every kebab-shaped string,
// because this tree names rule ids in prose constantly and a docblock citing one is not a
// construction site. `contract/migrate-v4-to-v5.ts` is excluded from the first-argument form on
// purpose: its private `diagnostic(path, message, ids)` puts the path first, and its one id is
// caught by the assigned form instead.

const SOURCE_ROOT = fileURLToPath(new URL("../../src/", import.meta.url));
const SOURCE_FILE = /\.tsx?$/;
const VALIDATOR = "contract/validate-v5.ts";
const PATH_FIRST_CONSTRUCTOR = "contract/migrate-v4-to-v5.ts";
const TRIGGER_ADAPTER = "adapters/trigger-factory/default.ts";

const CONSTRUCTED = /\b(?:issue|diag|diagnostic|frozenDiagnostic)\(\s*"([a-z][a-z0-9-]*)"/g;
const ASSIGNED = /\bruleId:\s*"([a-z][a-z0-9-]*)"/g;
const DECLARED = /\bruleId\s*=\s*"([a-z][a-z0-9-]*)"/g;
const REPORTED = /\badd\(\s*"([a-z][a-z0-9-]*)"/g;
const PREFIX_SITE = /ruleIdPrefix:\s*"plugin-contribution-"/;

interface FoundId {
  readonly id: string;
  readonly file: string;
}

function sourceFilesUnder(directory: string): readonly string[] {
  const found: string[] = [];
  for (const entry of readdirSync(`${SOURCE_ROOT}${directory}`, { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) found.push(...sourceFilesUnder(`${path}/`));
    else if (SOURCE_FILE.test(entry.name)) found.push(path);
  }
  return found;
}

function sourceFiles(): readonly string[] {
  return [...sourceFilesUnder("")].sort();
}

function sourceOf(relativePath: string): string {
  return readFileSync(`${SOURCE_ROOT}${relativePath}`, "utf8");
}

function matches(source: string, pattern: RegExp): readonly string[] {
  return [...source.matchAll(pattern)].map((match) => match[1] as string);
}

// A rule id always carries a hyphen, so requiring one costs nothing and keeps a lowercase
// single-word argument out of the scan.
function idsIn(relativePath: string): readonly string[] {
  const source = sourceOf(relativePath);
  const found = [...matches(source, ASSIGNED), ...matches(source, DECLARED)];
  if (relativePath !== PATH_FIRST_CONSTRUCTOR) found.push(...matches(source, CONSTRUCTED));
  if (relativePath === VALIDATOR) found.push(...matches(source, REPORTED));
  return found.filter((id) => id.includes("-"));
}

function constructedIds(): readonly FoundId[] {
  return sourceFiles().flatMap((file) => idsIn(file).map((id) => ({ id, file })));
}

describe("rule id enumeration", () => {
  it("covers every rule id constructed under the core source tree", () => {
    const uncovered = constructedIds()
      .filter(({ id }) => !isRuleId(id))
      .map(({ id, file }) => `${id} constructed in ${file}`)
      .sort();
    expect([...new Set(uncovered)]).toEqual([]);
  });

  it("finds the contribution prefix site, so a passing scan is never an empty one", () => {
    const withPrefixSite = sourceFiles().filter((file) => PREFIX_SITE.test(sourceOf(file)));
    expect(withPrefixSite).toEqual([VALIDATOR]);
  });

  it("reaches the construction modules, including the adapter the first inventory missed", () => {
    const files = sourceFiles();
    const found = [...new Set(constructedIds().map(({ id }) => id))];
    expect(files).toContain(TRIGGER_ADAPTER);
    expect(found).toContain("trigger-driver-unavailable");
    expect(found).toContain("schema-v4-migration");
    expect(found).toContain("keyframes-shape");
    expect(files.length).toBeGreaterThan(40);
    expect(found.length).toBeGreaterThan(50);
  });

  it("names every id exactly once", () => {
    expect(RULE_IDS.length).toBe(new Set(RULE_IDS).size);
    expect(BASE_RULE_IDS.length).toBe(new Set(BASE_RULE_IDS).size);
    expect(KEYFRAME_RULE_IDS.length).toBe(new Set(KEYFRAME_RULE_IDS).size);
  });

  it("derives the prefixed family through the alias substitution rather than a second list", () => {
    expect(CONTRIBUTION_RULE_IDS.length).toBe(KEYFRAME_RULE_IDS.length);
    expect(CONTRIBUTION_RULE_IDS).toContain(`${CONTRIBUTION_RULE_ID_PREFIX}stop`);
    expect(CONTRIBUTION_RULE_IDS).not.toContain(`${CONTRIBUTION_RULE_ID_PREFIX}stop-position`);
    for (const name of Object.keys(CONTRIBUTION_RULE_ID_ALIASES))
      expect(KEYFRAME_RULE_IDS).toContain(name);
  });

  it("keeps the standalone contribution literals out of the derived family", () => {
    const derived = new Set<string>(CONTRIBUTION_RULE_IDS);
    const standalone = BASE_RULE_IDS.filter((id) =>
      id.startsWith(CONTRIBUTION_RULE_ID_PREFIX),
    ).filter((id) => derived.has(id));
    expect(standalone).toEqual([]);
  });
});
