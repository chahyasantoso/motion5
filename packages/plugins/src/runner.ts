import type {
  Clock,
  ClockTick,
  LivePatch,
  ProjectHandle,
  Value,
  ValueTransaction,
} from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";

export type RunnerStep =
  | { readonly kind: "hold" }
  | { readonly kind: "write"; readonly values: Value }
  | { readonly kind: "release" };

export interface Runner {
  /** The node this runner exclusively owns; each overlay replaces the previous one wholesale. */
  readonly nodeId: string;
  /** Synchronous. Reads published state; returns an overlay instead of writing the project. */
  step(tick: ClockTick, read: (nodeId: string) => LivePatch | undefined): RunnerStep;
  dispose?(): void;
}

export type RunnerFailure =
  | { readonly kind: "step-threw"; readonly nodeId: string; readonly cause: unknown }
  | { readonly kind: "write-refused"; readonly nodeId: string; readonly cause: unknown }
  | { readonly kind: "node-missing"; readonly nodeId: string }
  | { readonly kind: "dispose-threw"; readonly nodeId: string; readonly cause: unknown }
  /** Batch call failure, transient or not; stops the whole attachment. */
  | { readonly kind: "project-unavailable"; readonly cause: unknown };

export interface AttachRunnersOptions {
  /** The instance given to the Engine; attach after engine creation for engine-first ordering. */
  readonly clock: Clock;
  /** Runs after the batch closes; every report is attempted before the first throw escapes. */
  readonly onFailure: (failure: RunnerFailure) => void;
}

type RunnerProject = Pick<ProjectHandle, "get" | "tryTrack" | "values">;
interface Entry {
  readonly runner: Runner;
  readonly nodeId: string;
}
type Write =
  | { readonly entry: Entry; readonly kind: "write"; readonly values: Value }
  | { readonly entry: Entry; readonly kind: "release" };

function snapshotRunners(project: RunnerProject, runners: readonly Runner[]): Entry[] {
  if (!Array.isArray(runners)) throw new TypeError("Runners must be an array.");
  const seen = new Set<string>();
  return [...runners].map((runner: Runner) => {
    if (typeof runner !== "object" || runner === null || typeof runner.step !== "function") {
      throw new TypeError("Each runner requires a synchronous step function.");
    }
    const nodeId = runner.nodeId;
    if (typeof nodeId !== "string" || nodeId.length === 0) {
      throw new TypeError("Runner nodeId must be a non-empty string.");
    }
    if (seen.has(nodeId)) throw new TypeError(`Runner node "${nodeId}" has more than one owner.`);
    if (project.tryTrack(nodeId) === undefined) {
      throw new TypeError(`Runner node "${nodeId}" is missing.`);
    }
    if (runner.dispose !== undefined && typeof runner.dispose !== "function") {
      throw new TypeError(`Runner node "${nodeId}" requires a dispose function.`);
    }
    seen.add(nodeId);
    return { runner, nodeId };
  });
}

/**
 * Attaches runners to a project and clock; returns a disposer. Steps read published state
 * first; one batch per tick. A refusal retires only its runner; batch failure stops the attachment. */
