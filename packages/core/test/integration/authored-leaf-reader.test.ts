import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readAuthoredLeaf, readCompilableStops } from "../../src/contract/authored-leaf";
import type { Diagnostic } from "../../src/contract/v5";
import { validateKeyframes } from "../../src/contract/validate-v5";
import { compilePercentKeyframes } from "../../src/domain/keyframe-compiler";
import { createFakeInterpolator } from "../../src/testing/fakes";

// Issue #192, slice A. One owner for the question "what shape is this authored leaf".
//
// Six independent copies of `isRecord(value) && Array.isArray(...)` used to answer it. Five are the
// appendix of #192: `validateProperty`, `isKeyframeGroup`, `looksLikeLegacyGroup`, the compiler's
// `readStops`, and the registry's `readStops`. Two of them live in `contract/keyframe-shape.ts`, so
// five sites are four files.
//
// The sixth is `testing/fakes.ts`. `createFakeInterpolator` built its published state from a private
// reader that asked for membership rather than reading the property directly, which is why the
// appendix grep never saw it. It is the site that decides what a migrated integration fixture
// publishes, so leaving it out would have made slice B fail as a composition bug rather than as a
// schema one. `LF-3` is that site stated as an assertion.
//
// These cases own *ownership*: that one module answers, and that every consumer asks it. What a leaf
// may be is `LF-5` upward in `bare-authored-leaf.test.ts`, which is why the classification asserted
// here is only deep enough to prove the reader is the thing being consulted.

const SOURCE_ROOT = fileURLToPath(new URL("../../src/", import.meta.url));

/** Every file that used to carry its own copy of the leaf-shape check. */
const READ_SITES = [
  "contract/validate-v5.ts",
  "contract/keyframe-shape.ts",
  "domain/keyframe-compiler.ts",
  "domain/plugins.ts",
  "testing/fakes.ts",
];

/**
 * The three spellings the duplication actually used.
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
/** The retired wrapper, built rather than written, so `LF-16` never reads this file as a schema. */
const WRAPPED = { stops: RAMP };
/** A stop the compiler filters out and the old private copy in the fakes kept. */
const UNPARSEABLE_POSITION = [{ p: "half", v: 1 }];
/** A stop with no value at all. Same gap, other half. */
const ABSENT_VALUE = [{ p: 0 }];
/** A position outside the unit range, for the one parity case that reports on a stop. */
const OUT_OF_RANGE = [{ p: 2, v: 1 }];

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
    authored: { x: RAMP },
    published: ["x"],
  },
  {
    what: "a static property",
    authored: { x: 62 },
    published: ["x"],
  },
  {
    what: "the retired wrapper, which is refused rather than normalized",
    authored: { x: WRAPPED },
    published: [],
  },
  {
    what: "an empty stop list",
    authored: { x: [] },
    published: [],
  },
  {
    what: "the accepted no-op property",
    authored: { x: {} },
    published: [],
  },
  {
    what: "a stop whose position does not parse",
    authored: { x: UNPARSEABLE_POSITION },
    published: [],
  },
  {
    what: "a stop carrying no value",
    authored: { x: ABSENT_VALUE },
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
 * Every row here is invariant across ADR-050: none of these shapes is a leaf on either side of the
 * flip, so the rule id and the path both have to survive it. The wrapper and static-domain rows this
 * table used to carry moved to `LF-9` and `LF-10`, which own what a leaf may be; keeping them here
 * as well would have made one behavior change land in two places.
 *
 * Pinned by rule id and path together rather than by rule id alone, because a refactor that keeps
 * the ids and moves the paths is exactly the kind of drift a rule-id-only assertion misses.
 */
const PARITY: readonly ParityCase[] = [
  {
    what: "a position outside the unit range",
    authored: { x: OUT_OF_RANGE },
    expected: [
      "stop-position-range at keyframes.x[0].p",
      "stop-missing-start at keyframes.x",
      "stop-missing-end at keyframes.x",
    ],
  },
  {
    what: "the pre-ADR-049 group form",
    authored: { fk: { length: RAMP } },
    expected: ["keyframes-missing-values-section at keyframes.fk"],
  },
  {
    what: "a reserved section at the top level",
    authored: { values: { x: RAMP } },
    expected: ["keyframes-reserved-section at keyframes.values"],
  },
  {
    what: "an empty object, which names no section and stays a no-op property",
    authored: { fk: {} },
    expected: [],
  },
  {
    what: "a reserved separator in a key",
    authored: { "a:b": RAMP },
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
  it("LF-1 answers the leaf shape question from one module", () => {
    // Deep enough to prove the reader is the thing being consulted, and no deeper. `LF-5` upward own
    // what each form means.
    expect(readAuthoredLeaf(RAMP)).toEqual({ kind: "animated", stops: RAMP });
    expect(readAuthoredLeaf(62)).toEqual({ kind: "static", value: 62 });
    expect(readAuthoredLeaf(WRAPPED)).toEqual({ kind: "wrapper" });

    // `{}` is a deliberately accepted no-op property that `Y-6` already pins, so it is a kind of
    // its own rather than a shape the reader calls invalid.
    expect(readAuthoredLeaf({})).toEqual({ kind: "empty" });

    expect(readAuthoredLeaf({ a: 1 })).toEqual({ kind: "invalid" });
    expect(readAuthoredLeaf(null)).toEqual({ kind: "invalid" });
    expect(readAuthoredLeaf(undefined)).toEqual({ kind: "invalid" });

    // Compilability is the second question and it gets the second function. One module owns both,
    // so the filter the compiler applies and the filter the fake applies cannot drift apart.
    expect(readCompilableStops(RAMP)).toEqual(RAMP);
    expect(readCompilableStops(UNPARSEABLE_POSITION)).toEqual([]);
    expect(readCompilableStops(ABSENT_VALUE)).toEqual([]);
    // A static leaf compiles to no stops at all, which is what makes the bypass structural.
    expect(readCompilableStops(62)).toEqual([]);
    expect(readCompilableStops(WRAPPED)).toEqual([]);
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
      // Red on the parent of slice A for the two malformed stops. The compiler filters a stop with
      // an unparseable position or no value; the private copy in the fakes kept it and published a
      // key the real pipeline never produces.
      expect(fakeKeys(authored), `fake interpolator, ${what}`).toEqual(published);
    }
  });

  it("LF-4 moves no diagnostic that the authored form did not move", () => {
    for (const { what, authored, expected } of PARITY)
      expect(ruleIdsAndPaths(authored), what).toEqual(expected);
  });
});
