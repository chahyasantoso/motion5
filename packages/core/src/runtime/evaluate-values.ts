import type { ParsedCell, ParsedStop, ParsedValues } from "../contract/v5-parse";
import type { FieldSpec, FlatRecord, Scalar, Table, Value, ValueSpec } from "../contract/v5";
import { freezeValue } from "../domain/values";
import { unreachable } from "../lang/exhaustive";
import type { Interpolator } from "../ports/interpolator";

/**
 * Evaluation of a parsed table or record, flattened behind an opaque slot plan.
 *
 * A parsed cell is either constant, a numeric sequence the interpolator owns, or a discrete
 * sequence this module resolves. Every numeric cell becomes one opaque slot id on one keyframe
 * record, so one timeline carries the whole table; reconstruction walks the authored rows and
 * columns and reads a slot by id, which is why two rows may name the same column, unusual
 * characters survive, and a row id is never used to build a key. The slot ids never leave this
 * module: no output object is keyed by one.
 *
 * The backend is asked for per-key ease because each cell authored its own stops. A grouped
 * keyframe record, where one percent carries one ease for every property, is a different reading
 * and is not what this plan builds.
 *
 * The evaluator owns its timeline once, so repeated progress changes do not recompile the plan.
 * Callers dispose it with the track that owns it. A plan with no numeric cell creates no timeline
 * at all.
 */

type PlannedCell =
  | { readonly kind: "static"; readonly value: Scalar }
  | { readonly kind: "numeric"; readonly slot: string }
  | { readonly kind: "discrete"; readonly stops: readonly ParsedStop[] };

interface PlannedEntry {
  readonly name: string;
  readonly cell: PlannedCell;
}

interface PlannedRow {
  readonly id: string;
  readonly entries: readonly PlannedEntry[];
}

type Plan =
  | { readonly kind: "table"; readonly rows: readonly PlannedRow[] }
  | { readonly kind: "record"; readonly entries: readonly PlannedEntry[] };

interface FieldBounds {
  readonly min?: number;
  readonly max?: number;
}

interface Skeleton {
  readonly plan: Plan;
  readonly keyframes: Readonly<Record<string, readonly ParsedStop[]>>;
  /** Each slot's authored path, so an interpolator's refusal names the cell rather than the slot. */
  readonly paths: Readonly<Record<string, string>>;
  readonly bounds: ReadonlyMap<string, FieldBounds>;
  readonly timeInvariant: boolean;
}

export interface ValueEvaluator {
  /** Evaluates the authored shape at `progress`, clamped into `[0, 1]`. */
  evaluate(progress: number): Value;
  /** True when no cell changes with progress, so a seek need not recompose the node. */
  readonly timeInvariant: boolean;
  dispose(): void;
}

const EMPTY_TABLE: Plan = Object.freeze({ kind: "table", rows: Object.freeze([]) });
const EMPTY_RECORD: Plan = Object.freeze({ kind: "record", entries: Object.freeze([]) });
const NO_KEYFRAMES: Readonly<Record<string, readonly ParsedStop[]>> = Object.freeze({});
const NO_PATHS: Readonly<Record<string, string>> = Object.freeze({});
const NO_BOUNDS: ReadonlyMap<string, FieldBounds> = new Map();

/**
 * The last stop whose position has been reached, or the first stop before any is.
 *
 * Discrete means the value steps at a stop rather than moving towards it, so the stop at the exact
 * progress has already been reached and a progress before the first one holds the first value.
 */
function discreteAt(stops: readonly ParsedStop[], progress: number): Scalar {
  const first = stops[0];
  if (first === undefined) throw new TypeError("A discrete cell requires at least one stop.");
  let low = 0;
  let high = stops.length - 1;
  let reached = 0;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const stop = stops[middle];
    if (stop !== undefined && stop.p <= progress) {
      reached = middle;
      low = middle + 1;
    } else high = middle - 1;
  }
  return (stops[reached] ?? first).v;
}

