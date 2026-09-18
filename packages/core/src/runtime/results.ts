import type { Diagnostic } from "../contract/v5";
import type { LiveWriteResult } from "../domain/track";
import { unreachable } from "../domain/exhaustive";
import { refuse, type HandleTarget } from "./refusal";

/**
 * The three boolean-plus-optional pairs the project runtime decodes by hand, as closed unions.
 *
 * Each of them is a type that cannot state the implication its callers rely on, so each caller
 * restates it. `{ valid, value? }` cannot say that valid implies a value, so `project-runtime.ts`
 * writes `!validation.valid || !validation.value` five times, and that second clause is dead weight
 * that exists only to satisfy the compiler. `LiveWriteResult | undefined` is three outcomes wearing
 * an optional over a boolean, decoded by the same three-line dance in two places. And handle
 * liveness is ten private methods that differ in whether they throw, whether they assert liveness,
 * and whether they answer an entry or an id.
 *
 * One deliberate departure from the shape issue #443 sketches. Its `LiveWrite` gives `patched` no
 * payload, but `#recompileKeyframes` reads `written?.progress` on both outcomes, so a `patched`
 * carrying nothing would drop a progress the runtime seeks to today. The hook always answers a
 * progress; only whether a rebuild is owed differs, so that is the only thing the discriminant says.
 *
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

interface AcceptedShape<T> {
  readonly kind: "accepted";
  readonly value: T;
  readonly diagnostics: readonly Diagnostic[];
}

interface RejectedShape {
  readonly kind: "rejected";
  readonly diagnostics: readonly Diagnostic[];
}

/** A validated candidate: accepted with its value, or rejected with why. No non-null assertion. */
export type Validated<T> = Minted<AcceptedShape<T>> | Minted<RejectedShape>;

/**
 * Reads one validation result as a union, and is the only place the two-field encoding is decoded.
 *
 * Structural in its parameter rather than naming `TrackValidationResult`, because the same encoding
 * is answered for more than one candidate shape and this module owns none of them.
 */
export function validated<T>(result: {
  readonly valid: boolean;
  readonly value: T | null;
  readonly diagnostics: readonly Diagnostic[];
}): Validated<T> {
  const diagnostics = result.diagnostics;
  if (!result.valid || result.value === null)
    return mint<RejectedShape>({ kind: "rejected", diagnostics });
  return mint<AcceptedShape<T>>({ kind: "accepted", value: result.value, diagnostics });
}

/** The accepted value, or the refusal every one of those five sites throws today. */
export function expectValid<T>(result: Validated<T>): T {
  switch (result.kind) {
    case "accepted":
      return result.value;
    case "rejected":
      return refuse({ kind: "invalid-definition", diagnostics: result.diagnostics });
    default:
      return unreachable(result);
  }
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
  if (result.patched) return mint<PatchedShape>({ kind: "patched", progress: result.progress });
  return mint<NeedsRebuildShape>({ kind: "needs-rebuild", progress: result.progress });
}

/**
 * Whether the seam declined to patch, so this write owes a staged replacement.
 *
 * A reader rather than a discriminant comparison spelled at the call site, on the precedent
 * `value-state.ts` set: the module that owns a union owns the switch over it, so a variant added
 * later breaks here instead of falling into whichever arm happened to be written last. Named for
 * what the caller owes rather than for the variant, because `buildOwed` in `value-state.ts` answers
 * a different question about a different union, and two names one letter apart would be a second
 * owner of neither.
 */
export function stageOwed(write: LiveWrite): boolean {
  switch (write.kind) {
    case "no-hook":
    case "patched":
      return false;
    case "needs-rebuild":
      return true;
    default:
      return unreachable(write);
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
