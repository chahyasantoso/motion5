import type { Diagnostic } from "../contract/v5";
import { readOutcome, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import { refuse, type HandleTarget } from "./refusal";

/**
 * Closed runtime results, owned where produced: `Outcome` keeps value and refusals exclusive;
 * resolution holds liveness and entry in one union, read once. */
declare const RESULT_BRAND: unique symbol;

/** One mint mark for this module's unions: disjoint discriminants leave it only closedness to buy. */
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

/** Resolves one captured token against a reader's entries: mismatch → `stale()`. Runtime liveness stays its owner's. */
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
