export type ImmutableValue =
  | string
  | number
  | boolean
  | null
  | readonly ImmutableValue[]
  | Readonly<Record<string, ImmutableValue>>;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function invalidValue(value: unknown): TypeError {
  return new TypeError(
    `Unsupported immutable value: ${Object.prototype.toString.call(value)}.`,
  );
}

/**
 * Deeply freezes a renderer-neutral value once and rejects cycles or mutable host objects.
 * A WeakSet makes cycle detection finite and deterministic instead of allowing recursion to loop.
 */
export function freezeValue<T extends ImmutableValue>(value: T): Readonly<T> {
  const active = new WeakSet<object>();
  const visited = new WeakSet<object>();

  function visit(current: unknown): void {
    if (current === null || typeof current !== "object") {
      if (
        typeof current !== "string" &&
        typeof current !== "number" &&
        typeof current !== "boolean"
      ) {
        throw invalidValue(current);
      }
      if (typeof current === "number" && !Number.isFinite(current)) {
        throw new TypeError("Immutable values require finite numbers.");
      }
      return;
    }

    if (active.has(current)) throw new TypeError("Immutable values cannot contain cycles.");
    if (visited.has(current)) return;

    if (!Array.isArray(current) && !isPlainRecord(current)) throw invalidValue(current);

    active.add(current);
    if (Array.isArray(current)) {
      for (const item of current) visit(item);
    } else {
      for (const key of Object.keys(current)) visit(current[key]);
    }
    active.delete(current);
    visited.add(current);
    Object.freeze(current);
  }

  visit(value);
  return value as Readonly<T>;
}

/**
 * Structural equality for immutable values. Object key insertion order is irrelevant;
 * array order and Object.is primitive semantics are preserved.
 */
export function equalValues(left: unknown, right: unknown): boolean {
  const seen = new WeakMap<object, object>();

  function equal(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true;
    if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
      return false;
    }
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (!Array.isArray(a) && (!isPlainRecord(a) || !isPlainRecord(b))) return false;

    const prior = seen.get(a);
    if (prior === b) return true;
    seen.set(a, b);

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => equal(item, b[index]));
    }

    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key, index) => key === bKeys[index] && equal(a[key], b[key]));
  }

  return equal(left, right);
}
