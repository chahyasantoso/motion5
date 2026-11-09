/** A flat record of scalars, the shape these fixtures publish as their `values` output. */
export type TestValues = Readonly<Record<string, number | string | boolean>>;

function isScalarRecord(value: unknown): value is TestValues {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.values(value).every(
    (item) => typeof item === "number" || typeof item === "string" || typeof item === "boolean",
  );
}

/** `outputs` with a `values` member, which is what every ready patch the plugin suites publish. */
function hasValuesMember(outputs: unknown): outputs is { readonly values?: unknown } {
  return outputs !== null && typeof outputs === "object" && "values" in outputs;
}

/** The ready patch's `values` output, narrowed without a cast. */
export function patchValues(patch: {
  readonly status: string;
  readonly outputs?: unknown;
}): TestValues {
  const value = hasValuesMember(patch.outputs) ? patch.outputs.values : undefined;
  if (!isScalarRecord(value))
    throw new Error("Expected a ready patch with a flat-record values output.");
  return value;
}
