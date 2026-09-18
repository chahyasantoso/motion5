import type { Diagnostic, Patch } from "../contract/v5";
import { unreachable } from "../domain/exhaustive";

/**
 * The lifecycle of one `PatchRegistry` as one value, with the batch buffers inside the variant that
 * owns them.
 *
 * Three booleans encoded this until issue #443: `#batchOpen`, `#notifying` and `#disposed`, eight
 * combinations of which about four meant anything. Beside them sat four fields that are only
 * meaningful while a batch is open, which `beginBatch` set one by one and `closeBatch` reset one by
 * one, and that is the half-cleared-key problem ADR-083 refuses one layer up: a tick, a seed list, a
 * patch buffer and a diagnostic buffer that can each be half a batch are four ways for one
 * publication to answer from the last one.
 *
 * So the buffers ride `collecting`, and closing a batch is one assignment rather than five. A retired
 * registry carries no batch at all, which is what the four clears in `dispose` were doing by hand,
 * and a disposed registry with a batch open stops being expressible.
 *
 * Notification is a field of every phase rather than a phase beside them, and that is the one
 * distinction this union does not close, deliberately. Delivering the terminal patch of an evicted
 * node raises it out of band, from a graph mutation rather than from a flush, and it restores whatever
 * it interrupted rather than assuming it interrupted nothing, so a notification running inside an open
 * batch is a state this registry already tolerates. A `notifying` variant beside the others would make
 * that pair unrepresentable and lose the batch it was carrying, which is `DrainBooking`'s argument in
 * `graph-runtime-state.ts` applied to the same question one module over. See ADR-083 and ADR-092.
 *
 * Issue #443, phase B step 10.
 */
declare const REGISTRY_PHASE_BRAND: unique symbol;

/**
 * The mint mark that keeps the union below closed as well as discriminated.
 *
 * The device `graph-runtime-state.ts` already uses, for the reason issue #387 gave: a variant
 * declaring only its discriminant is not closed, because TypeScript's excess-property check reads a
 * fresh object literal rather than a value arriving through a variable. Declared, never exported and
 * never assigned at run time, so no other module can name the key and no property exists to carry.
 */
