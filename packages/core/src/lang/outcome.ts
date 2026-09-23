import { unreachable } from "./exhaustive";

/**
 * A computation that either carries its value or is refused with at least one diagnostic.
 *
 * The discriminant makes success and refusal mutually exclusive, while the non-empty refusal tuple
 * makes a refusal without a reason impossible to write down. Diagnostics on an accepted outcome are
 * warnings or other non-blocking findings; diagnostics on a refused outcome explain why no value is
 * available. `E` carries no default, and that absence is the decision ADR-103 records: a default
 * naming `Diagnostic` was the only project-specific token in this module, and it made a
 * dependency-free primitive import the contract layer while the contract layer imported back. The
 * `diagnostics` property keeps its name, because it is the shape `validateV5` already returns to a
 * caller. This is an internal language-level primitive and is intentionally absent from every
 * package entrypoint.
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

/**
 * A collection with at least one member, proven to the compiler rather than asserted at a call.
 *
 * The length test is the whole rule, and it is stated here so the refusal constructor receives a
 * tuple the type system already accepts. Reading the first element to decide emptiness was the
 * earlier spelling, and it refused a valid collection whose first member is legitimately
 * `undefined`, which an `Outcome<T, undefined>` may carry.
 */
function isNonEmpty<E>(values: readonly E[]): values is readonly [E, ...E[]] {
  return values.length > 0;
}

/**
 * Convert a runtime diagnostic collection into a refused outcome without permitting an empty one.
 *
 * The boundary survives for the callers that genuinely accumulate: `graph/order.ts`'s cycle site
 * and the three validation sites, where the count is a property of the input rather than of the
 * call. A caller that carries exactly one diagnostic reaches `refusedOutcome` directly instead.
 */
export function refusedOutcomeFrom<T, E>(diagnostics: readonly E[]): Outcome<T, E> {
  if (!isNonEmpty(diagnostics))
    throw new TypeError("A refused outcome requires at least one diagnostic.");
  return refusedOutcome([...diagnostics]);
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
