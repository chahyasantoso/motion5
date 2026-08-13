import type { Diagnostic } from "../../contract/v5";
import { compilePercentKeyframes } from "../../domain/keyframe-compiler";
import type { Interpolator, InterpolationTimeline } from "../../ports/interpolator";

export interface GsapTweenLike {
  readonly duration: () => number;
  progress(): number;
  progress(value: number): GsapTweenLike;
  kill(): void;
}
export interface GsapTimelineLike {
  duration(): number;
  duration(value: number): GsapTimelineLike;
  progress(): number;
  progress(value: number): GsapTimelineLike;
  to(target: Record<string, unknown>, vars: Record<string, unknown>, position?: number): GsapTimelineLike;
  kill(): void;
}
export interface GsapLike {
  timeline?: (vars?: Record<string, unknown>) => GsapTimelineLike;
  to?: (target: Record<string, unknown>, vars: Record<string, unknown>) => GsapTweenLike;
}

interface AuthoredStop {
  readonly p: number;
  readonly v: unknown;
  readonly ease?: unknown;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function readDuration(config: unknown): number {
  if (!isRecord(config)) return 1;
  const duration = config.duration;
  return typeof duration === "number" && Number.isFinite(duration) && duration >= 0 ? duration : 1;
}
function readTweenVars(config: unknown): Readonly<Record<string, unknown>> {
  if (!isRecord(config) || !isRecord(config.tweenVars)) return {};
  return config.tweenVars;
}
function readStops(value: unknown): readonly AuthoredStop[] {
  if (!isRecord(value) || !Array.isArray(value.stops)) return [];
  return value.stops.filter(
    (stop): stop is AuthoredStop =>
      isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop,
  );
}
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics.map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`).join(" ");
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
  return {
    create(config): InterpolationTimeline {
      const compiled = compilePercentKeyframes(config);
      if (compiled.diagnostics.length > 0) throw new KeyframeCompilationError(compiled.diagnostics);
      const proxy: Record<string, unknown> = { ...compiled.initial };
      const duration = readDuration(config);
      const authored = isRecord(config) && isRecord(config.keyframes) ? config.keyframes : {};
      const tweenVars = readTweenVars(config);
      const parent = gsap.timeline?.({ paused: true });
      if (parent) {
        for (const [key, property] of Object.entries(authored)) {
          const stops = readStops(property);
          if (stops.length === 0) continue;
          if (stops[0] && stops[0].p > 0) {
            parent.to(proxy, { [key]: stops[0].v, duration: 0 }, 0);
          }
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
            parent.to(proxy, vars, previous.p * duration);
          }
          if (stops.at(-1)?.p < 1) {
            parent.to(proxy, { [key]: stops.at(-1)?.v, duration: 0 }, duration);
          }
        }
        parent.duration(duration);
        return {
          get duration() {
            return parent.duration();
          },
          state: proxy,
          progress(value?: number): number | void {
            if (value === undefined) return parent.progress();
            parent.progress(value);
          },
          kill(): void {
            parent.kill();
          },
        };
      }
      if (!gsap.to) throw new TypeError("GSAP adapter requires timeline().");
      const tween = gsap.to(proxy, {
        ...tweenVars,
        keyframes: compiled.keyframes,
        duration,
        paused: true,
      });
      function progress(): number;
      function progress(value: number): void;
      function progress(value?: number): number | void {
        if (value === undefined) return tween.progress();
        tween.progress(value);
      }
      return { get duration() { return tween.duration(); }, state: proxy, progress, kill: () => tween.kill() };
    },
  };
}
