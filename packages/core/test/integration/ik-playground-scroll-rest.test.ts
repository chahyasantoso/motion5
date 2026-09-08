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
  scrollWeight,
} from "../../../../apps/ik-playground/src/scroll-reach";
import { Engine, type ProjectHandle } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";

const rigs = [ARM, TENTACLE];
function load() {
  const plugins = new PluginRegistry();
  for (const plugin of [transformPlugin, fkPlugin, ikPlugin]) plugins.register(plugin);
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
  }).load(ikPlaygroundProject);
  for (const id of ALL_NODE_IDS) handle.mount(id);
  for (const rig of rigs) {
    handle.seek(nodeId(rig.rootTrack), 0);
    handle.seek(nodeId(rig.goalTrack), 0);
  }
  while (scheduler.pending.length) scheduler.flush();
  return handle;
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
    const handle = load();
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
              fk: { values: { rotation: rig.restRotations[index], weight: 0 } },
            });
        });
      }
      expectLengths(handle);
    } finally {
      handle.dispose();
    }
  });

  it("holds staged goals and flips at zero, partial and full weight until another scroll commit", () => {
    const handle = load();
    const controller = createScrollReach(handle);
    const runtime = (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
    const replace = vi.spyOn(runtime.graph, "replaceGraph");
    const bindings = ALL_NODE_IDS.map((id) => handle.track(id).requires);
    try {
      const rest = pose(handle);
      for (const weight of [0, 0.5, 1]) {
        controller.commit(weight);
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
        expect(pose(handle)).toEqual(before);
        controller.commit(weight);
        for (const rig of rigs) {
          expect(handle.get(nodeId(rig.goalTrack))!.values).toMatchObject(
            controller.goals[rig.goalTrack]!,
          );
          expect(handle.get(nodeId(rig.solverTrack))!.values.flip).toBe(weight !== 0.5);
          for (const id of rig.memberTracks)
            expect(handle.track(nodeId(id)).definition.keyframes).toMatchObject({
              fk: { values: { weight } },
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
      controller.commit(0);
      expect(pose(handle)).toEqual(rest);
      expect(ALL_NODE_IDS.map((id) => handle.track(id).requires)).toEqual(bindings);
      expect(replace).not.toHaveBeenCalled();
      const invalidate = vi.spyOn(runtime.graph, "invalidate");
      controller.commit(0);
      expect(invalidate).not.toHaveBeenCalled();
    } finally {
      handle.dispose();
    }
  });

  it("normalizes real scroll position, holds on resize, and cleans up before remount", () => {
    class Host extends EventTarget {
      scrollY = 0;
    }
    const host = new Host();
    let range = 1000;
    const handle = load();
    const controller = createScrollReach(handle);
    const apply = vi.fn((weight: number) => controller.commit(weight));
    let cleanup = bindScrollReach(host, () => range, apply);
    try {
      const rest = pose(handle);
      controller.moveGoal(ARM.goalTrack, 290, 360);
      host.dispatchEvent(new Event("scroll"));
      expect(apply).toHaveBeenCalledTimes(1);
      expect(pose(handle)).toEqual(rest);
      host.scrollY = 500;
      host.dispatchEvent(new Event("scroll"));
      expect(apply).toHaveBeenLastCalledWith(0.5);
      expect(pose(handle)).not.toEqual(rest);
      const held = pose(handle);
      controller.moveGoal(TENTACLE.goalTrack, 860, 260);
      range = 2000;
      host.dispatchEvent(new Event("resize"));
      expect(pose(handle)).toEqual(held);
      host.scrollY = 1000;
      host.dispatchEvent(new Event("scroll"));
      expect(apply).toHaveBeenLastCalledWith(0.5);
      expect(handle.get(nodeId(TENTACLE.goalTrack))!.values).toMatchObject({ x: 860, y: 260 });
      host.scrollY = 0;
      host.dispatchEvent(new Event("scroll"));
      expect(pose(handle)).toEqual(rest);
      cleanup();
      apply.mockClear();
      host.scrollY = 2000;
      host.dispatchEvent(new Event("scroll"));
      expect(apply).not.toHaveBeenCalled();
      cleanup = bindScrollReach(host, () => range, apply);
      expect(apply).toHaveBeenCalledExactlyOnceWith(1);
      host.scrollY = 1000;
      host.dispatchEvent(new Event("scroll"));
      expect(apply).toHaveBeenCalledTimes(2);
    } finally {
      cleanup();
      handle.dispose();
    }
  });

  it("clamps scroll bounds and rejects invalid pending input without poisoning the solve", () => {
    expect(scrollWeight(-20, 100)).toBe(0);
    expect(scrollWeight(200, 100)).toBe(1);
    expect(scrollWeight(30, 0)).toBe(0);
    expect(scrollWeight(NaN, 100)).toBe(0);
    expect(scrollWeight(30, Infinity)).toBe(0);
    const handle = load();
    try {
      const controller = createScrollReach(handle);
      const before = controller.goals;
      expect(controller.moveGoal(ARM.goalTrack, NaN, 20)).toBe(before);
      expect(() => controller.moveGoal("missing", 0, 0)).toThrow("Unknown pending goal");
      expect(() => controller.flip("missing", true)).toThrow("Unknown pending solver");
      expect(controller.commit(2)).toBe(1);
      expect(controller.commit(-1)).toBe(0);
    } finally {
      handle.dispose();
    }
  });
});
