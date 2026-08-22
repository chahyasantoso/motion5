import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Diagnostic } from "../../src/contract/v5";
import { validateKeyframes } from "../../src/contract/validate-v5";
import { compilePercentKeyframes } from "../../src/domain/keyframe-compiler";
import { createFakeInterpolator } from "../../src/testing/fakes";

// Issue #192, slice A. One owner for the question "what shape is this authored leaf".
//
// The authored form does not change here. The object wrapper is still the only accepted leaf and
// every diagnostic is identical before and after, which is what LF-4 pins. What changes is that six
// independent copies of `isRecord(value) && Array.isArray(...)` collapse into one module, so the
// next slice can change what a leaf may be in one function body rather than in five files that can
// disagree with each other.
//
// Five of those sites are the appendix of #192: `validateProperty`, `isKeyframeGroup`,
// `looksLikeLegacyGroup`, the compiler's `readStops`, and the registry's `readStops`. Two of them
// live in `contract/keyframe-shape.ts`, so five sites are four files.
//
// The sixth is `testing/fakes.ts`. `createFakeInterpolator` builds its published state from a
// private reader that asks for membership rather than reading the property directly, which is why
// the appendix grep never saw it. It is the site that decides what a migrated integration fixture
// publishes, so leaving it out would have made slice B fail as a composition bug rather than as a
// schema one. LF-3 is that site stated as an assertion.
//
// This file lives in the integration tier on purpose. Slice A's red run fails `typecheck` in the
// `quality` job, which runs before `npm test`, so a unit-tier case would produce no assertion output
// at all. The `integration` job runs vitest directly and reports every case, the same way the
// ADR-049 red run did.

const SOURCE_ROOT = fileURLToPath(new URL("../../src/", import.meta.url));
const READER = "../../src/contract/authored-leaf";

/** Every file that carries its own copy of the leaf-shape check on the parent commit. */
const READ_SITES = [
  "contract/validate-v5.ts",
  "contract/keyframe-shape.ts",
  "domain/keyframe-compiler.ts",
  "domain/plugins.ts",
  "testing/fakes.ts",
];

/**
 * The three spellings the duplication actually uses.
 *
 * Asserted against the declaring sources rather than against behavior, in the `Y-12` idiom: a
 * seventh copy would pass every behavioral case in the suite on the day it was added, so "one
 * owner" has to be a gate on the source or it is a claim in a comment.
 */
const DUPLICATE_LEAF_CHECKS = [
  { what: "a local readStops declaration", pattern: /function\s+readStops\s*\(/ },
  { what: "an inline array test on the property", pattern: /Array\.isArray\([^)\n]*\.stops\s*\)/ },
  { what: "an inline membership test", pattern: /"stops"\s+in\s+/ },
];

const RAMP = [
  { p: 0, v: 0 },
  { p: 1, v: 10 },
];
/** A stop the compiler filters out and the fake interpolator keeps. That gap is the defect. */
const UNPARSEABLE_POSITION = [{ p: "half", v: 1 }];
/** A stop with no value at all. Same gap, other half. */
const ABSENT_VALUE = [{ p: 0 }];

interface PublicationCase {
  readonly what: string;
  readonly authored: Readonly<Record<string, unknown>>;
  readonly published: readonly string[];
}

/**
 * Which keys an authored record publishes, according to each of the two readers.
 *
 * The compiler is the owner, so its answer is the expected one. Every row asserts that both readers
 * give it, which is a different assertion from "the compiler is correct".
 */
const PUBLICATION: readonly PublicationCase[] = [
  {
    what: "a well formed animated property",
    authored: { x: { stops: RAMP } },
    published: ["x"],
  },
  {
    what: "an empty stop list",
    authored: { x: { stops: [] } },
    published: [],
  },
  {
    what: "the accepted no-op property",
    authored: { x: {} },
    published: [],
  },
  {
    what: "a leaf that is not a record at all",
    authored: { x: 5 },
    published: [],
  },
  {
    what: "a stop whose position does not parse",
    authored: { x: { stops: UNPARSEABLE_POSITION } },
    published: [],
  },
  {
    what: "a stop carrying no value",
    authored: { x: { stops: ABSENT_VALUE } },
    published: [],
  },
];

interface ParityCase {
  readonly what: string;
  readonly authored: unknown;
  readonly expected: readonly string[];
}

/**
 * The diagnostics the consolidation is not allowed to move.
 *
 * Pinned by rule id and path together rather than by rule id alone, because a refactor that keeps
 * the ids and moves the paths is exactly the kind of drift a rule-id-only assertion misses.
 */
