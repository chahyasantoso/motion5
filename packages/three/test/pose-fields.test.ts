import { describe, expect, it } from "vitest";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { applyPose, type RenderTarget } from "@gerak/dom";
import { POSE_2D_FIELDS, type Pose2d } from "@gerak/moves";
import { applyPose2d } from "../src/index";

/** A value for each field that differs from rest, so a renderer that drops the field shows no change. */
const MOVED: Required<Pick<Pose2d, (typeof POSE_2D_FIELDS)[number]>> = {
  x: 7,
  y: 9,
  rotation: 30,
  scale: 2,
  scaleX: 0.5,
  scaleY: 0.25,
  opacity: 0.5,
  anchor: "bottom",
};

function domWrite(pose: Pose2d): string {
  const target: RenderTarget = { style: {} };
  applyPose(target, pose);
  return JSON.stringify(target.style);
}

function threeWrite(pose: Pose2d): string {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
  applyPose2d(mesh, pose);
  return JSON.stringify([mesh.position, mesh.rotation.z, mesh.scale, mesh.material.opacity]);
}

describe("every Pose2d field", () => {
  it.each(POSE_2D_FIELDS)("%s reaches the DOM renderer", (field) => {
    const base: Pose2d = field === "anchor" ? { scaleY: 0.5 } : {};
    expect(domWrite({ ...base, [field]: MOVED[field] })).not.toBe(domWrite(base));
  });

  it.each(POSE_2D_FIELDS)("%s reaches the Three.js renderer", (field) => {
    const base: Pose2d = field === "anchor" ? { scaleY: 0.5 } : {};
    expect(threeWrite({ ...base, [field]: MOVED[field] })).not.toBe(threeWrite(base));
  });
});