function planValues(
  values: ParsedValues | undefined,
  spec: ValueSpec | undefined,
  path: string,
): Skeleton {
  if (values === undefined)
    return {
      plan: spec?.kind === "record" ? EMPTY_RECORD : EMPTY_TABLE,
      keyframes: NO_KEYFRAMES,
      paths: NO_PATHS,
      bounds: NO_BOUNDS,
      timeInvariant: true,
    };

  let animated = false;
  const numericStops: (readonly ParsedStop[])[] = [];
  const numericPaths: string[] = [];
  const numericBounds: (FieldBounds | undefined)[] = [];
  const planCell = (
    cell: ParsedCell,
    field: FieldSpec | undefined,
    cellPath: string,
  ): PlannedCell => {
    switch (cell.kind) {
      case "static":
        return { kind: "static", value: cell.value };
      case "animated":
        animated = true;
        switch (cell.scalar) {
          case "number": {
            const slot = `s${numericStops.length}`;
            numericStops.push(cell.stops);
            numericPaths.push(cellPath);
            numericBounds.push(
              field?.min === undefined && field?.max === undefined
                ? undefined
                : {
                    ...(field?.min === undefined ? {} : { min: field.min }),
                    ...(field?.max === undefined ? {} : { max: field.max }),
                  },
            );
            return { kind: "numeric", slot };
          }
          case "string":
          case "boolean":
            return { kind: "discrete", stops: cell.stops };
          default:
            return unreachable(cell.scalar);
        }
      default:
        return unreachable(cell);
    }
  };
  const planEntries = (
    cells: Readonly<Record<string, ParsedCell>>,
    fields: Readonly<Record<string, FieldSpec>> | undefined,
    cellsPath: string,
  ): readonly PlannedEntry[] =>
    Object.entries(cells).map(([name, cell]) => ({
      name,
      cell: planCell(cell, fields?.[name], `${cellsPath}.${name}`),
    }));
  const slotPaths = (): Readonly<Record<string, string>> =>
    Object.freeze(
      Object.fromEntries(numericPaths.map((cellPath, index) => [`s${index}`, cellPath] as const)),
    );

  switch (values.kind) {
    case "table": {
      const fields = spec?.kind === "table" ? spec.schema.row.fields : undefined;
      const rows = values.rows.map((row, index) => ({
        id: row.id,
        entries: planEntries(row.cells, fields, `${path}[${index}].cells`),
      }));
      const keyframes = Object.fromEntries(
        numericStops.map((stops, index) => [`s${index}`, stops] as const),
      );
      return {
        plan: { kind: "table", rows },
        keyframes: Object.freeze(keyframes),
        paths: slotPaths(),
        bounds: boundsOf(numericBounds),
        timeInvariant: !animated,
      };
    }
    case "record": {
      const fields = spec?.kind === "record" ? spec.fields : undefined;
      const entries = planEntries(values.fields, fields, path);
      const keyframes = Object.fromEntries(
        numericStops.map((stops, index) => [`s${index}`, stops] as const),
      );
      return {
        plan: { kind: "record", entries },
        keyframes: Object.freeze(keyframes),
        paths: slotPaths(),
        bounds: boundsOf(numericBounds),
        timeInvariant: !animated,
      };
    }
    default:
      return unreachable(values);
  }
}

function boundsOf(entries: readonly (FieldBounds | undefined)[]): ReadonlyMap<string, FieldBounds> {
  const bounds = new Map<string, FieldBounds>();
  entries.forEach((entry, index) => {
    if (entry !== undefined) bounds.set(`s${index}`, entry);
  });
  return bounds;
}

export function createValueEvaluator(
  values: ParsedValues | undefined,
  interpolator: Interpolator,
  spec: ValueSpec | undefined,
  path: string,
): ValueEvaluator {
  const { plan, keyframes, paths, bounds, timeInvariant } = planValues(values, spec, path);
  const hasNumeric = Object.keys(keyframes).length > 0;
  // Duration 1 makes progress the normalized position the authored stops already use. The flag is
  // the one thing a backend must honor for per-cell stops: eases at one position stay independent.
  const timeline = hasNumeric
    ? interpolator.create(Object.freeze({ duration: 1, keyframes, paths, perKeyEase: true }))
    : undefined;
  let disposed = false;

  const scalarAt = (cell: PlannedCell, progress: number): Scalar => {
    switch (cell.kind) {
      case "static":
        return cell.value;
      case "numeric": {
        const value = timeline?.state[cell.slot];
        if (typeof value !== "number" || !Number.isFinite(value))
          throw new TypeError(`Interpolator slot '${cell.slot}' did not produce a finite number.`);
        const bound = bounds.get(cell.slot);
        if (bound === undefined) return value;
        return Math.max(
          bound.min ?? Number.NEGATIVE_INFINITY,
          Math.min(bound.max ?? Number.POSITIVE_INFINITY, value),
        );
      }
      case "discrete":
        return discreteAt(cell.stops, progress);
      default:
        return unreachable(cell);
    }
  };

  const reconstruct = (progress: number): Value => {
    switch (plan.kind) {
      case "table": {
        const rows: { id: string; cells: Record<string, Scalar> }[] = [];
        for (const row of plan.rows) {
          const cells: Record<string, Scalar> = {};
          for (const entry of row.entries) cells[entry.name] = scalarAt(entry.cell, progress);
          rows.push({ id: row.id, cells });
        }
        const table: Table = freezeValue(rows);
        return table;
      }
      case "record": {
        const fields: Record<string, Scalar> = {};
        for (const entry of plan.entries) fields[entry.name] = scalarAt(entry.cell, progress);
        const record: FlatRecord = freezeValue(fields);
        return record;
      }
      default:
        return unreachable(plan);
    }
  };

  return {
    timeInvariant,
    evaluate(progress) {
      if (disposed) throw new TypeError("Value evaluator is disposed.");
      if (!Number.isFinite(progress)) throw new TypeError("Value progress must be finite.");
      const clamped = Math.max(0, Math.min(1, progress));
      timeline?.progress(clamped);
      return reconstruct(clamped);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      timeline?.kill();
    },
  };
}
