import type { MotionDefinition, TrackDefinition, TriggerSignal } from "../contract/v5";
import type { LiveValues } from "../contract/track-handle";
import type { ResolvedPlugins, TrackConfigView } from "../domain/plugins";
import type { LiveWriteResult } from "../domain/track";

/**
 * Every seam a loaded project reaches, as four total records rather than fifteen maybe-functions.
 *
 * `ProjectRuntime` held one field per hook, each typed `T | undefined`, and asked at every call site
 * whether the host had installed it. So `?.` was load-bearing in nineteen places, and what a missing
 * seam does was answered nineteen times: usually nothing, sometimes `undefined` standing for a
 * decision further down, and in two cases a `void` a reader could not branch on at all. Whether a
 * seam exists is a question the constructor can answer once, and every answer after that is a call.
 *
 * So the optionality stops at construction. `NO_PORTS` is the one statement of what an uninstalled
 * seam does, the runtime reads each option against it exactly once, and no member of any port below
 * is optional. The four groups are the four owners: what a compiled Track costs, what a Motion owns
 * that no node carries, what a live value write reaches, and what belongs to the host itself.
 *
 * The public option surface does not move and cannot: `ProjectRuntimeOptions` is what a caller
 * writes, its members stay optional there, and this is what the runtime holds instead of holding
 * them. Two shapes, one direction, and the seam types themselves live here rather than there so a
 * port can name them without importing the runtime that calls it.
 *
 * Issue #443, phase A step 7. See ADR-059, ADR-060, ADR-061, ADR-062, ADR-066 and ADR-067.
 */

/**
 * A replacement already installed by the staging seam, with its displaced Track held for rollback.
 *
 * Before commit starts, rollback restores the displaced Track and releases the replacement.
 * Commit finalizes adoption and releases the displaced Track; that release can throw after the
 * replacement became irreversible. A throwing commit is not a promise that rollback can restore
 * a usable old Track. The staging seam owns cleanup if it throws before returning this handle.
 */
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}

/**
 * The one seam by which a live value reaches the compiled Track this runtime does not own.
 *
 * One hook, because there is one mechanism, and what separates `setValues` from `overrideValues` is
 * the retained definition, which is ADR-060's. `undefined` for the overlay is a write no animated
 * key is involved in, which keeps a static-only write on the path it was already on. See ADR-059
 * and ADR-060.
 */
export type LiveValueWriter = (
  nodeId: string,
  values: LiveValues,
  overlay: Readonly<Record<string, unknown>> | undefined,
  rebase: boolean,
) => LiveWriteResult | undefined;

/**
 * How this layer asks what an authored record resolves to.
 *
 * One hook, one implementation: `PluginRegistry.resolveForKeyframes` stays the only owner of key
 * ownership, slot declaration and the plugin chain, and this runtime depends on a function rather
 * than on a registry it has no other reason to hold. See ADR-062.
 */
export type KeyframeResolver = (
  keyframes: Readonly<Record<string, unknown>>,
  path: string,
  track: TrackConfigView,
) => ResolvedPlugins;

/**
 * The resolver as a port: the same question, with the answer a project holding no registry gives.
 *
 * `undefined` is not an error and not an empty resolution. It means nothing here can judge the
 * record, so every replacement builds, which is what keeps a registry-free rig byte-identical.
 * Spelled through `Parameters` so the argument list still has exactly one owner above. See ADR-062.
 */
export type OptionalKeyframeResolver = (
  ...args: Parameters<KeyframeResolver>
) => ResolvedPlugins | undefined;

/** What one node's compiled Track costs: building it, replacing it, and releasing it. */
export interface TrackPort {
  readonly compile: (track: TrackDefinition, nodeId?: string) => void;
  readonly dispose: (nodeId: string) => void;
  readonly stage: (track: TrackDefinition, nodeId: string) => StagedTrack | undefined;
}

/**
 * Everything a Motion owns that no node carries, including the two tier 0 seams.
 *
 * `replaceTrigger` and `setStagger` answer an optional completion rather than nothing, because a
 * trigger carries a disposable resource behind it and a stagger does not, and returning means
 * acceptance in both cases. Throwing before returning means refusal and the supplier owns cleanup.
 * See ADR-061 and issues #340 and #341.
 */
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

/** The two seams a value write reaches, neither of which touches the graph. */
export interface ValuePort {
  readonly write: LiveValueWriter;
  readonly seek: (nodeId: string, progress: number) => void;
}

