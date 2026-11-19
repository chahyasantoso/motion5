/** The limits and fallback of one number option. */
interface NumberRule {
  readonly default?: number;
  readonly min?: number;
  readonly max?: number;
}

function refusal(move: string, name: string, rule: string): RangeError {
  return new RangeError(`${move}: option "${name}" ${rule}.`);
}

/** A number option with its default filled in; throws a `RangeError` when it is missing, not a finite
 * number, or outside `min` and `max`. */
export function numberOption(
  move: string,
  name: string,
  value: number | undefined,
  rule: NumberRule = {},
): number {
  if (value === undefined) {
    if (rule.default === undefined) throw refusal(move, name, "is required");
    return rule.default;
  }
  if (typeof value !== "number" || !Number.isFinite(value))
    throw refusal(move, name, "must be a number");
  if (rule.min !== undefined && value < rule.min)
    throw refusal(move, name, `must be at least ${rule.min}`);
  if (rule.max !== undefined && value > rule.max)
    throw refusal(move, name, `must be at most ${rule.max}`);
  return value;
}

/** A string option that must be one of `allowed`; `fallback` stands in for a missing one. */
export function choiceOption<const T extends string>(
  move: string,
  name: string,
  value: T | undefined,
  allowed: readonly T[],
  fallback?: T,
): T {
  if (value === undefined) {
    if (fallback === undefined) throw refusal(move, name, "is required");
    return fallback;
  }
  if (typeof value !== "string") throw refusal(move, name, "must be a string");
  if (!allowed.includes(value)) throw refusal(move, name, `must be one of ${allowed.join(", ")}`);
  return value;
}
