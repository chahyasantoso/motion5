import { unreachable } from "../lang/exhaustive";

/**
 * What a compiled Track carries beyond the definition it was built from, as a closed union.
 *
 * Two states: the compiled Track is exactly its definition, or a whole-value live overlay stands on
 * it. The legacy mask/timeline split and its animated variant retired with the mask seam; an
 * identified-table write replaces the evaluated table or record wholesale, so there is no second
 * half to distinguish and a fresh compilation is the one thing that clears it.
 *
 * The overlay's value is deliberately not carried. The compiled Track owns it, and both readers here
 * ask only whether one is standing. Issue #443, phase A step 4. See ADR-059, ADR-060 and ADR-066.
 */
declare const VALUE_STATE_BRAND: unique symbol;

/** The mint mark, so a shape assembled somewhere else is not a state. See issue #387. */
interface ValueStateBrand {
  readonly [VALUE_STATE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & ValueStateBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

interface AuthoredShape {
  readonly kind: "authored";
}

interface WrittenShape {
  readonly kind: "written";
}

/** Whether a live write stands on one node's compiled Track. */
export type ValueState = Minted<AuthoredShape> | Minted<WrittenShape>;

/** The compiled Track is exactly its definition: freshly built, or never written to since. */
export const AUTHORED: ValueState = mint<AuthoredShape>({ kind: "authored" });

/**
 * A whole-value live overlay stands on an identified-table Track.
 *
 * The two facts its readers need, in one state: a live write stands, and a fresh compilation is
 * what clears it.
 */
export const LIVE: ValueState = mint<WrittenShape>({ kind: "written" });

/**
 * Whether a replacement owes a timeline build even when its compiled inputs compare equal.
 *
 * The live overlay has no inverse, so only a successful fresh compilation removes it. Asked second
 * in the derivation's predicate and never first: the candidate resolve beside it is a validator,
 * and a short-circuit deletes a validator rather than a cost. See ADR-066 and `RA-105`.
 */
export function buildOwed(state: ValueState): boolean {
  switch (state.kind) {
    case "authored":
      return false;
    case "written":
      return true;
    default:
      return unreachable(state);
  }
}
