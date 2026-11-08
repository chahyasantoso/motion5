import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateV5, type ProjectDefinition } from "@motion5/core";
import { code } from "../../../packages/core/test/helpers/source-region";
import { loadBuiltinCatalog } from "../../../packages/tools/src/engine/catalog";
import { sampleProject } from "../../../packages/tools/src/engine/sample";

const COMPONENT = join(process.cwd(), "apps/react-demo/src/rope-word.tsx");

async function project(): Promise<ProjectDefinition> {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "apps/react-demo/src/rope-word.json"), "utf8"),
  );
  const validated = validateV5(raw, await loadBuiltinCatalog());
  if (validated.kind === "refused") throw new Error(JSON.stringify(validated.diagnostics));
  return validated.value;
}

function rows(value: unknown): { x: number; y: number }[] {
  if (!Array.isArray(value)) throw new Error("Expected rows.");
  return value.map((row: unknown) => {
    const cells = Object(Reflect.get(Object(row), "cells"));
    return { x: Number(cells.x), y: Number(cells.y) };
  });
}

describe("rope word", () => {
  it("settles the rope exactly on the word before the ink writes it on", async () => {
    const loaded = await project();
    const track = loaded.motions[0]?.tracks.find(({ id }) => id === "rope");
    const shape = rows(track?.input?.values);
    const result = sampleProject(loaded, await loadBuiltinCatalog(), {
      kind: "time",
      ms: [2800],
    });
    if (result.kind !== "accepted") throw new Error(result.kind);
    const sample = result.samples[0]?.nodes["write/rope"];
    if (sample?.status !== "ready") throw new Error(`rope is ${sample?.status}`);
    rows(sample.outputs.values).forEach((point, index) => {
      expect(point.x).toBeCloseTo(shape[index]!.x, 6);
      expect(point.y).toBeCloseTo(shape[index]!.y, 6);
    });
  });

  it("keeps all motion out of the component", () => {
    expect(code(COMPONENT)).not.toMatch(/Math\.|ease|duration|stagger|progress/i);
  });
});
