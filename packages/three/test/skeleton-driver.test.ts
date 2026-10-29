import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { frameToMatrix } from "../src/index";
import {
  captureSkeleton,
  createSkeletonDriver,
  describeBoneOutcome,
  skeletonTracks,
  tableFrameSource,
  type BoneDrive,
  type BoneOutcome,
} from "../src/skeleton";
import { syntheticSkeleton } from "./support/synthetic-skeleton";

function load(tracks: readonly TrackDefinition[]) {
  const plugins = new PluginCatalog();
  plugins.register(fk3dPlugin);
  const project = new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "manual" }, tracks }] });
  for (const track of tracks) project.mount(`scene/${track.id}`);
  for (const track of tracks) project.seek(`scene/${track.id}`, 0);
  return project;
}

/**
 * Rigid equality: the frame contract carries position and rotation, and uniform ancestor scale is
 * applied by the scene rather than by the published frame, so comparing the full matrices would
 * compare a scale the driver never writes.
 */
function expectRigid(actual: Matrix4, expected: Matrix4) {
  const actualPosition = new Vector3(),
    actualQuaternion = new Quaternion(),
    actualScale = new Vector3();
  const expectedPosition = new Vector3(),
    expectedQuaternion = new Quaternion(),
    expectedScale = new Vector3();
  actual.decompose(actualPosition, actualQuaternion, actualScale);
  expected.decompose(expectedPosition, expectedQuaternion, expectedScale);
  expect(actualPosition.distanceTo(expectedPosition)).toBeLessThan(1e-6);
  expect(Math.abs(actualQuaternion.dot(expectedQuaternion))).toBeGreaterThan(1 - 1e-9);
}

function poseTable(tracks: readonly TrackDefinition[], idPrefix: string): unknown {
  const project = load(tracks);
  try {
    const patch = project.get(`scene/${idPrefix}-pose`);
    if (patch?.status !== "ready") throw new Error("Missing pose publication");
    return patch.outputs.values;
  } finally {
    project.dispose();
  }
}

describe("captured skeleton tracks", () => {
  it("K1 publishes each pivot in root-parent space without changing FK", () => {
    const rig = syntheticSkeleton();
    const binding = captureSkeleton(rig.skeleton, rig);
    const tracks = skeletonTracks(binding, { idPrefix: "imported" });
    const project = load(tracks);
    try {
      const patch = project.get("scene/imported-pose");
      if (patch?.status !== "ready") throw new Error("Missing pose publication");
      const read = tableFrameSource(patch.outputs.values);
      for (const bone of binding.bones) {
        const rowId = bone.key ?? `imported-bone-${bone.index}`;
        const cells = read(rowId);
        if (cells === undefined) throw new Error(`Missing pose row ${rowId}`);
        const expected = new Matrix4()
          .copy(rig.rootParent.matrixWorld)
          .invert()
          .multiply(rig.skeleton.bones[bone.index]!.matrixWorld);
        expectRigid(frameToMatrix(cells, new Matrix4()), expected);
      }
    } finally {
      project.dispose();
    }
  });

  it("K2 keeps one row per captured bone, including an unmapped intermediate bone", () => {
    const rig = syntheticSkeleton();
    const tracks = skeletonTracks(captureSkeleton(rig.skeleton, rig), { idPrefix: "a" });
    expect(tracks.map((track) => track.id)).toEqual(["a-root", "a-body", "a-solved", "a-pose"]);
    const pose = tracks.find((track) => track.id === "a-pose");
    expect(pose?.plugin).toBe("fk3d");
    expect(pose?.input?.requires).toEqual({
      chain: "a-body",
      solved: "a-solved",
      base: "a-root",
    });
    const body = tracks.find((track) => track.id === "a-body");
    const rows = body?.input?.values as readonly {
      readonly id: string;
      readonly cells: Readonly<Record<string, unknown>>;
    }[];
    expect(rows.map((row) => row.id)).toEqual(["hand", "hips", "a-bone-2"]);
    expect(rows[2]?.cells.parentId).toBe("hips");
  });

  it("K3 refuses bad prefixes and newly scaled bones", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    for (const idPrefix of ["", "bad/id"])
      expect(() => skeletonTracks(binding, { idPrefix })).toThrow(TypeError);
    rig.middle.scale.x = 2;
    expect(() => skeletonTracks(binding, { idPrefix: "a" })).toThrow(TypeError);
  });

  it("K4 generates deterministic snapshots", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    expect(skeletonTracks(binding, { idPrefix: "a" })).toEqual(
      skeletonTracks(binding, { idPrefix: "a" }),
    );
  });
});

