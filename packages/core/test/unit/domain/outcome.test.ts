import { describe, expect, it } from "vitest";
import { diagnostic } from "../../../src/contract/diagnostics";
import type { Diagnostic } from "../../../src/contract/v5";
import { unreachable } from "../../../src/lang/exhaustive";
import {
  acceptedOutcome,
  readOutcome,
  refusedOutcome,
  refusedOutcomeFrom,
  type Outcome,
} from "../../../src/domain/outcome";

const warning: Diagnostic = diagnostic("observation-pending-reference", "arm", "Pending.", [
  "source",
  "arm",
]);
const refusal: Diagnostic = diagnostic("observation-source-shape", "arm", "Invalid source.");

describe("accepted and refused outcomes keep values and diagnostics exclusive", () => {
  it("carries an accepted value and non-blocking diagnostics", () => {
    const outcome = acceptedOutcome(7, [warning]);

    expect(outcome).toEqual({ kind: "accepted", value: 7, diagnostics: [warning] });
    expect(outcome.kind).toBe("accepted");
    if (outcome.kind === "accepted") expect(outcome.value).toBe(7);
  });

  it("carries at least one refusal diagnostic and no value", () => {
    const outcome = refusedOutcome<number>([refusal]);

    expect(outcome).toEqual({ kind: "refused", diagnostics: [refusal] });
    expect(outcome.kind).toBe("refused");
    expect("value" in outcome).toBe(false);
  });

  it("accepts undefined as a diagnostic in a non-empty collection", () => {
    const outcome = refusedOutcomeFrom<number, undefined>([undefined]);

    expect(outcome).toEqual({ kind: "refused", diagnostics: [undefined] });
    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toHaveLength(1);
    expect(outcome.diagnostics[0]).toBeUndefined();
    expect(Object.isFrozen(outcome.diagnostics)).toBe(true);
  });

  it("throws the original error for an empty diagnostic collection", () => {
    expect(() => refusedOutcomeFrom<number, Diagnostic>([])).toThrow(
      new TypeError("A refused outcome requires at least one diagnostic."),
    );
  });

  it("reads both branches through one exhaustive reader", () => {
    const read = (outcome: Outcome<number>): string =>
      readOutcome(
        outcome,
        (value, diagnostics) => `accepted ${value} with ${diagnostics.length} diagnostic`,
        (diagnostics) => `refused with ${diagnostics.length} diagnostic`,
      );

    expect(read(acceptedOutcome(7, [warning]))).toBe("accepted 7 with 1 diagnostic");
    expect(read(refusedOutcome<number>([refusal]))).toBe("refused with 1 diagnostic");
  });

  it("throws when a foreign kind crosses the outcome boundary", () => {
    const foreign = { kind: "deferred" } as unknown as Outcome<number>;
    const read = (outcome: Outcome<number>): string =>
      readOutcome(
        outcome,
        (value) => `accepted ${value}`,
        (diagnostics) => `refused ${diagnostics.length}`,
      );

    expect(() => read(foreign)).toThrow(TypeError);
    expect(() => read(foreign)).toThrow(/Unhandled variant/);
  });

  it("refuses a widened union whose reader leaves a kind undecided", () => {
    type Widened = Outcome<number> | { readonly kind: "deferred" };

    const readWidened = (outcome: Widened): number => {
      switch (outcome.kind) {
        case "accepted":
          return outcome.value;
        case "refused":
          return outcome.diagnostics.length;
        default:
          // @ts-expect-error a widened kind is not decided by this reader.
          return unreachable(outcome);
      }
    };

    expect(typeof readWidened).toBe("function");
  });
});
