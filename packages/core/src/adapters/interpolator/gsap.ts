import type { AuthoredStop, Diagnostic } from "../../contract/v5";
import { describeDiagnostics } from "../../contract/diagnostics";
import {
  compilePercentKeyframes,
  type CompiledKeyframes,
  type KeyframeCompileOptions,
} from "../../contract/keyframe-compiler";
import {
  PATCHED,
  RECOMPILE,
  type Interpolator,
  type InterpolationTimeline,
} from "../../ports/interpolator";

export interface GsapTweenLike {
  duration(): number;
  duration(value: number): GsapTweenLike;
  progress(): number;
  progress(value: number): GsapTweenLike;
  kill(): void;
}
export interface GsapTimelineLike {
  duration(): number;
  duration(value: number): GsapTimelineLike;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  to(
    target: Record<string, unknown>,
    vars: Record<string, unknown>,
    position?: number,
  ): GsapTimelineLike;
  /** The most recently added child; `to()` answers the timeline, so per-key handles need this read. */
  recent(): unknown;
  kill(): void;
}
export interface GsapLike {
  timeline?(vars?: Record<string, unknown>): GsapTimelineLike;
  to?(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTweenLike;
}
/** One frozen value; a key with nothing compiled allocates nothing. */
const NO_STOPS: readonly AuthoredStop[] = Object.freeze([]);
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function readDuration(config: unknown): number {
  if (!isRecord(config)) return 1;
  const duration = config.duration;
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0 ? duration : 1;
}
function readKeyframes(config: unknown): Readonly<Record<string, unknown>> {
  return isRecord(config) && isRecord(config.keyframes) ? config.keyframes : {};
}
function readTweenVars(config: unknown): Readonly<Record<string, unknown>> {
  return !isRecord(config) || !isRecord(config.tweenVars) ? {} : config.tweenVars;
}
/** `perKeyEase` → each cell keeps its own ease; default groups one ease per percent frame. */
function readCompileOptions(config: unknown): KeyframeCompileOptions {
  return isRecord(config) && config.perKeyEase === true ? { ease: "per-key" } : {};
}
function hasError(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some(({ severity }) => severity === "error");
}
/**
 * The recent child, or nothing when the host cannot answer.
 * Unanswering host retains no handles → `patchKeys` declines → caller recompiles instead of a `TypeError`. */
function recentChild(timeline: GsapTimelineLike): unknown {
  const read = timeline.recent;
  return typeof read === "function" ? read.call(timeline) : undefined;
}
/** A child this adapter may retain: anything killable alone; gsap may answer a callback. */
function asTween(child: unknown): GsapTweenLike | undefined {
  if (!isRecord(child)) return undefined;
  return typeof child.kill === "function" ? (child as unknown as GsapTweenLike) : undefined;
}
/** Whether two compiled stop lists are the same tween shape, value for value. */
function sameStops(left: readonly AuthoredStop[], right: readonly AuthoredStop[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((stop, index) => {
    const other = right[index];
    if (other === undefined) return false;
    return (
      Object.is(stop.p, other.p) && Object.is(stop.v, other.v) && Object.is(stop.ease, other.ease)
    );
  });
}
/**
 * Same animated keys; any difference is a recompile, never a patch.
 * Scalar over animated key, stop list over static one, retired `{ stops: [...] }` wrapper compiles to nothing → new shape. */
function sameKeys(left: CompiledKeyframes, right: CompiledKeyframes): boolean {
  const before = left.properties.map(({ key }) => key);
  const after = right.properties.map(({ key }) => key);
  return before.length === after.length && before.every((key, index) => key === after[index]);
}
function stopsOf(compiled: CompiledKeyframes, key: string): readonly AuthoredStop[] {
  return compiled.properties.find((property) => property.key === key)?.stops ?? NO_STOPS;
}
export class KeyframeCompilationError extends TypeError {
  readonly diagnostics: readonly Diagnostic[];
  constructor(diagnostics: readonly Diagnostic[]) {
    super(describeDiagnostics(diagnostics));
    this.name = "keyframe-compilation";
    this.diagnostics = diagnostics;
  }
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  const createTimeline = gsap.timeline;
  if (typeof createTimeline !== "function") {
    throw new TypeError("createGsapInterpolator requires gsap.timeline(vars).");
  }
  return {
    create(config): InterpolationTimeline {
      // Base record and the compile now on the timeline; the overlay is not retained (live minus
      // base), so a rebase is one assignment.
      const compileOptions = readCompileOptions(config);
      let base = readKeyframes(config);
      let compiled = compilePercentKeyframes(base, "keyframes", compileOptions);
      if (hasError(compiled.diagnostics)) throw new KeyframeCompilationError(compiled.diagnostics);

      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const tweenVars = readTweenVars(config);
      const timeline = createTimeline.call(gsap, { paused: true });
      const tweensByKey = new Map<string, readonly GsapTweenLike[]>();

      // Read back each `to()` child → per-key kill. `to()` reads its start off the proxy, so a
      // rebuild must first hold each key's first compiled stop, unrendered.
      const buildKey = (key: string, stops: readonly AuthoredStop[]): readonly GsapTweenLike[] => {
        const handles: GsapTweenLike[] = [];
        for (let index = 1; index < stops.length; index += 1) {
          const previous = stops[index - 1];
          const next = stops[index];
          if (!previous || !next) continue;
          const vars: Record<string, unknown> = {
            ...tweenVars,
            [key]: next.v,
            duration: (next.p - previous.p) * duration,
          };
          if (next.ease !== undefined) vars.ease = next.ease;
          else if (!("ease" in tweenVars)) vars.ease = "none";
          timeline.to(proxy, vars, previous.p * duration);
          const child = asTween(recentChild(timeline));
          if (child) handles.push(child);
        }
        return handles;
      };

      for (const { key, stops } of compiled.properties) tweensByKey.set(key, buildKey(key, stops));
      // Terminal padding tween owns no key and pins total length; never in the map, since killing
      // it would renormalize `progress()` and move every mapped time.
      if (duration > 0) timeline.to(proxy, { duration: 0 }, duration);

      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
      }
      function patchKeys(overlay: Readonly<Record<string, unknown>>, rebase = false) {
        const effective = { ...base, ...overlay };
        const next = compilePercentKeyframes(effective, "keyframes", compileOptions);
        // Declined, not refused: the caller recompiles, and that compile raises the diagnostic
        // exactly as a fresh `create()` would, from its one owner.
        if (hasError(next.diagnostics)) return RECOMPILE;
        if (!sameKeys(next, compiled)) return RECOMPILE;
        const changed = next.properties.filter(
          ({ key, stops }) => !sameStops(stops, stopsOf(compiled, key)),
        );
        // Host answered nothing for `recent()` → no handles → a rebuild would double the tweens;
        // decline, as the one-tween adapter does by omission.
        if (changed.some(({ key }) => (tweensByKey.get(key) ?? []).length === 0)) return RECOMPILE;
        const at = timeline.progress();
        // Rewind to 0, re-seed `next.initial`, rebuild: rebuilt tweens read start off the proxy.
        // Mid-progress would animate from the replaced tween's value, not that key's first stop.
        timeline.progress(0);
        Object.assign(proxy, next.initial);
        for (const { key, stops } of changed) {
          for (const tween of tweensByKey.get(key) ?? []) tween.kill();
          tweensByKey.set(key, buildKey(key, stops));
        }
        compiled = next;
        if (rebase) base = effective;
        // Re-applying `at` renders rebuilt keys and returns siblings the rewind moved; at 0 the
        // re-seed already is that state, so no render is needed.
        timeline.progress(at);
        return PATCHED;
      }
      return {
        get duration() {
          return duration;
        },
        state: proxy,
        progress,
        patchKeys,
        kill(): void {
          timeline.kill();
        },
      };
    },
  };
}

export function createGsapOneTweenInterpolator(gsap: GsapLike): Interpolator {
  const createTween = gsap.to;
  if (typeof createTween !== "function") {
    throw new TypeError("createGsapOneTweenInterpolator requires gsap.to(target, vars).");
  }
  return {
    create(config): InterpolationTimeline {
      const compiled = compilePercentKeyframes(readKeyframes(config));
      if (compiled.diagnostics.some(({ severity }) => severity === "error"))
        throw new KeyframeCompilationError(compiled.diagnostics);

      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const tweenVars = readTweenVars(config);

      const keyframesMap: Record<string, unknown> = { ...compiled.map };
      if (!("100%" in keyframesMap)) {
        const finalValues: Record<string, unknown> = {};
        for (const { key, stops } of compiled.properties) {
          const last = stops[stops.length - 1];
          if (last) finalValues[key] = last.v;
        }
        keyframesMap["100%"] = finalValues;
      }

      const tween = createTween.call(gsap, proxy, {
        keyframes: {
          ...keyframesMap,
          easeEach: "none",
        },
        ease: "none",
        duration,
        paused: true,
        ...tweenVars,
      });

      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return tween.progress();
        tween.progress(value);
      }

      // No per-key capability: one `gsap.to` with a `keyframes` map has no per-key child to kill,
      // so declaring the member would lie; the caller's recompile is the honest answer.
      return {
        get duration() {
          return duration;
        },
        state: proxy,
        progress,
        kill(): void {
          tween.kill();
        },
      };
    },
  };
}
