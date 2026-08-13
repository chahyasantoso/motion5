import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";
import { compilePercentKeyframes } from "../../domain/keyframe-compiler";

export interface GsapTweenLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTweenLike;
  kill(): void;
}
export interface GsapLike {
  to(target: Record<string, unknown>, vars: Record<string, unknown>): GsapTweenLike;
}

function readDuration(config: unknown): number {
  if (!config || typeof config !== "object") return 1;
  const duration = (config as { duration?: unknown }).duration;
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0 ? duration : 1;
}
function readTweenVars(config: unknown): Readonly<Record<string, unknown>> {
  if (!config || typeof config !== "object") return {};
  const vars = (config as { tweenVars?: unknown }).tweenVars;
  return vars && typeof vars === "object" && !Array.isArray(vars)
    ? (vars as Readonly<Record<string, unknown>>)
    : {};
}

export class KeyframeCompilationError extends TypeError {
  readonly diagnostics: readonly ReturnType<typeof compilePercentKeyframes>["diagnostics"];
  constructor(diagnostics: readonly ReturnType<typeof compilePercentKeyframes>["diagnostics"]) {
    super(diagnostics.map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`).join(" "));
    this.name = "keyframe-compilation";
    this.diagnostics = diagnostics;
  }
}

export function createGsapInterpolator(gsap: GsapLike): Interpolator {
  return {
    create(config): InterpolationTimeline {
      const compiled = compilePercentKeyframes(config);
      if (compiled.diagnostics.length > 0) throw new KeyframeCompilationError(compiled.diagnostics);
      const proxy: Record<string, unknown> = { ...compiled.initial };
      const tween = gsap.to(proxy, {
        ...readTweenVars(config),
        keyframes: compiled.keyframes,
        duration: readDuration(config),
        paused: true,
      });
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return tween.progress();
        tween.progress(value);
      }
      return {
        get duration() {
          return tween.duration();
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
