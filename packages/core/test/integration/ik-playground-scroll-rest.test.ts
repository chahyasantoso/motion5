import { describe, expect, it, vi } from "vitest";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import { createManualClock } from "../../src/ports/clock";
import { Engine, type ProjectHandle } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../../plugins/src/fk";
import { ikPlugin } from "../../../plugins/src/ik";
import { transformPlugin } from "../../../plugins/src/transform";
import { fk3dPlugin } from "../../../plugins/src/fk3d";
import { ik3dPlugin } from "../../../plugins/src/ik3d";
import { transform3dPlugin } from "../../../plugins/src/transform3d";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { FABRIK_TOLERANCE } from "../../../plugins/src/fabrik";
import {
  ALL_NODE_IDS,
  STAGE_2D,
  frameTrack,
  ikPlaygroundProject,
  TENTACLE,
  nodeId,
} from "../../../../apps/ik-playground/src/ik-playground-project";
import {
  IK3D,
  IK3D_NODE_ID,
  IK3D_NODE_IDS,
  IK3D_PERSPECTIVE,
  ik3dPlaygroundMotion,
} from "../../../../apps/ik-playground/src/ik3d-playground-project";
import { loadPlayground } from "../../../../apps/ik-playground/src/playground-runtime";

function source() {
  const listeners = new Set<(progress: number) => void>();
  const value: ScrollSource = {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  return {
    value,
    listeners,
    emit(progress: number) {
      for (const listener of [...listeners]) listener(progress);
    },
  };
}

async function load() {
  const scroll = source();
  const scheduler = createFakeScheduler();
  const runtime = await loadPlayground({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    scroll: scroll.value,
  });
  const flush = () => {
    for (let rounds = 0; scheduler.pending.length; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      scheduler.flush();
    }
  };
  const emit = (progress: number) => {
    scroll.emit(progress);
    flush();
  };
  flush();
  emit(0);
  return { runtime, scroll, scheduler, emit, flush };
}

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  for (const plugin of [
    transformPlugin,
    fkPlugin,
    ikPlugin,
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
  ])
    plugins.register(plugin);
  return plugins;
}

function reference2d(x: number, y: number) {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins: registry(),
    triggerFactory: createTriggerFactory({ scroll: () => ({ subscribe: () => () => undefined }) }),
  }).load({
    ...ikPlaygroundProject,
    motions: [
      {
        ...ikPlaygroundProject.motions[0]!,
        trigger: { type: "manual" },
        tracks: ikPlaygroundProject.motions[0]!.tracks.map((track) =>
          track.id === TENTACLE.goalTrack ? frameTrack(TENTACLE.goalTrack, x, y) : track,
        ),
      },
    ],
  });
  for (const id of ALL_NODE_IDS) handle.mount(id);
  drain(scheduler);
  return { handle, scheduler };
}

function reference3d(x: number, y: number, z: number) {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins: registry(),
  }).load({
    schemaVersion: 5,
    projectId: "ik-playground-3d-reference",
    perspective: IK3D_PERSPECTIVE,
    motions: [
      {
        ...ik3dPlaygroundMotion,
        trigger: { type: "manual" },
        tracks: ik3dPlaygroundMotion.tracks.map((track) =>
          track.id === IK3D.goalTrack
            ? { id: IK3D.goalTrack, keyframes: { transform3d: { values: { x, y, z } } } }
            : track,
        ),
      },
    ],
  });
  for (const id of IK3D_NODE_IDS) handle.mount(id);
  drain(scheduler);
  return { handle, scheduler };
}

function drain(scheduler: ReturnType<typeof createFakeScheduler>): void {
  for (let rounds = 0; scheduler.pending.length; rounds++) {
    if (rounds > 20) throw new Error("Scheduler did not settle.");
    scheduler.flush();
  }
}

