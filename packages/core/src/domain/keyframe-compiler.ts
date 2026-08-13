import type { AuthoredStop, Diagnostic } from "../contract/v5";

export interface CompiledKeyframes {
  readonly keyframes: Record<string, Record<string, unknown>>;
  readonly initial: Record<string, unknown>;
  readonly diagnostics: readonly Diagnostic[];
}

function diagnostic(ruleId: string, path: string, message: string, ids: readonly string[]): Diagnostic {
  return Object.freeze({ ruleId, path, message, severity: "error", ids: Object.freeze([...ids]) });
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function toPercentKey(position: number): string {
  return `${position * 100}%`;
}
function readStops(value: unknown): readonly AuthoredStop[] {
  if (!isRecord(value) || !Array.isArray(value.stops)) return [];
  return value.stops.filter(
    (stop): stop is AuthoredStop =>
      isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop,
  );
}

export function compilePercentKeyframes(config: unknown, path = "keyframes"): CompiledKeyframes {
  if (!isRecord(config) || !isRecord(config.keyframes))
    return { keyframes: {}, initial: {}, diagnostics: [] };

  const keyframes: Record<string, Record<string, unknown>> = {};
  const initial: Record<string, unknown> = {};
  const diagnostics: Diagnostic[] = [];
  const easeOwners = new Map<string, { ease: unknown; keys: string[] }>();

  const addValue = (percent: string, key: string, value: unknown): void => {
    (keyframes[percent] ??= {})[key] = value;
  };
  const addEase = (percent: string, key: string, ease: unknown): void => {
    const owner = easeOwners.get(percent);
    if (owner && JSON.stringify(owner.ease) !== JSON.stringify(ease)) {
      const ids = [...new Set([...owner.keys, key])].sort();
      diagnostics.push(
        diagnostic(
          "plugin-contribution-ease-collision",
          `${path}[\"${percent}\"].ease`,
          `Conflicting ease values were authored at ${percent}.`,
          ids,
        ),
      );
      return;
    }
    if (owner) owner.keys.push(key);
    else {
      easeOwners.set(percent, { ease, keys: [key] });
      (keyframes[percent] ??= {}).ease = ease;
    }
  };

  for (const [key, property] of Object.entries(config.keyframes)) {
    const stops = readStops(property);
    const first = stops[0];
    const last = stops.at(-1);
    if (!first || !last) continue;
    initial[key] = first.v;

    // Boundary values preserve leading/trailing holds without resampling sibling grids.
    if (first.p > 0) addValue("0%", key, first.v);
    for (const stop of stops) {
      const percent = toPercentKey(stop.p);
      addValue(percent, key, stop.v);
      if (stop.ease !== undefined) addEase(percent, key, stop.ease);
    }
    if (last.p < 1) addValue("100%", key, last.v);
  }

  return Object.freeze({
    keyframes: Object.freeze(
      Object.fromEntries(
        Object.entries(keyframes).map(([percent, frame]) => [percent, Object.freeze(frame)]),
      ),
    ),
    initial: Object.freeze(initial),
    diagnostics: Object.freeze(diagnostics),
  });
}
