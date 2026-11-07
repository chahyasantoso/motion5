import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validateV5, type ProjectDefinition } from "@motion5/core";
import { code } from "../../../packages/core/test/helpers/source-region";
import { loadBuiltinCatalog } from "../../../scripts/motion-tools/catalog";
import { sampleProject, type NodeSample } from "../../../scripts/motion-tools/sample";

const PROJECT_URL = new URL("../src/timing-beat.json", import.meta.url);
const COMPONENT_URL = new URL("../src/TimingBeat.tsx", import.meta.url);

async function project(): Promise<ProjectDefinition> {
  const validated = validateV5(
    JSON.parse(readFileSync(PROJECT_URL, "utf8")),
    await loadBuiltinCatalog(),
  );
  if (validated.kind === "refused") throw new Error(JSON.stringify(validated.diagnostics));
  return validated.value;
}

async function sampleAt(ms: number) {
  const result = sampleProject(await project(), await loadBuiltinCatalog(), {
    kind: "time",
    ms: [ms],
  });
  if (result.kind !== "accepted") throw new Error(JSON.stringify(result));
  return result.samples[0]?.nodes ?? {};
}

function values(sample: NodeSample | undefined) {
  if (sample?.status !== "ready") throw new Error(`Expected ready, got ${sample?.status}.`);
  return sample.outputs.values;
}

describe("timing beat", () => {
  it("is plain data that validates against the built-in catalog", async () => {
    expect((await project()).motions).toHaveLength(3);
  });

  it("holds every letter above the stage at the first frame, and the dot off it", async () => {
    const nodes = await sampleAt(0);
    for (const letter of ["t", "i", "m", "i2", "n", "g"])
      expect(values(nodes[`letters/${letter}`])).toMatchObject({ y: -700 });
    expect(values(nodes["period/dot"])).toMatchObject({ x: -1300, y: 0 });
    expect(values(nodes["cover/wipe"])).toEqual({ clipPath: "circle(0px at 967px 413px)" });
  });

  it("drops the letters in order", async () => {
    const nodes = await sampleAt(500);
    const heights = ["t", "i", "m", "i2", "n", "g"].map((letter) => {
      const cell = values(nodes[`letters/${letter}`]);
      if (cell === undefined || Array.isArray(cell)) throw new Error(`${letter} has no record.`);
      return Number(Reflect.get(cell, "y"));
    });
    for (let index = 1; index < heights.length; index += 1)
      expect(heights[index]).toBeLessThanOrEqual(heights[index - 1] ?? 0);
    expect(heights[0]).toBe(0);
    expect(heights[5]).toBe(-700);
  });

  it("lands the word and the period at their rest poses before the wipe", async () => {
    const nodes = await sampleAt(2300);
    for (const letter of ["t", "i", "m", "i2", "n", "g"])
      expect(values(nodes[`letters/${letter}`])).toEqual({ y: 0, scaleX: 1, scaleY: 1 });
    expect(values(nodes["period/dot"])).toEqual({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });

  it("covers the stage by the end", async () => {
    expect(values((await sampleAt(3000))["cover/wipe"])).toEqual({
      clipPath: "circle(1500px at 967px 413px)",
    });
  });

  it("keeps all motion out of the component: no arithmetic, easing or timing there", () => {
    const source = code(COMPONENT_URL);
    expect(source).not.toMatch(/Math\.|ease|duration|stagger|progress/i);
  });
});
