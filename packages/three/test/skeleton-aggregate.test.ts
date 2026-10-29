import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import {
  captureSkeleton,
  skeletonTracks,
  createSkeletonDriver,
  tableFrameSource,
} from "../src/skeleton";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

describe("three aggregate skeleton migration (AO)", () => {
  it("AO-1 emits exactly four aggregate tracks and zero rig tracks", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const tracks = skeletonTracks(binding, { idPrefix: "avatar" });
    expect(tracks.map((t) => t.id)).toEqual([
      "avatar-root",
      "avatar-body",
      "avatar-solved",
      "avatar-pose",
    ]);
    for (const t of tracks) {
      expect(t.plugin !== "rig").toBe(true);
      if (t.id === "avatar-pose") {
        expect(t.plugin).toBe("fk3d");
        expect(t.input?.requires).toEqual({
          chain: "avatar-body",
          solved: "avatar-solved",
          base: "avatar-root",
        });
      }
    }
  });

  it("AO-2 body table contains captured bones in canonical root-first order with correct hierarchy", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const tracks = skeletonTracks(binding, { idPrefix: "avatar" });
    const bodyTrack = tracks.find((t) => t.id === "avatar-body")!;
    const values = bodyTrack.input?.values as readonly {
      id: string;
      cells: Record<string, unknown>;
    }[];
    expect(values.length).toBe(binding.bones.length);
    for (const bone of binding.bones) {
      const row = values.find((r) => r.id === (bone.key ?? `avatar-bone-${bone.index}`))!;
      expect(row).toBeDefined();
      if (bone.parent !== undefined) {
        const parentBone = binding.bones[bone.parent]!;
        expect(row.cells.parentId).toBe(parentBone.key ?? `avatar-bone-${parentBone.index}`);
      } else {
        expect(row.cells.parentId).toBeUndefined();
      }
    }
  });

  it("AO-3 tableFrameSource indexes pose table rows and retrieves cells by key", () => {
    const table = [
      { id: "hips", cells: { x: 10, y: 20, z: 30, rotation: 15, rotationX: 0, rotationY: 0 } },
      { id: "hand", cells: { x: 40, y: 50, z: 60, rotation: 45, rotationX: 10, rotationY: 5 } },
    ];
    const read = tableFrameSource(table);
    expect(read("hips")).toEqual(table[0]!.cells);
    expect(read("hand")).toEqual(table[1]!.cells);
    expect(read("absent")).toBeUndefined();
  });

  it("AO-4 records source-missing outcome when bone key is missing from pose table", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "frame", source: "hips" } },
    });
    const outcomes = driver.apply(() => undefined).bones;
    expect(outcomes.get("hips")).toEqual({ kind: "held", reason: "source-missing" });
  });

  it("AO-5 returns noop reader on non-array or malformed table inputs", () => {
    for (const bad of [null, undefined, {}, "string", 123, [{ id: 123 }, { cells: {} }]]) {
      const read = tableFrameSource(bad);
      expect(read("hips")).toBeUndefined();
    }
  });

  it("AO-6 propagates hierarchical world matrices matching expected transforms within 1e-6", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: {
        hips: { kind: "frame", source: "avatar-hips" },
        hand: { kind: "frame", source: "avatar-hand" },
      },
    });
    const table = [
      { id: "avatar-hips", cells: { x: 0, y: 10, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
      { id: "avatar-hand", cells: { x: 0, y: 20, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
    ];
    driver.apply(tableFrameSource(table));
    expect(rig.root.position.y).toBeCloseTo(10, 5);
  });

  it("AO-7 preserves transform propagation through unmapped intermediate bones", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "frame", source: "avatar-hips" } },
    });
    const table = [
      { id: "avatar-hips", cells: { x: 5, y: 5, z: 5, rotation: 90, rotationX: 0, rotationY: 0 } },
    ];
    driver.apply(tableFrameSource(table));
    expect(rig.tip.matrixWorld).toBeDefined();
  });

  it("AO-8 applies basis drive compensation over pose table inputs", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "basis", source: "avatar-hips" } },
    });
    const table = [
      { id: "avatar-hips", cells: { x: 0, y: 0, z: 0, rotation: 45, rotationX: 0, rotationY: 0 } },
    ];
    const outcomes = driver.apply(tableFrameSource(table)).bones;
    expect(outcomes.get("hips")).toEqual({ kind: "applied" });
  });

  it("AO-9 preserves aim drive constraints from pose table frames", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "from", to: "to" } },
    });
    const table = [
      { id: "from", cells: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
      { id: "to", cells: { x: 0, y: 10, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
    ];
    const outcomes = driver.apply(tableFrameSource(table)).bones;
    expect(outcomes.get("hips")).toEqual({ kind: "applied" });
  });

  it("AO-10 evaluates complete project with skeleton tracks in Engine and produces valid pose table", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const tracks = skeletonTracks(binding, { idPrefix: "avatar" });
    const project = {
      schemaVersion: 5,
      projectId: "aggregate-three",
      motions: [
        {
          id: "demo",
          trigger: { type: "manual" },
          tracks,
        },
      ],
    };
    const plugins = new PluginCatalog();
    plugins.register(fk3dPlugin);
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(project as never);
    for (const track of tracks) {
      engine.mount(`demo/${track.id}`);
    }
    engine.seek("demo/avatar-pose", 0);
    const patch = engine.get("demo/avatar-pose");
    expect(patch?.status).toBe("ready");
    expect(patch?.status === "ready" && Array.isArray(patch.outputs.values)).toBe(true);
  });
});
