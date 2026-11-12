import { describe, expect, it } from "vitest";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { applyValue, type RenderTarget } from "@gerak/dom";
import { POSE_2D_FIELDS, type Pose2d } from "@gerak/moves";
import { applyPose2d, applyPose3d, THREE_POSE_FIELDS } from "../src/index";

type Field = (typeof POSE_2D_FIELDS)[number];

/** A value for each field that differs from rest, so a renderer that drops the field shows no change. */
const MOVED: Required<Pick<Pose2d, Field>> = {
  x: 7,
  y: 9,
  rotation: 30,
  scale: 2,
  scaleX: 0.5,
  scaleY: 0.25,
  opacity: 0.5,
  blur: 3,
  drawn: 0.5,
  drawnFrom: 0.25,
  clipX: 5,
  clipY: 6,
  clipRadius: 7,
  anchor: "bottom",
};

/** What a field needs beside it to show: an anchor needs a scale, a clip centre needs a radius. */
function baseFor(field: Field): Pose2d {
  switch (field) {
    case "anchor":
      return { scaleY: 0.5 };
    case "clipX":
    case "clipY":
      return { clipRadius: 7 };
    case "x":
    case "y":
    case "rotation":
    case "scale":
    case "scaleX":
    case "scaleY":
    case "opacity":
    case "blur":
    case "drawn":
    case "drawnFrom":
    case "clipRadius":
      return {};
    default: {
      const unknown: never = field;
      throw new TypeError(`Unknown field: ${String(unknown)}`);
    }
  }
}

function domWrite(pose: Pose2d): string {
  const target: RenderTarget = { style: {}, getTotalLength: () => 100 };
  applyValue(target, pose);
  return JSON.stringify(target.style);
}

function threeWrite(pose: Pose2d): string {
  const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
  applyPose2d(mesh, pose);
  return JSON.stringify([mesh.position, mesh.rotation.z, mesh.scale, mesh.material.opacity]);
}

const written: ReadonlySet<Field> = new Set(THREE_POSE_FIELDS);

describe("every Pose2d field", () => {
  it.each(POSE_2D_FIELDS)("%s reaches the DOM renderer", (field) => {
    const base = baseFor(field);
    expect(domWrite({ ...base, [field]: MOVED[field] })).not.toBe(domWrite(base));
  });

  it.each(THREE_POSE_FIELDS)("%s reaches the Three.js renderer", (field) => {
    const base = baseFor(field);
    expect(threeWrite({ ...base, [field]: MOVED[field] })).not.toBe(threeWrite(base));
  });

  it.each(POSE_2D_FIELDS.filter((field) => !written.has(field)))(
    "%s leaves a Three.js object unchanged",
    (field) => {
      expect(threeWrite({ [field]: MOVED[field] })).toBe(threeWrite({}));
    },
  );
});

describe("custom numbers on a Three.js object", () => {
  it("go to the piece's own function, in 2D and in 3D", () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
    const seen: [string, number, unknown][] = [];
    const custom = (name: string, value: number, object: unknown): void => {
      seen.push([name, value, object]);
    };
    applyPose2d(mesh, { x: 1, custom: { tint: 0.4 } }, undefined, custom);
    applyPose3d(mesh, { z: 1, custom: { glow: 2 } }, undefined, custom);
    expect(seen).toEqual([
      ["tint", 0.4, mesh],
      ["glow", 2, mesh],
    ]);
  });

  it("are dropped when the piece gives no function", () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial());
    expect(() => applyPose2d(mesh, { custom: { tint: 1 } })).not.toThrow();
  });
});
