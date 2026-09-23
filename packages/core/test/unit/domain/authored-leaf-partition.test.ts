import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { AuthoredLeaf, AuthoredLeafPartition } from "../../../src/contract/authored-leaf";
import { authoredLeafPartition, readAuthoredLeaf } from "../../../src/contract/authored-leaf";
import { unreachable } from "../../../src/lang/exhaustive";
import { code, declaration, member } from "../../helpers/source-region";

/**
 * Phase 2b of issue #451. A static leaf is a value for the mask, an animated leaf is a source of
 * stops for compilation, and empty, retired-wrapper, and invalid leaves are neither. Four readers
 * asked that same three-way question by checking only for `static` and letting every other kind
 * fall through. That was total only while the union stayed unchanged, and it made the answer belong
 * to four call sites instead of to the contract that already classified the leaf.
 *
 * `authoredLeafPartition` owns this second question. It reads the five-kind answer from
 * `readAuthoredLeaf`, carries the payload the next owner needs, and returns `none` for the three
 * forms that carry neither payload. The validator and legacy-group reader have a different
 * question: they need the full five-way shape, so they keep their own exhaustive switches
 * rather than forcing this three-way partition to answer a diagnostic question.
 */
const SOURCE_ROOT = fileURLToPath(new URL("../../../src/", import.meta.url));
const AUTHORED_LEAF = code(`${SOURCE_ROOT}contract/authored-leaf.ts`);
const READ_COMPILABLE_STOPS = member(
  AUTHORED_LEAF,
  "export function readCompilableStops(value: unknown): readonly AuthoredStop[] {",
  "",
);
const LEGACY_GROUP = member(
  code(`${SOURCE_ROOT}contract/keyframe-shape.ts`),
  "export function looksLikeLegacyGroup(value: unknown): boolean {",
  "",
);
const PARTITION_DECLARATION = declaration(
  AUTHORED_LEAF,
  "export type AuthoredLeafPartition =",
  ";",
);

const RAMP = [{ p: 0, v: 1 }];
/** The retired wrapper is named so the bare-leaf scan never sees a stops array literal. */
const WRAPPED = { stops: RAMP };

function partitionOf(value: unknown): AuthoredLeafPartition {
  return authoredLeafPartition(readAuthoredLeaf(value));
}

describe("the authored leaf payload partition answers every leaf kind", () => {
  it("returns a value, stops, or none for every classified leaf", () => {
    expect(partitionOf(RAMP)).toEqual({ kind: "stops", stops: RAMP });
    expect(partitionOf(60)).toEqual({ kind: "value", value: 60 });
    expect(partitionOf({})).toEqual({ kind: "none" });
    expect(partitionOf(WRAPPED)).toEqual({ kind: "none" });
    expect(partitionOf(null)).toEqual({ kind: "none" });
  });

  it("refuses a foreign kind instead of choosing a fallback payload", () => {
    const foreign = { kind: "derived" } as unknown as AuthoredLeaf;
    expect(() => authoredLeafPartition(foreign)).toThrow(TypeError);
    expect(() => authoredLeafPartition(foreign)).toThrow(/Unhandled variant/);
  });

  it("rejects a widened read that leaves one authored kind undecided", () => {
    type Widened = AuthoredLeaf | { readonly kind: "derived" };

    // Deliberately never called: the assertion is the `tsc` diagnostic, in the shape used by the
    // exhaustive and live-write-channel tests. A sixth kind must fail at the shared sink.
    const partitionWidened = (leaf: Widened): AuthoredLeafPartition => {
      switch (leaf.kind) {
        case "animated":
          return { kind: "stops", stops: leaf.stops };
        case "static":
          return { kind: "value", value: leaf.value };
        case "empty":
        case "wrapper":
        case "invalid":
          return { kind: "none" };
        default:
          // @ts-expect-error a kind this read does not decide about is not `never`.
          return unreachable(leaf);
      }
    };

    expect(typeof partitionWidened).toBe("function");
  });

  it("keeps every changed reader on an exhaustive or owned spelling", () => {
    const validator = code(`${SOURCE_ROOT}contract/validate-v5.ts`);
    const compiler = code(`${SOURCE_ROOT}contract/keyframe-compiler.ts`);
    const plugins = code(`${SOURCE_ROOT}domain/plugins.ts`);
    const authoredValues = code(`${SOURCE_ROOT}runtime/authored-values.ts`);
    const fakes = code(`${SOURCE_ROOT}testing/fakes.ts`);
    const readers = [
      AUTHORED_LEAF,
      READ_COMPILABLE_STOPS,
      LEGACY_GROUP,
      validator,
      compiler,
      plugins,
      authoredValues,
      fakes,
    ];
    const oneSided = /\.kind\s*(?:===|!==)\s*"/;

    for (const source of readers) expect(source).not.toMatch(oneSided);

    expect(compiler).toContain("authoredLeafPartition");
    expect(plugins).toContain("authoredLeafPartition");
    expect(authoredValues).toContain("authoredLeafPartition");
    expect(fakes).toContain("authoredLeafPartition");
    expect(READ_COMPILABLE_STOPS).toContain("default:");
    expect(READ_COMPILABLE_STOPS).toContain("unreachable(leaf)");
    expect(LEGACY_GROUP).toContain("unreachable(leaf)");
    expect(validator).toContain("unreachable(leaf)");
    expect(PARTITION_DECLARATION).toContain('readonly kind: "value"');
    expect(PARTITION_DECLARATION).toContain('readonly kind: "stops"');
    expect(PARTITION_DECLARATION).toContain('readonly kind: "none"');
  });
});
