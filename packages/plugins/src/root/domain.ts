/** Root frame, pure: the whole frame is animated, so the structure is empty. */

export type Scalar = number | string | boolean;
export type Root = Readonly<Record<string, Scalar>>;
export type RootStructure = Readonly<Record<string, never>>;

export type RootError =
  | { readonly kind: "record-shape"; readonly message: string }
  | { readonly kind: "field-shape"; readonly field: string };

export type RootResult =
  | { readonly ok: true; readonly value: RootStructure }
  | { readonly ok: false; readonly errors: readonly RootError[] };

export const ROOT_2D_FIELDS_REQUIRED = ["x", "y", "rotation"] as const;
export const ROOT_3D_FIELDS_REQUIRED = [
  "x",
  "y",
  "z",
  "rotation",
  "rotationX",
  "rotationY",
] as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseRoot(
  value: unknown,
  required: readonly string[] = ROOT_2D_FIELDS_REQUIRED,
): RootResult {
  if (!isRecord(value))
    return {
      ok: false,
      errors: [{ kind: "record-shape", message: "A root must be a record." }],
    };
  const errors: RootError[] = [];
  for (const field of required) {
    const cell = value[field];
    if (typeof cell !== "number" || !Number.isFinite(cell))
      errors.push({ kind: "field-shape", field });
  }
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };
  return { ok: true, value: Object.freeze({}) };
}

export function bindRoot(_structure: RootStructure, value: unknown): Root {
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
