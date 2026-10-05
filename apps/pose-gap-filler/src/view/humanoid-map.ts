import type { Skeleton } from "three";

const HUMANOID_ALIASES = {
  hips: ["hips", "pelvis", "jbipchips"],
  "left-upper-arm": ["leftarm", "leftupperarm", "jbiplupperarm"],
  "left-lower-arm": ["leftforearm", "leftlowerarm", "jbipllowerarm"],
  "right-upper-arm": ["rightarm", "rightupperarm", "jbiprupperarm"],
  "right-lower-arm": ["rightforearm", "rightlowerarm", "jbiprlowerarm"],
  "left-upper-leg": ["leftupleg", "leftupperleg", "jbiplupperleg"],
  "left-lower-leg": ["leftleg", "leftlowerleg", "jbipllowerleg"],
  "right-upper-leg": ["rightupleg", "rightupperleg", "jbiprupperleg"],
  "right-lower-leg": ["rightleg", "rightlowerleg", "jbiprlowerleg"],
  spine: ["spine", "jbipcspine"],
  chest: ["spine1", "chest", "upperchest", "jbipcchest"],
  neck: ["neck", "jbipcneck"],
  head: ["head", "jbipchead"],
  "left-hand": ["lefthand", "jbiplhand"],
  "right-hand": ["righthand", "jbiprhand"],
  "left-foot": ["leftfoot", "jbiplfoot"],
  "right-foot": ["rightfoot", "jbiprfoot"],
} as const;
export type HumanoidKey = keyof typeof HUMANOID_ALIASES;
export const REQUIRED_HUMANOID_KEYS: readonly HumanoidKey[] = Object.freeze([
  "hips",
  "left-upper-arm",
  "left-lower-arm",
  "right-upper-arm",
  "right-lower-arm",
  "left-upper-leg",
  "left-lower-leg",
  "right-upper-leg",
  "right-lower-leg",
]);
const aliases = new Map<string, HumanoidKey>();
for (const [key, names] of Object.entries(HUMANOID_ALIASES))
  for (const name of names) aliases.set(name, key as HumanoidKey);

/** Handles GLTFLoader sanitization and unsanitized Mixamo names, never guesses other prefixes. */
export function normalizeBoneName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s_[\].:/]/g, "")
    .replace(/^mixamorig\d*/, "");
}

export function resolveHumanoid(skeleton: Skeleton): {
  readonly boneKeys: Readonly<Record<string, HumanoidKey>>;
  readonly missing: readonly HumanoidKey[];
} {
  const boneKeys: Record<string, HumanoidKey> = {};
  const found = new Set<HumanoidKey>();
  for (const bone of skeleton.bones) {
    const key = aliases.get(normalizeBoneName(bone.name));
    if (key === undefined) continue;
    Object.defineProperty(boneKeys, bone.name, {
      value: key,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    found.add(key);
  }
  return {
    boneKeys: Object.freeze(boneKeys),
    missing: Object.freeze(REQUIRED_HUMANOID_KEYS.filter((key) => !found.has(key))),
  };
}
