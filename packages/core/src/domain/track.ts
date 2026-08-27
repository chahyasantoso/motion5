import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
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
   */
  interpolated(): ImmutableRecord {
    this.assertActive();
    return rendererNeutralState(this.#timeline.state);
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
   * the one way this seam can be silently wrong.
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
