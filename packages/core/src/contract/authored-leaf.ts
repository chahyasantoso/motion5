import type { AuthoredStaticValue, AuthoredStop } from "./v5";

/**
 * What an authored leaf is, according to the one function allowed to answer.
 *
 * A leaf is a single authored property, as opposed to a plugin-named group of them. Deciding what
 * shape one has used to be six independent copies of the same record-and-array test: the authoring
 * gate in `validate-v5`, both predicates in `keyframe-shape`, the interpolation compiler, the plugin
 * registry's contribution path, and the fake interpolator in `testing/fakes`. Six copies of one
 * predicate is six answers to one question, and two of them already disagreed.
 *
 * Since ADR-050 there are two canonical forms and one retired one:
 *
 * - `"animated"`, a bare array of stops. The array is the value.
 * - `"static"`, a bare finite scalar. Never interpolated, and structurally unable to carry an
 *   `ease`.
 * - `"wrapper"`, the retired `{ stops: [...] }` object. Named here so that exactly one place decides
 *   what the old shape looks like, and refused by name rather than normalized.
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
  | { readonly kind: "static"; readonly value: AuthoredStaticValue }
  | { readonly kind: "empty" }
  | { readonly kind: "wrapper" }
  | { readonly kind: "invalid" };

/** One frozen value per shapeless kind, so classifying a leaf allocates nothing. */
const EMPTY_LEAF: AuthoredLeaf = Object.freeze({ kind: "empty" });
const WRAPPER_LEAF: AuthoredLeaf = Object.freeze({ kind: "wrapper" });
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
 *
 * Only an object carrying a `stops` **array** is the retired wrapper. `{ stops: "none" }` never was
 * the old form, so it stays an ordinary shape error rather than being reported as a migration.
 */
export function readAuthoredLeaf(value: unknown): AuthoredLeaf {
  if (Array.isArray(value)) return { kind: "animated", stops: value };
  if (typeof value === "number")
    return Number.isFinite(value) ? { kind: "static", value } : INVALID_LEAF;
  if (typeof value === "string" || typeof value === "boolean") return { kind: "static", value };
  if (!isRecord(value)) return INVALID_LEAF;
  if (Array.isArray(value.stops)) return WRAPPER_LEAF;
  return Object.keys(value).length === 0 ? EMPTY_LEAF : INVALID_LEAF;
}

/**
 * The stops a leaf actually compiles to: every authored stop with a finite position and a value.
 *
 * A static leaf compiles to no stops at all, which is what makes the interpolator bypass structural.
 * The caller reads its value from `readAuthoredLeaf` instead, so nothing downstream has to invent a
 * keyframe pair to represent a value that never changes.
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
