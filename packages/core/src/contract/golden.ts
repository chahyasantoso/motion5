import type { Diagnostic } from "./v5";

export interface GoldenFixture<TInput = unknown, TOutput = unknown> {
  readonly id: string;
  readonly description: string;
  readonly input: TInput;
  readonly expected: TOutput;
}

export interface GoldenValidationFixture {
  readonly id: string;
  readonly input: unknown;
  readonly expected: {
    readonly valid: boolean;
    readonly diagnostics: readonly Pick<Diagnostic, "ruleId" | "path" | "severity">[];
  };
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortKeys(entry)]),
  );
}

/** Stable, JSON-safe serialization for golden input/output evidence. */
export function serializeGolden(value: unknown): string {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}

export function parseGolden<T>(serialized: string): T {
  return JSON.parse(serialized) as T;
}
