import { describe, expect, it, vi } from "vitest";
import {
  ALL_NODE_IDS,
  ARM,
  TENTACLE,
  ikPlaygroundProject,
  nodeId,
} from "../../../../apps/ik-playground/src/ik-playground-project";
import {
  bindScrollReach,
  createScrollReach,
} from "../../../../apps/ik-playground/src/scroll-reach";
import { Engine, type ProjectHandle } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import { lerpAngle } from "../../src/plugins/frame";

const rigs = [ARM, TENTACLE];
function load() {
  const plugins = new PluginRegistry();
  for (const plugin of [transformPlugin, fkPlugin, ikPlugin]) plugins.register(plugin);
  const scheduler = createFakeScheduler();
  const clock = createManualClock();
  let listener: ((progress: number) => void) | undefined;
  const unsubscribe = vi.fn(() => {
    listener = undefined;
  });
  const source: ScrollSource = {
    subscribe(fn) {
      listener = fn;
      return unsubscribe;
    },
  };
  let controller: ReturnType<typeof createScrollReach>;
  const handle = new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
    triggerFactory: createTriggerFactory({
      scroll: () => bindScrollReach(source, () => controller.commit()),
    }),
  }).load(ikPlaygroundProject);
  controller = createScrollReach(handle);
  for (const id of ALL_NODE_IDS) handle.mount(id);
  const flush = () => {
    for (let rounds = 0; scheduler.pending.length; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      scheduler.flush();
    }
  };
  const push = (progress: number) => listener?.(progress);
  const emit = (progress: number) => {
    push(progress);
    flush();
  };
  emit(0);
  return { handle, controller, emit, push, flush, clock, unsubscribe };
}
function pose(handle: ProjectHandle) {
  return rigs.flatMap((rig) =>
    [...rig.memberTracks, rig.fkTailTrack].map((id) => {
      const patch = handle.get(nodeId(id));
      expect(patch?.status).toBe("ready");
      if (patch?.status !== "ready")
        throw new Error(`${id} is ${patch?.status ?? "absent"}, not ready.`);
      return patch.values;
    }),
  );
}
function expectLengths(handle: ProjectHandle) {
  for (const rig of rigs) {
    const rootTrackPatch = handle.get(nodeId(rig.rootTrack));
    if (rootTrackPatch?.status !== "ready")
      throw new Error(`rootTrackPatch is ${rootTrackPatch?.status ?? "absent"}, not ready.`);
    let parent = rootTrackPatch.values;
    [...rig.memberTracks, rig.fkTailTrack].forEach((id, index) => {
      const idPatch = handle.get(nodeId(id));
      if (idPatch?.status !== "ready")
        throw new Error(`idPatch is ${idPatch?.status ?? "absent"}, not ready.`);
      const child = idPatch.values;
      expect(
        Math.hypot(Number(child.x) - Number(parent.x), Number(child.y) - Number(parent.y)),
      ).toBeCloseTo(rig.lengths[index] ?? rig.fkTailLength, 7);
      parent = child;
    });
  }
}