interface RegistryPhaseBrand {
  readonly [REGISTRY_PHASE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & RegistryPhaseBrand;

/** Mints one phase, and is the only expression in the program that produces a `RegistryPhase`. */
function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

/** Whether subscribers are being notified, which every phase answers because any of them can be. */
export type Notification = "quiet" | "notifying";

interface IdleShape {
  readonly kind: "idle";
  readonly notification: Notification;
}

interface CollectingShape {
  readonly kind: "collecting";
  readonly notification: Notification;
  readonly tick: number;
  readonly seeds: readonly string[];
  readonly patches: Patch[];
  readonly diagnostics: Diagnostic[];
}

interface DisposedShape {
  readonly kind: "disposed";
  readonly notification: Notification;
}

/** Where one registry is in its own life, and the whole of what that state carries. */
export type RegistryPhase = Minted<IdleShape> | Minted<CollectingShape> | Minted<DisposedShape>;

// Interned, so every transition that only carries a notification is a lookup rather than an
// allocation. Only `collecting` is minted per batch, because only `collecting` has a payload.
const IDLE_PHASES = {
  quiet: mint<IdleShape>({ kind: "idle", notification: "quiet" }),
  notifying: mint<IdleShape>({ kind: "idle", notification: "notifying" }),
} as const;

const DISPOSED_PHASES = {
  quiet: mint<DisposedShape>({ kind: "disposed", notification: "quiet" }),
  notifying: mint<DisposedShape>({ kind: "disposed", notification: "notifying" }),
} as const;

/** The phase a registry starts in: live, collecting nothing, notifying nobody. */
export const REGISTRY_IDLE: RegistryPhase = IDLE_PHASES.quiet;

/** The batch a collecting phase is filling, as its readers see it. */
export interface OpenBatch {
  readonly tick: number;
  readonly seeds: readonly string[];
  readonly patches: readonly Patch[];
  readonly diagnostics: readonly Diagnostic[];
}

/** Why a batch may not open now. The precedence between the two is stated once, in `opening`. */
export type BatchRefusal = "notifying" | "open";

/**
 * What one attempt to open a batch is answered with.
 *
 * Three answers rather than a boolean, because the three are genuinely different: a retired registry
 * collects nothing and refuses nothing, a notifying one refuses reentrancy, and one already
 * collecting refuses a second batch. Unbranded, because it is read at its one call site and stored
 * nowhere.
 */
export type BatchOpening =
  | { readonly kind: "collect"; readonly phase: RegistryPhase }
  | { readonly kind: "ignore" }
  | { readonly kind: "refuse"; readonly reason: BatchRefusal };

const IGNORE: BatchOpening = Object.freeze({ kind: "ignore" });
const REFUSE_NOTIFYING: BatchOpening = Object.freeze({ kind: "refuse", reason: "notifying" });
const REFUSE_OPEN: BatchOpening = Object.freeze({ kind: "refuse", reason: "open" });

/** Answers whether this registry is retired, which is a discriminant read and nothing else. */
export function isDisposed(phase: RegistryPhase): boolean {
  switch (phase.kind) {
    case "idle":
    case "collecting":
      return false;
    case "disposed":
      return true;
    default:
      return unreachable(phase);
  }
}

/**
 * Answers whether subscribers are being notified, for every reader that has to ask.
 *
 * `disposed` carries the field too, and that is deliberate: a subscriber may retire the registry from
 * inside a notification and the subscribers behind it are still notified, so a retired registry
 * answering quiet would answer the reentrancy question with a state it is not in.
 */
export function isNotifying(phase: RegistryPhase): boolean {
  switch (phase.kind) {
    case "idle":
    case "collecting":
    case "disposed":
      return phase.notification === "notifying";
    default:
      return unreachable(phase);
  }
}

/** The notification a phase carries, which is what an out-of-band delivery restores. */
export function notificationOf(phase: RegistryPhase): Notification {
  switch (phase.kind) {
    case "idle":
    case "collecting":
    case "disposed":
      return phase.notification;
    default:
      return unreachable(phase);
  }
}

/** The batch this phase is collecting into, or `undefined` when no batch is open. */
export function openBatch(phase: RegistryPhase): OpenBatch | undefined {
  switch (phase.kind) {
    case "collecting":
      return phase;
    case "idle":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/**
 * Answers what opening a batch does to this phase, and is the one owner of that precedence.
 *
 * Reentrancy outranks a second batch, which is the order the two guards were written in and is now
 * the order one function states. A retired registry is ignored rather than refused, because
 * publication into one is already a no-op and a caller tearing its project down mid-flush is legal.
 */
export function opening(
  phase: RegistryPhase,
  tick: number,
  seeds: readonly string[],
): BatchOpening {
  switch (phase.kind) {
    case "disposed":
      return IGNORE;
    case "idle":
      if (phase.notification === "notifying") return REFUSE_NOTIFYING;
      return Object.freeze({
        kind: "collect",
        phase: mint<CollectingShape>({
          kind: "collecting",
          notification: phase.notification,
          tick,
          seeds: Object.freeze([...seeds]),
          patches: [],
          diagnostics: [],
        }),
      });
    case "collecting":
      if (phase.notification === "notifying") return REFUSE_NOTIFYING;
      return REFUSE_OPEN;
    default:
      return unreachable(phase);
  }
}

/**
 * Retains one patch in the open batch, and is the only writer of a collecting phase's buffers.
 *
 * The arrays the variant carries are mutated rather than a phase minted per patch, because a busy
 * frame publishes one per member and those buffers are what the batch is made of. A publication with
 * no batch open is retained by the registry's own map and collected nowhere, which is what the retired
 * fields did with it too: they pushed it into a buffer the next `beginBatch` emptied.
 */
export function retain(phase: RegistryPhase, patch: Patch): void {
  switch (phase.kind) {
    case "collecting":
      phase.patches.push(patch);
      phase.diagnostics.push(...patch.diagnostics);
      return;
    case "idle":
    case "disposed":
      return;
    default:
      return unreachable(phase);
  }
}

/** Answers the phase a closed batch leaves, dropping the buffers with the variant that held them. */
export function closed(phase: RegistryPhase): RegistryPhase {
  switch (phase.kind) {
    case "collecting":
      return IDLE_PHASES[phase.notification];
    case "idle":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Raises or lowers the notification, keeping the phase that carries it. Total, and terminal-safe. */
export function withNotification(phase: RegistryPhase, notification: Notification): RegistryPhase {
  switch (phase.kind) {
    case "idle":
      return IDLE_PHASES[notification];
    case "disposed":
      return DISPOSED_PHASES[notification];
    // Minted rather than looked up, because this variant carries a payload, and field by field rather
    // than by spread, so a field added later fails here instead of travelling in silence.
    case "collecting":
      return mint<CollectingShape>({
        kind: "collecting",
        notification,
        tick: phase.tick,
        seeds: phase.seeds,
        patches: phase.patches,
        diagnostics: phase.diagnostics,
      });
    default:
      return unreachable(phase);
  }
}

/**
 * Answers the phase a registry retires into, carrying whatever notification is still running.
 *
 * Idempotent, and it drops the batch: a retired registry answers no batch, which is what `dispose`
 * did by emptying four fields one at a time.
 */
export function retired(phase: RegistryPhase): RegistryPhase {
  switch (phase.kind) {
    case "idle":
    case "collecting":
    case "disposed":
      return DISPOSED_PHASES[phase.notification];
    default:
      return unreachable(phase);
  }
}
