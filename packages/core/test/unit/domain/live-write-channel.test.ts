import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { AuthoredLeaf } from "../../../src/contract/authored-leaf";
import { liveWriteChannel, readAuthoredLeaf } from "../../../src/contract/authored-leaf";
import { unreachable } from "../../../src/domain/exhaustive";
import { code, member } from "../../helpers/source-region";

/**
 * Phase 2a of issue #451. `AuthoredLeaf` has five variants and eleven readers, none of which
 * decided about all five, and two of the eleven are one decision written in opposite directions:
 * `Track.#acceptedValues` refused `kind === "animated"` and `Track.#acceptedOverlay` refused
 * `kind !== "animated"`. A sixth variant would have been maskable at the first and patchable at the
 * second, simultaneously, and nothing in the repository reads both sites together.
 *
 * So this is one classification plus two readers of it, rather than two switches. The behaviour is
 * unchanged by construction, which `track-live-values.test.ts` is the evidence for and which is why
 * that suite is not restated here: the refusals it pins have to keep answering exactly as they did.
 *
 * See ADR-059, ADR-060, ADR-092.
 */
const TRACK = code(fileURLToPath(new URL("../../../src/domain/track.ts", import.meta.url)));
const ACCEPTED_VALUES = member(TRACK, "#acceptedValues(next: LiveValues): ImmutableRecord {");
const ACCEPTED_OVERLAY = member(
  TRACK,
  "#acceptedOverlay(overlay: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {",
);

describe("one classification answers which channel a live write travels on", () => {
  it("routes an animated leaf to the timeline and every other kind to the mask", () => {
    // Through the classifier rather than through literals, so the case is about the union the
    // repository actually produces and not about five hand-written records.
    expect(liveWriteChannel(readAuthoredLeaf([{ p: 0, v: 1 }]))).toBe("timeline");
    expect(liveWriteChannel(readAuthoredLeaf(60))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf("40px"))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf(true))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf({}))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf({ stops: [] }))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf(Number.NaN))).toBe("mask");
    expect(liveWriteChannel(readAuthoredLeaf(null))).toBe("mask");
  });

  it("covers all five kinds, so no leaf the classifier can read is left unrouted", () => {
    const kinds = new Set(
      [[{ p: 0, v: 1 }], 60, {}, { stops: [] }, null].map((value) => readAuthoredLeaf(value).kind),
    );
    expect([...kinds].sort()).toEqual(["animated", "empty", "invalid", "static", "wrapper"]);
  });

  it("refuses a sixth kind that reached it across the type boundary", () => {
    const foreign = { kind: "derived" } as unknown as AuthoredLeaf;
    expect(() => liveWriteChannel(foreign)).toThrow(TypeError);
    expect(() => liveWriteChannel(foreign)).toThrow(/Unhandled variant/);
  });

  it("refuses a classification that leaves one kind undecided", () => {
    type Widened = AuthoredLeaf | { readonly kind: "derived" };

    // Deliberately never called: the assertion is the `tsc` diagnostic, in the shape
    // `exhaustive.test.ts` uses. This read decides about the five kinds that exist and says nothing
    // about the sixth, so its subject is not `never` where the sink is handed it.
    const routeWidened = (leaf: Widened): string => {
      switch (leaf.kind) {
        case "animated":
          return "timeline";
        case "static":
        case "empty":
        case "wrapper":
        case "invalid":
          return "mask";
        default:
          // @ts-expect-error a kind this read does not decide about is not `never`.
          return unreachable(leaf);
      }
    };

    expect(typeof routeWidened).toBe("function");
  });

  it("leaves Track with one reader of the channel per member and no second spelling", () => {
    expect(ACCEPTED_VALUES).toContain(
      'liveWriteChannel(readAuthoredLeaf(authored[key])) !== "mask"',
    );
    expect(ACCEPTED_OVERLAY).toContain(
      'liveWriteChannel(readAuthoredLeaf(authored[key])) !== "timeline"',
    );
    // The opposite-direction pair is gone rather than supplemented. Either spelling surviving would
    // be a second answer to the question this classification now owns.
    expect(TRACK).not.toContain('.kind === "animated"');
    expect(TRACK).not.toContain('.kind !== "animated"');
  });
});
