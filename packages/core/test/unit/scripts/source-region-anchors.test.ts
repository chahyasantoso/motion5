import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// A source-text assertion is addressed by something the claim names, and this gate refuses the shape
// that is not. Issue #314 found two cases in `live-value-updates.test.ts` sliced between one
// member's name and the name of the *next* member, so three edits that change no behaviour could
// turn them red, and one of them could widen the window in silence instead.
//
// The scan that issue asked for rather than guessed at found the same shape in three more places:
// `LV-14` bounded by `compose(`, `SH-7` bounded by `#removeTrack(`, and `RA-113` hand-rolling the
// identical slice with `indexOf` and no helper at all. It also found the lower bound to be the worse
// half. `#writeValues(` matches its declaration and every call site, and `#handle` calls it while
// being declared earlier in the file, so the window `LV-5` and `PK-17` actually read began inside
// the handle factory and covered fifteen members, `#apply` and `#invalidateOne` among them. Both
// claims were true of that window by accident, and one of them was a claim about a single owner
// measured over two of them.
//
// Gated rather than written down alone, on `evidence-case-ids.test.ts`'s reason: the shape this
// refuses is invisible in review, because a window bounded by a plausible identifier reads exactly
// like a window bounded by a claim. `docs/TESTING-STRATEGY.md` owns the rule itself, and
// `packages/core/test/helpers/source-region.ts` is the one owner of the reading.
//
// The scan root and the walk are `evidence-case-ids.test.ts`'s, deliberately: a source-reading idiom
// is no more one package's than a citation id is.
const REPO_ROOT = fileURLToPath(new URL("../../../../../", import.meta.url));
const SELF = "packages/core/test/unit/scripts/source-region-anchors.test.ts";
const HELPER = "packages/core/test/helpers/source-region.ts";
const UNWALKED = new Set(["node_modules", "dist", "coverage"]);
const TEST_FILE = /\.test\.tsx?$/;
/** The specifier every source-reading case resolves the one owner through. */
const HELPER_IMPORT = 'helpers/source-region"';
/** The idiom that names a source file to read, which is what makes a file this gate's subject. */
const SOURCE_CONSTANT = "_SOURCE = fileURLToPath(";
/**
 * A local redeclaration of anything the one owner exports, asked only of a file that reads source.
 *
 * Scoped rather than suite-wide, and the scope is a finding rather than a carve-out: `member` is a
 * domain word in this suite. Three solver cases declare a local `member()` that builds a
 * `MemberState` or a bone definition, and none of them is a second owner of anything this rule is
 * about, so a gate refusing the spelling suite-wide would be measuring a name instead of a subject.
 * This file's first run did exactly that and named all three, which is the measurement rather than
 * the theory.
 */
const REDECLARED = /^\s*(?:export\s+)?function\s+(code|region|member|declaration)\s*\(/m;
/**
 * The retired helper's own declaration, refused suite-wide because that one name is not overloaded.
 *
 * Nothing in this tree calls a chain member, a bone or a published record a region, so a file
 * declaring one is reintroducing the mechanism wherever it happens to sit.
 */
const RETIRED_HELPER = /^\s*(?:export\s+)?function\s+region\s*\(/m;
/** A call to the retired two-bound helper, which no longer exists to be called. */
const RETIRED_CALL = /(?<![.\w])region\s*\(/;
/**
 * The source readers this slice did not migrate, and why the list has teeth in both directions.
 *
 * Both read `src/contract/v5.ts` to assert that a retired authored form is absent from a type
 * declaration, neither slices a region at all, and neither is issue #314's defect. They are recorded
 * rather than ignored, because the third check would otherwise be silent about them, and recorded as
 * a closed set rather than as an allowlist, because the assertion is `toEqual`: migrating one fails
 * this gate until the entry goes with it, and a new source-reading case fails it on arrival. That is
 * the read budget's waiver shape, which may shrink and may not grow.
 */
const PENDING = [
  "packages/core/test/integration/bare-authored-leaf.test.ts",
  "packages/core/test/integration/plugin-group-values-section.test.ts",
];

function testFilesUnder(directory: string): readonly string[] {
  const found: string[] = [];
  for (const entry of readdirSync(`${REPO_ROOT}${directory}`, { withFileTypes: true })) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".") || UNWALKED.has(entry.name)) continue;
      found.push(...testFilesUnder(`${path}/`));
    } else if (TEST_FILE.test(entry.name) && path !== SELF) found.push(path);
  }
  return found;
}

function testFiles(): readonly string[] {
  return [...testFilesUnder("")].sort();
}

function sourceOf(relativePath: string): string {
  return readFileSync(`${REPO_ROOT}${relativePath}`, "utf8");
}

describe("source-region anchors", () => {
  it("declares the region helpers in one place and nowhere else", () => {
    const readers = testFiles().filter((file) => sourceOf(file).includes(SOURCE_CONSTANT));
    const shadowed = readers.filter((file) => REDECLARED.test(sourceOf(file)));
    expect(shadowed.sort()).toEqual([]);

    // The retired name is refused everywhere rather than only where source is read, for the reason
    // stated beside it: it is the one of the four that cannot mean anything else here.
    const retired = testFiles().filter((file) => RETIRED_HELPER.test(sourceOf(file)));
    expect(retired.sort()).toEqual([]);

    // The owner exists and exports all three, so a green run above is one owner rather than none.
    const owner = sourceOf(HELPER);
    const exported = ["function code(", "function member(", "function declaration("];
    expect(exported.filter((name) => !owner.includes(`export ${name}`))).toEqual([]);
  });

  it("leaves no call to the retired two-bound helper anywhere in the suite", () => {
    const offenders = testFiles().filter((file) => RETIRED_CALL.test(sourceOf(file)));
    expect(offenders.sort()).toEqual([]);
  });

  it("reads source through the one owner, and records the readers that do not yet", () => {
    const readers = testFiles().filter((file) => sourceOf(file).includes(SOURCE_CONSTANT));

    // A scan asserts that it found what it is scanning: matched nothing reads as every file clean.
    expect(readers.length).toBeGreaterThanOrEqual(7);

    const unmigrated = readers.filter((file) => !sourceOf(file).includes(HELPER_IMPORT));
    expect(unmigrated.sort()).toEqual([...PENDING].sort());
  });
});
