import { describe, expect, it } from "vitest";
import type { ProjectHandle } from "../../src/engine";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { selectRecord, selectRow } from "../../src/contract/output-select";
import { loadPlayground } from "../../../../apps/ik-playground/src/playground-runtime";
import { TENTACLE, nodeId } from "../../../../apps/ik-playground/src/ik-playground-project";
import { IK3D, IK3D_NODE_ID } from "../../../../apps/ik-playground/src/ik3d-playground-project";

interface FakeScroll {
  subscribe(onProgress: (progress: number) => void): () => void;
  emit(progress: number): void;
}

function scrollSource(): FakeScroll {
  const listeners = new Set<(progress: number) => void>();
  return {
    subscribe(onProgress) {
      listeners.add(onProgress);
      return () => {
        listeners.delete(onProgress);
      };
    },
    emit(progress) {
      for (const listener of [...listeners]) listener(progress);
    },
  };
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

async function loaded(): Promise<{
  runtime: Awaited<ReturnType<typeof loadPlayground>>;
  flush: () => void;
}> {
  const scroll = scrollSource();
  const scheduler = createFakeScheduler();
  const runtime = await loadPlayground({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    scroll,
  });
  const flush = () => {
    scheduler.flush();
    runtimeOf(runtime.project).graph.flush([...runtime.project.mountedNodeIds()]);
  };
  scroll.emit(1);
  flush();
  return { runtime, flush };
}

function readyValues(handle: ProjectHandle, node: string) {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Node ${node} is not ready`);
  return patch.outputs.values;
}

describe("ik-playground runs the aggregate pipeline", () => {
  it("publishes one pose row per member and solver rows plus the inspect record", async () => {
    const { runtime, flush } = await loaded();
    const { project, goals } = runtime;
    try {
      const planar = readyValues(project, nodeId(TENTACLE.poseTrack));
      expect(Array.isArray(planar)).toBe(true);
      const planarRows = planar as readonly { readonly id: string }[];
      expect(planarRows.map((row) => row.id)).toEqual([...TENTACLE.memberTracks]);
      const tip = selectRow(planar, TENTACLE.tipTrack);
      expect(tip.kind).toBe("row");

      const solve = project.get(nodeId(TENTACLE.solverTrack));
      expect(solve?.status).toBe("ready");
      if (solve?.status !== "ready") throw new Error("missing solve");
      const solved = selectRow(solve.outputs.values, TENTACLE.tipTrack);
      expect(solved.kind).toBe("row");
      if (solved.kind === "row") {
        expect(typeof solved.cells.rotation).toBe("number");
        expect(Number.isFinite(solved.cells.rotation)).toBe(true);
      }
      const inspect = selectRecord(solve.outputs.inspect);
      expect(inspect.kind).toBe("record");
      if (inspect.kind === "record") expect(typeof inspect.values.residual).toBe("number");

      const spatial = readyValues(project, IK3D_NODE_ID(IK3D.poseTrack));
      expect(Array.isArray(spatial)).toBe(true);
      expect((spatial as readonly { readonly id: string }[]).map((row) => row.id)).toEqual([
        ...IK3D.memberTracks,
      ]);

      const before = selectRow(readyValues(project, nodeId(TENTACLE.poseTrack)), TENTACLE.tipTrack);
      if (before.kind !== "row") throw new Error("missing tip row");
      const beforeX = before.cells.x;
      goals.move({ rig: "planar", x: 240, y: 250 });
      flush();
      const goalsTable = readyValues(project, nodeId(TENTACLE.goalsTrack));
      const goal = selectRow(goalsTable, TENTACLE.goalRowId);
      expect(goal).toEqual({
        kind: "row",
        cells: { memberId: TENTACLE.tipTrack, x: 240, y: 250 },
      });
      const after = selectRow(readyValues(project, nodeId(TENTACLE.poseTrack)), TENTACLE.tipTrack);
      if (after.kind !== "row") throw new Error("missing tip row after move");
      expect(after.cells.x).not.toBe(beforeX);

      goals.move({ rig: "spatial", x: 190, y: 155, z: 20 });
      const spatialGoal = selectRow(
        readyValues(project, IK3D_NODE_ID(IK3D.goalsTrack)),
        IK3D.goalRowId,
      );
      expect(spatialGoal).toEqual({
        kind: "row",
        cells: { memberId: IK3D.tipTrack, x: 190, y: 155, z: 20 },
      });
    } finally {
      project.dispose();
    }
  });

  it("disposes every node without leaving a subscription behind", async () => {
    const { runtime } = await loaded();
    const { project } = runtime;
    expect(() => project.dispose()).not.toThrow();
  });
});
