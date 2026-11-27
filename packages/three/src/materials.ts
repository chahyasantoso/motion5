import { Material, type Object3D } from "three";

interface MaterialBase {
  readonly opacity: number;
  readonly transparent: boolean;
}

interface CapturedSlot {
  readonly node: Object3D;
  readonly original: Material | readonly Material[];
  readonly bases: readonly MaterialBase[];
  readonly replaced: boolean;
  readonly materials: readonly Material[];
}

interface ObjectMaterialState {
  readonly slots: readonly CapturedSlot[];
  readonly cloned: readonly Material[];
  applied: boolean;
}

const MATERIAL_OWNERS = new WeakMap<Material, Object3D>();
const OBJECT_MATERIALS = new WeakMap<Object3D, ObjectMaterialState>();

function asMaterialList(raw: unknown): readonly Material[] | undefined {
  if (raw instanceof Material) return [raw];
  if (Array.isArray(raw) && raw.every((item) => item instanceof Material)) return raw;
  return undefined;
}

function captureSlot(
  owner: Object3D,
  node: Object3D,
  sharedMaterials: ReadonlySet<Material> | undefined,
  clonedOut: Material[],
): CapturedSlot | undefined {
  const raw: unknown = Reflect.get(node, "material");
  const list = asMaterialList(raw);
  if (list === undefined || list.length === 0) return undefined;
  const bases = list.map((mat) => ({ opacity: mat.opacity, transparent: mat.transparent }));
  const nextMaterials: Material[] = [];
  let replaced = false;
  for (const mat of list) {
    const claimed = MATERIAL_OWNERS.get(mat);
    const mustClone =
      sharedMaterials?.has(mat) === true || (claimed !== undefined && claimed !== owner);
    if (mustClone) {
      const copy = mat.clone();
      MATERIAL_OWNERS.set(copy, owner);
      nextMaterials.push(copy);
      clonedOut.push(copy);
      replaced = true;
    } else {
      MATERIAL_OWNERS.set(mat, owner);
      nextMaterials.push(mat);
    }
  }
  if (replaced) {
    Reflect.set(node, "material", Array.isArray(raw) ? nextMaterials : nextMaterials[0]);
  }
  const first = list[0];
  if (first === undefined) return undefined;
  const original: Material | readonly Material[] = Array.isArray(raw) ? [...list] : first;
  return { node, original, bases, replaced, materials: nextMaterials };
}

/** Captures rest materials across `target`'s hierarchy, cloning any material shared with another owner. */
export function captureMaterials(
  target: Object3D,
  sharedMaterials?: ReadonlySet<Material>,
): ObjectMaterialState {
  const existing = OBJECT_MATERIALS.get(target);
  if (existing !== undefined) return existing;
  const slots: CapturedSlot[] = [];
  const cloned: Material[] = [];
  target.traverse((node) => {
    const slot = captureSlot(target, node, sharedMaterials, cloned);
    if (slot !== undefined) slots.push(slot);
  });
  const state: ObjectMaterialState = { slots, cloned, applied: false };
  OBJECT_MATERIALS.set(target, state);
  return state;
}

/** Collects materials referenced by more than one node across `roots`. */
export function findSharedMaterials(roots: Iterable<Object3D>): ReadonlySet<Material> {
  const visited = new Set<Object3D>();
  const counts = new Map<Material, number>();
  const shared = new Set<Material>();
  for (const root of roots) {
    root.traverse((node) => {
      if (visited.has(node)) return;
      visited.add(node);
      const raw: unknown = Reflect.get(node, "material");
      const list = asMaterialList(raw);
      if (list === undefined) return;
      for (const mat of list) {
        const next = (counts.get(mat) ?? 0) + 1;
        counts.set(mat, next);
        if (next > 1) shared.add(mat);
      }
    });
  }
  return shared;
}

/** Scales every material under `target` by `opacity`, or restores captured baseline when omitted. */
export function applyObjectOpacity(target: Object3D, opacity: number | undefined): void {
  if (opacity === undefined) {
    const existing = OBJECT_MATERIALS.get(target);
    if (existing === undefined || !existing.applied) return;
    for (const slot of existing.slots) {
      slot.materials.forEach((mat, index) => {
        const base = slot.bases[index];
        if (base === undefined) return;
        mat.opacity = base.opacity;
        if (mat.transparent !== base.transparent) {
          mat.transparent = base.transparent;
          mat.needsUpdate = true;
        }
      });
    }
    existing.applied = false;
    return;
  }
  const state = captureMaterials(target);
  state.applied = true;
  for (const slot of state.slots) {
    slot.materials.forEach((mat, index) => {
      const base = slot.bases[index];
      if (base === undefined) return;
      mat.opacity = base.opacity * opacity;
      if (mat.transparent !== true) {
        mat.transparent = true;
        mat.needsUpdate = true;
      }
    });
  }
}

/** Restores captured base opacity, transparency, and original materials for `target`. */
export function restoreMaterials(target: Object3D): void {
  const state = OBJECT_MATERIALS.get(target);
  if (state === undefined) return;
  for (const slot of state.slots) {
    slot.materials.forEach((mat, index) => {
      const base = slot.bases[index];
      if (base === undefined) return;
      mat.opacity = base.opacity;
      if (mat.transparent !== base.transparent) {
        mat.transparent = base.transparent;
        mat.needsUpdate = true;
      }
      if (MATERIAL_OWNERS.get(mat) === target) MATERIAL_OWNERS.delete(mat);
    });
    if (slot.replaced) {
      Reflect.set(slot.node, "material", slot.original);
    }
  }
  for (const mat of state.cloned) mat.dispose();
  OBJECT_MATERIALS.delete(target);
}
