import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { buildGraphIR } from "../../../src/graph/ir";
import { validateV5 } from "../../../src/contract/validate-v5";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}
function ruleIds(diagnostics: readonly Diagnostic[]): readonly string[] {
  return diagnostics.map(({ ruleId }) => ruleId);
}
function freeProject(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return { schemaVersion: 5, projectId: "cache", motions: [], freeTracks: tracks };
}

describe("IncrementalGraphBuilder cache correctness (W1)", () => {
  // collectTrack only ever produces diagnostics on the path that computes a node. A cached
  // result therefore carries the node but not the reasons it is incomplete, so every build
  // after the first reports a clean project that is missing content the author declared.
  // This is silent data loss, not a stale-cache annoyance.
  it("re-reports a rejected observation edge instead of caching the omission", () => {
    const root: TrackDefinition = { id: "root", keyframes: { x: ramp(0, 100) } };
    // An authored projection: `resolveObservationEdge` refuses it, `collectTrack` collects the
    // diagnostic and drops the edge, and the node comes back incomplete. Cast, because the field
    // is no longer declared and a JavaScript author can still write it.
    const child = {
      id: "child",
      keyframes: { y: ramp(0, 50) },
      observes: [{ source: "~/root", projection: { pick: ["x"] } }],
    } as unknown as TrackDefinition;
    const project = freeProject([root, child]);
    const builder = new IncrementalGraphBuilder();

    const first = builder.build(project);
    expect(first.graph).toBeUndefined();
    expect(ruleIds(first.diagnostics)).toContain("observation-projection-unsupported");

    // Before the fix: diagnostics were empty and a graph was returned, with ~/child present and
    // its declared observation edge gone forever.
    const second = builder.build(project);
    expect(ruleIds(second.diagnostics)).toContain("observation-projection-unsupported");
    expect(second.graph).toBeUndefined();
  });

  it("re-reports an invalid track id instead of caching the absent node", () => {
    const bad: TrackDefinition = { id: "a/b", keyframes: { x: ramp(0, 1) } };
    const project = freeProject([bad]);
    const builder = new IncrementalGraphBuilder();

    const first = builder.build(project);
    expect(first.graph).toBeUndefined();
    expect(ruleIds(first.diagnostics)).toContain("track-id");

    // Today: `undefined` was cached, so the second build emits nothing and succeeds with an
    // empty node list -- a project that was correctly rejected once now loads.
    const second = builder.build(project);
    expect(ruleIds(second.diagnostics)).toContain("track-id");
    expect(second.graph).toBeUndefined();
  });

  // A5: node ids are derived from (owner, ownerId, track.id), so the track object alone
  // cannot key them. Reusing one definition across two motions is legal -- validateV5 scopes
  // track-id uniqueness per motion -- and buildGraphIR handles it. The cache returns motion
  // m1's node for m2, `seen` then rejects it, and Engine.load throws on a valid project.
  it("keys the cache by owner so one track object can back two motion nodes", () => {
    const shared: TrackDefinition = { id: "t", keyframes: { x: ramp(0, 100) } };
    const project: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "cache",
      motions: [
        { id: "m1", trigger: { type: "manual" }, tracks: [shared] },
        { id: "m2", trigger: { type: "manual" }, tracks: [shared] },
      ],
    };

    expect(validateV5(project).valid).toBe(true);

    const incremental = new IncrementalGraphBuilder().build(project);
    expect(ruleIds(incremental.diagnostics)).not.toContain("node-duplicate");
    expect(Object.keys(incremental.graph?.nodeById ?? {}).sort()).toEqual(["m1/t", "m2/t"]);
  });

  // The real invariant: the cached builder must be observationally equivalent to the
  // uncached reference builder for any project, on any build.
  it("agrees with buildGraphIR on every project in this file", () => {
    const shared: TrackDefinition = { id: "t", keyframes: { x: ramp(0, 100) } };
    const projects: readonly ProjectDefinition[] = [
      freeProject([{ id: "root", keyframes: { x: ramp(0, 100) } }]),
      freeProject([{ id: "a/b", keyframes: { x: ramp(0, 1) } }]),
      {
        schemaVersion: 5,
        projectId: "cache",
        motions: [
          { id: "m1", trigger: { type: "manual" }, tracks: [shared] },
          { id: "m2", trigger: { type: "manual" }, tracks: [shared] },
        ],
      },
    ];

    for (const project of projects) {
      const builder = new IncrementalGraphBuilder();
      const reference = buildGraphIR(project);
      // Twice, because the first build is the only one the cache cannot affect.
      for (const pass of [1, 2]) {
        const candidate = builder.build(project);
        expect(candidate.graph === undefined, `pass ${pass}`).toBe(reference.graph === undefined);
        expect(Object.keys(candidate.graph?.nodeById ?? {}).sort(), `pass ${pass}`).toEqual(
          Object.keys(reference.graph?.nodeById ?? {}).sort(),
        );
        expect(candidate.graph?.order, `pass ${pass}`).toEqual(reference.graph?.order);
      }
    }
  });

  // Guards against "fix the cache" degrading into "delete the cache". Node identity is what
  // makes adopt/destroyAdopted incremental rather than a full rebuild per mutation.
  it("returns the identical GraphNode for an unchanged track across builds", () => {
    const root: TrackDefinition = { id: "root", keyframes: { x: ramp(0, 100) } };
    const project = freeProject([root]);
    const builder = new IncrementalGraphBuilder();

    const first = builder.build(project);
    const second = builder.build(project);
    expect(first.graph?.nodeById["~/root"]).toBeDefined();
    expect(second.graph?.nodeById["~/root"]).toBe(first.graph?.nodeById["~/root"]);
  });

  // And the other half of the identity contract: a different object at the same node id is a
  // miss, so a replaced track always rebuilds. W5's replaceTrack depends on this.
  it("rebuilds when a different track object takes the same node id", () => {
    const before: TrackDefinition = { id: "t", keyframes: { x: ramp(0, 10) } };
    const after: TrackDefinition = { id: "t", keyframes: { x: ramp(0, 999) } };
    const builder = new IncrementalGraphBuilder();

    const first = builder.build(freeProject([before]));
    const second = builder.build(freeProject([after]));
    expect(first.graph?.nodeById["~/t"]?.track).toBe(before);
    expect(second.graph?.nodeById["~/t"]?.track).toBe(after);
  });
});
