import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { PluginDefinition, ResolvedPlugins } from "./plugins";

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
function prepareConfig(config: unknown, plugins: readonly PluginDefinition[]): unknown {
  if (!isRecord(config) || !isRecord(config.keyframes)) return config;
  let keyframes = { ...config.keyframes };
  for (const plugin of plugins) {
    if (plugin.stage !== "prepare" || plugin.contribute === undefined) continue;
    const contribution = plugin.contribute(Object.freeze({ ...keyframes }));
    if (isRecord(contribution)) keyframes = { ...keyframes, ...contribution };
  }
  return Object.freeze({ ...config, keyframes: Object.freeze(keyframes) });
}
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
  internalKeys: Object.freeze([]),
  outputSerializers: Object.freeze({}),
});
export class Track {
  readonly #timeline: InterpolationTimeline;
  readonly #plugins: ResolvedPlugins;
  #progress: number;
  #dirty = true;
  #disposed = false;
  #lastSnapshot: TrackSnapshot | undefined;
  #lastInputs: Readonly<ImmutableRecord> | undefined;
  constructor(options: TrackOptions) {
    this.#plugins = options.plugins ?? EMPTY_RESOLVED_PLUGINS;
    const preparedConfig = prepareConfig(options.interpolationConfig, this.#plugins.plugins);
    this.#timeline = options.interpolator.create(preparedConfig);
    this.#progress = 0;
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
    this.#progress = next;
    this.#timeline.progress(next);
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
    const frozenValues = freezeComposition(values);
    const snapshot = Object.freeze({ progress: this.#progress, values: frozenValues });
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
