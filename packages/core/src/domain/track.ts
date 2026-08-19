import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { ResolvedPlugins } from "./plugins";

export interface TrackSnapshot {
  readonly progress: number;
  readonly values: Readonly<ImmutableRecord>;
}
export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly plugins?: ResolvedPlugins;
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
 * `inputs`, and `outputs`, so a namespaced key can only be something a plugin derived for itself.
 * See ADR-041 and ADR-042.
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
const EMPTY_RESOLVED_PLUGINS: ResolvedPlugins = Object.freeze({
  plugins: Object.freeze([]),
  diagnostics: Object.freeze([]),
  authoredKeyframes: Object.freeze({}),
  internalKeys: Object.freeze([]),
  outputSerializers: Object.freeze({}),
  preparation: Object.freeze({ keyframes: Object.freeze({}), tweenVars: Object.freeze({}) }),
});
export class Track {
  readonly #timeline: InterpolationTimeline;
  readonly #plugins: ResolvedPlugins;
  #progress = 0;
  #dirty = true;
  #disposed = false;
  #lastSnapshot: TrackSnapshot | undefined;
  #lastInputs: Readonly<ImmutableRecord> | undefined;
  constructor(options: TrackOptions) {
    this.#plugins = options.plugins ?? EMPTY_RESOLVED_PLUGINS;
    this.#timeline = options.interpolator.create(
      preparedConfig(options.interpolationConfig, this.#plugins),
    );
  }
  get progress(): number {
    return this.#progress;
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
  compose(inputs: Readonly<ImmutableRecord> = {}): TrackSnapshot {
    this.assertActive();
    if (
      !this.#dirty &&
      this.#lastSnapshot &&
      this.#lastInputs !== undefined &&
      (this.#lastInputs === inputs || equalValues(this.#lastInputs, inputs))
    )
      return this.#lastSnapshot;
    let values: ImmutableRecord = { ...rendererNeutralState(this.#timeline.state), ...inputs };
    for (const plugin of this.#plugins.plugins) {
      const composed = plugin.compose(values, this.#progress);
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
    this.#lastInputs = freezeValue({ ...inputs });
    this.#lastSnapshot = snapshot;
    this.#dirty = false;
    return snapshot;
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#timeline.kill();
    this.#lastSnapshot = undefined;
    this.#lastInputs = undefined;
  }
  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
