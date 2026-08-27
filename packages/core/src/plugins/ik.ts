import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";

export interface BaseFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readFrame(input: unknown): BaseFrame {
  if (input === null || typeof input !== "object" || Array.isArray(input))
    return { x: 0, y: 0, rotation: 0 };
  const record = input as Readonly<Record<string, unknown>>;
  return {
    x: readNumber(record.x),
    y: readNumber(record.y),
    rotation: readNumber(record.rotation),
  };
}

export function readMembers(membersInput: unknown): readonly MemberState[] {
  if (!Array.isArray(membersInput) || membersInput.length === 0) {
    throw new Error("ikPlugin requires non-empty members array in inputs.");
  }
  return membersInput as readonly MemberState[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function solveTwoBone(
  root: BaseFrame,
  target: BaseFrame,
  members: readonly MemberState[],
  flip = false,
): Readonly<Record<string, number>> {
  if (members.length < 2) {
    const result: Record<string, number> = {};
    for (const m of members) result[m.id] = 0;
    return Object.freeze(result);
  }

  const m1 = members[0]!;
  const m2 = members[1]!;
  const l1 = Math.max(0, readNumber(m1.values.length));
  const l2 = Math.max(0, readNumber(m2.values.length));

  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.hypot(dx, dy);
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (l1 <= 0 && l2 <= 0) {
    return Object.freeze({
      [m1.id]: targetAngle - root.rotation,
      [m2.id]: 0,
    });
  }

  if (l1 <= 0) {
    return Object.freeze({
      [m1.id]: 0,
      [m2.id]: targetAngle - root.rotation,
    });
  }

  if (l2 <= 0) {
    return Object.freeze({
      [m1.id]: targetAngle - root.rotation,
      [m2.id]: 0,
    });
  }

  const minReach = Math.abs(l1 - l2);
  const maxReach = l1 + l2;
  const clampedD = clamp(d, minReach, maxReach);

  if (clampedD <= 0) {
    return Object.freeze({
      [m1.id]: 0,
      [m2.id]: 0,
    });
  }

  const cosAlpha = clamp((l1 * l1 + clampedD * clampedD - l2 * l2) / (2 * l1 * clampedD), -1, 1);
  const alpha = (Math.acos(cosAlpha) * 180) / Math.PI;

  const cosBeta = clamp((l1 * l1 + l2 * l2 - clampedD * clampedD) / (2 * l1 * l2), -1, 1);
  const beta = (Math.acos(cosBeta) * 180) / Math.PI;

  let r1: number;
  let r2: number;

  if (!flip) {
    const worldR1 = targetAngle - alpha;
    r1 = worldR1 - root.rotation;
    r2 = 180 - beta;
  } else {
    const worldR1 = targetAngle + alpha;
    r1 = worldR1 - root.rotation;
    r2 = beta - 180;
  }

  return Object.freeze({
    [m1.id]: r1,
    [m2.id]: r2,
  });
}

export const ikPlugin: PluginDefinition = {
  name: "ik",
  keys: ["flip"],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "target position to reach" },
  },
  stage: "compose",
  outputs: ["rotations"],
  compose: (values, _progress, inputs) => {
    const root = readFrame(inputs.root);
    const target = readFrame(inputs.target);
    const members = readMembers(inputs.members);
    const flip = Boolean(values.flip);
    const rotations = solveTwoBone(root, target, members, flip);
    return Object.freeze({
      rotations: Object.freeze(rotations as unknown as ImmutableRecord),
    });
  },
};
