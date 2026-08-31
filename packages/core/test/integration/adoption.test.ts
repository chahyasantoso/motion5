import { describe, expect, it } from "vitest";
import type { TrackDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
const freeTrack: TrackDefinition = { id: "cursor" };

describe("P5-02 adopted free tracks", () => {
  it("adopts a free track under ~/id and publishes through the ordinary graph path", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const adopted = runtime.adopt(freeTrack, owner);
    expect(adopted.id).toBe("~/cursor");
    expect(runtime.instanceCount).toBe(1);
    // The adopt publishes it, rather than the seek that used to follow: a structural commit seeds
    // its own flush now (issue #223, `RA-9`). The seek is a no-op by construction, because the
    // value it would publish is the one already retained, and that half is asserted rather than
    // dropped: without it, published-early and published-twice look the same from here.
    expect(runtime.graph.registry.get("~/cursor")?.values).toEqual({ node: "~/cursor" });
    expect(runtime.seek("~/cursor", 0).patches).toEqual([]);
    runtime.dispose();
  });

  it("rejects duplicate adopted ids instead of silently replacing membership", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    runtime.adopt(freeTrack, {});
    expect(() => runtime.adopt(freeTrack, {})).toThrow(/already exists/);
    runtime.dispose();
  });

  it("lets a borrower unmount without destroying the adopted track, while only the owner can destroy it", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const adopted = runtime.adopt(freeTrack, owner);
    runtime.unmount(adopted.id);
    expect(runtime.instanceCount).toBe(0);
    expect(runtime.graph.state.snapshot().nodes).toContain("~/cursor");
    expect(() => runtime.destroyAdopted(adopted.id, {})).toThrow(/owner/);
    runtime.destroyAdopted(adopted.id, owner);
    expect(runtime.graph.state.snapshot().nodes).not.toContain("~/cursor");
    runtime.dispose();
  });

  it("keeps every adopted track independently addressable across sequential adopt and destroy calls", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const cursor = runtime.adopt({ id: "cursor" }, owner);
    const drag = runtime.adopt({ id: "drag" }, owner);
    expect(runtime.graph.state.snapshot().nodes).toEqual(
      expect.arrayContaining(["~/cursor", "~/drag"]),
    );
    // Each adopt published its own node and nothing else. Read at the commit rather than through a
    // following seek, and read per id, because addressability is the claim: a commit that seeded
    // the whole member set instead of the node it touched would pass a two-node assertion here and
    // fail this one on the second adopt, which would republish the first.
    expect(runtime.graph.registry.get(cursor.id)?.values).toEqual({ node: "~/cursor" });
    expect(runtime.graph.registry.get(drag.id)?.values).toEqual({ node: "~/drag" });
    expect(runtime.graph.registry.get(cursor.id)?.revision).toBe(1);
    runtime.destroyAdopted(cursor.id, owner);
    expect(runtime.graph.state.snapshot().nodes).not.toContain("~/cursor");
    expect(runtime.graph.state.snapshot().nodes).toContain("~/drag");
    // Eviction drops the retained patch, so the destroyed node is addressable as absent rather
    // than as its final pose.
    expect(runtime.graph.registry.get(cursor.id)).toBeUndefined();
    expect(runtime.graph.registry.get(drag.id)?.values).toEqual({ node: "~/drag" });
    runtime.dispose();
  });

  it("rejects adopted tracks with non-finite stop positions", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    expect(() =>
      runtime.adopt({ id: "bad", keyframes: { x: [{ p: Number.NaN, v: 0 }] } }, {}),
    ).toThrow(/stop-position/);
    runtime.dispose();
  });

  it("rejects adopted tracks with non-monotonic stop positions", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    expect(() =>
      runtime.adopt(
        {
          id: "bad",
          keyframes: {
            x: [
              { p: 0.5, v: 0 },
              { p: 0.2, v: 1 },
            ],
          },
        },
        {},
      ),
    ).toThrow(/stop-position/);
    runtime.dispose();
  });

  it("rejects adopted tracks with duplicate stop positions", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    expect(() =>
      runtime.adopt(
        {
          id: "bad",
          keyframes: {
            x: [
              { p: 0, v: 0 },
              { p: 0, v: 1 },
            ],
          },
        },
        {},
      ),
    ).toThrow(/stop-position/);
    runtime.dispose();
  });

  it("adopts a track into an existing motion under motionId/trackId", () => {
    let addedMotion: string | undefined;
    let addedTrack: string | undefined;
    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose,
      addMotionTrack: (mId, tId) => {
        addedMotion = mId;
        addedTrack = tId;
      },
    });
    const owner = {};
    const adopted = runtime.adopt({ id: "opacity" }, owner, { motionId: "hero" });
    expect(adopted.id).toBe("hero/opacity");
    expect(runtime.graph.state.snapshot().nodes).toContain("hero/opacity");
    expect(addedMotion).toBe("hero");
    expect(addedTrack).toBe("hero/opacity");

    // Published by the commit, and after the Motion entry was written: the flush is seeded once the
    // settle steps ran, so a node that publishes here is one its Motion can already resolve.
    expect(runtime.graph.registry.get("hero/opacity")?.values).toEqual({ node: "hero/opacity" });
    expect(runtime.seek("hero/opacity", 0).patches).toEqual([]);
    runtime.dispose();
  });

  it("rejects adopting into a non-existent motion", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    expect(() => runtime.adopt({ id: "opacity" }, {}, { motionId: "nonexistent" })).toThrow(
      /nonexistent/,
    );
    runtime.dispose();
  });

  it("destroys a motion-adopted track and invokes removeMotionTrack", () => {
    let removedMotion: string | undefined;
    let removedTrack: string | undefined;
    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose,
      removeMotionTrack: (mId, tId) => {
        removedMotion = mId;
        removedTrack = tId;
      },
    });
    const owner = {};
    const adopted = runtime.adopt({ id: "opacity" }, owner, { motionId: "hero" });
    expect(runtime.graph.state.snapshot().nodes).toContain("hero/opacity");

    runtime.destroyAdopted(adopted.id, owner);
    expect(runtime.graph.state.snapshot().nodes).not.toContain("hero/opacity");
    expect(removedMotion).toBe("hero");
    expect(removedTrack).toBe("hero/opacity");
    runtime.dispose();
  });
});
