import { unreachable } from "../lang/exhaustive";
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
 * `"empty"` is a kind of its own rather than a spelling of `"invalid"`. An authored `{}` leaf inside
 * a group's `values` section is a deliberately accepted no-op property that `Y-6` pins, so
 * collapsing it into the invalid case would turn a documented acceptance into a diagnostic. A `{}`
 * written as a top-level entry is a different question, answered by `validateKeyframes` as
 * `keyframes-ungrouped-key`, because every top-level entry must name its plugin. See ADR-121.
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
 * Which of a live write's two channels a key authored as this leaf travels on.
 *
 * `Track` refuses a live write that arrives on the wrong channel at two members, and before this
 * the two asked one question in opposite directions: `#acceptedValues` refused `kind ===
 * "animated"` and `#acceptedOverlay` refused `kind !== "animated"`. Each was total over the five
 * kinds that exist by accident rather than by construction, and they were total in ways that could
 * disagree: a sixth kind would have been maskable at one member and patchable at the other at the
 * same time, and no gate in this repository names either site. One classification, read
 * exhaustively, is what makes those two answers one answer.
 *
 * The three shapeless kinds travel on the mask, which is what both members already did rather
 * than a decision taken here. `empty` is the deliberately accepted no-op `Y-6` pins, and `wrapper`
 * and `invalid` are refused by the validator before a live write can reach a loaded project, so
 * classifying those two decides nothing a caller can observe. The result is a closed two-member
 * union, so a reader that asks for the one channel it wants has decided about both.
 *
 * This answers the channel and nothing else. Which authored payload a consumer needs is a different
 * partition, because it carries either a static value or the stops that may be compiled. See
 * ADR-059, ADR-060, and ADR-092.
 */
export type LiveWriteChannel = "mask" | "timeline";

export function liveWriteChannel(leaf: AuthoredLeaf): LiveWriteChannel {
  switch (leaf.kind) {
    case "animated":
      return "timeline";
    case "static":
    case "empty":
    case "wrapper":
    case "invalid":
      return "mask";
    default:
      return unreachable(leaf);
  }
}

/**
 * The payload role an authored leaf presents to a consumer of the compiled definition.
 *
 * The compiler, fake interpolator, and live-value mask each asked this same three-way question in
 * their own words: a static leaf has a value, an animated leaf has stops, and every other leaf has
 * neither. The old readers compared `kind` one-sidedly and then fell through, so a new leaf kind
 * inherited whichever answer happened to be written after the comparison. This partition names all
 * three answers once and preserves the payload needed by each owner of the next step.
 *
 * This is a read of `AuthoredLeaf`, not another classifier. `readAuthoredLeaf` remains the only
 * function that inspects an unknown value, while this function exhaustively maps its five already
 * classified kinds. The empty, retired-wrapper, and invalid forms intentionally share `none`: that
 * is the answer those readers already produced, and validation remains the owner of refusing the
 * two malformed forms. See ADR-050, ADR-059, ADR-060, and ADR-092.
 */
export type AuthoredLeafPartition =
  | { readonly kind: "value"; readonly value: AuthoredStaticValue }
  | { readonly kind: "stops"; readonly stops: readonly unknown[] }
  | { readonly kind: "none" };

const NO_PARTITION: AuthoredLeafPartition = Object.freeze({ kind: "none" });

export function authoredLeafPartition(leaf: AuthoredLeaf): AuthoredLeafPartition {
  switch (leaf.kind) {
    case "animated":
      return { kind: "stops", stops: leaf.stops };
    case "static":
      return { kind: "value", value: leaf.value };
    case "empty":
    case "wrapper":
    case "invalid":
      return NO_PARTITION;
    default:
      return unreachable(leaf);
  }
}

/**
 * The stops a leaf actually compiles to: every authored stop with a finite position and a value.
 *
 * A static leaf compiles to no stops at all, which is what makes the interpolator bypass structural.
 * The caller reads its value from `authoredLeafPartition` instead, so nothing downstream has to
 * invent a keyframe pair to represent a value that never changes.
 *
 * Tolerant by design, exactly like `readPluginValues`. A malformed stop is absent here and reported
 * by `validateKeyframes`, which owns shape. The filter lives beside the classifier rather than in
 * the compiler, because the fake interpolator and the plugin contribution path need the same answer
 * and used to reach it independently.
 */
export function readCompilableStops(value: unknown): readonly AuthoredStop[] {
  const leaf = readAuthoredLeaf(value);
  switch (leaf.kind) {
    case "animated":
      return leaf.stops.filter(
        (stop): stop is AuthoredStop =>
          isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop,
      );
    case "static":
    case "empty":
    case "wrapper":
    case "invalid":
      return NO_STOPS;
    default:
      return unreachable(leaf);
  }
}
