import { describe, expect, it } from "vitest";
import type { Patch, ProjectDefinition } from "../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

/**
 * Phase 3 of issue #362: where two mechanisms answer one question, the weaker one is deleted.
 *
 * Three members go. `ProjectHandle.subscribe` forwarded to `registry.subscribeNode` one line away
 * from `subscribeNode` forwarding to the same call, and the guide documented it as the same call
 * under an older name, which is the discouraged-in-prose shape the guardrail refuses. `adopt` and
 * `destroyAdopted` answer what `addTrack` and `TrackHandle.remove` already answer, and answer it
 * more weakly: `adopt` hands back a frozen `{ id, track }` that cannot say whether its node is
 * still live, and both take a caller-invented owner object as the gate on removal.
 *
 * `"name" in object` is what asserts an absence here, on `RA-16`'s shape, because it typechecks on
 * both sides of the deletion: these cases fail on an assertion before the source lands rather than
 * failing to compile. Each asserts the surviving spelling is present in the same rig, since a probe
 * against a mistyped receiver answers absent for every name, and each asserts the accepting
 * direction, since a case whose subject is a deletion is green against the deletion alone.
 *
 * `project-handle-surface.test.ts` owns the handle's total key list and is where a member added
 * later lands first. This file owns the narrower claim a key list cannot make: that the question
 * each deleted member answered is still answered by the mechanism that kept it.
 */
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "arm",
          keyframes: {
            transform: {
              values: {
                x: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
          },
        },
      ],
    },
  ],
};

function load(): ProjectHandle {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(PROJECT);
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

describe("one question, one mechanism on the runtime surface", () => {
  it("RA-155 subscribes to a node through subscribeNode and through nothing else", () => {
    const handle = load();
    try {
      expect("subscribeNode" in handle).toBe(true);
      expect("subscribe" in handle).toBe(false);

      const seen: Patch[] = [];
      const unsubscribe = handle.subscribeNode("hero/arm", (patch) => {
        seen.push(patch);
      });
      handle.mount("hero/arm");
      handle.seek("hero/arm", 0.5);

      expect(seen).toHaveLength(1);
      const seenPatch = seen.at(-1);
      if (seenPatch?.status !== "ready")
        throw new Error(`seenPatch is ${seenPatch?.status ?? "absent"}, not ready.`);
      expect(seenPatch.values).toEqual({ x: 50 });

      // The node keeps publishing after the unsubscribe, which is what makes the count below a
      // claim about this listener rather than about a deduplicated patch: the values move.
      unsubscribe();
      handle.seek("hero/arm", 0.75);

      const heroArmPatch = handle.get("hero/arm");
      if (heroArmPatch?.status !== "ready")
        throw new Error(`hero/arm is ${heroArmPatch?.status ?? "absent"}, not ready.`);
      expect(heroArmPatch.values).toEqual({ x: 75 });
      expect(seen).toHaveLength(1);
    } finally {
      handle.dispose();
    }
  });

  it("RA-156 adds and removes a runtime track through addTrack and its handle", () => {
    const handle = load();
    try {
      expect("addTrack" in handle).toBe(true);
      expect("adopt" in handle).toBe(false);
      expect("destroyAdopted" in handle).toBe(false);

      const seen: Patch[] = [];
      const added = handle.addTrack({ id: "cursor" });
      handle.subscribeNode(added.id, (patch) => {
        seen.push(patch);
      });

      expect(added.id).toBe("~/cursor");
      expect(added.live).toBe(true);
      expect(handle.get(added.id)?.status).toBe("ready");

      added.remove();

      expect(added.live).toBe(false);
      expect(seen.at(-1)?.status).toBe("destroyed");
      expect(handle.get(added.id)).toBeUndefined();
    } finally {
      handle.dispose();
    }
  });

  it("RA-157 asks for no owner object on the runtime the handle projects either", () => {
    const handle = load();
    const runtime = runtimeOf(handle);
    try {
      expect("addTrack" in runtime).toBe(true);
      expect("adopt" in runtime).toBe(false);
      expect("destroyAdopted" in runtime).toBe(false);

      // The owner gate goes with the pair rather than moving somewhere else. What refuses a removal
      // now is the token the handle captured, so a second attempt is `StaleTrackHandleError` rather
      // than a comparison against an object the caller invented.
      // `unified-mutation-surface.test.ts` owns that refusal; this asserts only that a removal asks
      // for no owner at all.
      const added = runtime.addTrack({ id: "cursor" });
      added.remove();

      expect(runtime.tryTrack(added.id)).toBeUndefined();
      expect(runtime.graph.state.snapshot().nodes).not.toContain("~/cursor");
    } finally {
      handle.dispose();
    }
  });
});
