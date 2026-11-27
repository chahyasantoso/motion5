/** Something sampled or triggered at `at` ms on the scene's clock: a continuous `"value"` or discrete `"trigger"`. */
export interface InputEntry {
  readonly kind: "value" | "trigger";
  readonly name: string;
  readonly at: number;
  readonly value: number;
  readonly target?: string;
  /** The other body or collider a contact touched. */
  readonly other?: string;
  /** Where a contact or action happened, in the scene's units: px in 2D, with `z` in 3D. */
  readonly point?: EventPoint;
}

/** A point an entry happened at, in the scene's units; `z` only in 3D. */
export interface EventPoint {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}

/** Every input entry so far, oldest first; a scene reads it beside its time. */
export type Input = readonly InputEntry[];

/** Whether `value` is an `InputEntry`: `kind`, `name`, `at`, `value` and optional `target`, `point` and `other`. */
export function isInputEntry(value: unknown): value is InputEntry {
  if (typeof value !== "object" || value === null) return false;
  const kind: unknown = Reflect.get(value, "kind");
  if (kind !== "value" && kind !== "trigger") return false;
  const optional = (key: string, expected: "string") => {
    const field: unknown = Reflect.get(value, key);
    return field === undefined || typeof field === expected;
  };
  return (
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "at") === "number" &&
    typeof Reflect.get(value, "value") === "number" &&
    optional("target", "string") &&
    isOptionalPoint(Reflect.get(value, "point")) &&
    optional("other", "string")
  );
}

function isOptionalPoint(point: unknown): boolean {
  if (point === undefined) return true;
  if (typeof point !== "object" || point === null) return false;
  const z: unknown = Reflect.get(point, "z");
  return (
    typeof Reflect.get(point, "x") === "number" &&
    typeof Reflect.get(point, "y") === "number" &&
    (z === undefined || typeof z === "number")
  );
}

/** The empty input list; share it rather than allocating one. */
export const NO_INPUT: Input = Object.freeze([]);

/** Several input lists as one, oldest first; a scene's own cues joined with the page's input. */
export function mergeInput(...lists: readonly Input[]): Input {
  return lists.flat().sort((a, b) => a.at - b.at);
}
