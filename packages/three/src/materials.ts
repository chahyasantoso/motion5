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
  readonly held: Set<Material>;
  replaced: boolean;
  materials: readonly Material[];
}

const CAPTURED_REFS = new WeakMap<Material, number>();

function retainSlotMaterial(slot: CapturedSlot, mat: Material): void {
  if (slot.held.has(mat)) return;
  slot.held.add(mat);
  CAPTURED_REFS.set(mat, (CAPTURED_REFS.get(mat) ?? 0) + 1);
}

function releaseSlotMaterials(slot: CapturedSlot): void {
  for (const mat of slot.held) {
    const count = CAPTURED_REFS.get(mat);
    if (count === undefined || count <= 1) CAPTURED_REFS.delete(mat);
    else CAPTURED_REFS.set(mat, count - 1);
  }
  slot.held.clear();
}

interface ObjectMaterialState {
  readonly slots: readonly CapturedSlot[];
  readonly cloned: Material[];
  readonly clonedSet: Set<Material>;
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
  const slot: CapturedSlot = {
    node,
    original,
    bases,
    isArray,
    held: new Set(),
    replaced,
    materials: nextMaterials,
  };
  for (const mat of list) retainSlotMaterial(slot, mat);
  for (const mat of nextMaterials) retainSlotMaterial(slot, mat);
  return slot;
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
  const state: ObjectMaterialState = { slots, cloned, clonedSet: new Set(cloned), applied: false };
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
      if (!hasCurrentMaterials(slot.node, slot.materials)) continue;
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
    if (!hasCurrentMaterials(slot.node, slot.materials)) continue;
    if (store.isolate) {
      let changed = false;
      const nextMaterials = slot.materials.map((mat) => {
        if (state.clonedSet.has(mat)) return mat;
        const copy = mat.clone();
        if (store.owners.get(mat) === target) store.owners.delete(mat);
        store.owners.set(copy, target);
        state.cloned.push(copy);
        state.clonedSet.add(copy);
        retainSlotMaterial(slot, copy);
        changed = true;
        return copy;
      });
      if (changed) {
        slot.materials = nextMaterials;
        slot.replaced = true;
        Reflect.set(slot.node, "material", slot.isArray ? nextMaterials : nextMaterials[0]);
      }
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
    const current = hasCurrentMaterials(slot.node, slot.materials);
    if (current && (state.applied || slot.replaced)) {
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
    for (const mat of slot.held) {
      if (store.owners.get(mat) === target) store.owners.delete(mat);
    }
    if (slot.replaced && current) {
      Reflect.set(slot.node, "material", slot.original);
    }
    releaseSlotMaterials(slot);
  }
  const stillHeldOnNodes = new Set<Material>();
  for (const slot of state.slots) {
    const onNode = asMaterialList(Reflect.get(slot.node, "material"));
    if (onNode !== undefined) {
      for (const mat of onNode) stillHeldOnNodes.add(mat);
    }
  }
  // A clone another mount has since captured as its original stays alive for that mount to restore.
  for (const mat of state.cloned) {
    if (!CAPTURED_REFS.has(mat) && !stillHeldOnNodes.has(mat)) mat.dispose();
  }
  store.objects.delete(target);
}
