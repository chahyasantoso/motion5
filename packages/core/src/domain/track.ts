import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
import { liveWriteChannel, readAuthoredLeaf } from "../contract/authored-leaf";
import type { LiveValues } from "../contract/track-handle";
import {
  PATCHED,
  RECOMPILE,
  type InterpolationTimeline,
  type Interpolator,
  type PatchKeysResult,
} from "../ports/interpolator";
import { unreachable } from "../lang/exhaustive";
import type { PluginInputs, RequirementInputs, ResolvedPlugins } from "./plugins";
import { isLegacyComposeDefinition } from "./legacy-compose";
import { CompositionOutputError } from "./composition-error";
import { publishableValues } from "./publication";
import {
  executeTrackOperations,
  disposeRetiredStates,
  type LegacyComposeChain,
  type TrackCandidate,
  type TrackSnapshot,
} from "./track-operations";

export { CompositionOutputError };
export type { TrackSnapshot };

import type { TrackExecutionPlan } from "./execution-plan";
import type { EvaluatorServices } from "./cache";
import type { CompilerEntryKey } from "../contract/address";

export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly plugins?: ResolvedPlugins;
  readonly plan?: TrackExecutionPlan;
  readonly services?: EvaluatorServices;
  readonly nodeId: string;
}
/** Why one key of a live value write was refused. One reason per key, never a list. */
export type LiveValueRefusal = "unknown" | "kind" | "prepared";
/**
 * What one live value write reports back to the owner of the retained definition.
 *
 * The interpolation seam's closed result and the playhead this track is holding. The result travels
 * unchanged to the runtime owner that decides whether a replacement is owed; Track owns validation
 * and forwarding, not a second boolean interpretation of the port answer. See ADR-060.
 */
export interface LiveWriteResult {
  readonly patch: PatchKeysResult;
  readonly progress: number;
}
/**
 * The message for one refusal, so the error itself holds no branch.
 *
 * Three reasons and they are the whole set. `"animated"` is gone: with both entry points lifted and
 * a declining backend escalating rather than refusing, no code path can produce it, and a union
 * member is removed and then refused rather than left declared. See ADR-060.
 */
function describeRefusal(nodeId: string, key: string, reason: LiveValueRefusal): string {
  switch (reason) {
    case "kind":
      return `Key "${key}" of track "${nodeId}" cannot change which kind of leaf it is.`;
    case "prepared":
      return `Key "${key}" of track "${nodeId}" is prepared by a plugin and cannot be written live.`;
    case "unknown":
      return `Key "${key}" is not an authored value of track "${nodeId}".`;
    default:
      return unreachable(reason);
  }
}
/**
 * The one refusal a live value write reports.
 *
 * `TypeError` is the parent for the reason `StaleTrackHandleError` gives: every existing narrowing
 * of a bad argument keeps matching, and the named type is a narrowing rather than a break. `ruleId`
 * is what a caller branches on, carried on the instance as well as the constructor so a caught
 * value answers without the class in scope.
 *
 * `unknown` is a key the authored record does not have, which is one answer for an unknown name, a
 * key another plugin owns, a namespaced `:` key, and an interpolator scratch `_` key: ownership was
 * settled at resolve time and neither reserved spelling can be authored, so a key that reached
 * `authoredKeyframes` has an owner by construction. `kind` is a leaf shape change, which is a
 * recompile of a different shape rather than a write. `prepared` is a key a plugin already decided
 * the value of, refused rather than silently inverting that precedence. See ADR-059 and ADR-060.
 */
