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
      expect(handle.get(nodeId(id))?.status).toBe("ready");
      return handle.get(nodeId(id))!.values;
    }),
  );
}
function expectLengths(handle: ProjectHandle) {
  for (const rig of rigs) {
    let parent = handle.get(nodeId(rig.rootTrack))!.values;
    [...rig.memberTracks, rig.fkTailTrack].forEach((id, index) => {
      const child = handle.get(nodeId(id))!.values;
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
          const values = handle.get(nodeId(id))!.values;
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
        const applied = rigs.map((rig) => handle.get(nodeId(rig.goalTrack))!.values);
        const oldSnapshot = controller.goals;
        rigs.forEach((rig, index) => {
          controller.moveGoal(
            rig.goalTrack,
            rig.root.x + 40 + weight * 20,
            rig.root.y + 60 + weight * 20,
          );
          controller.flip(rig.solverTrack, weight !== 0.5);
          expect(handle.get(nodeId(rig.goalTrack))!.values).toEqual(applied[index]);
        });
        expect(oldSnapshot).not.toBe(controller.goals);
        clock.tick(1000 + weight * 1000);
        flush();
        expect(pose(handle)).toEqual(before);
        emit(weight);
        for (const rig of rigs) {
          expect(handle.get(nodeId(rig.goalTrack))!.values).toMatchObject(
            controller.goals[rig.goalTrack]!,
          );
          expect(handle.get(nodeId(rig.solverTrack))!.values.flip).toBe(weight !== 0.5);
          const rotations = handle.get(nodeId(rig.solverTrack))!.values.rotations as Readonly<
            Record<string, number>
          >;
          let rotation = 0;
          rig.memberTracks.forEach((id, index) => {
            rotation += lerpAngle(rig.restRotations[index]!, rotations[nodeId(id)]!, weight);
            expect(handle.get(nodeId(id))?.sourceProgress).toBeCloseTo(weight);
            expect(handle.get(nodeId(id))?.values.rotation).toBeCloseTo(rotation);
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
            const tip = handle.get(nodeId(rig.tipTrack))!.values;
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
      const invalidate = vi.spyOn(runtime.graph, "invalidate");
      controller.commit();
      expect(invalidate).not.toHaveBeenCalled();
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
    for (const id of ALL_NODE_IDS) expect(handle.get(id)?.sourceProgress).toBeCloseTo(0.75);
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
      expect(handle.get(nodeId(ARM.tipTrack))?.sourceProgress).toBe(1);
      emit(-1);
      expect(handle.get(nodeId(ARM.tipTrack))?.sourceProgress).toBe(0);
      const applied = handle.get(nodeId(ARM.goalTrack));
      controller.moveGoal(ARM.goalTrack, 290, 360);
      expect(() => emit(NaN)).toThrow("finite");
      expect(() => emit(Infinity)).toThrow("finite");
      expect(handle.get(nodeId(ARM.goalTrack))).toBe(applied);
      emit(0.5);
      expect(handle.get(nodeId(ARM.goalTrack))?.values).toMatchObject({ x: 290, y: 360 });
    } finally {
      handle.dispose();
    }
  });
});