type Values = Readonly<Record<string, unknown>>;
function values(runtime: Awaited<ReturnType<typeof load>>["runtime"], id: string): Values {
  const patch = runtime.project.get(id);
  if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}`);
  return patch.values;
}
function valuesFrom(handle: ProjectHandle, id: string): Values {
  const patch = handle.get(id);
  if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}`);
  return patch.values;
}
function snapshot(
  runtime: Awaited<ReturnType<typeof load>>["runtime"],
): Readonly<Record<string, Values>> {
  return Object.fromEntries(
    [...ALL_NODE_IDS, ...IK3D_NODE_IDS].map((id) => [id, values(runtime, id)]),
  );
}
function distance2d(left: Values, right: { x: number; y: number }): number {
  return Math.hypot(Number(left.x) - right.x, Number(left.y) - right.y);
}
function distance3d(left: Values, right: Values): number {
  return Math.hypot(
    Number(left.x) - Number(right.x),
    Number(left.y) - Number(right.y),
    Number(left.z) - Number(right.z),
  );
}

function expectPlanarRest(runtime: Awaited<ReturnType<typeof load>>["runtime"]): void {
  let x = TENTACLE.root.x;
  let y = TENTACLE.root.y;
  let rotation = 0;
  [...TENTACLE.memberTracks, TENTACLE.fkTailTrack].forEach((track, index) => {
    rotation += TENTACLE.restRotations[index] ?? 0;
    const length = TENTACLE.lengths[index] ?? TENTACLE.fkTailLength;
    x += length * Math.cos((rotation * Math.PI) / 180);
    y += length * Math.sin((rotation * Math.PI) / 180);
    const frame = values(runtime, nodeId(track));
    expect(Number(frame.x)).toBeCloseTo(x, 7);
    expect(Number(frame.y)).toBeCloseTo(y, 7);
    expect(Number(frame.rotation)).toBeCloseTo(rotation, 7);
  });
}

