import type { IK3D } from "../ik3d-playground-project";

/** The frames a 3D stage marks: a closed union, so a new kind cannot go unpainted. */
export type FrameKind = "goal" | "pole" | "root";

/** One colour per frame kind, shared by the CSS and the three.js stage. */
export const FRAME_COLOR: Readonly<Record<FrameKind, string>> = {
  goal: "#fbbf24",
  pole: "#34d399",
  root: "#c084fc",
};

/** One colour per member, keyed by the authored member ids so none can go unpainted. */
export const BONE_COLOR: Readonly<Record<(typeof IK3D.memberTracks)[number], string>> = {
  upper: "#c084fc",
  fore: "#818cf8",
  wrist: "#38bdf8",
  hand: "#67e8f9",
};
