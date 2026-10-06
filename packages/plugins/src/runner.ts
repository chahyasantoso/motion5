import type {
  Clock,
  ClockTick,
  LivePatch,
  LiveValues,
  ProjectHandle,
  ValueTransaction,
} from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";

export type RunnerStep =
  | { readonly kind: "hold" }
  | { readonly kind: "write"; readonly values: LiveValues }
  | { readonly kind: "release" };

export interface Runner {
  /** Exclusive owner within this attachment: each overlay replaces the previous overlay wholesale. */
  readonly nodeId: string;
  /** Synchronous. Read published state here; return an overlay rather than writing to the project. */
  step(tick: ClockTick, read: (nodeId: string) => LivePatch | undefined): RunnerStep;
  dispose?(): void;
}

export type RunnerFailure =
  | { readonly kind: "step-threw"; readonly nodeId: string; readonly cause: unknown }
  | { readonly kind: "write-refused"; readonly nodeId: string; readonly cause: unknown }
  | { readonly kind: "node-missing"; readonly nodeId: string }
  | { readonly kind: "dispose-threw"; readonly nodeId: string; readonly cause: unknown }
  /** Any failure of the batch call itself; transient or not, it stops the whole attachment. */
  | { readonly kind: "project-unavailable"; readonly cause: unknown };

export interface AttachRunnersOptions {
  /** The same instance given to the Engine; attach after engine creation for engine-first ordering. */
  readonly clock: Clock;
  /** Runs after the batch closes. Every queued report is attempted before the first throw escapes. */
  readonly onFailure: (failure: RunnerFailure) => void;
}

type RunnerProject = Pick<ProjectHandle, "get" | "tryTrack" | "values">;
interface Entry {
  readonly runner: Runner;
  readonly nodeId: string;
}
interface Write {
  readonly entry: Entry;
  readonly values: LiveValues;
}
const RELEASE: LiveValues = Object.freeze({});

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
 * Owns runner lifecycle outside the graph (ADR-139).
 *
 * All steps read the engine's published state before any queued runner writes land. At most one
 * value batch is opened per tick. A refusal detaches only its runner, releases its overlay when
 * possible, and disposes it once. The array and ownership ids are snapshotted at attachment.
 *
 * Overlays accept authored static keys of the same leaf kind (ADR-060). Identical writes still
 * republish and recompute downstream; returning hold is the runner's decision. Separate
 * attachments must not own the same node. Steps must not write to the project synchronously.
 *
 * Dispose before project.dispose(). Reversed cleanup still disposes every runner, then rethrows
 * the batch error once. Any failure of the batch call itself stops the attachment, transient or
 * not (project-unavailable); that stop has already cleaned up, so disposal is silent.
 * Recursive clock dispatch and disposal during a running tick are refused before changing state.
 * Dispose outside step, runner cleanup and onFailure; after a terminal stop disposal is a no-op.
 * Native async work stays outside step: offer its completed result to a LatestSlot.
 */
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
  // Assigned once subscribe returns. A clock that fires inside subscribe can stop the attachment
  // before then; stop() records it and the subscription is released as soon as it exists.
  let unsubscribe: (() => void) | undefined;

  // The only transition to stopped; idempotent with respect to the clock subscription.
  function stop(): void {
    stopped = true;
    unsubscribe?.();
  }

  // This is the only transition out of live; deletion before disposal makes cleanup reentrant.
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

  // Per-write refusals stay inside the recipe. Only a values() failure can stop the attachment.
  function applyWrite(
    tx: ValueTransaction,
    write: Write,
    failures: RunnerFailure[],
    reportMissing = true,
  ): void {
    const { entry, values } = write;
    const track = tx.tryTrack(entry.nodeId);
    if (track === undefined) {
      if (reportMissing) failures.push({ kind: "node-missing", nodeId: entry.nodeId });
      retire(entry);
      return;
    }
    try {
      track.overrideValues(values);
    } catch (cause) {
      failures.push({ kind: "write-refused", nodeId: entry.nodeId, cause });
      retire(entry);
      // A batch is not atomic. Clear an earlier successful overlay even when this write refused.
      // Do not retry a failed release, but do report a second failure if recovery itself refuses.
      if (values !== RELEASE) {
        try {
          track.overrideValues(RELEASE);
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
            writes.push({ entry, values: step.values });
            break;
          case "release":
            writes.push({ entry, values: RELEASE });
            break;
          default:
            unreachable(step);
        }
      } catch (cause) {
        failures.push({ kind: "step-threw", nodeId: entry.nodeId, cause });
        retire(entry);
        writes.push({ entry, values: RELEASE });
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

  const subscription = clock.subscribe((tick) => {
    if (stopped) return;
    if (dispatching) throw new Error("Runner clock dispatch is already in flight.");
    dispatching = true;
    try {
      dispatch(tick);
    } finally {
      dispatching = false;
    }
  });
  if (stopped) subscription();
  else unsubscribe = subscription;

  return () => {
    if (stopped) return;
    // Cleanup would otherwise open a second batch from step, disposal or a failure callback.
    // Refuse before any state transition; the caller can retry after dispatch has returned.
    if (dispatching) throw new Error("Runner disposal cannot run during clock dispatch.");
    stop();
    const entries = [...live];
    for (const entry of entries) retire(entry);
    const failures: RunnerFailure[] = [];
    const errors: unknown[] = [];
    if (entries.length > 0) {
      try {
        project.values((tx) => {
          for (const entry of entries) applyWrite(tx, { entry, values: RELEASE }, failures, false);
        });
      } catch (error) {
        errors.push(error);
      }
    }
    disposeRetired(failures);
    errors.push(...report(failures));
    if (errors.length > 0) throw errors[0];
  };
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

/** The only owner of runner failure wording. Causes remain available without coercing caller data. */
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

/** `undefined` means empty, so it is not an offerable value; wrap optional results in a record. */
export interface LatestSlot<T extends {} | null> {
  offer(value: T): void;
  take(): T | undefined;
}

/** Bounded storage for an asynchronous producer: latest offered value wins, take consumes once. */
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