describe("IK playground scroll-only rest blending", () => {
  it("TH-134 takes both FABRIK chains from authored rest to solved and back byte-identically", async () => {
    const test = await load();
    try {
      expectPlanarRest(test.runtime);
      const rest = snapshot(test.runtime);
      const initialGoal2d = values(test.runtime, nodeId(TENTACLE.goalTrack));
      const initialGoal3d = values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack));
      test.emit(1);
      const goal2d = values(test.runtime, nodeId(TENTACLE.goalTrack));
      const tip2d = values(test.runtime, nodeId(TENTACLE.tipTrack));
      expect(distance2d(tip2d, { x: Number(goal2d.x), y: Number(goal2d.y) })).toBeLessThan(0.1);
      const goal3d = values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack));
      const tip3d = values(test.runtime, IK3D_NODE_ID(IK3D.tipTrack));
      expect(distance3d(tip3d, goal3d)).toBeLessThanOrEqual(FABRIK_TOLERANCE);
      expect(values(test.runtime, IK3D_NODE_ID(IK3D.solverTrack))).toMatchObject({
        inspect: true,
        inspection: { kind: "converged" },
      });
      test.emit(0);
      expect(snapshot(test.runtime)).toEqual(rest);
      expect(values(test.runtime, nodeId(TENTACLE.goalTrack))).toEqual(initialGoal2d);
      expect(values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack))).toEqual(initialGoal3d);

      // Weight zero is authored rest, independently of a goal edit; this also protects the 3D FK
      // composition without introducing a second hand-maintained spatial rest calculation.
      test.runtime.goals.move({ rig: "spatial", x: 240, y: 130, z: -90 });
      const movedGoal = values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack));
      expect(movedGoal).toMatchObject({ x: 240, y: 130, z: -90 });
      for (const id of TENTACLE.memberTracks)
        expect(values(test.runtime, nodeId(id))).toEqual(rest[nodeId(id)]);
      for (const id of IK3D.memberTracks)
        expect(values(test.runtime, IK3D_NODE_ID(id))).toEqual(rest[IK3D_NODE_ID(id)]);
    } finally {
      test.runtime.project.dispose();
    }
  });

  it("TH-136 moves the planar chain immediately at its current partial weight", async () => {
    const test = await load();
    // The oracle authors the goal where the drag puts it, so a live write must equal a document.
    const reference = reference2d(240, 250);
    try {
      test.emit(0.5);
      const before = test.runtime.project.get(nodeId(TENTACLE.tipTrack));
      test.runtime.goals.move({ rig: "planar", x: 240, y: 250 });
      const after = test.runtime.project.get(nodeId(TENTACLE.tipTrack));
      if (after?.status !== "ready") throw new Error("The tip did not publish a ready patch.");
      expect(after.sourceProgress).toBeCloseTo(0.5);
      expect(after).not.toBe(before);
      reference.handle.signal("rig", { type: "manual", progress: 0.5 });
      drain(reference.scheduler);
      for (const id of [...TENTACLE.memberTracks, TENTACLE.fkTailTrack])
        expect(values(test.runtime, nodeId(id))).toEqual(valuesFrom(reference.handle, nodeId(id)));

      const rest = TENTACLE.memberTracks.map((id) => values(test.runtime, nodeId(id)));
      test.runtime.goals.move({ rig: "planar", x: 300, y: 300 });
      // The same write at weight zero leaves all member frames at authored rest.
      test.emit(0);
      const zeroBefore = TENTACLE.memberTracks.map((id) => values(test.runtime, nodeId(id)));
      test.runtime.goals.move({ rig: "planar", x: 320, y: 320 });
      expect(TENTACLE.memberTracks.map((id) => values(test.runtime, nodeId(id)))).toEqual(
        zeroBefore,
      );
      expect(rest).not.toEqual(zeroBefore);
      test.emit(1);
      test.runtime.goals.move({ rig: "planar", x: 320, y: 320 });
      const tip = values(test.runtime, nodeId(TENTACLE.tipTrack));
      expect(distance2d(tip, { x: 320, y: 320 })).toBeLessThan(0.1);
    } finally {
      test.runtime.project.dispose();
      reference.handle.dispose();
    }
  });

  it("TH-137 moves the spatial chain immediately and reaches a dragged goal at weight one", async () => {
    const test = await load();
    const reference = reference3d(190, 155, 20);
    try {
      test.emit(0.5);
      test.runtime.goals.move({ rig: "spatial", x: 190, y: 155, z: 20 });
      const patch = test.runtime.project.get(IK3D_NODE_ID(IK3D.tipTrack));
      if (patch?.status !== "ready") throw new Error("The tip did not publish a ready patch.");
      expect(patch.sourceProgress).toBeCloseTo(0.5);
      reference.handle.signal("rig3d", { type: "manual", progress: 0.5 });
      drain(reference.scheduler);
      for (const id of IK3D_NODE_IDS)
        expect(values(test.runtime, id)).toEqual(valuesFrom(reference.handle, id));
      test.emit(1);
      test.runtime.goals.move({ rig: "spatial", x: 190, y: 155, z: 20 });
      expect(
        distance3d(values(test.runtime, IK3D_NODE_ID(IK3D.tipTrack)), {
          x: 190,
          y: 155,
          z: 20,
        }),
      ).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    } finally {
      test.runtime.project.dispose();
      reference.handle.dispose();
    }
  });

  it("TH-138 clamps goals, ignores non-finite input, and flips without graph replacement", async () => {
    const test = await load();
    try {
      const graph = (test.runtime.project as ProjectHandle & { readonly _runtime: ProjectRuntime })
        ._runtime.graph;
      const replace = vi.spyOn(graph, "replaceGraph");
      const planarBefore = test.runtime.project.get(nodeId(TENTACLE.goalTrack));
      const spatialBefore = test.runtime.project.get(IK3D_NODE_ID(IK3D.goalTrack));
      test.runtime.goals.move({ rig: "planar", x: NaN, y: 20 });
      test.runtime.goals.move({ rig: "spatial", x: Infinity, y: 20, z: 0 });
      expect(test.runtime.project.get(nodeId(TENTACLE.goalTrack))).toBe(planarBefore);
      expect(test.runtime.project.get(IK3D_NODE_ID(IK3D.goalTrack))).toBe(spatialBefore);
      test.runtime.goals.move({ rig: "planar", x: -100, y: 1000 });
      expect(values(test.runtime, nodeId(TENTACLE.goalTrack))).toMatchObject({
        x: STAGE_2D.margin,
        y: STAGE_2D.height - STAGE_2D.margin,
      });
      test.runtime.goals.move({ rig: "spatial", x: -100, y: 1000, z: 1000 });
      const spatial = values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack));
      // At the nearest depth the frame edge is exactly the authored box corner (TH-145).
      expect(Number(spatial.x)).toBeCloseTo(12, 9);
      expect(Number(spatial.y)).toBeCloseTo(288, 9);
      expect(spatial.z).toBe(160);
      test.runtime.goals.move({ rig: "planar", x: TENTACLE.goal.x, y: TENTACLE.goal.y });
      test.emit(1);
      const before = TENTACLE.memberTracks.map((id) =>
        Number(values(test.runtime, nodeId(id)).rotation),
      );
      test.runtime.goals.flip(true);
      const after = TENTACLE.memberTracks.map((id) =>
        Number(values(test.runtime, nodeId(id)).rotation),
      );
      expect(after).not.toEqual(before);
      expect(replace).not.toHaveBeenCalled();
    } finally {
      test.runtime.project.dispose();
    }
  });

  it("TH-139 coalesces scroll and unsubscribes both Motions on disposal", async () => {
    const test = await load();
    const graph = (test.runtime.project as ProjectHandle & { readonly _runtime: ProjectRuntime })
      ._runtime.graph;
    const publication = vi.spyOn(graph, "flush");
    publication.mockClear();
    const before = test.runtime.project.get(nodeId(TENTACLE.tipTrack));
    test.scroll.emit(0.25);
    test.scroll.emit(0.75);
    expect(test.runtime.project.get(nodeId(TENTACLE.tipTrack))).toBe(before);
    test.flush();
    const settled = test.runtime.project.get(nodeId(TENTACLE.tipTrack));
    if (settled?.status !== "ready") throw new Error("The tip did not publish a ready patch.");
    expect(settled.sourceProgress).toBeCloseTo(0.75);
    expect(publication).toHaveBeenCalledTimes(2);
    expect(test.scroll.listeners.size).toBe(2);
    test.runtime.project.dispose();
    expect(test.scroll.listeners.size).toBe(0);
    expect(() => {
      test.scroll.emit(0.5);
    }).not.toThrow();
  });

  it("preserves authored values while the source alone changes both member weights", async () => {
    const test = await load();
    try {
      const before2d = values(test.runtime, nodeId(TENTACLE.goalTrack));
      const before3d = values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack));
      const authored2d = test.runtime.project.track(nodeId(TENTACLE.goalTrack)).definition;
      const authored3d = test.runtime.project.track(IK3D_NODE_ID(IK3D.goalTrack)).definition;
      test.emit(0.5);
      expect(values(test.runtime, nodeId(TENTACLE.goalTrack))).toEqual(before2d);
      expect(values(test.runtime, IK3D_NODE_ID(IK3D.goalTrack))).toEqual(before3d);
      expect(test.runtime.project.track(nodeId(TENTACLE.goalTrack)).definition).toEqual(authored2d);
      expect(test.runtime.project.track(IK3D_NODE_ID(IK3D.goalTrack)).definition).toEqual(
        authored3d,
      );
    } finally {
      test.runtime.project.dispose();
    }
  });

  it("keeps the planar rest calculation inside the authored stage bounds", () => {
    expect(TENTACLE.root.x).toBeGreaterThanOrEqual(STAGE_2D.margin);
    expect(TENTACLE.root.y).toBeGreaterThanOrEqual(STAGE_2D.margin);
  });
});
