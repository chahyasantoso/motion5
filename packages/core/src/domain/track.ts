import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
import { readAuthoredLeaf } from "../contract/authored-leaf";
import type { LiveValues } from "../contract/track-handle";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { PluginInputs, RequirementInputs, ResolvedPlugins } from "./plugins";

export interface TrackSnapshot {
  readonly progress: number;
  readonly values: Readonly<ImmutableRecord>;
}
export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly plugins?: ResolvedPlugins;
  readonly nodeId: string;
}
export class CompositionOutputError extends TypeError {
  readonly ruleId = "composition-output-shape" as const;
  constructor(message: string) {
    super(message);
    this.name = this.ruleId;
  }
}
/** Why one key of a live value write was refused. One reason per key, never a list. */
export type LiveValueRefusal = "unknown" | "kind" | "prepared";
/**
 * What one live value write reports back to the owner of the retained definition.
 *
 * Two facts and no more. `patched` is whether the interpolator honored the animated half, which is
 * the only thing that decides whether the caller has to escalate to a recompile; `progress` is what
 * this track is holding, so an escalation can re-seek a freshly compiled Track without asking a
 * second owner where the playhead was. See ADR-060.
 */
export interface LiveWriteResult {
  readonly patched: boolean;
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
  if (reason === "kind")
    return `Key "${key}" of track "${nodeId}" cannot change which kind of leaf it is.`;
  if (reason === "prepared")
    return `Key "${key}" of track "${nodeId}" is prepared by a plugin and cannot be written live.`;
  return `Key "${key}" is not an authored value of track "${nodeId}".`;
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
/**
 * A key under a plugin's namespace is that plugin's private domain, by rule rather than by
 * declaration. The colon is reserved in every authored keyframe name and in plugin `keys`,
 * `inputs`, `outputs`, and requirement slots, so a namespaced key can only be something a plugin
 * derived for itself. See ADR-041 and ADR-042.
 */
function isNamespacedInternal(key: string): boolean {
  return key.includes(":");
}
/**
 * The one enforcement point for internal keys.
 *
 * It is here, and not in a renderer, because `adapters/dom.ts` is not the only renderer:
 * `packages/react` hands consumers the whole patch. A denylist applied per renderer has to be
 * reimplemented by each of them, and a regression test written against one would pass while the
 * other leaked. Filtering before the snapshot is frozen gives the publisher, `handle.get`,
 * `subscribeNode`, and every adapter the same surface.
 *
 * `internalKeys` stays for unprefixed derived keys, which no rule can recognize. It is the
 * declaration of last resort rather than the mechanism.
 *
 * It runs once per composition, after the chain and before the freeze, whichever entry point the
 * composition arrived through. A seed is filtered by the same call that filters a derived key, so
 * the split adds no second surface to keep in agreement with this one.
 */
function publishableValues(values: ImmutableRecord, plugins: ResolvedPlugins): ImmutableRecord {
  const result: Record<string, unknown> = {};
  const declared = plugins.internalKeys;
  for (const [key, value] of Object.entries(values)) {
    if (isNamespacedInternal(key) || declared.includes(key)) continue;
    result[key] = value;
  }
  return result as ImmutableRecord;
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
  readonly #nodeId: string;
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
    const patched = animated === undefined ? true : this.#patch(animated, rebase);
    return { patched, progress: this.#progress };
  }
  /**
   * Every static key of a live write, answered by the two owners that already exist.
   *
   * `authoredKeyframes` is the flattened authored record the resolver produced, so presence in it is
   * the whole of the unknown-key question: a key another plugin owns, a namespaced key, and an
   * interpolator scratch key are all absent from it, and ownership was settled at resolve time.
   * `readAuthoredLeaf` is the one function allowed to say what shape a leaf has, which is the whole
   * of the kind question. This class therefore holds no registry and reimplements no ownership
   * predicate.
   *
   * A scalar for an animated key is refused rather than masked, and that is the invariant this class
   * still enforces: the mask shadows the timeline at every progress, so accepting one would be the
   * permanently frozen animation ADR-059 refuses. What changed is the answer for such a key, not
   * the refusal: it moves through the overlay instead.
   */
  #acceptedValues(next: LiveValues): ImmutableRecord {
    const authored = this.#plugins.authoredKeyframes;
    const accepted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(next)) {
      if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(this.#nodeId, key, "unknown");
      if (readAuthoredLeaf(authored[key]).kind === "animated")
        throw new LiveValueKeyError(this.#nodeId, key, "kind");
      accepted[key] = value;
    }
    if (Object.keys(accepted).length === 0) return NO_VALUES;
    return freezeValue(accepted as ImmutableRecord);
  }
  /**
   * Every animated key of a live write, answered by the three owners that already exist.
   *
   * `authoredKeyframes` answers presence, `readAuthoredLeaf` answers which kind of leaf the key was
   * authored as, and `preparation.keyframes` answers whether a plugin already decided this key's
   * value. `Track` gains no knowledge of which keys are compiled: those three already answer it,
   * and a second answer would be one that can disagree.
   *
   * A prepared key is refused because `preparedConfig` merges the plugin's keyframes over the
   * authored ones, while an overlay sits over the base, so patching one would invert that
   * precedence and make the live timeline disagree with the next real recompile.
   */
  #acceptedOverlay(overlay: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> {
    const authored = this.#plugins.authoredKeyframes;
    const prepared = this.#plugins.preparation.keyframes;
    const accepted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(overlay)) {
      if (!Object.hasOwn(authored, key)) throw new LiveValueKeyError(this.#nodeId, key, "unknown");
      if (readAuthoredLeaf(authored[key]).kind !== "animated")
        throw new LiveValueKeyError(this.#nodeId, key, "kind");
      if (Object.hasOwn(prepared, key)) throw new LiveValueKeyError(this.#nodeId, key, "prepared");
      accepted[key] = value;
    }
    return accepted;
  }
  /**
   * Hands the animated half to the interpolator, if it declared the capability.
   *
   * The whole of the optional member at this layer, and no branch on which backend it is. The
   * `false` a declining backend never gets to return is the same `false` a patching one returns
   * when it cannot do the rebuild: both mean escalate, and the caller's answer is the same on
   * either. `Track` learns that a capability exists, never that GSAP exists.
   */
  #patch(overlay: Readonly<Record<string, unknown>>, rebase: boolean): boolean {
    const timeline = this.#timeline;
    if (timeline.patchKeys === undefined) return false;
    return timeline.patchKeys(overlay, rebase);
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
    return { ...interpolated, ...this.#values };
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
   * Runs the plugin chain from `seed` rather than from this track's own interpolated state.
   *
   * `seed` is this track's pre-plugin value domain, not a second input channel. No authored form
   * populates it, nothing outside this class holds a value to put in it that did not come from
   * `interpolated()`, and a value bound from another node still reaches a plugin only through its
   * declared slot. ADR-047's invariant is about where an upstream value may land, and it holds
   * unchanged: `requirementInputs` is still the only parameter one can arrive by.
   *
   * The seed is part of the memo key, for the same reason the requirement inputs are. `#dirty`
   * reports whether the timeline moved, which says nothing about whether this is the seed the last
   * snapshot was composed from, and answering one seed's question with another seed's snapshot is
   * the one way this seam can be silently wrong. It is also why a changed mask needs no flag of its
   * own to be seen: a different mask is a different seed.
   */
  composeFrom(
    seed: ImmutableRecord,
    requirementInputs: RequirementInputs = NO_REQUIREMENT_INPUTS,
  ): TrackSnapshot {
    this.assertActive();
    const memoized = this.#memoized(seed, requirementInputs);
    if (memoized !== undefined) return memoized;
    let values: ImmutableRecord = seed;
    for (const plugin of this.#plugins.plugins) {
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
      values: freezeComposition(publishableValues(values, this.#plugins)),
    });
    this.#lastSeed = Object.freeze({ ...seed });
    this.#lastRequirementInputs = Object.freeze({ ...requirementInputs });
    this.#lastSnapshot = snapshot;
    this.#dirty = false;
    return snapshot;
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
    this.#lastSnapshot = undefined;
    this.#lastSeed = undefined;
    this.#lastRequirementInputs = undefined;
  }
  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
