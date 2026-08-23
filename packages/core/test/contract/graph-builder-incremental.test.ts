import { describe, expect, test } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { IncrementalGraphBuilder } from "../../src/adapters/graph-builder/incremental";
import { buildGraphIR } from "../../src/graph/ir";

describe("IncrementalGraphBuilder Equivalence", () => {
  const getTestProject = (): ProjectDefinition => ({
    schemaVersion: 5,
    motions: [
      {
        id: "m1",
        // Required by MotionDefinition. The builder never reads it, but the fixture claims to
        // be a ProjectDefinition, so it has to actually be one.
        trigger: { type: "manual" },
        tracks: [
          {
            id: "t1",
            keyframes: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 10 },
              ],
            },
          },
        ],
      },
    ],
    freeTracks: [
      {
        id: "f1",
        keyframes: {
          y: [
            { p: 0, v: 0 },
            { p: 1, v: 20 },
          ],
        },
        observes: [{ source: "m1/t1" }],
      },
    ],
  });

  test("produces the exact same output as buildGraphIR on first build", () => {
    const project = getTestProject();
    const builder = new IncrementalGraphBuilder();

    const expected = buildGraphIR(project);
    const actual = builder.build(project);

    expect(actual).toEqual(expected);
  });

  test("produces the exact same output on subsequent builds with new tracks appended", () => {
    const project = getTestProject();
    const builder = new IncrementalGraphBuilder();

    // First build populates the cache
    builder.build(project);

    // Append a new track (simulating adoption)
    const newTrack: TrackDefinition = {
      id: "f2",
      keyframes: {
        z: [
          { p: 0, v: 0 },
          { p: 1, v: 30 },
        ],
      },
      observes: [{ source: "~/f1" }],
    };

    const nextProject: ProjectDefinition = {
      ...project,
      freeTracks: [...(project.freeTracks ?? []), newTrack],
    };

    const expected = buildGraphIR(nextProject);
    const actual = builder.build(nextProject);

    expect(actual).toEqual(expected);
  });

  test("memoizes GraphNode references across builds", () => {
    const project = getTestProject();
    const builder = new IncrementalGraphBuilder();

    const result1 = builder.build(project);
    const result2 = builder.build(project);

    // Ensure the nodes are referentially identical because they came from the WeakMap
    expect(result1.graph?.nodes[0]).toBe(result2.graph?.nodes[0]);
    expect(result1.graph?.nodes[1]).toBe(result2.graph?.nodes[1]);
  });
});
