import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import type { DomTarget } from "../../src/adapters/dom";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import type { ProjectDefinition } from "../../src/contract/v5";
import type { ProjectHandle } from "../../src/engine";
import { Engine } from "../../src/engine";
import { patchRender } from "../../src/contract/patch-render";
import { PluginRegistry } from "../../src/domain/plugins";
import type { TrackHandle } from "../../src/contract/track-handle";
import { fkPlugin } from "../../../plugins/src/fk";
import { transformPlugin } from "../../../plugins/src/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import {
  armTracks,
  coreWalkerTracks,
  initialWalkerProject,
} from "../../../../apps/react-demo/src/full-body-project";
import { nodePosition } from "../../../../apps/react-demo/src/components/marker-position";

interface FakeStyle extends Record<string, unknown> {
  removeProperty(property: string): void;
}

interface FakeSvgTarget {
  style: FakeStyle;
  ownerSVGElement: null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

function createSvgTarget(): FakeSvgTarget {
  const style: FakeStyle = {
    visibility: undefined,
    removeProperty(property) {
      delete this[property];
    },
  };
  return {
    style,
    ownerSVGElement: null,
    setAttribute() {},
    removeAttribute() {},
  };
}

function loadRig(): {
  handle: ProjectHandle;
  flush(): void;
} {
  const scheduler = createFakeScheduler();
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  const definition: ProjectDefinition = {
    ...initialWalkerProject,
    motions: [{ id: "walk", trigger: { type: "manual" }, tracks: coreWalkerTracks }],
  };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
    triggerFactory: createTriggerFactory({ scroll: () => ({ subscribe: () => () => undefined }) }),
  }).load(definition);
  for (const track of coreWalkerTracks) handle.mount(`walk/${track.id}`);

  return {
    handle,
    flush() {
      for (let rounds = 0; scheduler.pending.length; rounds += 1) {
        if (rounds > 20) throw new Error("Scheduler did not settle.");
        scheduler.flush();
      }
    },
  };
}

function addArms(handle: ProjectHandle): TrackHandle[] {
  return handle.edit((tx) => {
    const walk = tx.motion("walk");
    return armTracks.map((track) => walk.addTrack(track));
  });
}

function removeArms(handles: readonly TrackHandle[]): void {
  for (const trackHandle of [...handles].reverse()) trackHandle.remove();
}

/**
 * Renderer-free equivalent of the real `useDerivedDomPatch` binding.
 *
 * The test runtime does not provide `react-test-renderer`, so it drives the same public source,
 * derivation and DOM adapter path that the hook composes: every publication reads the current
 * project patch, hides absent or non-renderable input, and otherwise writes `nodePosition`.
 */
function bindMarker(handle: ProjectHandle, nodeId: string, target: FakeSvgTarget): () => void {
  const adapter = createDomPatchAdapter({ style: {} }, undefined, (id): DomTarget | undefined =>
    id === nodeId ? (target as unknown as DomTarget) : undefined,
  );
  const render = () => {
    const decision = patchRender(handle.get(nodeId));
    if (decision.kind !== "render") {
      adapter.applyValues(nodeId, { visibility: "hidden" });
      return;
    }
    const values = nodePosition([decision.patch.values]);
    if (values === undefined) throw new Error("Marker position was not derivable.");
    adapter.applyValues(nodeId, values);
  };
  const unsubscribe = handle.subscribeNode(nodeId, render);
  render();
  return () => {
    unsubscribe();
    adapter.clear(target as unknown as DomTarget);
  };
}

describe("react demo skeleton rig", () => {
  it("TH-140 writes labelled marker position without the node's rotation", () => {
    const test = loadRig();
    const { handle } = test;
    const target = createSvgTarget();
    handle.signal("walk", { type: "manual", progress: 0.6 });
    test.flush();
    const arms = addArms(handle);
    const arm = handle.get("walk/armL_lower");
    expect(arm?.status).toBe("ready");
    if (arm?.status !== "ready") throw new Error("The arm marker node did not become ready.");
    expect(Number(arm.values.rotation)).not.toBe(0);

    const unbind = bindMarker(handle, "walk/armL_lower", target);
    expect(target.style.transform).toMatch(/^translate3d\([^)]*\)$/);
    expect(target.style.transform).not.toContain("rotate(");

    unbind();
    removeArms(arms);
    handle.dispose();
  });

  it("TH-141 hides removed arm markers and shows them again after the same edit", () => {
    const test = loadRig();
    const { handle } = test;
    const target = createSvgTarget();
    handle.signal("walk", { type: "manual", progress: 0.6 });
    test.flush();
    const arms = addArms(handle);
    const unbind = bindMarker(handle, "walk/armL_lower", target);
    expect(handle.get("walk/armL_lower")?.status).toBe("ready");
    expect(target.style.visibility).toBeUndefined();

    handle.edit(() => {
      removeArms(arms);
    });
    expect(target.style.visibility).toBe("hidden");

    const readded = addArms(handle);
    expect(target.style.visibility).toBeUndefined();
    expect(target.style.transform).toMatch(/^translate3d\([^)]*\)$/);

    unbind();
    removeArms(readded);
    handle.dispose();
  });
});
