import { authoredLeafPartition, readAuthoredLeaf, readCompilableStops } from "./authored-leaf";
import { diagnostic } from "./diagnostics";
import type { AuthoredStop, Diagnostic } from "./v5";
import { unreachable } from "../lang/exhaustive";

export interface CompiledKeyframes {
  readonly map: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly initial: Readonly<Record<string, unknown>>;
  readonly properties: readonly CompiledProperty[];
  readonly diagnostics: readonly Diagnostic[];
}
export interface CompiledProperty {
  readonly key: string;
  readonly stops: readonly AuthoredStop[];
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
 * Compile authored leaves once per interpolator call. The contract owns stop eligibility via
 * `readCompilableStops`, so the domain and every backend agree about malformed authored leaves.
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
          `${path}["${percent}"].ease`,
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
    const partition = authoredLeafPartition(readAuthoredLeaf(property));
    switch (partition.kind) {
      case "value":
        initial[key] = partition.value;
        continue;
      case "none":
        continue;
      case "stops":
        break;
      default:
        return unreachable(partition);
    }
    const stops = readCompilableStops(partition.stops);
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
