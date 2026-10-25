import { describe, expect, it } from "vitest";
import { code, codeOnly } from "../../helpers/source-region";
import { fileURLToPath } from "node:url";
import { readPluginValues } from "../../../src/contract/keyframe-shape";
import type { AuthoredPluginGroup } from "../../../src/contract/v5";

// Issue #255, follow-up debt from slice E of issue #223. One owner for the question of what a
// plugin group authors.
//
// `contract/keyframe-shape.ts` declared `readPluginValues` the single reader of the `values`
// section. The runtime's authored value edit and the pure editors used to read the field themselves, so
// one authored layout had three readers; the editors and the verb are gone now, and what remains is
// the gate that keeps every surviving reader on the one owner.
//
// `RA-108` pinned the old editors' inherited-name behaviour. It is deleted with those editors: the
// identified-table edit surface has no authored-key membership test left to protect.

const SOURCE_ROOT = fileURLToPath(new URL("../../../src/", import.meta.url));

/** Every file that reads a group's authored values rather than writing the section back. */
const READ_SITES = ["contract/solver-constraints.ts", "domain/keyframe-groups.ts", "graph/ir.ts"];

/**
 * The spellings the duplication used.
 *
 * Written to catch a read off the group rather than any mention of the constant: a writer of the
 * section still reaches `PLUGIN_VALUES_SECTION`, which is that constant doing its job.
 */
const DUPLICATE_VALUE_READS = [
  { what: "a direct read of the values field", pattern: /\.group\.values/ },
  { what: "a bracketed read of the section", pattern: /\.group\[PLUGIN_VALUES_SECTION\]/ },
  { what: "a local empty-values fallback", pattern: /values\s*\?\?\s*\{\}/ },
];

const AUTHORED: AuthoredPluginGroup = Object.freeze({
  values: Object.freeze({ length: 3 }),
  requires: Object.freeze({ base: "root" }),
});

/** The same group with no values section at all, which is how a group authors no property. */
const NO_SECTION: AuthoredPluginGroup = Object.freeze({
  requires: Object.freeze({ base: "root" }),
});

function sourceOf(site: string): string {
  return codeOnly(code(`${SOURCE_ROOT}${site}`), site);
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
});
