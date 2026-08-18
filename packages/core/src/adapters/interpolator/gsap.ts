import type { Diagnostic } from "../../contract/v5";
import { compilePercentKeyframes } from "../../domain/keyframe-compiler";
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
  kill(): void;
}
export interface GsapLike {
  timeline?(vars?: Record<string, unknown>): GsapTimelineLike;
  to?(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTweenLike;
}
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
      const compiled = compilePercentKeyframes(readKeyframes(config));
      if (compiled.diagnostics.some(({ severity }) => severity === "error"))
        throw new KeyframeCompilationError(compiled.diagnostics);

      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const tweenVars = readTweenVars(config);
      const timeline = createTimeline.call(gsap, { paused: true });

      for (const { key, stops } of compiled.properties) {
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
        }
      }
      if (duration > 0) timeline.to(proxy, { duration: 0 }, duration);

      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return timeline.progress();
        timeline.progress(value);
      }
      return {
        get duration() {
          return duration;
        },
        state: proxy,
        progress,
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
