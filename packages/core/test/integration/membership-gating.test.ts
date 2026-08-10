import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
  freeTracks: [{ id: "cursor" }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("GraphRuntime membership", () => {
  it("starts empty and publishes only attached nodes by default", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);
    expect(runtime.memberCount).toBe(0);
    const batch = runtime.flush();
    expect(batch.seeds).toEqual([]);
    expect(batch.patches).toEqual([]);
    runtime.attach("hero/arm");
    expect(runtime.memberCount).toBe(1);
    expect(runtime.flush().seeds).toEqual(["hero/arm"]);
    runtime.detach("hero/arm");
    expect(runtime.memberCount).toBe(0);
    expect(runtime.flush().seeds).toEqual([]);
    runtime.dispose();
  });
});
