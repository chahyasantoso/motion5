import type { AuthoredStop } from "./v5";

/**
 * What an authored leaf is, according to the one function allowed to answer.
 *
 * A leaf is a single authored property, as opposed to a plugin-named group of them. Deciding what
 * shape one has used to be six independent copies of the same record-and-array test: the authoring
 * gate in `validate-v5`, both predicates in `keyframe-shape`, the interpolation compiler, the plugin
 * registry's contribution path, and the fake interpolator in `testing/fakes`. Six copies of one
 * predicate is six answers to one question, and two of them already disagreed: the compiler drops a
 * stop whose position does not parse, and the fake kept it and published a key nothing else did.
 *
 * `"empty"` is a kind of its own rather than a spelling of `"invalid"`. An authored `{}` is a
 * deliberately accepted no-op property that `Y-6` pins, so collapsing it into the invalid case would
 * turn a documented acceptance into a diagnostic.
 *
 * The union is deliberately narrow. Adding a member is how the authored form changes, and the point
 * of this module is that such a change happens here and nowhere else. See issue #192.
 */
export type AuthoredLeaf =
  | { readonly kind: "animated"; readonly stops: readonly unknown[] }
  | { readonly kind: "empty" }
  | { readonly kind: "invalid" };

/** One frozen value per shapeless kind, so classifying a leaf allocates nothing. */
const EMPTY_LEAF: AuthoredLeaf = Object.freeze({ kind: "empty" });
const INVALID_LEAF: AuthoredLeaf = Object.freeze({ kind: "invalid" });
/** One frozen empty list, so a leaf that compiles to nothing allocates nothing either. */
const NO_STOPS: readonly AuthoredStop[] = Object.freeze([]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Classifies one authored leaf, and nothing else.
 *
 * The authored array is handed back exactly as written rather than filtered, because validation has
 * to see every stop an author typed in order to report a bad position at all. Filtering is the
 * separate question `readCompilableStops` answers below, and separating the two is what lets one
 * module own both without either caller getting the other one's answer.
 */
export function readAuthoredLeaf(value: unknown): AuthoredLeaf {
  if (!isRecord(value)) return INVALID_LEAF;
  const authored = value.stops;
  if (Array.isArray(authored)) return { kind: "animated", stops: authored };
  return Object.keys(value).length === 0 ? EMPTY_LEAF : INVALID_LEAF;
}

/**
 * The stops a leaf actually compiles to: every authored stop with a finite position and a value.
 *
 * Tolerant by design, exactly like `readPluginValues`. A malformed stop is absent here and reported
 * by `validateKeyframes`, which owns shape. The filter lives beside the classifier rather than in
 * the compiler, because the fake interpolator and the plugin contribution path need the same answer
 * and used to reach it independently.
 */
export function readCompilableStops(value: unknown): readonly AuthoredStop[] {
  const leaf = readAuthoredLeaf(value);
  if (leaf.kind !== "animated") return NO_STOPS;
  return leaf.stops.filter(
    (stop): stop is AuthoredStop =>
      isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop,
  );
}