describe("IK playground scroll-only rest blending", () => {
  it("starts in the authored local rest pose including ordinary FK tails", () => {
    const { handle } = load();
    try {
      for (const rig of rigs) {
        let x = rig.root.x,
          y = rig.root.y,
          rotation = 0;
        [...rig.memberTracks, rig.fkTailTrack].forEach((id, index) => {
          rotation += rig.restRotations[index] ?? 0;
          const length = rig.lengths[index] ?? rig.fkTailLength;
          x += length * Math.cos((rotation * Math.PI) / 180);
          y += length * Math.sin((rotation * Math.PI) / 180);
          const idPatch2 = handle.get(nodeId(id));
          if (idPatch2?.status !== "ready")
            throw new Error(`idPatch2 is ${idPatch2?.status ?? "absent"}, not ready.`);
          const values = idPatch2.values;
          expect(Number(values.x)).toBeCloseTo(x, 7);
          expect(Number(values.y)).toBeCloseTo(y, 7);
          expect(Number(values.rotation)).toBeCloseTo(rotation, 7);
          if (index < rig.memberTracks.length)
            expect(handle.track(nodeId(id)).definition.keyframes).toMatchObject({
              fk: {
                values: {
                  rotation: rig.restRotations[index],
                  weight: [
                    { p: 0, v: 0 },
                    { p: 1, v: 1 },
                  ],
                },
              },
            });
        });
      }
      expectLengths(handle);
    } finally {
      handle.dispose();
    }
  });

  it("holds staged goals and flips at zero, partial and full weight until another scroll commit", () => {
    const { handle, controller, emit, clock, flush } = load();
    const runtime = (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
    const replace = vi.spyOn(runtime.graph, "replaceGraph");
    const bindings = ALL_NODE_IDS.map((id) => handle.track(id).requires);
    try {
      const rest = pose(handle);
      for (const weight of [0, 0.5, 1]) {
        emit(weight);
        const before = pose(handle);
        const applied = rigs.map((rig) => {
          const patch = handle.get(nodeId(rig.goalTrack));
          if (patch?.status !== "ready")
            throw new Error(`${rig.goalTrack} is ${patch?.status ?? "absent"}, not ready.`);
          return patch.values;
        });
        const oldSnapshot = controller.goals;
        rigs.forEach((rig, index) => {
          controller.moveGoal(
            rig.goalTrack,
            rig.root.x + 40 + weight * 20,
            rig.root.y + 60 + weight * 20,
          );
          controller.flip(rig.solverTrack, weight !== 0.5);
          const goalTrackPatch = handle.get(nodeId(rig.goalTrack));
          if (goalTrackPatch?.status !== "ready")
            throw new Error(`goalTrackPatch is ${goalTrackPatch?.status ?? "absent"}, not ready.`);
          expect(goalTrackPatch.values).toEqual(applied[index]);
        });
        expect(oldSnapshot).not.toBe(controller.goals);
        clock.tick(1000 + weight * 1000);
        flush();
        expect(pose(handle)).toEqual(before);
        emit(weight);
        for (const rig of rigs) {
          const goalTrackPatch2 = handle.get(nodeId(rig.goalTrack));
          if (goalTrackPatch2?.status !== "ready")
            throw new Error(
              `goalTrackPatch2 is ${goalTrackPatch2?.status ?? "absent"}, not ready.`,
            );
          expect(goalTrackPatch2.values).toMatchObject(controller.goals[rig.goalTrack]!);
          const solverTrackPatch = handle.get(nodeId(rig.solverTrack));
          if (solverTrackPatch?.status !== "ready")
            throw new Error(
              `solverTrackPatch is ${solverTrackPatch?.status ?? "absent"}, not ready.`,
            );
          expect(solverTrackPatch.values.flip).toBe(weight !== 0.5);
          const rotations = solverTrackPatch.values.rotations as Readonly<Record<string, number>>;
          let rotation = 0;
          rig.memberTracks.forEach((id, index) => {
            rotation += lerpAngle(rig.restRotations[index]!, rotations[nodeId(id)]!, weight);
            const idPatch3 = handle.get(nodeId(id));
            if (idPatch3?.status !== "ready")
              throw new Error(`idPatch3 is ${idPatch3?.status ?? "absent"}, not ready.`);
            expect(idPatch3.sourceProgress).toBeCloseTo(weight);
            expect(idPatch3.values.rotation).toBeCloseTo(rotation);
            expect(handle.track(nodeId(id)).definition.keyframes).toMatchObject({
              fk: {
                values: {
                  weight: [
                    { p: 0, v: 0 },
                    { p: 1, v: 1 },
                  ],
                },
              },
            });
          });
          if (weight === 1) {
            const tipTrackPatch = handle.get(nodeId(rig.tipTrack));
            if (tipTrackPatch?.status !== "ready")
              throw new Error(`tipTrackPatch is ${tipTrackPatch?.status ?? "absent"}, not ready.`);
            const tip = tipTrackPatch.values;
            const goal = controller.goals[rig.goalTrack]!;
            expect(Math.hypot(Number(tip.x) - goal.x, Number(tip.y) - goal.y)).toBeLessThan(0.1);
          }
        }
        if (weight === 0) expect(pose(handle)).toEqual(rest);
        else expect(pose(handle)).not.toEqual(before);
        expectLengths(handle);
      }
      emit(0);
      expect(pose(handle)).toEqual(rest);
      expect(ALL_NODE_IDS.map((id) => handle.track(id).requires)).toEqual(bindings);
      expect(replace).not.toHaveBeenCalled();
      const publication = vi.spyOn(runtime.graph, "flush");
      controller.commit();
      expect(publication).not.toHaveBeenCalled();
    } finally {
      handle.dispose();
    }
  });

  it("coalesces progress through Motion and cancels its queued work and source on disposal", () => {
    const { handle, push, flush, unsubscribe } = load();
    const rest = pose(handle);
    push(0.25);
    push(0.75);
    expect(pose(handle)).toEqual(rest);
    flush();
    for (const id of ALL_NODE_IDS) {
      const patch = handle.get(id);
      if (patch?.status !== "ready")
        throw new Error(`${id} is ${patch?.status ?? "absent"}, not ready.`);
      expect(patch.sourceProgress).toBeCloseTo(0.75);
    }
    push(1);
    handle.dispose();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(() => {
      push(0.5);
      flush();
      handle.dispose();
    }).not.toThrow();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("clamps scroll bounds and rejects invalid pending input without poisoning the solve", () => {
    const { handle, controller, emit } = load();
    try {
      const before = controller.goals;
      expect(controller.moveGoal(ARM.goalTrack, NaN, 20)).toBe(before);
      expect(() => controller.moveGoal("missing", 0, 0)).toThrow("Unknown pending goal");
      expect(() => controller.flip("missing", true)).toThrow("Unknown pending solver");
      emit(2);
      const tipTrackPatch2 = handle.get(nodeId(ARM.tipTrack));
      if (tipTrackPatch2?.status !== "ready")
        throw new Error(`tipTrackPatch2 is ${tipTrackPatch2?.status ?? "absent"}, not ready.`);
      expect(tipTrackPatch2.sourceProgress).toBe(1);
      emit(-1);
      const tipTrackPatch3 = handle.get(nodeId(ARM.tipTrack));
      if (tipTrackPatch3?.status !== "ready")
        throw new Error(`tipTrackPatch3 is ${tipTrackPatch3?.status ?? "absent"}, not ready.`);
      expect(tipTrackPatch3.sourceProgress).toBe(0);
      const applied = handle.get(nodeId(ARM.goalTrack));
      controller.moveGoal(ARM.goalTrack, 290, 360);
      expect(() => emit(NaN)).toThrow("finite");
      expect(() => emit(Infinity)).toThrow("finite");
      expect(handle.get(nodeId(ARM.goalTrack))).toBe(applied);
      emit(0.5);
      const goalTrackPatch3 = handle.get(nodeId(ARM.goalTrack));
      if (goalTrackPatch3?.status !== "ready")
        throw new Error(`goalTrackPatch3 is ${goalTrackPatch3?.status ?? "absent"}, not ready.`);
      expect(goalTrackPatch3.values).toMatchObject({ x: 290, y: 360 });
    } finally {
      handle.dispose();
    }
  });
});
