import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Plans, ADRs and pull request bodies cite a case by id, so two cases sharing one id make every one
// of those citations ambiguous. Uniqueness is therefore asked across the suite rather than within a
// file, and titles are matched rather than bare ids so a comment naming another case cannot read as
// a second declaration.
const REPO_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const SELF = "packages/core/test/unit/scripts/evidence-case-ids.test.ts";
const UNWALKED = new Set(["node_modules", "dist", "coverage"]);
// A series is one to three capital letters, a hyphen and a number at the head of a test title. A
// prefix carrying a digit is a plan slice (`T4-3`) and does not match, so nothing has to list which
// series may join. An invariant is cited by every test covering it, so `I-` is not a series.
const SERIES = /it\(\s*"([A-Z]{1,3})-(\d+)(?![\w-])/g;
const INVARIANT = "I-";

function walk(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(`${REPO_ROOT}${directory}`, { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory() && !entry.name.startsWith(".") && !UNWALKED.has(entry.name))
      found.push(...walk(`${path}/`));
    else if (/\.test\.tsx?$/.test(entry.name) && path !== SELF) found.push(path);
  }
  return found.sort();
}

function idsOf(source: string): string[] {
  return [...source.matchAll(SERIES)]
    .map((match) => `${match[1]}-${match[2]}`)
    .filter((id) => !id.startsWith(INVARIANT));
}

function owners(sources: Record<string, string>): Map<string, string[]> {
  const owners = new Map<string, string[]>();
  for (const [file, source] of Object.entries(sources))
    for (const id of idsOf(source)) owners.set(id, [...(owners.get(id) ?? []), file]);
  return owners;
}

function suiteOwners(): Map<string, string[]> {
  const sources: Record<string, string> = {};
  for (const file of walk("")) sources[file] = readFileSync(`${REPO_ROOT}${file}`, "utf8");
  return owners(sources);
}

function repeated(owners: Map<string, string[]>): string[] {
  return [...owners.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([id, files]) => `${id} declared in ${[...new Set(files)].sort().join(" and ")}`)
    .sort();
}

describe("evidence case ids", () => {
  it("holds every id the suite declares to exactly one test", () => {
    expect(repeated(suiteOwners())).toEqual([]);
  });

  it("refuses a repeated id, which is the whole reason this gate exists", () => {
    const planted = owners({
      "packages/core/test/a.test.ts": 'it("GF-9 one", () => {}); it("GF-10 other", () => {});',
      "packages/core/test/b.test.ts": 'it("GF-9 two", () => {});',
    });
    expect(repeated(planted)).toEqual([
      "GF-9 declared in packages/core/test/a.test.ts and packages/core/test/b.test.ts",
    ]);
  });

  it("passes an invariant citation, because one invariant has many tests", () => {
    expect(idsOf('it("I-13 holds the order", () => {});')).toEqual([]);
  });

  it("scans every home the suite runs, so green is never an empty walk", () => {
    const files = walk("");
    const homes = ["packages/core", "packages/plugins", "packages/react", "packages/three", "apps"];
    for (const home of homes)
      expect(
        files.some((file) => file.startsWith(`${home}/`)),
        home,
      ).toBe(true);
    expect(files.filter((file) => file.includes("node_modules"))).toEqual([]);
    expect(files.length).toBeGreaterThan(200);
    expect(suiteOwners().size).toBeGreaterThan(400);
  });
});
