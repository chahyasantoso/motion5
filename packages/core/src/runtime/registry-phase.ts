import type { Diagnostic, LivePatch, Patch } from "../contract/v5";
import { unreachable } from "../lang/exhaustive";

/**
 * One `PatchRegistry` lifecycle as one value: batch buffers ride `collecting`; notification is a
 * field every phase carries, so an open batch stays representable while notifying. */
declare const REGISTRY_PHASE_BRAND: unique symbol;

/**
 * Mint mark closing the union: excess-property checks read fresh literals, so an unbranded variant
 * stays open. Never exported or assigned. */
interface RegistryPhaseBrand {
  readonly [REGISTRY_PHASE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & RegistryPhaseBrand;

/** Mints one phase: the only expression in the program that produces a `RegistryPhase`. */
function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

/** Whether subscribers are being notified; every phase answers, since any of them can be. */
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

/**
 * Where one registry is in its own life — `idle`, `collecting` with its batch buffers, `disposed` —
 * plus the notification every variant carries. */
export type RegistryPhase = Minted<IdleShape> | Minted<CollectingShape> | Minted<DisposedShape>;

// Interned: transitions carrying only a notification are lookups. `collecting` mints per batch,
// for its payload.
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

/** Why a batch may not open: `notifying` (reentrancy) or `open` (second batch). */
export type BatchRefusal = "notifying" | "open";

/**
 * One batch-opening attempt: `collect` mints the phase, `ignore` for a retired registry, `refuse`
 * names the guard that held. Unbranded: read at one call site, stored nowhere. */
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
 * Whether subscribers are being notified. `disposed` carries it too: a subscriber may retire the
 * registry mid-notification, and those behind it are still notified. */
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

/** The notification a phase carries, which an out-of-band delivery restores. */
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
 * What opening a batch does, and the one owner of the precedence: reentrancy outranks a second
 * batch; a retired registry is ignored, publication into one already a no-op. */
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
 * Retains one patch in the open batch: sole writer of a collecting phase's buffers, mutated in
 * place. Outside a batch it is a no-op. */
export function retain(phase: RegistryPhase, patch: LivePatch): void {
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
    // Minted, not looked up: payload variant. Field by field, so a field added later fails here.
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
 * The phase a registry retires into, keeping whatever notification is running. Idempotent; drops
 * the batch. */
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
