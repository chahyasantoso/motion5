import { describe, expect, it } from "vitest";
import {
  Engine,
  PluginCatalog,
  createManualClock,
  createTriggerFactory,
  type ProjectHandle,
  type TrackHandle,
} from "@motion5/core";
import { selectRow } from "@motion5/core/plugin-api";
import { fkPlugin } from "@motion5/plugins/fk";
import {
  createFakeInterpolator,
  createFakeScheduler,
} from "../../../packages/core/src/testing/fakes";
import type { ProjectRuntime } from "../../../packages/core/src/runtime/project-runtime";
import { armTracks, initialWalkerProject, WALK_SCROLL_SOURCE } from "../src/full-body-project";

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

function load() {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const scroll = scrollSource();
  const plugins = new PluginCatalog();
  plugins.register(fkPlugin);
  const project = new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
    triggerFactory: createTriggerFactory({
      scroll: ({ trigger }) => (trigger.source === WALK_SCROLL_SOURCE ? scroll : undefined),
    }),
  }).load(initialWalkerProject);
  for (const motionId of project.motionIds())
    for (const trackNode of project.motion(motionId).trackIds) project.mount(trackNode);
  for (const freeNode of project.freeTrackIds()) project.mount(freeNode);
  const flush = () => {
    scheduler.flush();
    runtimeOf(project).graph.flush([...project.mountedNodeIds()]);
  };
  return { project, clock, scroll, flush };
}

function poseRows(handle: ProjectHandle, node: string) {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Node ${node} is not ready`);
  if (!Array.isArray(patch.outputs.values)) throw new Error(`Node ${node} publishes no table`);
  return patch.outputs.values;
}

function addArms(project: ProjectHandle): readonly TrackHandle[] {
  const handles = project.edit((transaction) => {
    const walk = transaction.motion("walk");
    return armTracks.map((track) => walk.addTrack(track));
  });
  runtimeOf(project).graph.flush([...project.mountedNodeIds()]);
  return handles;
}

function removeArms(project: ProjectHandle, handles: readonly TrackHandle[]): void {
  project.edit(() => {
    for (const trackHandle of [...handles].reverse()) trackHandle.remove();
  });
  runtimeOf(project).graph.flush([...project.mountedNodeIds()]);
}

describe("react-demo walker on the real project", () => {
  it("seeks the core rig and publishes one pose row per core bone", () => {
    const { project } = load();
    try {
      project.seek("walk/pose", 0.5);
      const rows = poseRows(project, "walk/pose");
      expect(rows.length).toBe(8);
      expect(rows.map((row) => row.id)).toEqual([
        "chest",
        "legL_thigh",
        "legR_thigh",
        "head",
        "legL_shin",
        "legR_shin",
        "legL_foot",
        "legR_foot",
      ]);
      const chest = selectRow(rows, "chest");
      expect(chest.kind).toBe("row");
    } finally {
      project.dispose();
    }
  });

  it("keeps a scroll-driven pose still across a clock tick", () => {
    const { project, clock } = load();
    try {
      project.seek("walk/pose", 0.25);
      const before = project.get("walk/pose");
      clock.tick(16);
      expect(project.get("walk/pose")).toBe(before);
    } finally {
      project.dispose();
    }
  });

  it("adopts the arm branch at a scroll threshold and publishes its pose table", () => {
    const { project, scroll, flush } = load();
    try {
      scroll.emit(0.6);
      flush();
      const arms = addArms(project);
      expect(arms.length).toBe(armTracks.length);
      const rows = poseRows(project, "walk/arms-pose");
      expect(rows.map((row) => row.id)).toEqual([
        "chest",
        "armL_upper",
        "armR_upper",
        "armL_lower",
        "armR_lower",
      ]);
      expect(project.mountedNodeIds()).toContain("walk/arms-pose");
    } finally {
      project.dispose();
    }
  });

  it("destroys the arm branch while the core rig keeps publishing", () => {
    const { project, scroll, flush } = load();
    try {
      scroll.emit(0.6);
      flush();
      const arms = addArms(project);
      scroll.emit(0.4);
      flush();
      removeArms(project, arms);
      expect(project.get("walk/arms-pose")).toBeUndefined();
      expect(project.get("walk/arms-body")).toBeUndefined();
      expect(poseRows(project, "walk/pose").length).toBe(8);
    } finally {
      project.dispose();
    }
  });

  it("disposes every mounted node once", () => {
    const { project } = load();
    project.seek("walk/pose", 0.5);
    expect(() => project.dispose()).not.toThrow();
  });
});