export function attachRunners(
  project: RunnerProject,
  runners: readonly Runner[],
  options: AttachRunnersOptions,
): () => void {
  const live = new Set(snapshotRunners(project, runners));
  const { clock, onFailure } = readOptions(options);
  const read = (nodeId: string) => project.get(nodeId);
  const pendingDisposal = new Set<Entry>();
  let stopped = false;
  let dispatching = false;
  // Set after subscribe returns; a tick inside subscribe can stop first, and that subscription is released.
  let unsubscribe: (() => void) | undefined;

  // Only transition to stopped; idempotent over the clock subscription.
  function stop(): void {
    stopped = true;
    unsubscribe?.();
  }

  // Only transition out of live; delete before disposal keeps cleanup reentrant.
  function retire(entry: Entry): void {
    if (live.delete(entry)) pendingDisposal.add(entry);
  }

  function disposeRetired(failures: RunnerFailure[]): void {
    for (const entry of pendingDisposal) {
      pendingDisposal.delete(entry);
      try {
        entry.runner.dispose?.();
      } catch (cause) {
        failures.push({ kind: "dispose-threw", nodeId: entry.nodeId, cause });
      }
    }
  }

  function report(failures: readonly RunnerFailure[]): unknown[] {
    const errors: unknown[] = [];
    for (const failure of failures) {
      try {
        onFailure(failure);
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  }

  // Per-write refusals stay in the recipe; only a values() failure stops the attachment.
  function applyWrite(
    tx: ValueTransaction,
    write: Write,
    failures: RunnerFailure[],
    reportMissing = true,
  ): void {
    const { entry } = write;
    const track = tx.tryTrack(entry.nodeId);
    if (track === undefined) {
      if (reportMissing) failures.push({ kind: "node-missing", nodeId: entry.nodeId });
      retire(entry);
      return;
    }
    try {
      switch (write.kind) {
        case "write":
          track.writeValues(write.values);
          break;
        case "release":
          track.releaseValues();
          break;
        default:
          unreachable(write);
      }
    } catch (cause) {
      failures.push({ kind: "write-refused", nodeId: entry.nodeId, cause });
      retire(entry);
      // Batch not atomic: refused write still releases its earlier overlay; failed release not retried, recovery refusal reported.
      if (write.kind === "write") {
        try {
          track.releaseValues();
        } catch (releaseCause) {
          failures.push({ kind: "write-refused", nodeId: entry.nodeId, cause: releaseCause });
        }
      }
    }
  }

  function dispatch(tick: ClockTick): void {
    if (stopped) return;
    const failures: RunnerFailure[] = [];
    const writes: Write[] = [];
    for (const entry of live) {
      try {
        const step = entry.runner.step(tick, read);
        switch (step.kind) {
          case "hold":
            break;
          case "write":
            writes.push({ entry, kind: "write", values: step.values });
            break;
          case "release":
            writes.push({ entry, kind: "release" });
            break;
          default:
            unreachable(step);
        }
      } catch (cause) {
        failures.push({ kind: "step-threw", nodeId: entry.nodeId, cause });
        retire(entry);
        writes.push({ entry, kind: "release" });
      }
    }
    if (writes.length > 0) {
      try {
        project.values((tx) => {
          for (const write of writes) applyWrite(tx, write, failures);
        });
      } catch (cause) {
        stop();
        for (const entry of live) retire(entry);
        failures.push({ kind: "project-unavailable", cause });
      }
    }
    disposeRetired(failures);
    if (live.size === 0 && !stopped) stop();
    const errors = report(failures);
    if (errors.length > 0) throw errors[0];
  }

  // Tick throws before subscribe returns: keep first error, finish subscribing, clean up, rethrow.
  let attaching = true;
  let attachFailure: { readonly error: unknown } | undefined;
  const subscription = clock.subscribe((tick) => {
    if (stopped) return;
    if (dispatching) throw new Error("Runner clock dispatch is already in flight.");
    dispatching = true;
    try {
      dispatch(tick);
    } catch (error) {
      if (!attaching) throw error;
      attachFailure ??= { error };
    } finally {
      dispatching = false;
    }
  });
  attaching = false;
  if (stopped) subscription();
  else unsubscribe = subscription;

  const dispose = () => {
    if (stopped) return;
    // Refuse before any state transition: cleanup would open a second batch; retry after dispatch returns.
    if (dispatching) throw new Error("Runner disposal cannot run during clock dispatch.");
    stop();
    const entries = [...live];
    for (const entry of entries) retire(entry);
    const failures: RunnerFailure[] = [];
    const errors: unknown[] = [];
    if (entries.length > 0) {
      try {
        project.values((tx) => {
          for (const entry of entries) applyWrite(tx, { entry, kind: "release" }, failures, false);
        });
      } catch (error) {
        errors.push(error);
      }
    }
    disposeRetired(failures);
    errors.push(...report(failures));
    if (errors.length > 0) throw errors[0];
  };
  if (attachFailure !== undefined) {
    try {
      dispose();
    } catch {
      // Attachment error is first; cleanup errors after it are secondary.
    }
    throw attachFailure.error;
  }
  return dispose;
}

function readOptions(options: AttachRunnersOptions): AttachRunnersOptions {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("Runners require an options object.");
  }
  const { clock, onFailure } = options;
  if (typeof clock !== "object" || clock === null || typeof clock.subscribe !== "function") {
    throw new TypeError("Runners require a clock with a subscribe function.");
  }
  if (typeof onFailure !== "function") {
    throw new TypeError("Runners require an onFailure function.");
  }
  return { clock, onFailure };
}

/** The only owner of runner failure wording; causes stay available without coercing caller data. */
export function describeRunnerFailure(failure: RunnerFailure): string {
  switch (failure.kind) {
    case "step-threw":
      return `Runner "${failure.nodeId}" step threw.`;
    case "write-refused":
      return `Runner "${failure.nodeId}" override was refused.`;
    case "node-missing":
      return `Runner node "${failure.nodeId}" is missing.`;
    case "dispose-threw":
      return `Runner "${failure.nodeId}" disposal threw.`;
    case "project-unavailable":
      return "Runner project is unavailable; the attachment has stopped.";
    default:
      return unreachable(failure);
  }
}

/** `undefined` means empty, so it is not offerable; wrap optional results in a record. */
export interface LatestSlot<T extends {} | null> {
  offer(value: T): void;
  take(): T | undefined;
}

/** Bounded store for an async producer: latest offer wins, take consumes once. */
export function createLatestSlot<T extends {} | null>(): LatestSlot<T> {
  let latest: T | undefined;
  return {
    offer(value) {
      latest = value;
    },
    take() {
      const value = latest;
      latest = undefined;
      return value;
    },
  };
}
