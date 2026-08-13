import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";

describe("observation projection validation (X-1)", () => {
  it("rejects an input projection that is neither pick nor map", () => {
    const project = {
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            { id: "source" },
            {
              id: "observer",
              observes: [
                {
                  source: "source",
                  role: "input",
                  projection: { nope: true },
                },
              ],
            },
          ],
        },
      ],
    } as unknown as ProjectDefinition;

    expect(buildGraphIR(project).diagnostics.map(({ ruleId }) => ruleId)).toContain(
      "observation-input-projection",
    );
  });

  it("accepts projected input observations without the compatibility target", () => {
    const project = {
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            { id: "source" },
            {
              id: "observer",
              observes: [
                {
                  source: "source",
                  role: "input",
                  projection: { pick: ["opacity"] },
                },
              ],
            },
          ],
        },
      ],
    } as unknown as ProjectDefinition;

    expect(buildGraphIR(project).diagnostics).toEqual([]);
  });
});