/** The two seams that belong to the host rather than to any node or Motion. */
export interface HostPort {
  readonly resolveKeyframes: OptionalKeyframeResolver;
  readonly disposeComposition: () => void;
}

/** The four ports one project holds, grouped by owner and never by which option declared them. */
export interface ProjectPorts {
  readonly track: TrackPort;
  readonly motion: MotionPort;
  readonly value: ValuePort;
  readonly host: HostPort;
}

/**
 * What an uninstalled seam does, stated once.
 *
 * One function for all fifteen, because doing nothing and answering nothing are the same statement
 * in every one of these positions: a port that returns `void` ignores it, a port that answers a
 * stage or a completion or a resolution reads it as absent, and the readers of that absence already
 * own what it means. Frozen at both levels, and the source the runtime reads its own defaults from,
 * so a seam added later has one place to say what its absence does.
 */
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
  value: Object.freeze<ValuePort>({ write: NOTHING, seek: NOTHING }),
  host: Object.freeze<HostPort>({ resolveKeyframes: NOTHING, disposeComposition: NOTHING }),
});

/**
 * One seam a host installed, applied to the host that was handed the option, or the absent answer.
 *
 * Two questions with one owner, because every one of the fifteen seams asks them together: whether
 * an option was installed at all, and what an installed one is called on. The first is why this
 * module exists. The second is what a port record would otherwise have changed by existing. A hook
 * used to be held as a field and reached as `this.#hook?.(...)`, so an ordinary method-style host
 * function read the runtime as its receiver; reached off a frozen port record it would read that
 * record instead. Nothing relies on it, every hook in this repository being an arrow or already
 * bound, but it is public callback behaviour and this slice moves nothing observable, so the receiver
 * is applied where the seam is resolved rather than left to whichever object the call is written on.
 *
 * `bind` rather than a wrapper that forwards, and the second reason is the one that decided it. The
 * receiver is fixed once, where the seam is resolved, instead of at each of the calls that follow. And
 * `Function.prototype.apply` takes a mutable tuple, so a forwarding wrapper cannot hand it an `Args`
 * constrained to `readonly unknown[]`; widening the constraint to reach it would let a caller past a
 * seam signature this module is the whole owner of. Binding needs neither.
 *
 * `absent` is the seam's own entry in `NO_PORTS` at each of the thirteen sites that resolves an
 * option directly, so a member wired to the wrong default is a mismatched pair on one line rather
 * than a silent agreement between two, and the evidence for it can be a set rather than a count. The
 * two normalized completions reach the same no-op one indirection out, through `completing`.
 */
export function installed<Args extends readonly unknown[], R>(
  host: object,
  hook: ((...args: Args) => R) | undefined,
  absent: (...args: Args) => R,
): (...args: Args) => R {
  return hook === undefined ? absent : hook.bind(host);
}

/**
 * What a tier 0 hook actually answered, read as the completion step it earns rather than as a value.
 *
 * `void | (() => void)` is what the two tier 0 options declare, and `void` is not a value a reader
 * may branch on, so a reader that wrote `complete?.()` was relying on a type it had been handed
 * loosely. Three answers are reachable. A host that answered nothing, by either spelling, answered
 * no step. A host that answered a function answered that function.
 *
 * A host that answered a defined non-function answered neither, and discarding it is not the
 * conservative reading it looks like. `complete?.()` reached that value and threw a `TypeError` at
 * the settlement step that ran it, after the definition had already been adopted, so discarding it
 * lets an operation succeed where it used to fail and drops that failure out of the settlement's
 * error sequence with it. So the step is answered and the step is that same call: the throw stays
 * where it was thrown, and every reader still branches on a step or nothing rather than on a `void`.
 */
function completionStep(complete: unknown): (() => void) | undefined {
  if (complete === undefined || complete === null) return undefined;
  if (typeof complete === "function") return complete as () => void;
  const uncallable = complete as () => void;
  return () => uncallable();
}

/**
 * One seam that may answer a completion, on the host that was handed it, normalized to a step.
 *
 * `installed` owns the receiver and the absence, `completionStep` owns what came back, so neither
 * question is answered twice and an absent hook reaches the same reader a hook returning nothing
 * does. See ADR-061.
 */
export function completing<Args extends readonly unknown[]>(
  host: object,
  hook: ((...args: Args) => void | (() => void)) | undefined,
): (...args: Args) => (() => void) | undefined {
  const call = installed<Args, unknown>(host, hook, NOTHING);
  return (...args: Args) => completionStep(call(...args));
}
