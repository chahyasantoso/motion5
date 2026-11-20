/** Something that happened at `at` ms on the scene's clock: a hover, a press, a landing, or a sample of a
 * live number; `target` names where. */
export interface MotionEvent {
  readonly name: string;
  readonly at: number;
  readonly target?: string;
  /** Where a pointer event happened, in px from the watched element's top left corner. */
  readonly x?: number;
  readonly y?: number;
  /** A sample's number, such as how far a mouth is open; `follow` reads it with `"value"`. */
  readonly value?: number;
  /** Where a contact touched, in the scene's units: px in 2D, with `z` in 3D. */
  readonly point?: EventPoint;
  /** The other body or collider a contact touched. */
  readonly other?: string;
}

/** A point an event happened at, in the scene's units; `z` only in 3D. */
export interface EventPoint {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}

/** Every event so far, oldest first; a scene reads it beside its time. */
export type Events = readonly MotionEvent[];

/** Whether `value` is a `MotionEvent`: a `name`, an `at` and, when given, a `target`, an `x`, `y`, a
 * `value`, a `point` of numbers and an `other`. */
export function isMotionEvent(value: unknown): value is MotionEvent {
  if (typeof value !== "object" || value === null) return false;
  const optional = (key: string, kind: "string" | "number") => {
    const field: unknown = Reflect.get(value, key);
    return field === undefined || typeof field === kind;
  };
  return (
    typeof Reflect.get(value, "name") === "string" &&
    typeof Reflect.get(value, "at") === "number" &&
    optional("target", "string") &&
    optional("x", "number") &&
    optional("y", "number") &&
    optional("value", "number") &&
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

/** The empty event list; share it rather than allocating one. */
export const NO_EVENTS: Events = Object.freeze([]);

/** Several event lists as one, oldest first; a scene's own cues joined with the page's events. */
export function mergeEvents(...lists: readonly Events[]): Events {
  return lists.flat().sort((a, b) => a.at - b.at);
}
