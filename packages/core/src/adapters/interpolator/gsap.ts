import type { AuthoredStop, Diagnostic } from "../../contract/v5";
import { compilePercentKeyframes, type CompiledKeyframes } from "../../domain/keyframe-compiler";
import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

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
  /**
   * The most recently added child, whatever it is.
   *
   * `to()` returns the timeline rather than the tween it added, so collecting its return value
   * gives N references to one object and the first `kill()` takes every sibling with it. This one
   * read is what makes per-key handles possible at all, and a real `gsap.timeline()` already
   * answers it, so no host shim moves. Typed as `unknown` because gsap's own answer is a union
   * with a callback in it: this adapter narrows what it retains rather than asking a host to.
   */
  recent(): unknown;
  kill(): void;
}
export interface GsapLike {
  timeline?(vars?: Record<string, unknown>): GsapTimelineLike;
  to?(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTweenLike;
}
/** One frozen value each, so a key with nothing compiled and an absent overlay allocate nothing. */
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
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
function hasError(diagnostics: readonly Diagnostic[]): boolean {
  return diagnostics.some(({ severity }) => severity === "error");
}
/**
 * The child this adapter is allowed to retain: anything that can be killed on its own.
 *
 * Narrowed here rather than in `GsapTimelineLike`, because gsap's `recent()` answers with a tween,
 * a nested timeline, or a plain callback, and only two of those have a `kill`. A shape this cannot
 * recognize is simply not retained, which costs one key its per-key handles and therefore one
 * decline, rather than a `TypeError` from calling a method a host never had.
 */
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
      Object.is(stop.p, other.p) &&
      Object.is(stop.v, other.v) &&
      Object.is(stop.ease, other.ease)
    );
  });
}
/**
 * Whether two compiles produced the same animated keys, in the compiler's own order.
 *
 * A difference is never a patch. A scalar written over an animated key deletes that key from the
 * compiled properties and a stop list over a static one adds it, and the retired `{ stops: [...] }`
 * wrapper compiles to nothing at all, so all three are recompiles of a different shape and all
 * three decline here rather than being half-applied.
 */
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
      // The base record and the compile that is currently on the timeline. The overlay is not
      // retained beside them, because it is `live` minus `base` and retaining it as well would be
      // two answers to one question. A rebase is therefore one assignment rather than two.
      let base = readKeyframes(config);
      let compiled = compilePercentKeyframes(base);
      if (hasError(compiled.diagnostics)) throw new KeyframeCompilationError(compiled.diagnostics);

      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const tweenVars = readTweenVars(config);
      const timeline = createTimeline.call(gsap, { paused: true });
      const tweensByKey = new Map<string, readonly GsapTweenLike[]>();

      // Tween construction is untouched. The only thing added is reading back the child each `to()`
      // appended, so one key's tweens can later be killed without touching a sibling's.
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
          const child = asTween(timeline.recent());
          if (child) handles.push(child);
        }
        return handles;
      };

      for (const { key, stops } of compiled.properties) tweensByKey.set(key, buildKey(key, stops));
      // The terminal padding tween owns no key and pins the total length, so it is added after every
      // per-key handle has been collected and never enters the retained map. Killing it would
      // renormalize `progress()` against a shorter timeline and move every mapped time silently.
      if (duration > 0) timeline.to(proxy, { duration: 0 }, duration);

      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
      }
      function patchKeys(overlay: Readonly<Record<string, unknown>>, rebase = false): boolean {
        const effective = { ...base, ...overlay };
        const next = compilePercentKeyframes(effective);
        // Declined, not refused. The caller recompiles, and the recompile raises the diagnostic
        // exactly as a fresh `create()` of the same record would, from the one place that owns it.
        if (hasError(next.diagnostics)) return false;
        if (!sameKeys(next, compiled)) return false;
        const changed = next.properties.filter(
          ({ key, stops }) => !sameStops(stops, stopsOf(compiled, key)),
        );
        const at = timeline.progress();
        for (const { key, stops } of changed) {
          for (const tween of tweensByKey.get(key) ?? []) tween.kill();
          tweensByKey.set(key, buildKey(key, stops));
        }
        // Killing a tween does not revert the proxy, and the proxy is `state`, so every key is
        // re-seeded from the recompiled initial before the playhead is re-applied. The seek is a
        // round trip rather than a same-value write, because gsap owes no render for a progress it
        // is already holding and a rebuilt key reads its start value on first render.
        Object.assign(proxy, next.initial);
        compiled = next;
        if (rebase) base = effective;
        timeline.progress(at === 0 ? 1 : 0);
        timeline.progress(at);
        return true;
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

      // Deliberately no per-key capability. One `gsap.to` carrying a `keyframes` map has no per-key
      // child to kill, so declaring the member here would be a lie and the caller's recompile is
      // the honest answer. Interface segregation because an implementation genuinely cannot honor
      // it, not because it was inconvenient. See ADR-060.
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
