import type { DofId } from "../body/skeleton";
import { actorPose, standingRoot, type ActorPose } from "./actor";
import { add3, type Vec3 } from "./rotation";

/** One key pose of a scenario: at a fraction of its period, these angles and this root offset. */
interface Key {
  readonly at: number;
  readonly angles: Readonly<Record<DofId, number>>;
  /** The pelvis offset from standing, metres. */
  readonly root?: Vec3;
}

interface Scenario {
  readonly label: string;
  readonly periodMs: number;
  /** Ascending `at` from 0; the last key eases back into the first, so every scenario loops. */
  readonly keys: readonly Key[];
}

const ARMS_DOWN = { "left-shoulder-abduct": 10, "right-shoulder-abduct": 10 };
const RELAXED = { ...ARMS_DOWN, "left-elbow-flex": 10, "right-elbow-flex": 10 };

/**
 * The scripted motions, data read by one interpolator (`scenarioPose`), each chosen for a question
 * the pipeline has to answer: a still person, a reversal inside a gap, a squat, a half turn (front
 * and back), a wrist behind the torso, crossed arms, and a person stepping out of frame and back.
 */
export const SCENARIOS = {
  standing: {
    label: "Standing, slow sway",
    periodMs: 6000,
    keys: [
      { at: 0, angles: RELAXED },
      { at: 0.5, angles: { ...RELAXED, "spine-bend": 3, "neck-twist": 8, "left-elbow-flex": 18 } },
    ],
  },
  "arm-reversal": {
    label: "Left arm raise that reverses fast",
    periodMs: 2400,
    keys: [
      { at: 0, angles: RELAXED },
      { at: 0.4, angles: { ...RELAXED, "left-shoulder-flex": 150, "left-elbow-flex": 35 } },
      { at: 0.5, angles: { ...RELAXED, "left-shoulder-flex": 150, "left-elbow-flex": 35 } },
    ],
  },
  squat: {
    label: "Squat with arms forward",
    periodMs: 3000,
    keys: [
      { at: 0, angles: RELAXED },
      {
        at: 0.5,
        angles: {
          "spine-flex": 30,
          "left-hip-flex": 85,
          "right-hip-flex": 85,
          "left-knee-flex": 110,
          "right-knee-flex": 110,
          "left-ankle-flex": 20,
          "right-ankle-flex": 20,
          "left-shoulder-flex": 85,
          "right-shoulder-flex": 85,
        },
        root: [0, -0.38, -0.05],
      },
    ],
  },
  turn: {
    label: "Half turn, front to back and back",
    periodMs: 8000,
    keys: [
      { at: 0, angles: RELAXED },
      { at: 0.5, angles: { ...RELAXED, "root-yaw": 180 } },
    ],
  },
  "wrist-behind-torso": {
    label: "Left wrist behind the back",
    periodMs: 6000,
    keys: [
      { at: 0, angles: RELAXED },
      {
        at: 0.3,
        angles: {
          ...ARMS_DOWN,
          "left-shoulder-flex": -45,
          "left-shoulder-abduct": -10,
          "left-shoulder-twist": -40,
          "left-elbow-flex": 110,
        },
      },
      {
        at: 0.7,
        angles: {
          ...ARMS_DOWN,
          "left-shoulder-flex": -45,
          "left-shoulder-abduct": -10,
          "left-shoulder-twist": -40,
          "left-elbow-flex": 110,
        },
      },
    ],
  },
  "crossed-arms": {
    label: "Arms crossed in front",
    periodMs: 5000,
    keys: [
      { at: 0, angles: RELAXED },
      {
        at: 0.35,
        angles: {
          "left-shoulder-flex": 60,
          "right-shoulder-flex": 60,
          "left-shoulder-abduct": -25,
          "right-shoulder-abduct": -25,
          "left-elbow-flex": 125,
          "right-elbow-flex": 125,
        },
      },
      {
        at: 0.65,
        angles: {
          "left-shoulder-flex": 60,
          "right-shoulder-flex": 60,
          "left-shoulder-abduct": -25,
          "right-shoulder-abduct": -25,
          "left-elbow-flex": 125,
          "right-elbow-flex": 125,
        },
      },
    ],
  },
  "step-out": {
    label: "Step out of frame and back",
    periodMs: 8000,
    keys: [
      { at: 0, angles: RELAXED },
      { at: 0.35, angles: RELAXED, root: [2.4, 0, 0] },
      { at: 0.65, angles: RELAXED, root: [2.4, 0, 0] },
    ],
  },
} as const satisfies Readonly<Record<string, Scenario>>;

export type ScenarioId = keyof typeof SCENARIOS;
export const SCENARIO_IDS = Object.keys(SCENARIOS) as readonly ScenarioId[];

/** Smoothstep: zero velocity at both keys, so a scripted reversal has no kink. */
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The scenario's pose at `tMs`: the two keys around the instant's phase, eased. An angle a key
 * does not name is 0 at that key, so every key is a whole pose. Deterministic in `tMs`, and
 * periodic: `scenarioPose(id, t)` equals `scenarioPose(id, t + periodMs)`.
 */
export function scenarioPose(id: ScenarioId, tMs: number): ActorPose {
  const scenario: Scenario = SCENARIOS[id];
  if (!Number.isFinite(tMs)) throw new Error("Scenario time must be finite.");
  const phase =
    (((tMs % scenario.periodMs) + scenario.periodMs) % scenario.periodMs) / scenario.periodMs;
  const keys = scenario.keys;
  let index = keys.length - 1;
  while (index > 0 && keys[index]!.at > phase) index -= 1;
  const from = keys[index]!;
  const to = keys[(index + 1) % keys.length]!;
  const end = index + 1 < keys.length ? to.at : 1;
  const t = ease(end > from.at ? (phase - from.at) / (end - from.at) : 0);
  const names = new Set([...Object.keys(from.angles), ...Object.keys(to.angles)]);
  const angles: Record<DofId, number> = {};
  for (const name of names)
    angles[name] =
      (from.angles[name] ?? 0) + ((to.angles[name] ?? 0) - (from.angles[name] ?? 0)) * t;
  const [fx, fy, fz] = from.root ?? [0, 0, 0];
  const [tx, ty, tz] = to.root ?? [0, 0, 0];
  const offset: Vec3 = [fx + (tx - fx) * t, fy + (ty - fy) * t, fz + (tz - fz) * t];
  return actorPose(angles, add3(standingRoot(), offset));
}
