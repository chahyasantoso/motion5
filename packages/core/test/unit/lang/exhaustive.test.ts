import { describe, expect, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import { DISPOSED, IDLE, type RuntimePhase } from "../../../src/runtime/graph-runtime-state";

/**
 * Issue #437, the read side of ADR-083, ADR-084 and ADR-088.
 *
 * Those three records make an illegal combination impossible to write down. None of them reached the
 * reads, which were predicate calls and early-return chains ending in a ternary, so the answer for a
 * variant nobody named was whichever arm came last: `idle` for a phase, `warm` for a memo and
 * `nothing` for a payload, the most permissive answer each union had. Adding `disposing` in issue
 * #408 needed one guard hand-patched at five sites and no gate named one of them.
 *
 * These cases are about the sink rather than about the switches that call it, which is why they live
 * beside `lang/exhaustive.ts` rather than in the state module's file. The first is a lie detector
 * for the guarantee itself: it is green only because the parameter is `never`, so widening it to
 * `unknown` leaves the expectation unused and fails. The second asserts the accepting direction in
 * the same rig, because a sink that refused every subject would be green against the first on its
 * own, and covers the arm the compiler proved unreachable and a cast can still reach. See ADR-092.
 */
describe("a read of a closed union decides about every variant it can hold", () => {
  it("refuses a read that leaves one variant of its subject undecided", () => {
    type Widened = RuntimePhase | { readonly kind: "reviving" };

    // Deliberately never called: the assertion is the `tsc` diagnostic, in the shape the state
    // module's own compile-time cases use. This switch decides about the four phases that exist and
    // says nothing about the fifth, so its subject is not `never` where the sink is handed it.
    const readWidenedPhase = (phase: Widened): boolean => {
      switch (phase.kind) {
        case "idle":
        case "flushing":
          return true;
        case "disposing":
        case "disposed":
          return false;
        default:
          // @ts-expect-error a variant this read does not decide about is not `never`.
          return unreachable(phase);
      }
    };

    expect(typeof readWidenedPhase).toBe("function");
  });

  it("accepts the subject of a read that decides about all of them, and throws past a cast", () => {
    const readEveryPhase = (phase: RuntimePhase): boolean => {
      switch (phase.kind) {
        case "idle":
        case "flushing":
          return true;
        case "disposing":
        case "disposed":
          return false;
        default:
          return unreachable(phase);
      }
    };

    expect(readEveryPhase(IDLE)).toBe(true);
    expect(readEveryPhase(DISPOSED)).toBe(false);
    // Reachable only by a caller that crossed the type boundary at run time, which is the one thing
    // the compiler cannot rule out and the reason this throws rather than answering a fallback.
    expect(() => readEveryPhase({ kind: "reviving" } as unknown as RuntimePhase)).toThrow(
      TypeError,
    );
  });
});
