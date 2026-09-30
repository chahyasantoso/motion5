import type { JointId } from "../filler/landmarks";

/**
 * Live keys that force a joint missing through the same `forced` reason a replay mask uses: the
 * top row is the arms, the home row the legs, left hand for the person's left side.
 */
export const HOTKEYS: Readonly<Record<string, JointId>> = {
  q: "left-elbow",
  w: "left-wrist",
  o: "right-elbow",
  p: "right-wrist",
  a: "left-knee",
  s: "left-ankle",
  k: "right-knee",
  l: "right-ankle",
};

export interface ForcedJoints {
  /** The joints forced this frame, the set the pipeline step reads. */
  readonly joints: ReadonlySet<JointId>;
  /** Toggles the joint bound to `key`; answers whether the key is bound at all. */
  toggle(key: string): boolean;
  clear(): void;
}

export function createForcedJoints(): ForcedJoints {
  const joints = new Set<JointId>();
  return {
    joints,
    toggle(key) {
      const joint = HOTKEYS[key.toLowerCase()];
      if (joint === undefined) return false;
      if (!joints.delete(joint)) joints.add(joint);
      return true;
    },
    clear() {
      joints.clear();
    },
  };
}
