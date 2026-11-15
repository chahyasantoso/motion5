import { clockDriver } from "@gerak/dom";
import {
  aim,
  ease,
  follow,
  mix,
  orbit,
  project3d,
  span,
  type Events,
  type Lens3d,
  type Pose3d,
  type Time,
} from "@gerak/moves";
import { posedJoints3d, type BonePose3d, type JointTable3d } from "@gerak/rig";

/** How long the scene runs, in ms; `motion:sample` and `motion:review` read it. */
export const durationMs = 5200;

/** The page's size in px; the page sizes its renderer and stage from it. */
export const stage = { width: 1280, height: 720 } as const;

/** Edge of the turning cube, in world units. */
export const CUBE = 1.6;

/** The arm's joints in the cube's own space, rising from its top face. */
export const ARM = {
  base: { x: 0, y: 0.8, z: 0, parent: null },
  mid: { x: 0, y: 1.5, z: 0, parent: "base" },
  tip: { x: 0, y: 2.2, z: 0, parent: "mid" },
} as const satisfies JointTable3d;

/** The fixed point on the cube that the first callout is pinned to, in the cube's own space. */
export const MARK = { x: 0.8, y: 0.8, z: 0.8 } as const;

const MARK_TABLE = { mark: MARK } as const satisfies JointTable3d;

/** Where the caption's corner sits, under the cube; it does not turn with it. */
export const CAPTION_POINT = { x: -1.3, y: -1.5, z: 0 } as const;

/** The caption's words; the scene's cue samples reveal them one by one. */
export const CAPTION = ["Labels", "ride", "the", "pose,", "not", "a", "loop."] as const;

const REVEAL_FROM = 1000;
const REVEAL_EVERY = 350;

/** One sample per word, each carrying how many words should show by then. */
export const cues: Events = CAPTION.map((_word, index) => ({
  name: "words",
  at: REVEAL_FROM + index * REVEAL_EVERY,
  value: index + 1,
}));

const eye = orbit({ target: { x: 0, y: 0.6, z: 0 }, radius: 9, azimuth: 0, elevation: 14 });

/** The fixed camera: the page draws through it and `project3d` pins each callout by it. */
export const lens: Lens3d = { ...eye, ...aim(eye, { x: 0, y: 0.6, z: 0 }), fov: 40 };

const turn = span(0, 4400);
const lean = span(500, 3300);
const curl = span(900, 4000);

const revealed = follow({ start: 0, on: { words: "value" }, stiffness: 170, damping: 26 });

/** How many caption words show for a `words` number from the scene. */
export function wordsShown(value: number): number {
  return Math.min(CAPTION.length, Math.max(0, Math.round(value)));
}

/** Opacity of a callout: 0 behind the lens and from the object's centre depth onward, 1 once clear of it. */
export function fadeOf(at: { readonly depth: number; readonly visible: boolean }, centre: number) {
  if (!at.visible) return 0;
  return Math.min(1, Math.max(0, (centre - at.depth) / 0.4));
}

/** Review limits of the 3D targets: a jump of a fifth of the cube, and a turn of 30 degrees. */
export const limits = {
  object: { jump: CUBE / 5, turn: 30 },
  bones: { jump: CUBE / 5, turn: 30 },
} as const;

/** Every target's pose at `time`: `object` and `bones` in 3D, each callout in stage px. */
export const scene = (time: Time, events: Events) => {
  const object: Pose3d = {
    rotationX: 10,
    rotationY: mix(-20, 160, turn.of(time, ease.sineInOut).progress),
  };
  const bones: Record<"base" | "mid", BonePose3d> = {
    base: { rotation: mix(0, 30, lean.of(time, ease.sineInOut).progress) },
    mid: { rotation: mix(0, -60, curl.of(time, ease.sineInOut).progress) },
  };
  const centre = project3d({ x: 0, y: 0, z: 0 }, lens, stage).depth;
  const mark = posedJoints3d(MARK_TABLE, {}, object).mark;
  const tip = posedJoints3d(ARM, bones, object).tip;
  const pinned = project3d(mark, lens, stage);
  const tipped = project3d(tip, lens, stage);
  const under = project3d(CAPTION_POINT, lens, stage);
  return {
    object,
    bones,
    pin: { x: pinned.x, y: pinned.y, opacity: fadeOf(pinned, centre) },
    tip: { x: tipped.x, y: tipped.y, opacity: fadeOf(tipped, centre) },
    caption: {
      x: under.x,
      y: under.y,
      opacity: under.visible ? 1 : 0,
      custom: { words: revealed(time, events) },
    },
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