describe("parent-space skeleton driver", () => {
  it("D1 round trips FK world frames through nested bones", () => {
    const rig = syntheticSkeleton();
    const boneKeys = { hips: "hips", middle: "middle", tip: "hand" };
    const binding = captureSkeleton(rig.skeleton, { boneKeys });
    const tracks = skeletonTracks(binding, { idPrefix: "a" });
    const table = poseTable(tracks, "a");
    const matrices = rig.skeleton.bones.map((bone) => bone.matrixWorld.clone());
    for (const bone of rig.skeleton.bones) {
      bone.position.set(9, 8, 7);
      bone.quaternion.identity();
    }
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: {
        hand: { kind: "frame", source: "hand" },
        middle: { kind: "frame", source: "middle" },
        hips: { kind: "frame", source: "hips" },
      },
    });
    const result = driver.apply(tableFrameSource(table));
    expect([...result.bones.values()].map((outcome) => outcome.kind)).toEqual([
      "applied",
      "applied",
      "applied",
    ]);
    rig.skeleton.bones.forEach((bone, i) => expectRigid(bone.matrixWorld, matrices[i]!));
  });

  it("D2 maps a calibrated source and differently scaled armature into one parent space", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const sourceSpace = new Object3D();
    sourceSpace.rotation.x = Math.PI;
    sourceSpace.scale.setScalar(0.001);
    const driver = createSkeletonDriver(binding, {
      sourceSpace,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    driver.apply((id) => (id === "a" ? { x: 0, y: 0, z: 0 } : { x: 300, y: 900, z: -200 }));
    const actual = rig.middle.position.clone().transformDirection(rig.root.matrixWorld);
    const expected = new Vector3(300, 900, -200).transformDirection(sourceSpace.matrixWorld);
    expect(actual.angleTo(expected)).toBeLessThan(1e-6);
  });

  it("D3 and D3b preserve non-identity rest rotation and rest twist under a swing", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const captured = binding.bones[1]!;
    const aim = captured.restAim!;
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    driver.apply((id) => (id === "a" ? {} : { x: aim.x, y: aim.y, z: aim.z }));
    expect(rig.root.quaternion.equals(captured.restQuaternion)).toBe(true);
    const perpendicular = new Vector3(aim.y, -aim.x, 0).normalize();
    driver.apply((id) =>
      id === "a" ? {} : { x: perpendicular.x, y: perpendicular.y, z: perpendicular.z },
    );
    const swing = rig.root.quaternion.clone().multiply(captured.restQuaternion.clone().invert());
    expect(Math.abs(new Vector3(swing.x, swing.y, swing.z).dot(aim))).toBeLessThan(1e-12);
    expect(
      rig.middle.position
        .clone()
        .applyQuaternion(rig.root.quaternion)
        .normalize()
        .angleTo(perpendicular),
    ).toBeLessThan(1e-6);
  });

  it("D4 holds missing or degenerate input and keeps antipodal rotation finite", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "aim", from: "a", to: "b" } },
    });
    const before = rig.root.quaternion.clone();
    expect(driver.apply(() => undefined).bones.get("hips")).toEqual({
      kind: "held",
      reason: "source-missing",
    });
    expect(driver.apply(() => ({})).bones.get("hips")).toEqual({
      kind: "held",
      reason: "degenerate-direction",
    });
    expect(rig.root.quaternion.equals(before)).toBe(true);
    const aim = binding.bones[1]!.restAim!;
    driver.apply((id) => (id === "a" ? {} : { x: -aim.x, y: -aim.y, z: -aim.z }));
    expect(rig.root.quaternion.toArray().every(Number.isFinite)).toBe(true);
  });

  it("D5 snapshots drives independent of authored order and resets all bones", () => {
    const a = syntheticSkeleton(),
      b = syntheticSkeleton();
    const drives: Record<string, BoneDrive> = {
      hand: { kind: "frame", source: "tip" },
      hips: { kind: "frame", source: "root" },
    };
    const first = createSkeletonDriver(captureSkeleton(a.skeleton, a), {
      sourceSpace: a.rootParent,
      drives,
    });
    const second = createSkeletonDriver(captureSkeleton(b.skeleton, b), {
      sourceSpace: b.rootParent,
      drives: { hips: drives.hips!, hand: drives.hand! },
    });
    drives.hips = { kind: "rest" };
    const read = (id: string) => (id === "root" ? { x: 5, rotation: 35 } : { y: 8, rotationX: 20 });
    first.apply(read);
    second.apply(read);
    a.skeleton.bones.forEach((bone, i) =>
      expectRigid(bone.matrixWorld, b.skeleton.bones[i]!.matrixWorld),
    );
    a.middle.position.set(9, 9, 9);
    first.reset();
    expect(a.middle.position.toArray()).toEqual([2, 4, -1]);
  });

  it("D6 never writes inverse bind data after 100 applies", () => {
    const rig = syntheticSkeleton(),
      binding = captureSkeleton(rig.skeleton, rig);
    const inverses = rig.skeleton.boneInverses.map((matrix) => matrix.toArray());
    const driver = createSkeletonDriver(binding, {
      sourceSpace: rig.rootParent,
      drives: { hips: { kind: "frame", source: "x" } },
    });
    for (let i = 0; i < 100; i += 1) driver.apply(() => ({ x: i, rotation: i }));
    expect(rig.skeleton.boneInverses.map((matrix) => matrix.toArray())).toEqual(inverses);
  });

  it("D7 refuses an unmapped drive key", () => {
    const rig = syntheticSkeleton();
    expect(() =>
      createSkeletonDriver(captureSkeleton(rig.skeleton, rig), {
        sourceSpace: rig.rootParent,
        drives: { absent: { kind: "rest" } },
      }),
    ).toThrow(TypeError);
  });

  it("D8 selects pose rows only from a wholly valid table", () => {
    const hips = { x: 10, y: 20, z: 30, rotation: 15, rotationX: 0, rotationY: 0 };
    const hand = { x: 40, y: 50, z: 60, rotation: 45, rotationX: 10, rotationY: 5 };
    const read = tableFrameSource([
      { id: "hips", cells: hips },
      { id: "hand", cells: hand },
    ]);
    expect(read("hips")).toBe(hips);
    expect(read("hand")).toBe(hand);
    expect(read("absent")).toBeUndefined();

    const duplicateAfter = tableFrameSource([
      { id: "hips", cells: hips },
      { id: "hand", cells: hand },
      { id: "hips", cells: { ...hips, x: 99 } },
    ]);
    expect(duplicateAfter("hips")).toBeUndefined();

    const duplicateOutside = tableFrameSource([
      { id: "hips", cells: hips },
      { id: "hand", cells: hand },
      { id: "hand", cells: { ...hand, x: 99 } },
    ]);
    expect(duplicateOutside("hips")).toBeUndefined();

    const malformedCells = tableFrameSource([
      { id: "hips", cells: hips },
      { id: "hand", cells: { x: Number.NaN } },
    ]);
    expect(malformedCells("hips")).toBeUndefined();

    for (const bad of [null, undefined, {}, "string", 123, [{ id: 123, cells: hips }]])
      expect(tableFrameSource(bad)("hips")).toBeUndefined();
  });

  it("D9 describes every kind and held reason", () => {
    const outcomes: BoneOutcome[] = [
      { kind: "applied" },
      { kind: "rest" },
      { kind: "held", reason: "source-missing" },
      { kind: "held", reason: "degenerate-direction" },
      { kind: "held", reason: "no-rest-aim" },
    ];
    expect(outcomes.map(describeBoneOutcome)).toEqual([
      "Bone transform applied.",
      "Bone restored to rest.",
      "Bone held: source missing.",
      "Bone held: degenerate direction.",
      "Bone held: no unambiguous rest aim child.",
    ]);
  });
});
