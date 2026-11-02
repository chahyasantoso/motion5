import type { Outputs, ResolvedInput, Scalar } from "@motion5/core/plugin-api";

/** One input replayed at every sampled progress. */
export interface StabilityFixture {
  readonly name: string;
  readonly input: ResolvedInput;
}

/** The producer surface stability checking needs. */
export interface StableProducer {
  readonly id: string;
  transform(input: never, context: { readonly nodeId: string; readonly progress: number }): Outputs;
}

const DEFAULT_SAMPLES = Object.freeze([0, 0.5, 1]);

function tableSignature(outputs: Outputs): string {
  const parts: string[] = [];
  for (const name of Object.keys(outputs).sort()) {
    const value = outputs[name];
    if (!Array.isArray(value)) continue;
    parts.push(`${name}:${value.map((row) => row.id).join(",")}`);
  }
  return parts.join("|");
}

function staticSignature(outputs: Outputs): string {
  const cells: string[] = [];
  for (const name of Object.keys(outputs).sort()) {
    const value = outputs[name];
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const row of value as readonly {
        readonly id: string;
        readonly cells: Readonly<Record<string, Scalar>>;
      }[]) {
        for (const [field, cell] of Object.entries(row.cells).sort(([a], [b]) =>
          a < b ? -1 : a > b ? 1 : 0,
        ))
          if (!isNumericCell(cell))
            cells.push(`${name}.${row.id}.${field}=${JSON.stringify(cell)}`);
      }
      continue;
    }
    for (const [field, cell] of Object.entries(value).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0,
    ))
      if (!isNumericCell(cell)) cells.push(`${name}.${field}=${JSON.stringify(cell)}`);
  }
  return cells.join("|");
}

function isNumericCell(value: Scalar): boolean {
  return typeof value === "number";
}

/**
 * Replays producer fixtures across progress samples and refuses a row id set or non-numeric static
 * cell that moves. Numeric cells are the animated half and are deliberately ignored.
 */
export function assertStable(
  plugin: StableProducer,
  fixtures: readonly StabilityFixture[],
  progressSamples: readonly number[] = DEFAULT_SAMPLES,
): void {
  if (progressSamples.length === 0)
    throw new TypeError("assertStable requires at least one progress sample.");
  for (const fixture of fixtures) {
    let rows: string | undefined;
    let statics: string | undefined;
    for (const progress of progressSamples) {
      if (!Number.isFinite(progress) || progress < 0 || progress > 1)
        throw new TypeError(`assertStable progress must be in [0, 1], received ${progress}.`);
      const outputs = plugin.transform(fixture.input as never, {
        nodeId: fixture.name,
        progress,
      });
      const nextRows = tableSignature(outputs);
      const nextStatics = staticSignature(outputs);
      if (rows === undefined) {
        rows = nextRows;
        statics = nextStatics;
        continue;
      }
      if (nextRows !== rows)
        throw new Error(
          `Plugin '${plugin.id}' fixture '${fixture.name}' changed row ids at progress ${progress}.`,
        );
      if (nextStatics !== statics)
        throw new Error(
          `Plugin '${plugin.id}' fixture '${fixture.name}' changed static cells at progress ${progress}.`,
        );
    }
  }
}
