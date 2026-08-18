import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The C-series ids are this project's citation keys: the implementation plan, ADR-031, and every
// pull request body name evidence by id rather than by test title. Two cases sharing one id makes
// each of those citations ambiguous, so the gate is uniqueness across the whole suite, not within
// a file. Titles are matched instead of bare ids so a comment referring to another case cannot
// register as a second declaration.
const TEST_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SELF = "unit/scripts/evidence-case-ids.test.ts";
const CASE_TITLE = /it\(\s*"(C-\d+)/g;

function testFiles(): readonly string[] {
  return readdirSync(TEST_ROOT, { recursive: true, encoding: "utf8" })
    .map((entry) => entry.split("\\").join("/"))
    .filter((entry) => entry.endsWith(".test.ts") && entry !== SELF)
    .sort();
}

function declaredCaseIds(relativePath: string): readonly string[] {
  const source = readFileSync(`${TEST_ROOT}${relativePath}`, "utf8");
  return [...source.matchAll(CASE_TITLE)].map((match) => match[1] as string);
}

describe("evidence case ids", () => {
  it("declares every C-series case id exactly once across the suite", () => {
    const owners = new Map<string, string[]>();
    for (const file of testFiles())
      for (const id of declaredCaseIds(file)) owners.set(id, [...(owners.get(id) ?? []), file]);
    const collisions = [...owners.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([id, files]) => `${id} declared in ${files.join(" and ")}`)
      .sort();
    expect(collisions).toEqual([]);
  });

  it("finds the series at all, so a passing run is never an empty scan", () => {
    // Guards the gate itself: a broken directory walk or regex would otherwise report zero
    // collisions forever. A floor, not an exact count, so adding evidence never fails this.
    const files = testFiles().filter((file) => declaredCaseIds(file).length > 0);
    const total = files.reduce((count, file) => count + declaredCaseIds(file).length, 0);
    expect(files.length).toBeGreaterThanOrEqual(3);
    expect(total).toBeGreaterThan(15);
  });
});
