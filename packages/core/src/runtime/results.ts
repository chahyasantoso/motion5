import type { LiveWriteResult } from "../domain/track";
import { readOutcome, type Outcome } from "../domain/outcome";
import { unreachable } from "../domain/exhaustive";
import { refuse, type HandleTarget } from "./refusal";

/**
 * Closed runtime results owned at the boundary where their producers answer them.
 *
 * Track validation is an `Outcome`, so its accepted value and refusal diagnostics are mutually
 * exclusive before this runtime reads it. Live writes carry their patch decision and progress as
 * one union, while handle resolution carries liveness and its entry as one union. Each reader
 * below decides one question once, without reconstructing a boolean from nullable fields.
 *
 * The live-write union retains progress on both patch outcomes because the recompilation path seeks
 * the playhead after it stages a fresh track. Only the patch decision differs between those arms.
 * Issue #443, phase A step 2.
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
export function expectValid<T>(result: Outcome<T>): T {
  return readOutcome(
    result,
    (value) => value,
    (diagnostics) => refuse({ kind: "invalid-definition", diagnostics }),
  );
}

interface NoHookShape {
  readonly kind: "no-hook";
}

interface PatchedShape {
  readonly kind: "patched";
  readonly progress: number;
}

interface NeedsRebuildShape {
  readonly kind: "needs-rebuild";
  readonly progress: number;
}

/** What the live-write seam answered: no hook at all, a patched timeline, or a rebuild owed. */
export type LiveWrite = Minted<NoHookShape> | Minted<PatchedShape> | Minted<NeedsRebuildShape>;

const NO_HOOK: LiveWrite = mint<NoHookShape>({ kind: "no-hook" });

/** Reads the seam's answer as a union. `undefined` was never a fourth outcome, only an absent one. */
export function liveWrite(result: LiveWriteResult | undefined): LiveWrite {
  if (result === undefined) return NO_HOOK;
  switch (result.patch.kind) {
    case "patched":
      return mint<PatchedShape>({ kind: "patched", progress: result.progress });
    case "recompile":
      return mint<NeedsRebuildShape>({ kind: "needs-rebuild", progress: result.progress });
    default:
      return unreachable(result.patch);
  }
}

/**
 * The playhead the seam reported, or nothing when no seam answered at all.
 *
 * The second reader, and the reason there are two of them rather than one flag: no hook and a
 * patched timeline are the same answer to whether a stage is owed, and different answers to this.
 * It is also why `patched` carries a progress the shape issue #443 sketches gave it none of. The
 * recompilation path rebuilds whatever the seam did, so the only thing it asks of the answer is
 * where the playhead was.
 */
export function writtenProgress(write: LiveWrite): number | undefined {
  switch (write.kind) {
    case "no-hook":
      return undefined;
    case "patched":
    case "needs-rebuild":
      return write.progress;
    default:
      return unreachable(write);
  }
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
