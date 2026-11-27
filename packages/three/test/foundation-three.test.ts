import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D } from "three";
import { motion, type Pose3d, type Time } from "@gerak/core";
import { manualDriver, play } from "@gerak/player";
import { compileScene, formatStageError, frame, object, scene } from "@gerak/stage";
import { usePlayer } from "@gerak/react";
import { applyPose2d, applyPose3d, captureRest3d, restoreRest3d, threeBinder } from "../src/index";
import { findSharedMaterials } from "../src/materials";
import { useTarget3d } from "../src/react";

describe("Slice 3 foundation three contracts", () => {
  it("captures and restores full Rest3d including quaternion, scale, visibility, and materials", () => {
    const mat = new MeshBasicMaterial({ opacity: 0.8, transparent: false });
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    mesh.position.set(1, 2, 3);
    mesh.rotation.set(0.2, 0.4, -0.3);
    mesh.scale.set(2, 3, 4);
    mesh.visible = true;

    const rest = captureRest3d(mesh);
    applyPose3d(mesh, { x: 5, rotationY: 90, scale: 0.5, opacity: 0.5 }, rest);

    expect(mesh.position.x).toBeCloseTo(6, 9);
    expect(mesh.position.y).toBeCloseTo(2, 9);
    expect(mesh.scale.x).toBeCloseTo(1, 9);
    expect(mesh.scale.y).toBeCloseTo(1.5, 9);
    expect(mesh.scale.z).toBeCloseTo(2, 9);
    expect(mat.opacity).toBeCloseTo(0.4, 9);
    expect(mat.transparent).toBe(true);

    restoreRest3d(mesh, rest);
    expect(mesh.position.toArray()).toEqual([1, 2, 3]);
    expect(mesh.scale.toArray()).toEqual([2, 3, 4]);
    expect(mesh.rotation.x).toBeCloseTo(0.2, 9);
    expect(mesh.rotation.y).toBeCloseTo(0.4, 9);
    expect(mesh.rotation.z).toBeCloseTo(-0.3, 9);
    expect(mesh.visible).toBe(true);
    expect(mat.opacity).toBeCloseTo(0.8, 9);
    expect(mat.transparent).toBe(false);
  });

  it("handles Group descendants, Material[], shared material isolation, and opacity reset", () => {
    const sharedMat = new MeshBasicMaterial({ opacity: 1, transparent: false });
    const matA = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    const matB = new MeshBasicMaterial({ opacity: 1, transparent: false });

    const group = new Group();
    const child = new Mesh(new BoxGeometry(1, 1, 1), [matA, matB]);
    const sibling = new Mesh(new BoxGeometry(1, 1, 1), sharedMat);
    const sharedTarget = new Mesh(new BoxGeometry(1, 1, 1), sharedMat);
    group.add(child);

    applyPose3d(group, { opacity: 0.4 });
    expect(matA.opacity).toBeCloseTo(0.2, 9);
    expect(matB.opacity).toBeCloseTo(0.4, 9);
    expect(matB.transparent).toBe(true);

    applyPose3d(group, {});
    expect(matA.opacity).toBeCloseTo(0.5, 9);
    expect(matB.opacity).toBeCloseTo(1, 9);
    expect(matB.transparent).toBe(false);

    // Sibling sharing a material must not have its opacity mutated by animating sibling target.
    applyPose3d(sibling, { opacity: 1 });
    applyPose3d(sharedTarget, { opacity: 0.2 });
    expect(sibling.material.opacity).toBe(1);
    expect(sharedTarget.material).not.toBe(sibling.material);
    expect(sharedTarget.material.opacity).toBeCloseTo(0.2, 9);

    // Same isolation and group support in applyPose2d.
    const mat2d = new MeshBasicMaterial({ opacity: 0.9, transparent: false });
    const g2d = new Group();
    g2d.add(new Mesh(new BoxGeometry(1, 1, 1), mat2d));
    applyPose2d(g2d, { opacity: 0.5 });
    expect(mat2d.opacity).toBeCloseTo(0.45, 9);
    applyPose2d(g2d, {});
    expect(mat2d.opacity).toBeCloseTo(0.9, 9);
    expect(mat2d.transparent).toBe(false);
  });

  it("gates renderer draws on dirty 3D outputs, redraws when second object moves or on resize, and restores rest on stop", () => {
    const compiled = compileScene(
      scene(
        { length: 1000 },
        object("first").moves(motion((): Pose3d => ({ x: 1 }))),
        object("second").moves((t) => (t.progress >= 0.5 ? { x: 4 } : { x: 0 })),
      ),
    );
    if (!compiled.ok) throw new Error(compiled.errors.map(formatStageError).join("\n"));
    const stg = compiled.stage;

    const root = new Object3D();
    const first = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
    first.name = "first";
    first.position.set(2, 0, 0);
    const second = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
    second.name = "second";
    second.position.set(0, 5, 0);
    root.add(first, second);

    const driver = manualDriver({ durationMs: 1000 });
    const player = play((time, events) => frame(stg, { time, events }).targets, driver);
    let draws = 0;
    const binder = threeBinder(root, {
      draw: () => {
        draws += 1;
      },
      resize: () => undefined,
    });
    const stop = binder.start(player, stg);
    expect(draws).toBe(1);
    expect(first.position.x).toBeCloseTo(3, 9);

    // Seeking within [0, 0.4] keeps both poses identical: no redraw needed.
    driver.seekMs(200);
    expect(draws).toBe(1);

    // At 500ms only `second` moves (`first` stays unchanged): must still write `second` and redraw.
    driver.seekMs(500);
    expect(draws).toBe(2);
    expect(second.position.x).toBeCloseTo(4, 9);

    // Explicit resize must redraw.
    binder.resize?.();
    expect(draws).toBe(3);

    // Stop restores full rest.
    stop();
    expect(first.position.x).toBe(2);
    expect(second.position.x).toBe(0);
    expect(second.position.y).toBe(5);
  });

  it("supports stage (index, count) => Pose3d list functions and full Rest3d in useTarget3d", async () => {
    const stgScene = (time: Time) => ({
      items: (index: number, count: number): Pose3d => ({
        x: index * 2 + count * 10 + time.progress,
      }),
    });
    const driver = manualDriver({ durationMs: 1000 });
    const createDriver = () => driver;
    const obj = new Object3D();
    obj.position.set(1, 2, 3);
    obj.rotation.set(0, 0.5, 0);
    obj.scale.set(2, 2, 2);

    const Probe: FC<{ readonly count: number }> = ({ count }) => {
      const playing = usePlayer(stgScene, createDriver);
      const ref = useTarget3d(playing?.player, "items", { at: 1, count });
      return createElement("div", { ref });
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Probe, { count: 3 }), { createNodeMock: () => obj });
    });
    // index=1, count=3, progress=0 => pose.x = 32; added to rest.x=1 => 33.
    expect(obj.position.x).toBeCloseTo(33, 9);
    expect(obj.position.y).toBe(2);
    expect(obj.scale.x).toBe(2);
    expect(obj.rotation.y).toBeCloseTo(0.5, 9);

    await act(() => {
      driver.seekMs(500);
    });
    expect(obj.position.x).toBeCloseTo(33.5, 9);

    await act(() => renderer?.unmount());
    // Unmount restores captured Rest3d transforms and materials.
    expect(obj.position.x).toBe(1);
    expect(obj.position.y).toBe(2);
    expect(obj.scale.x).toBe(2);
  });

  it("restores materials and deduplicates override nodes when finding shared materials", () => {
    const sharedMat = new MeshBasicMaterial({ opacity: 1, transparent: false });
    const uniqueMat = new MeshBasicMaterial({ opacity: 1, transparent: false });
    const root = new Group();
    const overrideChild = new Mesh(new BoxGeometry(1, 1, 1), uniqueMat);
    const sharedA = new Mesh(new BoxGeometry(1, 1, 1), sharedMat);
    const sharedB = new Mesh(new BoxGeometry(1, 1, 1), sharedMat);
    root.add(overrideChild, sharedA, sharedB);

    const detected = findSharedMaterials([root, overrideChild]);
    expect(detected.has(sharedMat)).toBe(true);
    expect(detected.has(uniqueMat)).toBe(false);
  });
});
