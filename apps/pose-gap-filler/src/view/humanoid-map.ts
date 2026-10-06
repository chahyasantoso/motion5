import type { Bone, Skeleton } from "three";

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
 * Torso bones aim along the spine, so a branching spine or chest names the child on the path to
 * the neck (or head). Never inferred from child order. Bones off that path get no entry.
 */
export function torsoAimChildren(
  skeleton: Skeleton,
  boneKeys: Readonly<Record<string, HumanoidKey>>,
): Readonly<Record<string, string>> {
  const byKey = new Map<HumanoidKey, Bone>();
  for (const bone of skeleton.bones) {
    const key = Object.hasOwn(boneKeys, bone.name) ? boneKeys[bone.name] : undefined;
    if (key !== undefined) byKey.set(key, bone);
  }
  const target = byKey.get("neck") ?? byKey.get("head");
  const children: Record<string, string> = {};
  if (target === undefined) return Object.freeze(children);
  for (const key of ["spine", "chest"] as const) {
    const bone = byKey.get(key);
    if (bone === undefined) continue;
    let child = target;
    while (child.parent !== null && child.parent !== bone) child = child.parent as Bone;
    if (child.parent === bone) children[bone.name] = child.name;
  }
  return Object.freeze(children);
}