const PARITY: readonly ParityCase[] = [
  {
    what: "a leaf that is not a record",
    authored: { x: 5 },
    expected: ["stops-shape at keyframes.x.stops"],
  },
  {
    what: "a wrapper whose member is not an array",
    authored: { x: { stops: "no" } },
    expected: ["stops-shape at keyframes.x.stops"],
  },
  {
    what: "a position outside the unit range",
    authored: { x: { stops: [{ p: 2, v: 1 }] } },
    expected: [
      "stop-position-range at keyframes.x.stops[0].p",
      "stop-missing-start at keyframes.x",
      "stop-missing-end at keyframes.x",
    ],
  },
  {
    what: "the pre-ADR-049 group form",
    authored: { fk: { length: { stops: RAMP } } },
    expected: ["keyframes-missing-values-section at keyframes.fk"],
  },
  {
    what: "a reserved section at the top level",
    authored: { values: { x: { stops: RAMP } } },
    expected: ["keyframes-reserved-section at keyframes.values"],
  },
  {
    what: "an empty object, which names no section and stays a no-op property",
    authored: { fk: {} },
    expected: [],
  },
  {
    what: "a reserved separator in a key",
    authored: { "a:b": { stops: RAMP } },
    expected: ["keyframes-reserved-separator at keyframes.a:b"],
  },
];

function sourceOf(site: string): string {
  return readFileSync(`${SOURCE_ROOT}${site}`, "utf8");
}

function compiledKeys(authored: Readonly<Record<string, unknown>>): readonly string[] {
  return Object.keys(compilePercentKeyframes(authored).initial).sort();
}

function fakeKeys(authored: Readonly<Record<string, unknown>>): readonly string[] {
  const timeline = createFakeInterpolator().create({ keyframes: authored, duration: 1 });
  const keys = Object.keys(timeline.state).sort();
  timeline.kill();
  return keys;
}

function ruleIdsAndPaths(keyframes: unknown): readonly string[] {
  const diagnostics: Diagnostic[] = [];
  validateKeyframes(keyframes, "keyframes", diagnostics);
  return diagnostics.map(({ ruleId, path }) => `${ruleId} at ${path}`);
}

describe("one owner for the authored leaf shape", () => {
  it("LF-1 answers the leaf shape question from one module", async () => {
    const leaf = await import(READER);

    // The wrapper is still the only animated form in this slice, and the reader hands back the
    // array the author wrote rather than a filtered copy, because validation needs the raw stops to
    // report a bad position at all.
    expect(leaf.readAuthoredLeaf({ stops: RAMP })).toEqual({ kind: "animated", stops: RAMP });

    // `{}` is a deliberately accepted no-op property that `Y-6` already pins, so it is a kind of
    // its own rather than a shape the reader calls invalid.
    expect(leaf.readAuthoredLeaf({})).toEqual({ kind: "empty" });

    expect(leaf.readAuthoredLeaf({ a: 1 })).toEqual({ kind: "invalid" });
    expect(leaf.readAuthoredLeaf({ stops: "no" })).toEqual({ kind: "invalid" });
    expect(leaf.readAuthoredLeaf(null)).toEqual({ kind: "invalid" });
    expect(leaf.readAuthoredLeaf(undefined)).toEqual({ kind: "invalid" });

    // Compilability is the second question and it gets the second function. One module owns both,
    // so the filter the compiler applies and the filter the fake applies cannot drift apart.
    expect(leaf.readCompilableStops({ stops: RAMP })).toEqual(RAMP);
    expect(leaf.readCompilableStops({ stops: UNPARSEABLE_POSITION })).toEqual([]);
    expect(leaf.readCompilableStops({ stops: ABSENT_VALUE })).toEqual([]);
    expect(leaf.readCompilableStops(5)).toEqual([]);
  });

  it("LF-2 leaves no consumer holding a second copy of the check", () => {
    const offenders: string[] = [];
    for (const site of READ_SITES) {
      const source = sourceOf(site);
      for (const { what, pattern } of DUPLICATE_LEAF_CHECKS)
        if (pattern.test(source)) offenders.push(`${site} still declares ${what}`);
      if (!/readAuthoredLeaf|readCompilableStops/.test(source))
        offenders.push(`${site} never reaches the shared reader`);
    }
    expect(offenders.sort()).toEqual([]);
  });

  it("LF-3 makes the compiler and the fake interpolator agree on what a leaf publishes", () => {
    for (const { what, authored, published } of PUBLICATION) {
      expect(compiledKeys(authored), `compiler, ${what}`).toEqual(published);
      // Red on the parent for the two malformed stops. The compiler filters a stop with an
      // unparseable position or no value; the fake keeps it and publishes a key the real pipeline
      // never produces. A fixture migrated in slice B would have failed here as a composition bug.
      expect(fakeKeys(authored), `fake interpolator, ${what}`).toEqual(published);
    }
  });

  it("LF-4 moves no diagnostic while the five sites are consolidated", () => {
    // Green on the parent by design, and not claimed as red. This slice changes ownership rather
    // than behavior, so the case that would catch it changing behavior has to pass on both sides.
    for (const { what, authored, expected } of PARITY)
      expect(ruleIdsAndPaths(authored), what).toEqual(expected);
  });
});
