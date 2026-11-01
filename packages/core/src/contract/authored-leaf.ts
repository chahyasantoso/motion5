import { unreachable } from "../lang/exhaustive";
import type { AuthoredStaticValue, AuthoredStop } from "./v5";

/**
 * An authored leaf: `animated` stops array, `static` finite scalar never interpolated, `empty`
 * group `{}` no-op, `wrapper` retired `{ stops: [...] }` refused, `invalid` anything else. */
export type AuthoredLeaf =
  | { readonly kind: "animated"; readonly stops: readonly unknown[] }
  | { readonly kind: "static"; readonly value: AuthoredStaticValue }
  | { readonly kind: "empty" }
  | { readonly kind: "wrapper" }
  | { readonly kind: "invalid" };

/** Frozen singleton per shapeless kind; classifying allocates nothing. */
const EMPTY_LEAF: AuthoredLeaf = Object.freeze({ kind: "empty" });
const WRAPPER_LEAF: AuthoredLeaf = Object.freeze({ kind: "wrapper" });
const INVALID_LEAF: AuthoredLeaf = Object.freeze({ kind: "invalid" });
/** Frozen empty list; a leaf compiling to nothing allocates nothing. */
const NO_STOPS: readonly AuthoredStop[] = Object.freeze([]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Classify an authored leaf; sole inspector of unknown values. Arrays pass unfiltered so validation
 * sees every stop. An object carrying a `stops` array is the retired wrapper, refused. */
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
 * Payload a leaf presents: `value` for static, `stops` for animated, `none` for empty, wrapper,
 * invalid. Read of `AuthoredLeaf`; malformed forms refused by validation, not here. */
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
 * Stops a leaf compiles to: entries with finite `p` and a `v`. Static yields none; caller reads its
 * value from `authoredLeafPartition`. Malformed stops absent; validation owns shape. */
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
