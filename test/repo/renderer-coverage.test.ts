import { describe, expect, it } from "vitest";
import { UNWRITTEN, WRITTEN } from "@gerak/dom";
import { POSE_2D_FIELDS } from "@gerak/moves";
import { UNWRITTEN_2D, UNWRITTEN_3D, WRITTEN_2D, WRITTEN_3D } from "@gerak/three";
import { NUMBERS, TURNS } from "../../packages/moves/src/fields/pose3d";

const POSE_3D_FIELDS: readonly string[] = [...TURNS, ...NUMBERS];

/** Each field in the pose type is in the written list or the unwritten record, never both and never neither. */
function placed(
  fields: readonly string[],
  written: readonly string[],
  unwritten: Readonly<Record<string, string | undefined>>,
): { readonly neither: string[]; readonly both: string[]; readonly strays: string[] } {
  const reasons = Object.keys(unwritten);
  return {
    neither: fields.filter((field) => !written.includes(field) && !reasons.includes(field)),
    both: fields.filter((field) => written.includes(field) && reasons.includes(field)),
    strays: [...written, ...reasons].filter((field) => !fields.includes(field)),
  };
}

const NONE = { neither: [], both: [], strays: [] };

describe("every renderer says what it writes", () => {
  it("the DOM renderer places every Pose2d field once", () => {
    expect(placed(POSE_2D_FIELDS, WRITTEN, UNWRITTEN)).toEqual(NONE);
  });

  it("the Three.js 2D renderer places every Pose2d field once", () => {
    expect(placed(POSE_2D_FIELDS, WRITTEN_2D, UNWRITTEN_2D)).toEqual(NONE);
  });

  it("the Three.js 3D renderer places every Pose3d field once", () => {
    expect(placed(POSE_3D_FIELDS, WRITTEN_3D, UNWRITTEN_3D)).toEqual(NONE);
  });

  it("a field that is in neither list, or in both, is found", () => {
    const [first, ...rest] = WRITTEN;
    expect(placed(POSE_2D_FIELDS, rest, UNWRITTEN).neither).toEqual([first]);
    expect(placed(POSE_2D_FIELDS, WRITTEN, { x: "written elsewhere" }).both).toEqual(["x"]);
  });

  it("gives every unwritten field a reason", () => {
    for (const reasons of [UNWRITTEN, UNWRITTEN_2D, UNWRITTEN_3D])
      for (const [field, reason] of Object.entries(reasons))
        expect(reason?.length, field).toBeGreaterThan(0);
  });
});
