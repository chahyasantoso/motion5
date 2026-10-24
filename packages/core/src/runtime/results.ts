import type { Diagnostic } from "../contract/v5";
import { readOutcome, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import { refuse, type HandleTarget } from "./refusal";

/**
 * Closed runtime results owned at the boundary where their producers answer them.
 *
 * Track validation is an `Outcome`, so its accepted value and refusal diagnostics are mutually
 * exclusive before this runtime reads it. Handle resolution carries liveness and its entry as one
 * union, and this module's reader decides that question once rather than reconstructing a boolean
 * from nullable fields. The live-write union retired with the mask seam it decoded; a v5 live edit
 * plans its overlay rather than decoding a backend's patch answer.
 */
declare const RESULT_BRAND: unique symbol;

/**
 * The mint mark shared by the three unions in this module, for the reason issue #387 gave.
 *
 * One mark rather than three, because these are minted in one place and none of them is assignable
 * to another: their discriminants are disjoint, so the mark has only closedness left to buy.
 */
interface ResultBrand {
  readonly [RESULT_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & ResultBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

/** Reads a shared validation outcome and raises the runtime refusal for its refused branch. */
export function expectValid<T>(result: Outcome<T, Diagnostic>): T {
  return readOutcome(
    result,
    (value) => value,
    (diagnostics) => refuse({ kind: "invalid-definition", diagnostics }),
  );
}

interface LiveEntryShape<E> {
  readonly kind: "live";
  readonly entry: E;
}

interface StaleShape {
  readonly kind: "stale";
}

/** Whether a handle still points at what it was minted for, and what it points at when it does. */
export type Resolved<E> = Minted<LiveEntryShape<E>> | Minted<StaleShape>;

const STALE: Minted<StaleShape> = mint<StaleShape>({ kind: "stale" });

/** Answers a stale resolution, which carries nothing, so nothing has to be built to say so. */
export function stale<E>(): Resolved<E> {
  return STALE;
}

/**
 * Resolves one captured token against the entries a reader is looking at.
 *
 * The token comparison, once. Liveness of the runtime itself is a separate question and stays with
 * the phase that owns it, so a disposed runtime answers `stale()` at the one call site that asks.
 */
export function resolveToken<E extends { readonly token: number }>(
  entries: ReadonlyMap<string, E>,
  id: string,
  token: number,
): Resolved<E> {
  const entry = entries.get(id);
  if (entry === undefined || entry.token !== token) return STALE;
  return mint<LiveEntryShape<E>>({ kind: "live", entry });
}

/** Whether this resolution found what it was minted for. The `live` getter, as a discriminant read. */
export function isLive<E>(resolved: Resolved<E>): boolean {
  switch (resolved.kind) {
    case "live":
      return true;
    case "stale":
      return false;
    default:
      return unreachable(resolved);
  }
}

/** The resolved entry, or the stale-handle refusal the contract layer owns. */
export function expectLive<E>(resolved: Resolved<E>, target: HandleTarget): E {
  switch (resolved.kind) {
    case "live":
      return resolved.entry;
    case "stale":
      return refuse({ kind: "stale-handle", target });
    default:
      return unreachable(resolved);
  }
}
