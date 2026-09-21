import { unreachable } from "../lang/exhaustive";

/**
 * What a compiled Track carries beyond the definition it was built from, as a closed union.
 *
 * `TrackEntry` encoded this as an `overlay` record beside a `liveWrite` boolean: two fields for two
 * questions that are not independent. Three of their four combinations are reachable, because the
 * only writer of a populated overlay is the write that sets the marker, and no path clears the
 * marker without clearing the overlay with it. The fourth, an overlay standing over a Track nothing
 * wrote live, was unreachable and representable at the same time, and both readers of the pair had
 * to spell an emptiness test to ask their half of it.
 *
 * So the three reachable states are named here and the fourth cannot be minted. `buildOwed` answers
 * the derivation's question, `isOverlaid` answers the seam's, and each of them is one total switch.
 *
 * The overlay's keys are deliberately not carried. `Track` was handed them and owns the timeline
 * they patched, both readers here ask only whether one is standing, and a copy beside the owner is
 * a second owner rather than a record. Issue #443, phase A step 4. See ADR-059, ADR-060, ADR-066.
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

interface OverlaidShape {
  readonly kind: "overlaid";
}

/** Whether a live write stands on one node's compiled Track, and whether it involved a tween. */
export type ValueState = Minted<AuthoredShape> | Minted<WrittenShape> | Minted<OverlaidShape>;

/** The compiled Track is exactly its definition: freshly built, or never written to since. */
export const AUTHORED: ValueState = mint<AuthoredShape>({ kind: "authored" });

/** A live write landed and no animated key was involved in it. */
const WRITTEN: ValueState = mint<WrittenShape>({ kind: "written" });

/** A live write landed carrying animated keys, whose tweens the interpolator now holds. */
const OVERLAID: ValueState = mint<OverlaidShape>({ kind: "overlaid" });

/**
 * The state a returned live write leaves, minted from the overlay the seam was handed.
 *
 * An absent overlay and an empty one answer the same state, because they mean the same thing to
 * `Track.writeValues`: neither involves an animated key. What separates them there is whether a
 * standing tween is being cleared, which is a fact about the write rather than about what it leaves.
 * So this is called with exactly the argument the seam received, and the classification has one
 * owner instead of one emptiness test per caller.
 *
 * Minted from the write that was asked for rather than from what the backend answered, which is why
 * nothing here reads a `LiveWriteResult`: a declining backend escalates and a patching one does not,
 * and both leave a Track that only a fresh compilation restores. See ADR-066.
 */
export function liveWritten(overlay: Readonly<Record<string, unknown>> | undefined): ValueState {
  if (overlay === undefined || Object.keys(overlay).length === 0) return WRITTEN;
  return OVERLAID;
}

/**
 * Whether a replacement owes a timeline build even when its compiled inputs compare equal.
 *
 * The live writer has no inverse, so only a successful fresh compilation removes what it did. Asked
 * second in the derivation's predicate and never first: the candidate resolve beside it is a
 * validator, and a short-circuit deletes a validator rather than a cost. See ADR-066 and `RA-105`.
 */
export function buildOwed(state: ValueState): boolean {
  switch (state.kind) {
    case "authored":
      return false;
    case "written":
    case "overlaid":
      return true;
    default:
      return unreachable(state);
  }
}

/**
 * Whether an animated overlay is standing, which is what makes the next write involve the seam's
 * animated half even when its caller named no animated key at all.
 *
 * A revert names none of them, so without this answer an `overrideValues({})` cannot be told from a
 * static-only write and would leave a patched timeline patched. See ADR-060 and ADR-066.
 */
export function isOverlaid(state: ValueState): boolean {
  switch (state.kind) {
    case "overlaid":
      return true;
    case "authored":
    case "written":
      return false;
    default:
      return unreachable(state);
  }
}
