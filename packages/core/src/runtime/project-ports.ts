import type { MotionDefinition, TrackDefinition, TriggerSignal, Value } from "../contract/v5";
import type { ParsedValues } from "../contract/v5-parse";

/** Every seam a loaded project reaches: four records, no optional member, grouped by owner —
 * Track, Motion, value, host. `NO_PORTS` states each absence once. */

/** Staged replacement plus displaced Track kept for rollback; `commit` finalizes and may throw
 * once irreversible, past rollback's reach. */
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}

/** Three seams a value edit reaches, none touching graph: rewrite evaluator values, overlay one
 * value or drop it, move playhead. */
export interface ValuePort {
  readonly rewrite: (nodeId: string, values: ParsedValues) => void;
  readonly overlay: (nodeId: string, value: Value | undefined) => void;
  readonly seek: (nodeId: string, progress: number) => void;
}

/** What a node's compiled Track costs: build, replace, release. */
export interface TrackPort {
  readonly compile: (track: TrackDefinition, nodeId?: string) => void;
  readonly dispose: (nodeId: string) => void;
  readonly stage: (track: TrackDefinition, nodeId: string) => StagedTrack | undefined;
}

/** Everything a Motion owns that no node carries. `replaceTrigger` and `setStagger` answer an
 * optional completion: returning accepts, throwing refuses, supplier owns cleanup. */
export interface MotionPort {
  readonly create: (definition: MotionDefinition) => void;
  readonly destroy: (motionId: string) => void;
  readonly addTrack: (motionId: string, trackId: string, duration?: number) => void;
  readonly replaceTrack: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeTrack: (motionId: string, trackId: string) => void;
  readonly replaceTrigger: (
    motionId: string,
    definition: MotionDefinition,
  ) => (() => void) | undefined;
  readonly setStagger: (motionId: string, stagger?: number) => (() => void) | undefined;
  readonly signal: (motionId: string, signal: TriggerSignal) => void;
}

/** Seams a value edit reaches: rewrite, overlay, seek. */
export interface ValuePort {
  /** Replaces authored values one compiled Track evaluates, no rebuild — cheap tier's only host
   * seam. No Track: nothing; later mount compiles them. */
  readonly rewrite: (nodeId: string, values: ParsedValues) => void;
  /** Overlays one evaluated value on the compiled Track; `undefined` drops it. */
  readonly overlay: (nodeId: string, value: Value | undefined) => void;
  readonly seek: (nodeId: string, progress: number) => void;
}

/** Seam owned by the host, not a node or Motion. */
export interface HostPort {
  readonly disposeComposition: () => void;
}

/** The four ports one project holds, grouped by owner, not by declaring option. */
export interface ProjectPorts {
  readonly track: TrackPort;
  readonly motion: MotionPort;
  readonly value: ValuePort;
  readonly host: HostPort;
}

/** What an uninstalled seam does, once for all sixteen: a `void` port ignores it, a completion
 * or stage reads it absent. Frozen at both levels. */
const NOTHING = (): undefined => undefined;

export const NO_PORTS: ProjectPorts = Object.freeze({
  track: Object.freeze<TrackPort>({ compile: NOTHING, dispose: NOTHING, stage: NOTHING }),
  motion: Object.freeze<MotionPort>({
    create: NOTHING,
    destroy: NOTHING,
    addTrack: NOTHING,
    replaceTrack: NOTHING,
    removeTrack: NOTHING,
    replaceTrigger: NOTHING,
    setStagger: NOTHING,
    signal: NOTHING,
  }),
  value: Object.freeze<ValuePort>({ rewrite: NOTHING, overlay: NOTHING, seek: NOTHING }),
  host: Object.freeze<HostPort>({ disposeComposition: NOTHING }),
});

/** One installed seam, bound once to the host given the option; `absent` is that seam's own
 * `NO_PORTS` entry, so a wrong default shows on one line. */
export function installed<Args extends readonly unknown[], R>(
  host: object,
  hook: ((...args: Args) => R) | undefined,
  absent: (...args: Args) => R,
): (...args: Args) => R {
  return hook === undefined ? absent : hook.bind(host);
}

/** A hook's answer as a completion step: undefined/null → none, function → itself, any other
 * value → a step that throws when called, as calling it did. */
function completionStep(complete: unknown): (() => void) | undefined {
  if (complete === undefined || complete === null) return undefined;
  if (typeof complete === "function") return complete as () => void;
  const uncallable = complete as () => void;
  return () => uncallable();
}

/** A completion-answering seam on its host, normalized to a step; `installed` owns receiver and
 * absence, `completionStep` owns the answer. */
export function completing<Args extends readonly unknown[]>(
  host: object,
  hook: ((...args: Args) => void | (() => void)) | undefined,
): (...args: Args) => (() => void) | undefined {
  const call = installed<Args, unknown>(host, hook, NOTHING);
  return (...args: Args) => completionStep(call(...args));
}
