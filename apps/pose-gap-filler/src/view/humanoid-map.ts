import type { Bone, Object3D, Skeleton } from "three";

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
const REQUIRED: ReadonlySet<HumanoidKey> = new Set(REQUIRED_HUMANOID_KEYS);
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

/**
 * Optional keys take the first matching bone in skeleton order (a rig may carry both Chest and
 * UpperChest). A required key matched by several bones is ambiguous and refused by name.
 */
export function resolveHumanoid(skeleton: Skeleton): {
  readonly boneKeys: Readonly<Record<string, HumanoidKey>>;
  readonly missing: readonly HumanoidKey[];
  readonly ambiguous: readonly HumanoidKey[];
} {
  const boneKeys: Record<string, HumanoidKey> = {};
  const found = new Set<HumanoidKey>();
  const ambiguous = new Set<HumanoidKey>();
  for (const bone of skeleton.bones) {
    const key = aliases.get(normalizeBoneName(bone.name));
    if (key === undefined) continue;
    if (found.has(key)) {
      if (REQUIRED.has(key)) ambiguous.add(key);
      continue;
    }
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
    ambiguous: Object.freeze(REQUIRED_HUMANOID_KEYS.filter((key) => ambiguous.has(key))),
  };
}

/**
 * Each aim-driven key aims along its chain, at the first present target: the torso at the neck (or
 * head), an upper limb at its lower limb, a lower limb at its hand or foot. One owner of which child
 * a bone aims at, so twist or shoulder siblings never make a bone branch-ambiguous.
 */
const AIM_TARGETS: Readonly<Partial<Record<HumanoidKey, readonly HumanoidKey[]>>> = Object.freeze({
  spine: ["neck", "head"],
  chest: ["neck", "head"],
  "left-upper-arm": ["left-lower-arm"],
  "left-lower-arm": ["left-hand"],
  "right-upper-arm": ["right-lower-arm"],
  "right-lower-arm": ["right-hand"],
  "left-upper-leg": ["left-lower-leg"],
  "left-lower-leg": ["left-foot"],
  "right-upper-leg": ["right-lower-leg"],
  "right-lower-leg": ["right-foot"],
});

/**
 * Authored bone name to the direct child on the path to its aim target, never inferred from child
 * order. A bone whose target is absent or not a descendant gets no entry.
 */
export function humanoidAimChildren(
  skeleton: Skeleton,
  boneKeys: Readonly<Record<string, HumanoidKey>>,
): Readonly<Record<string, string>> {
  const byKey = new Map<HumanoidKey, Bone>();
  for (const bone of skeleton.bones)
    if (Object.hasOwn(boneKeys, bone.name)) byKey.set(boneKeys[bone.name]!, bone);
  const children: Record<string, string> = {};
  for (const [key, targets] of Object.entries(AIM_TARGETS) as [HumanoidKey, HumanoidKey[]][]) {
    const bone = byKey.get(key);
    const target = targets.map((name) => byKey.get(name)).find((found) => found !== undefined);
    if (bone === undefined || target === undefined) continue;
    let child: Object3D = target;
    while (child.parent !== null && child.parent !== bone) child = child.parent;
    if (child.parent === bone) children[bone.name] = child.name;
  }
  return Object.freeze(children);
}
