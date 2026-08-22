import { readCompilableStops } from "../contract/authored-leaf";
import type { AuthoredStop, Diagnostic } from "../contract/v5";

export interface CompiledProperty {
  readonly key: string;
  readonly stops: readonly AuthoredStop[];
}
export interface CompiledKeyframes {
  readonly map: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly initial: Readonly<Record<string, unknown>>;
  readonly properties: readonly CompiledProperty[];
  readonly diagnostics: readonly Diagnostic[];
}

function diagnostic(
  ruleId: string,
  path: string,
  message: string,
  ids: readonly string[],
): Diagnostic {
  return Object.freeze({ ruleId, path, message, severity: "error", ids: Object.freeze([...ids]) });
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function toPercentKey(position: number): string {
  return `${position * 100}%`;
}
function percentValue(percent: string): number {
  return Number.parseFloat(percent.slice(0, -1));
}

/**
 * Compile authored properties without projecting them onto a sibling's percent grid.
 *
 * Motion5 intentionally seeds each proxy property from its first authored value, even
 * when that stop is after 0%. This preserves the leading hold without inventing a 0%
 * keyframe, unlike the oracle's 0%-only proxy seeding.
 *
 * Which stops a leaf contributes is `readCompilableStops`, not a local reader. That is the one
 * owner of the leaf shape, so this compiler and the fake interpolator cannot disagree about what a
 * malformed stop publishes. See issue #192.
 */
export function compilePercentKeyframes(keyframes: unknown, path = "keyframes"): CompiledKeyframes {
  if (!isRecord(keyframes))
    return Object.freeze({
      map: Object.freeze({}),
      initial: Object.freeze({}),
      properties: Object.freeze([]),
      diagnostics: Object.freeze([]),
    });

  const map: Record<string, Record<string, unknown>> = {};
  const initial: Record<string, unknown> = {};
  const properties: CompiledProperty[] = [];
  const diagnostics: Diagnostic[] = [];
  const easeOwners = new Map<string, { ease: unknown; keys: string[] }>();

  const addValue = (percent: string, key: string, value: unknown): void => {
    (map[percent] ??= {})[key] = value;
  };
  const addEase = (percent: string, key: string, ease: unknown): void => {
    const owner = easeOwners.get(percent);
    if (owner && !Object.is(owner.ease, ease)) {
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
      (map[percent] ??= {}).ease = ease;
    }
  };

  for (const [key, property] of Object.entries(keyframes).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const stops = readCompilableStops(property);
    const first = stops[0];
    if (!first) continue;
    const frozenStops = Object.freeze([...stops]);
    properties.push(Object.freeze({ key, stops: frozenStops }));
    initial[key] = first.v;
    for (const stop of stops) {
      const percent = toPercentKey(stop.p);
      addValue(percent, key, stop.v);
      if (stop.ease !== undefined) addEase(percent, key, stop.ease);
    }
  }

  const orderedMap = Object.fromEntries(
    Object.entries(map)
      .sort(([left], [right]) => percentValue(left) - percentValue(right))
      .map(([percent, frame]) => [percent, Object.freeze(frame)]),
  );
  return Object.freeze({
    map: Object.freeze(orderedMap),
    initial: Object.freeze(initial),
    properties: Object.freeze(properties),
    diagnostics: Object.freeze(diagnostics),
  });
}
