import { Mesh, type Object3D } from "three";
import type { CustomWriter } from "./pose2d";

interface MorphBinding {
  readonly influences: number[];
  readonly index: number;
}

/** Builds a `CustomWriter` that writes `[0, 1]`-clamped values into matching `morphTargetInfluences` under `root`. */
export function morphTargets(root: Object3D): CustomWriter {
  const bindings = new Map<string, MorphBinding[]>();
  const warned = new Set<string>();

  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    const dictionary = node.morphTargetDictionary;
    const influences = node.morphTargetInfluences;
    if (dictionary === undefined || influences === undefined) return;
    for (const [name, index] of Object.entries(dictionary)) {
      if (typeof index !== "number" || index < 0 || index >= influences.length) continue;
      let list = bindings.get(name);
      if (list === undefined) {
        list = [];
        bindings.set(name, list);
      }
      list.push({ influences, index });
    }
  });

  return (name: string, value: number): void => {
    if (!Number.isFinite(value)) {
      throw new RangeError(`morphTargets: value for "${name}" must be finite.`);
    }
    const targets = bindings.get(name);
    if (targets === undefined) {
      if (!warned.has(name)) {
        warned.add(name);
        console.warn(`morphTargets: unknown morph target "${name}".`);
      }
      return;
    }
    const clamped = Math.min(1, Math.max(0, value));
    for (const { influences, index } of targets) {
      influences[index] = clamped;
    }
  };
}
