import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { diagnostic } from "../../../src/contract/diagnostics";
import type { Diagnostic } from "../../../src/contract/v5";
import { unreachable } from "../../../src/lang/exhaustive";
import { code, member } from "../../helpers/source-region";
import {
  acceptedOutcome,
  readOutcome,
  refusedOutcome,
  refusedOutcomeFrom,
  type Outcome,
} from "../../../src/lang/outcome";

const warning: Diagnostic = diagnostic("observation-pending-reference", "arm", "Pending.", [
  "source",
  "arm",
]);
const refusal: Diagnostic = diagnostic("observation-source-shape", "arm", "Invalid source.");

const OUTCOME = code(fileURLToPath(new URL("../../../src/lang/outcome.ts", import.meta.url)));

describe("accepted and refused outcomes keep values and diagnostics exclusive", () => {
  it("carries an accepted value and non-blocking diagnostics", () => {
    const outcome = acceptedOutcome(7, [warning]);

    expect(outcome).toEqual({ kind: "accepted", value: 7, diagnostics: [warning] });
    expect(outcome.kind).toBe("accepted");
    if (outcome.kind === "accepted") expect(outcome.value).toBe(7);
  });

  it("carries at least one refusal diagnostic and no value", () => {
    const outcome = refusedOutcome<number, Diagnostic>([refusal]);

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
    const read = (outcome: Outcome<number, Diagnostic>): string =>
      readOutcome(
        outcome,
        (value, diagnostics) => `accepted ${value} with ${diagnostics.length} diagnostic`,
        (diagnostics) => `refused with ${diagnostics.length} diagnostic`,
      );

    expect(read(acceptedOutcome(7, [warning]))).toBe("accepted 7 with 1 diagnostic");
    expect(read(refusedOutcome<number, Diagnostic>([refusal]))).toBe("refused with 1 diagnostic");
  });

  it("throws when a foreign kind crosses the outcome boundary", () => {
    const foreign = { kind: "deferred" } as unknown as Outcome<number, Diagnostic>;
    const read = (outcome: Outcome<number, Diagnostic>): string =>
      readOutcome(
        outcome,
        (value) => `accepted ${value}`,
        (diagnostics) => `refused ${diagnostics.length}`,
      );

    expect(() => read(foreign)).toThrow(TypeError);
    expect(() => read(foreign)).toThrow(/Unhandled variant/);
  });

  it("refuses a widened union whose reader leaves a kind undecided", () => {
    type Widened = Outcome<number, Diagnostic> | { readonly kind: "deferred" };

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

  it("names its error type at every use rather than defaulting it to a contract type", () => {
    // The algebra sits in `lang/`, which ARCHITECTURE section 2 calls dependency-free, so the one
    // thing that could make it reach a layer was `E = Diagnostic`. That default was also the whole
    // of the cycle: `domain/outcome.ts` imported `Diagnostic` from `contract/` while
    // `contract/validate-v5.ts` and `contract/migrate-v4-to-v5.ts` imported the constructors back.
    // Red before ADR-103's slice, where the declaration carried the default and the file carried
    // the import. A literal union leaves no run-time witness, so this is read off the source the
    // way `plugins.test.ts` reads `PluginStage`. See ADR-099 and ADR-103.
    expect(OUTCOME).toContain("export type Outcome<T, E> =");
    expect(OUTCOME).not.toContain("E = Diagnostic");
    expect(OUTCOME).not.toContain("../contract/");
    expect(OUTCOME).not.toContain("../domain/");
    const reader = member(OUTCOME, "export function readOutcome<T, E, R>(", "");
    expect(reader).toContain("unreachable(outcome)");
  });
});
