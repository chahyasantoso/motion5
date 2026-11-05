/** Root frame, pure: the whole frame is animated, so the structure is empty. */

export type Scalar = number | string | boolean;
export type Root = Readonly<Record<string, Scalar>>;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function bindRoot(value: unknown): Root {
  if (!isRecord(value)) throw new TypeError("A root entity requires a record.");
  const root: Record<string, Scalar> = {};
  for (const [name, cell] of Object.entries(value)) {
    if (
      typeof cell !== "string" &&
      typeof cell !== "boolean" &&
      (typeof cell !== "number" || !Number.isFinite(cell))
    )
      throw new TypeError(`Root field '${name}' must be a finite scalar.`);
    root[name] = cell;
  }
  return Object.freeze(root);
}
