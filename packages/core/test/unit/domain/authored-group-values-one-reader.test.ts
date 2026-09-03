import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readPluginValues } from "../../../src/contract/keyframe-shape";
import type { AuthoredPluginGroup, AuthoredProperty } from "../../../src/contract/v5";
import {
  readBoundGroup,
  removeKeyframe,
  setKeyframe,
  type AuthoredKeyframes,
} from "../../../src/domain/authoring/keyframes";

// Issue #255, follow-up debt from slice E of issue #223. One owner for the question of what a
// plugin group authors.
//
// `contract/keyframe-shape.ts` already declared `readPluginValues` the single reader of the
// `values` section, and every validation-side consumer asked it. Two did not.
// `ProjectRuntime.#setKeyframe` read the field off the group and the pure editors read it through
// the reserved constant, so one authored layout had three readers. All three were typed and all
// three agreed, which is exactly why no behavioural case in the suite could fail on it: a fourth
// reader would pass every one of them on the day it was added. The gate is therefore on the source
// as well, in the `LF-2` idiom.
//
// `RA-108` is the one place the three did not already agree, and it is a defect rather than a
// tidiness argument. Membership was `Object.hasOwn` on the runtime path and `in` in the editor, and
// an inherited name answers differently to those two.

const SOURCE_ROOT = fileURLToPath(new URL("../../../src/", import.meta.url));

/** Every file that reads a group's authored values rather than writing the section back. */
const READ_SITES = ["domain/authoring/keyframes.ts", "runtime/project-runtime.ts"];

/**
 * The spellings the duplication used.
 *
 * Written to catch a read off the group rather than any mention of the constant: `withValues` still
 * writes the section through `PLUGIN_VALUES_SECTION`, which is that constant doing its job.
 */
const DUPLICATE_VALUE_READS = [
  { what: "a direct read of the values field", pattern: /\.group\.values/ },
  { what: "a bracketed read of the section", pattern: /\.group\[PLUGIN_VALUES_SECTION\]/ },
  { what: "a local empty-values fallback", pattern: /values\s*\?\?\s*\{\}/ },
];

/** A static leaf, so the identity assertions below compare a value rather than a reference. */
const LEAF: AuthoredProperty = 3;

const AUTHORED: AuthoredPluginGroup = Object.freeze({
  values: Object.freeze({ length: LEAF }),
  requires: Object.freeze({ base: "root" }),
});

/** The same group with no values section at all, which is how a group authors no property. */
const NO_SECTION: AuthoredPluginGroup = Object.freeze({
  requires: Object.freeze({ base: "root" }),
});

const WITH_LEAF: AuthoredKeyframes = Object.freeze({ fk: AUTHORED });
const WITHOUT_SECTION: AuthoredKeyframes = Object.freeze({ fk: NO_SECTION });

function boundOf(keyframes: AuthoredKeyframes) {
  const bound = readBoundGroup(keyframes, "fk");
  if (bound === undefined) throw new Error("fixture authors no fk group");
  return bound;
}

function sourceOf(site: string): string {
  return readFileSync(`${SOURCE_ROOT}${site}`, "utf8");
}

describe("one owner for authored group values", () => {
  it("RA-106 answers what a group authors from one reader, in both of its views", () => {
    // The typed view hands back the section itself, so a caller that already proved the shape
    // needs no fallback and no cast of its own.
    expect(readPluginValues(AUTHORED)).toBe(AUTHORED.values);

    // Absent and malformed are one frozen empty answer, which is what lets every call site spell
    // membership directly instead of carrying a fallback.
    expect(readPluginValues(NO_SECTION)).toEqual({});
    expect(readPluginValues({ values: 3 })).toEqual({});
    expect(readPluginValues(undefined)).toEqual({});
    expect(Object.isFrozen(readPluginValues(NO_SECTION))).toBe(true);

    // One body under both signatures, asserted by identity: two readers agreeing today is the
    // condition this closed, not the invariant it leaves behind.
    const tolerant: unknown = AUTHORED;
    expect(readPluginValues(tolerant)).toBe(readPluginValues(AUTHORED));
  });

  it("RA-107 leaves no consumer holding a second reader of the section", () => {
    const offenders: string[] = [];
    for (const site of READ_SITES) {
      const source = sourceOf(site);
      for (const { what, pattern } of DUPLICATE_VALUE_READS)
        if (pattern.test(source)) offenders.push(`${site} still holds ${what}`);
      if (!source.includes("readPluginValues"))
        offenders.push(`${site} never reaches the shared reader`);
    }
    expect(offenders.sort()).toEqual([]);
  });

  it("RA-108 reads no inherited name as an authored leaf, on either path", () => {
    const bound = boundOf(WITH_LEAF);

    // Red on the parent. An inherited name answers true to `in` for every object, so the editor
    // rewrote the section for a leaf no author wrote and answered with a new record.
    expect(removeKeyframe(WITH_LEAF, bound, "toString")).toBe(WITH_LEAF);
    expect(Object.hasOwn(readPluginValues(bound.group), "toString")).toBe(false);

    // A narrowing rather than a refusal: the leaf the group does author still goes.
    expect(removeKeyframe(WITH_LEAF, bound, "length")).not.toBe(WITH_LEAF);

    // A group with no section is the same no-op, through the same read and with no fallback.
    const bare = boundOf(WITHOUT_SECTION);
    expect(removeKeyframe(WITHOUT_SECTION, bare, "length")).toBe(WITHOUT_SECTION);

    // The set direction reaches the reader for the other half of the question: a key the group
    // does not author yet is written, and rewriting the value it already holds is identity.
    expect(setKeyframe(WITHOUT_SECTION, bare, "length", LEAF)).not.toBe(WITHOUT_SECTION);
    expect(setKeyframe(WITH_LEAF, bound, "length", LEAF)).toBe(WITH_LEAF);
  });
});