export class LiveValueKeyError extends TypeError {
  static readonly ruleId = "live-value-key";
  readonly ruleId: string = LiveValueKeyError.ruleId;
  /** The qualified node id whose values were being written. */
  readonly nodeId: string;
  /** The one key that was refused. */
  readonly key: string;
  readonly reason: LiveValueRefusal;
  constructor(nodeId: string, key: string, reason: LiveValueRefusal) {
    super(describeRefusal(nodeId, key, reason));
    this.name = "LiveValueKeyError";
    this.nodeId = nodeId;
    this.key = key;
    this.reason = reason;
  }
}
function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function preparedConfig(config: unknown, plugins: ResolvedPlugins): unknown {
  if (!isRecord(config)) return config;
  const preparation = plugins.preparation;
  const authoredKeyframes = isRecord(config.keyframes) ? config.keyframes : {};
  const keyframes = { ...authoredKeyframes, ...preparation.keyframes };
  return Object.freeze({
    ...config,
    keyframes: Object.freeze(keyframes),
    tweenVars: preparation.tweenVars,
  });
}
// Underscore keys are interpolator scratch and are dropped before the plugin chain runs. This is
// deliberately not the same rule as `publishableValues`: a namespaced key must survive the chain so
// plugins can read each other's, and an underscore key invented by a plugin must still fail
// `isRendererNeutral` loudly rather than be quietly hidden here.
function rendererNeutralState(state: Readonly<Record<string, unknown>>): ImmutableRecord {
  if (!isRecord(state))
    throw new CompositionOutputError("Interpolator state must be a renderer-neutral record.");
  const values: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(state)) if (!key.startsWith("_")) values[key] = value;
  return values as ImmutableRecord;
}
function freezeComposition(values: unknown): ImmutableRecord {
  if (!isRecord(values))
    throw new CompositionOutputError("Composition output must be a renderer-neutral record.");
  try {
    return freezeValue(values as ImmutableRecord);
  } catch (error) {
    throw new CompositionOutputError(
      `Composition output is not renderer-neutral: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
/**
 * Identity first, then structure.
 *
 * Both halves of the memo key are compared through this, so neither can drift into a cheaper or a
 * stricter test than the other. Identity alone would never hold for a seed, because `compose`
 * builds a fresh record on every tick.
 */
function unchanged(left: unknown, right: unknown): boolean {
  return left === right || equalValues(left, right);
}
/** Every disposal failure in one message; naming only the first hides the rest. */
function describeFailures(failures: readonly unknown[]): string {
  return failures
    .map((failure) => (failure instanceof Error ? failure.message : String(failure)))
    .join("; ");
}
const NO_PLUGIN_INPUTS: PluginInputs = Object.freeze({});
const NO_REQUIREMENT_INPUTS: RequirementInputs = Object.freeze({});
/** No mask. One frozen value, so "no live values" allocates nothing and compares by identity. */
const NO_VALUES: ImmutableRecord = Object.freeze({});
const EMPTY_RESOLVED_PLUGINS: ResolvedPlugins = Object.freeze({
  plugins: Object.freeze([]),
  diagnostics: Object.freeze([]),
  authoredKeyframes: Object.freeze({}),
  requirements: Object.freeze([]),
  internalKeys: Object.freeze([]),
  outputSerializers: Object.freeze({}),
  preparation: Object.freeze({ keyframes: Object.freeze({}), tweenVars: Object.freeze({}) }),
});
export class Track {
  readonly #timeline: InterpolationTimeline;
  readonly #plugins: ResolvedPlugins;
  readonly #plan: TrackExecutionPlan | undefined;
  readonly #services: EvaluatorServices | undefined;
  readonly #nodeId: string;
  #committedStates: ReadonlyMap<CompilerEntryKey, unknown> = new Map();
  #progress = 0;
  #dirty = true;
  #disposed = false;
  #values: ImmutableRecord = NO_VALUES;
  #lastSnapshot: TrackSnapshot | undefined;
  #lastSeed: ImmutableRecord | undefined;
  #lastRequirementInputs: RequirementInputs | undefined;
  constructor(options: TrackOptions) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.#plugins = options.plugins ?? EMPTY_RESOLVED_PLUGINS;
    this.#plan = options.plan;
    this.#services = options.services;
    this.#nodeId = options.nodeId;
    this.#timeline = options.interpolator.create(
      preparedConfig(options.interpolationConfig, this.#plugins),
    );
  }
  get progress(): number {
    return this.#progress;
  }
  get nodeId(): string {
    return this.#nodeId;
  }
  get dirty(): boolean {
    return this.#dirty;
  }
  /**
   * The resolved plugin chain this track compiled from.
   *
   * A read of what the constructor was handed, so the compiled Track stays the single owner of it. A
   * caller that cached the resolve result in a map beside `tracks` would keep the metadata of a
   * replacement a staged rollback threw away; asking the live track cannot. See ADR-073.
   */
  get plugins(): ResolvedPlugins {
    return this.#plugins;
  }
  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#timeline.progress(next);
    this.#progress = next;
    this.#dirty = true;
    return true;
  }
  /**
   * Writes `values` as this track's mask and `overlay` as the animated keys the interpolator is to
   * rebuild, and reports whether the rebuild happened.
   *
   * One method and one semantics. It does not know whether it is applying a caller's override or a
   * rewritten authored value, because at this layer there is no difference: the difference is
   * whether the retained `TrackDefinition` moved, and `ProjectRuntime` is the only owner of that.
   * `rebase` is therefore forwarded untouched rather than interpreted here.
   *
   * Every key of both halves is classified before anything is assigned, so a refused key in a call
   * that also named a legal one leaves the mask, the timeline, and this track's progress exactly as
   * they were.
   *
   * `overlay` is `undefined` for a write in which no animated key is involved and none was involved
   * in the last one, and that is what keeps a static-only write on exactly the path it was on: no
   * whole-record recompile and no capability lookup. An empty overlay is not the same as an absent
   * one. It is the revert, and it is honored by the same call that honors a changed key.
   *
   * The mask is replaced wholesale rather than accumulated, so an empty record is no mask at all,
   * and frozen rather than retained by reference, so a caller that keeps mutating its own object
   * cannot move this track's values behind the memo's back. See ADR-059 and ADR-060.
   */
  writeValues(
    values: LiveValues,
    overlay: Readonly<Record<string, unknown>> | undefined,
    rebase: boolean,
  ): LiveWriteResult {
    this.assertActive();
    const accepted = this.#acceptedValues(values);
    const animated = overlay === undefined ? undefined : this.#acceptedOverlay(overlay);
    this.#values = accepted;
    this.#dirty = true;
    const patch = animated === undefined ? PATCHED : this.#patch(animated, rebase);
    return { patch, progress: this.#progress };
  }
  /**
   * Every static key of a live write, answered by the two owners that already exist.
   *
   * `authoredKeyframes` is the flattened authored record the resolver produced, so presence in it is
   * the whole of the unknown-key question: a key another plugin owns, a namespaced key, and an
   * interpolator scratch key are all absent from it, and ownership was settled at resolve time.
   * `liveWriteChannel` is the one function allowed to say which channel a leaf's key travels on,
   * which is the whole of the kind question and is the same answer `#acceptedOverlay` reads below.
   * This class therefore holds no registry, reimplements no ownership predicate, and no longer
   * spells the channel rule twice in opposite directions.
   *
   * A scalar for an animated key is refused rather than masked, and that is the invariant this class
   * still enforces: the mask shadows the timeline at every progress, so accepting one would be the
   * permanently frozen animation ADR-059 refuses. What changed is the answer for such a key, not
   * the refusal: it moves through the overlay instead.
   */
  #acceptedValues(next: LiveValues): ImmutableRecord {
    if (this.#plan) {
      const accepted: Record<string, Record<string, unknown>> = {};
      for (const [entryId, entryWrites] of Object.entries(next)) {
        if (!this.#plan.entriesById.has(entryId)) {
          throw new LiveValueKeyError(this.#nodeId, entryId, "unknown");
        }
        const entryPlan = this.#plan.entriesById.get(entryId)!;
        if (!isRecord(entryWrites)) {
          throw new LiveValueKeyError(this.#nodeId, entryId, "unknown");
        }
        const entryAccepted: Record<string, unknown> = {};
        for (const [leaf, value] of Object.entries(entryWrites)) {
          if (!Object.hasOwn(entryPlan.schema.values, leaf)) {
            throw new LiveValueKeyError(this.#nodeId, leaf, "unknown");
          }
          if (liveWriteChannel(readAuthoredLeaf(entryPlan.schema.values[leaf]!)) !== "mask") {
            throw new LiveValueKeyError(this.#nodeId, leaf, "kind");
          }
          entryAccepted[leaf] = value;
        }
        accepted[entryId] = Object.freeze(entryAccepted);
      }
      if (Object.keys(accepted).length === 0) return NO_VALUES;
      return freezeValue(accepted as ImmutableRecord);
    }
    const authored = this.#plugins.authoredKeyframes;
    const accepted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(next)) {
      if (isRecord(value)) {
        accepted[key] = value;
        continue;
      }
      if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(this.#nodeId, key, "unknown");
      if (liveWriteChannel(readAuthoredLeaf(authored[key])) !== "mask")
        throw new LiveValueKeyError(this.#nodeId, key, "kind");
      accepted[key] = value;
    }
    if (Object.keys(accepted).length === 0) return NO_VALUES;
    return freezeValue(accepted as ImmutableRecord);
  }
  /**
   * Every animated key of a live write, answered by the three owners that already exist.
   *
   * `authoredKeyframes` answers presence, `liveWriteChannel` answers which channel the key was
   * authored onto, and `preparation.keyframes` answers whether a plugin already decided this key's
   * value. `Track` gains no knowledge of which keys are compiled: those three already answer it,
   * and a second answer would be one that can disagree.
   *
   * A prepared key is refused because `preparedConfig` merges the plugin's keyframes over the
   * authored ones, while an overlay sits over the base, so patching one would invert that
   * precedence and make the live timeline disagree with the next real recompile.
   */
  #acceptedOverlay(overlay: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
    if (this.#plan) {
      const accepted: Record<string, Record<string, unknown>> = {};
      for (const [entryId, entryWrites] of Object.entries(overlay)) {
        if (!this.#plan.entriesById.has(entryId)) {
          throw new LiveValueKeyError(this.#nodeId, entryId, "unknown");
        }
        const entryPlan = this.#plan.entriesById.get(entryId)!;
        if (!isRecord(entryWrites)) {
          throw new LiveValueKeyError(this.#nodeId, entryId, "unknown");
        }
        const entryAccepted: Record<string, unknown> = {};
        for (const [leaf, value] of Object.entries(entryWrites)) {
          if (
            entryPlan.contribution?.keyframes &&
            Object.hasOwn(entryPlan.contribution.keyframes, leaf)
          ) {
            throw new LiveValueKeyError(this.#nodeId, leaf, "prepared");
          }
          if (!Object.hasOwn(entryPlan.schema.values, leaf)) {
            throw new LiveValueKeyError(this.#nodeId, leaf, "unknown");
          }
          if (liveWriteChannel(readAuthoredLeaf(entryPlan.schema.values[leaf]!)) !== "timeline") {
            throw new LiveValueKeyError(this.#nodeId, leaf, "kind");
          }
          entryAccepted[leaf] = value;
        }
        accepted[entryId] = Object.freeze(entryAccepted);
      }
      return Object.freeze(accepted);
    }
    const authored = this.#plugins.authoredKeyframes;
    const prepared = this.#plugins.preparation.keyframes;
    const accepted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(overlay)) {
      if (isRecord(value)) {
        accepted[key] = value;
        continue;
      }
      if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(this.#nodeId, key, "unknown");
      if (liveWriteChannel(readAuthoredLeaf(authored[key])) !== "timeline")
        throw new LiveValueKeyError(this.#nodeId, key, "kind");
      if (Object.hasOwn(prepared, key)) throw new LiveValueKeyError(this.#nodeId, key, "prepared");
      accepted[key] = value;
    }
    return accepted;
  }
  /**
   * Hands the animated half to the interpolator, if it declared the capability.
   *
   * The whole of the optional member at this layer, and no branch on which backend it is. A
   * declining backend's `recompile` result is forwarded unchanged to the runtime owner that
   * owns escalation, so Track learns that a capability exists and never that it is GSAP.
   */
  #patch(overlay: Readonly<Record<string, unknown>>, rebase: boolean): PatchKeysResult {
    const timeline = this.#timeline;
    if (timeline.patchKeys === undefined) return RECOMPILE;
    return timeline.patchKeys(overlay, rebase) ?? RECOMPILE;
  }
  /**
   * This track's interpolated, renderer-neutral state, before any plugin runs.
   *
   * Readable on its own because a value with no dependency on composition order should not have to
   * be reached through one. `#timeline.state` is written by `setProgress`, which the owning `Motion`
   * runs for every one of its tracks before a flush begins, so every track's interpolated state is
   * already determined when the first node composes. Reading another track's state is therefore not
   * reading a downstream node's output: it needs no edge and it can introduce no cycle.
   *
   * A read rather than a composition. No plugin runs, nothing is memoized, and the track is not
   * marked clean, so a caller cannot make a track look composed by asking it what it interpolated.
   *
   * The live value mask is applied here, after renderer-neutral filtering and before any caller
   * sees the record. That placement is the whole of the slice: this one read is what ordinary
   * composition, `composeFrom`, and the publisher's `MemberState` all go through, so a masked value
   * cannot reach one of them and miss another. An animated live value is not here at all, and that
   * is the point: it is on the timeline, so `state` already carries it. See ADR-059 and ADR-060.
   */
  interpolated(): ImmutableRecord {
    this.assertActive();
    const interpolated = rendererNeutralState(this.#timeline.state);
    if (this.#values === NO_VALUES) return interpolated;
    if (this.#plan) {
      const merged: Record<string, unknown> = { ...interpolated };
      for (const [entryId, entryWrites] of Object.entries(this.#values)) {
        if (isRecord(entryWrites)) {
          const base = isRecord(merged[entryId])
            ? (merged[entryId] as Record<string, unknown>)
            : {};
          merged[entryId] = Object.freeze({ ...base, ...entryWrites });
        } else {
          merged[entryId] = entryWrites;
        }
      }
      return freezeValue(merged as ImmutableRecord);
    }
    return { ...interpolated, ...this.#values };
  }
  /**
   * Evaluates this track's entry set and returns a candidate — proposed snapshot and state map.
   *
   * Read-only on committed state: `#committedStates` is not written. The caller decides whether
   * to accept the candidate and call `commit`, or to discard it and leave the track's committed
   * state unchanged. Two callers in the same candidate group may each call `evaluate` without
   * risk of partial commit: a group member that throws during its own `evaluate` does not affect
   * any track that already completed `evaluate` without yet calling `commit`.
   *
   * The memo is consulted: if `seed` and `requirementInputs` match the last committed snapshot,
   * the cached result is returned as a candidate without re-running the executor.
   */
  evaluate(
    seed: ImmutableRecord,
    requirementInputs: RequirementInputs = NO_REQUIREMENT_INPUTS,
  ): TrackCandidate {
    this.assertActive();
    const memoized = this.#memoized(seed, requirementInputs);
    if (memoized !== undefined) {
      return {
        kind: "candidate",
        snapshot: memoized,
        proposedStates: this.#committedStates as ReadonlyMap<CompilerEntryKey, never>,
      } as TrackCandidate;
    }
    if (this.#plan !== undefined) {
      return this.#evaluateWithOperations(seed, requirementInputs, this.#plan);
    }
    // Legacy-compose path (F2 removes this branch).
    let values: ImmutableRecord = seed;
    for (const plugin of this.#plugins.plugins) {
      if (!isLegacyComposeDefinition(plugin)) continue;
      const scoped = requirementInputs[plugin.name] ?? NO_PLUGIN_INPUTS;
      const composed = plugin.compose(values, this.#progress, scoped, this.#nodeId);
      if (!isRecord(composed))
        throw new CompositionOutputError(
          `Plugin "${plugin.name}" must return a renderer-neutral record.`,
        );
      values = composed as ImmutableRecord;
    }
    const snapshot = Object.freeze({
      progress: this.#progress,
      values: freezeComposition(publishableValues(values, this.#plugins.internalKeys)),
    });
    return { kind: "candidate", snapshot, proposedStates: new Map() };
  }

  /**
   * Commits an accepted candidate produced by `evaluate`.
   *
   * Writes `#committedStates`, updates the memo, clears `#dirty`, then calls
   * `disposeRetiredStates` for entries that were replaced. A disposal failure throws after the
   * swap (postcommit delivery error) — the state was committed and the error is surfaced, but
   * the commit itself is not undone. See docs/skeldata/LIFECYCLE.md §4.4.
   *
   * Only `Track.commit` writes `#committedStates`; `evaluate` is read-only on state. That
   * single-owner invariant is what makes the two-phase caller safe.
   */
  commit(
    candidate: TrackCandidate,
    seed?: ImmutableRecord,
    requirementInputs?: RequirementInputs,
  ): TrackSnapshot {
    this.assertActive();
    const retired = this.#committedStates;
    const nextStates = new Map<CompilerEntryKey, unknown>();
    for (const [key, proposal] of candidate.proposedStates) nextStates.set(key, proposal.state);
    this.#committedStates = nextStates;
    this.#lastSnapshot = candidate.snapshot;
    if (seed !== undefined) this.#lastSeed = Object.freeze({ ...seed });
    if (requirementInputs !== undefined)
      this.#lastRequirementInputs = Object.freeze({ ...requirementInputs });
    this.#dirty = false;
    if (this.#plan !== undefined) {
      const failures = disposeRetiredStates(this.#plan, retired, candidate.proposedStates);
      if (failures.length > 0) {
        throw new Error(
          `Track "${this.#nodeId}" committed but disposing a retired state failed: ${describeFailures(failures)}`,
        );
      }
    }
    return candidate.snapshot;
  }

  /**
   * Composes this track's values, then runs the plugin chain over them.
   *
   * One parameter, and it is the plugin-owned scope: each plugin receives only the slots it
   * declared, so a source's `rotation` reaches `fk` as `inputs.base.rotation` while the bone's
   * authored `rotation` stays `values.rotation`. They are distinguished by where they live rather
   * than by being spelled differently, which is why `fkPlugin` needs no `parentRotation`.
   *
   * There is no flat bag beside it. The generic `observes` channel that used to fill one declares
   * output edges only, so nothing merges an upstream value into the authored namespace and no
   * parameter exists to merge one with. See ADR-044 and ADR-047.
   *
   * It is `composeFrom(this.interpolated(), …)` and nothing else: one line, no second short-circuit
   * of its own, so the two entry points cannot answer differently or memoize separately.
   */
  compose(requirementInputs: RequirementInputs = NO_REQUIREMENT_INPUTS): TrackSnapshot {
    return this.composeFrom(this.interpolated(), requirementInputs);
  }
  /**
   * Shim: evaluate + immediate commit.
   *
   * Preserved for all existing test callers and for the legacy-compose path while F2 is pending.
   * The Engine publisher path calls `evaluate` then `commit` separately so it can batch the
   * accept/reject decision across a candidate group before any commit fires. Once the publisher
   * path is wired and the legacy-compose channel is removed (F2), this method is deleted.
   * Until then, treat it as test-only backwards-compat.
   */
  composeFrom(
    seed: ImmutableRecord,
    requirementInputs: RequirementInputs = NO_REQUIREMENT_INPUTS,
  ): TrackSnapshot {
    this.assertActive();
    const candidate = this.evaluate(seed, requirementInputs);
    // Memo hit: nothing to commit, snapshot is already current.
    if (
      this.#memoized(seed, requirementInputs) !== undefined &&
      candidate.proposedStates === (this.#committedStates as ReadonlyMap<CompilerEntryKey, never>)
    ) {
      return candidate.snapshot;
    }
    return this.commit(candidate, seed, requirementInputs);
  }
  /** The operations-path implementation of evaluate: runs the executor and returns a candidate. */
  #evaluateWithOperations(
    seed: ImmutableRecord,
    requirementInputs: RequirementInputs,
    plan: TrackExecutionPlan,
  ): TrackCandidate {
    const legacyCompose = this.#legacyChain();
    const result = executeTrackOperations({
      plan,
      seed,
      sampleValues: this.#sampleValues(seed, plan),
      requirementInputs,
      progress: this.#progress,
      ...(this.#services === undefined ? {} : { services: this.#services }),
      committedStates: this.#committedStates,
      ...(legacyCompose === undefined ? {} : { legacyCompose }),
    });
    const snapshot = Object.freeze({
      progress: this.#progress,
      values: result.publishedValues as ImmutableRecord,
    });
    return { kind: "candidate", snapshot, proposedStates: result.proposedStates };
  }
  #sampleValues(
    seed: ImmutableRecord,
    plan: TrackExecutionPlan,
  ): ReadonlyMap<string, Readonly<Record<string, unknown>>> {
    const samples = new Map<string, Readonly<Record<string, unknown>>>();
    for (const entry of plan.entries) {
      const values: Record<string, unknown> = {};
      for (const leaf of Object.keys(entry.schema.values)) {
        if (Object.hasOwn(seed, leaf)) values[leaf] = seed[leaf];
      }
      const indexed = seed[entry.entryId];
      if (isRecord(indexed)) Object.assign(values, indexed);
      samples.set(entry.entryId, Object.freeze(values));
    }
    return samples;
  }
  /** F2 deletes this legacy chain with the compose channel. */
  #legacyChain(): LegacyComposeChain | undefined {
    const legacy = this.#plugins.plugins.filter(isLegacyComposeDefinition);
    if (legacy.length === 0) return undefined;
    return Object.freeze({
      nodeId: this.#nodeId,
      plugins: Object.freeze(
        legacy.map((plugin) => Object.freeze({ name: plugin.name, compose: plugin.compose })),
      ),
      internalKeys: this.#plugins.internalKeys,
    });
  }
  /**
   * The retained snapshot, when it is the answer for exactly this seed and these inputs.
   *
   * Copies of both keys are kept rather than the caller's own objects, so a seed mutated after the
   * fact cannot turn a stale snapshot into a memo hit.
   */
  #memoized(
    seed: ImmutableRecord,
    requirementInputs: RequirementInputs,
  ): TrackSnapshot | undefined {
    if (this.#dirty || this.#lastSnapshot === undefined) return undefined;
    if (this.#lastSeed === undefined || this.#lastRequirementInputs === undefined) return undefined;
    if (!unchanged(this.#lastSeed, seed)) return undefined;
    if (!unchanged(this.#lastRequirementInputs, requirementInputs)) return undefined;
    return this.#lastSnapshot;
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#timeline.kill();
    const failures =
      this.#plan === undefined
        ? []
        : disposeRetiredStates(this.#plan, this.#committedStates, new Map());
    this.#committedStates = new Map();
    this.#lastSnapshot = undefined;
    this.#lastSeed = undefined;
    this.#lastRequirementInputs = undefined;
    if (failures.length > 0) {
      throw new Error(
        `Track "${this.#nodeId}" was disposed but releasing a plugin state failed: ${describeFailures(failures)}`,
      );
    }
  }
  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
