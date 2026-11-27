import { Material, type Object3D } from "three";

interface MaterialBase {
  readonly opacity: number;
  readonly transparent: boolean;
}

interface CapturedSlot {
  readonly node: Object3D;
  readonly original: Material | readonly Material[];
  readonly bases: readonly MaterialBase[];
  readonly isArray: boolean;
  replaced: boolean;
  materials: readonly Material[];
}

interface ObjectMaterialState {
  readonly slots: readonly CapturedSlot[];
  readonly cloned: Material[];
  applied: boolean;
}

/** Per-mount material ownership and captured baseline state. */
export interface MaterialStore {
  readonly owners: WeakMap<Material, Object3D>;
  readonly objects: WeakMap<Object3D, ObjectMaterialState>;
  readonly isolate: boolean;
}

/** Creates a material capture store isolated to one mount or binder. */
export function createMaterialStore(options?: { readonly isolate?: boolean }): MaterialStore {
  return {
    owners: new WeakMap(),
    objects: new WeakMap(),
    isolate: options?.isolate ?? false,
  };
}

const DEFAULT_STORE = createMaterialStore();

function asMaterialList(raw: unknown): readonly Material[] | undefined {
  if (raw instanceof Material) return [raw];
  if (Array.isArray(raw) && raw.every((item) => item instanceof Material)) return raw;
  return undefined;
}

function hasCurrentMaterials(node: Object3D, materials: readonly Material[]): boolean {
  const current = asMaterialList(Reflect.get(node, "material"));
  if (current === undefined || current.length !== materials.length) return false;
  return current.every((mat, index) => mat === materials[index]);
}

function captureSlot(
  owner: Object3D,
  node: Object3D,
  sharedMaterials: ReadonlySet<Material> | undefined,
  clonedOut: Material[],
  store: MaterialStore,
): CapturedSlot | undefined {
  const raw: unknown = Reflect.get(node, "material");
  const list = asMaterialList(raw);
  if (list === undefined || list.length === 0) return undefined;
  const bases = list.map((mat) => ({ opacity: mat.opacity, transparent: mat.transparent }));
  const nextMaterials: Material[] = [];
  let replaced = false;
  for (const mat of list) {
    const claimed = store.owners.get(mat);
    const mustClone =
      sharedMaterials?.has(mat) === true || (claimed !== undefined && claimed !== owner);
    if (mustClone) {
      const copy = mat.clone();
      store.owners.set(copy, owner);
      nextMaterials.push(copy);
      clonedOut.push(copy);
      replaced = true;
    } else {
      store.owners.set(mat, owner);
      nextMaterials.push(mat);
    }
  }
  const isArray = Array.isArray(raw);
  if (replaced) {
    Reflect.set(node, "material", isArray ? nextMaterials : nextMaterials[0]);
  }
  const first = list[0];
  if (first === undefined) return undefined;
  const original: Material | readonly Material[] = isArray ? [...list] : first;
  return { node, original, bases, isArray, replaced, materials: nextMaterials };
}

/** Captures rest materials across `target`'s hierarchy, cloning any material shared with another owner. */
export function captureMaterials(
  target: Object3D,
  sharedMaterials?: ReadonlySet<Material>,
  store: MaterialStore = DEFAULT_STORE,
): ObjectMaterialState {
  const existing = store.objects.get(target);
  if (existing !== undefined) return existing;
  const slots: CapturedSlot[] = [];
  const cloned: Material[] = [];
  target.traverse((node) => {
    const slot = captureSlot(target, node, sharedMaterials, cloned, store);
    if (slot !== undefined) slots.push(slot);
  });
  const state: ObjectMaterialState = { slots, cloned, applied: false };
  store.objects.set(target, state);
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
export function applyObjectOpacity(
  target: Object3D,
  opacity: number | undefined,
  store: MaterialStore = DEFAULT_STORE,
): void {
  if (opacity === undefined) {
    const existing = store.objects.get(target);
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
  const state = captureMaterials(target, undefined, store);
  state.applied = true;
  for (const slot of state.slots) {
    if (store.isolate && !slot.replaced) {
      const clonedSlot = slot.materials.map((mat) => {
        const copy = mat.clone();
        store.owners.set(copy, target);
        state.cloned.push(copy);
        return copy;
      });
      slot.materials = clonedSlot;
      slot.replaced = true;
      Reflect.set(slot.node, "material", slot.isArray ? clonedSlot : clonedSlot[0]);
    }
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
export function restoreMaterials(target: Object3D, store: MaterialStore = DEFAULT_STORE): void {
  const state = store.objects.get(target);
  if (state === undefined) return;
  for (const slot of state.slots) {
    if (state.applied || slot.replaced) {
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
    for (const mat of slot.materials) {
      if (store.owners.get(mat) === target) store.owners.delete(mat);
    }
    if (slot.replaced && hasCurrentMaterials(slot.node, slot.materials)) {
      Reflect.set(slot.node, "material", slot.original);
    }
  }
  for (const mat of state.cloned) mat.dispose();
  store.objects.delete(target);
}
