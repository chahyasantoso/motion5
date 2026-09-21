import type { Diagnostic } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/**
 * A computation that either carries its value or is refused with at least one diagnostic.
 *
 * The discriminant makes success and refusal mutually exclusive, while the non-empty refusal tuple
 * makes a refusal without a reason impossible to write down. Diagnostics on an accepted outcome are
 * warnings or other non-blocking findings; diagnostics on a refused outcome explain why no value is
 * available. This is an internal domain primitive and is intentionally absent from every package
 * entrypoint.
 */
export type Outcome<T, E = Diagnostic> =
  | { readonly kind: "accepted"; readonly value: T; readonly diagnostics: readonly E[] }
  | { readonly kind: "refused"; readonly diagnostics: readonly [E, ...E[]] };

/** Build an accepted outcome without changing the caller's diagnostic snapshot. */
export function acceptedOutcome<T, E = Diagnostic>(
  value: T,
  diagnostics: readonly E[],
): Outcome<T, E> {
  return { kind: "accepted", value, diagnostics };
}

/** Build a refused outcome whose tuple type requires at least one diagnostic. */
export function refusedOutcome<T, E = Diagnostic>(
  diagnostics: readonly [E, ...E[]],
): Outcome<T, E> {
  return { kind: "refused", diagnostics: Object.freeze(diagnostics) };
}

/**
 * Convert a runtime diagnostic collection into a refused outcome without permitting an empty one.
 */
export function refusedOutcomeFrom<T, E = Diagnostic>(diagnostics: readonly E[]): Outcome<T, E> {
  const [first, ...rest] = diagnostics;
  if (first === undefined)
    throw new TypeError("A refused outcome requires at least one diagnostic.");
  return refusedOutcome([first, ...rest]);
}

/**
 * Read either outcome branch exactly once, failing loudly if an unknown kind crosses the boundary.
 */
export function readOutcome<T, E, R>(
  outcome: Outcome<T, E>,
  accepted: (value: T, diagnostics: readonly E[]) => R,
  refused: (diagnostics: readonly [E, ...E[]]) => R,
): R {
  switch (outcome.kind) {
    case "accepted":
      return accepted(outcome.value, outcome.diagnostics);
    case "refused":
      return refused(outcome.diagnostics);
    default:
      return unreachable(outcome);
  }
}
