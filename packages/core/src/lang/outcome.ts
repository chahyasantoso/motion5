import { unreachable } from "./exhaustive";

/** A computation that either carries its value or is refused with at least one diagnostic.
 * `kind` makes the branches exclusive; the tuple makes a reasonless refusal unwritable.
 */
export type Outcome<T, E> =
  | { readonly kind: "accepted"; readonly value: T; readonly diagnostics: readonly E[] }
  | { readonly kind: "refused"; readonly diagnostics: readonly [E, ...E[]] };

/** Build an accepted outcome without changing the caller's diagnostic snapshot. */
export function acceptedOutcome<T, E>(value: T, diagnostics: readonly E[]): Outcome<T, E> {
  return { kind: "accepted", value, diagnostics };
}

/** Build a refused outcome whose tuple type requires at least one diagnostic. */
export function refusedOutcome<T, E>(diagnostics: readonly [E, ...E[]]): Outcome<T, E> {
  return { kind: "refused", diagnostics: Object.freeze(diagnostics) };
}

// Length, not first element: a member may legitimately be `undefined`.
function isNonEmpty<E>(values: readonly E[]): values is readonly [E, ...E[]] {
  return values.length > 0;
}

/** Convert a runtime diagnostic collection into a refused outcome, rejecting an empty one.
 * For callers that accumulate; a caller holding one diagnostic uses `refusedOutcome` directly.
 */
export function refusedOutcomeFrom<T, E>(diagnostics: readonly E[]): Outcome<T, E> {
  if (!isNonEmpty(diagnostics))
    throw new TypeError("A refused outcome requires at least one diagnostic.");
  return refusedOutcome([...diagnostics]);
}

/** Read either branch exactly once, failing loudly on an unknown kind. */
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
