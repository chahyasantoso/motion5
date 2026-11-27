import { POSE_3D_NUMBERS, unreachable, type Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import { frameVisible, listPose3d, pose3dOf, type ObjectBounds3d, type Stage } from "@gerak/stage";
import { Box3, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { createMaterialStore, findSharedMaterials } from "./materials";
import {
  applyPose3dWithStore,
  captureRest3dWithStore,
  restoreRest3dWithStore,
  type Rest3d,
} from "./pose3d";

/** Where a scene's object goes: an `Object3D`, an array of `Object3D`s for a `parts: true` list, or
 * a writer `(pose, visible) => void` such as one handing bone poses to `applyBones`. */
export type ObjectTarget3d =
  | Object3D
  | readonly Object3D[]
  | ((pose: Pose3d, visible: boolean) => void);

/** Settings of `threeBinder`: target overrides, optional viewport resize callback, and draw callback. */
export interface ThreeBinderOptions {
  readonly objects?: Readonly<Record<string, ObjectTarget3d>>;
  readonly resize?: () => void;
  readonly draw?: () => void;
}

/** What a mount runs to draw and measure object elements: claims, start, and optional resize, counts, measure, casts. */
export interface ThreeBinder {
  /** Whether it draws the object element `name`. */
  claims(name: string): boolean;
  /** Writes each object it claims from `player` on every step, then draws once; returns the stop. */
  start(player: Player<Readonly<Record<string, unknown>>>, stage: Stage): () => void;
  /** Resizes the renderer and camera before a mount measures DOM and 3D bounds. */
  readonly resize?: () => void;
  /** Part counts per bound or named 3D list object (`Object3D[]` overrides or `Group.children`). */
  counts?(names?: readonly string[]): Readonly<Record<string, number>>;
  /** Measures local world-unit rest dimensions `{ width, height, depth }` for each bound `Object3D`. */
  measure?(
    names?: readonly string[],
    lists?: ReadonlySet<string>,
  ): Readonly<Record<string, ObjectBounds3d>>;
  /** Declares known 3D cast names and whether each is a single object or a `parts: true` list. */
  casts?(): Readonly<Record<string, "single" | "list">>;
}

const IDENTITY_MATRIX = new Matrix4();

function accumulateMeshBounds(
  node: Object3D,
  parentMatrix: Matrix4,
  isRoot: boolean,
  total: Box3,
): void {
  if (!isRoot && !node.visible) return;
  let localMatrix = parentMatrix;
  if (!isRoot) {
    node.updateMatrix();
    localMatrix = new Matrix4().multiplyMatrices(parentMatrix, node.matrix);
  }
  if (node instanceof Mesh) {
    const geometry = node.geometry;
    if (geometry.boundingBox === null) geometry.computeBoundingBox();
    if (geometry.boundingBox !== null && !geometry.boundingBox.isEmpty()) {
      total.union(geometry.boundingBox.clone().applyMatrix4(localMatrix));
    }
  }
  for (const child of node.children) {
    accumulateMeshBounds(child, localMatrix, false, total);
  }
}

function measureObjectBounds(target: Object3D): ObjectBounds3d | undefined {
  const total = new Box3();
  accumulateMeshBounds(target, IDENTITY_MATRIX, true, total);
  if (total.isEmpty()) return undefined;
  const size = new Vector3();
  total.getSize(size);
  return Object.freeze({ width: size.x, height: size.y, depth: size.z });
}

type ClassifiedTarget =
  | { readonly kind: "writer"; readonly write: (pose: Pose3d, visible: boolean) => void }
  | { readonly kind: "list"; readonly items: readonly Object3D[] }
  | { readonly kind: "node"; readonly node: Object3D };

function classifyTarget(target: ObjectTarget3d): ClassifiedTarget {
  if (typeof target === "function") return { kind: "writer", write: target };
  if (target instanceof Object3D) return { kind: "node", node: target };
  return { kind: "list", items: target };
}

function measureList(
  name: string,
  items: readonly Object3D[],
  out: Record<string, ObjectBounds3d>,
): void {
  items.forEach((item, index) => {
    const measured = measureObjectBounds(item);
    if (measured === undefined) return;
    out[`${name}.${index}`] = measured;
    out[name] ??= measured;
  });
}

function samePose3d(a: Pose3d | undefined, b: Pose3d | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  for (const key of POSE_3D_NUMBERS) {
    if (!Object.is(a[key], b[key])) return false;
  }
  const ca = a.custom;
  const cb = b.custom;
  if (ca === cb) return true;
  if (ca === undefined || cb === undefined) return false;
  const keys = Object.keys(ca);
  if (keys.length !== Object.keys(cb).length) return false;
  return keys.every((key) => Object.is(ca[key], cb[key]));
}

/** Binds a scene's object elements to the `Object3D` of the same name under `root`, or to `objects[name]`. */
export function threeBinder(root: Object3D, options: ThreeBinderOptions = {}): ThreeBinder {
  const { objects = {}, resize, draw = () => undefined } = options;
  const targetOf = (name: string): ObjectTarget3d | undefined =>
    (Object.hasOwn(objects, name) ? objects[name] : undefined) ?? root.getObjectByName(name);
  const discoveredNames = (): readonly string[] => {
    const discovered = new Set<string>(Object.keys(objects));
    root.traverse((obj) => {
      if (obj.name !== "") discovered.add(obj.name);
    });
    return [...discovered];
  };
  let boundNames: readonly string[] = [];
  let boundListNames = new Set<string>();
  let started = false;
  return {
    claims: (name) => targetOf(name) !== undefined,
    casts(): Readonly<Record<string, "single" | "list">> {
      const out: Record<string, "single" | "list"> = {};
      for (const name of Object.keys(objects)) {
        const target = targetOf(name);
        if (target === undefined) continue;
        const classified = classifyTarget(target);
        switch (classified.kind) {
          case "list":
            out[name] = "list";
            break;
          case "node":
            out[name] = boundListNames.has(name) ? "list" : "single";
            break;
          case "writer":
            out[name] = "single";
            break;
          default:
            return unreachable(classified);
        }
      }
      for (const name of boundNames) {
        if (!Object.hasOwn(out, name)) {
          out[name] = boundListNames.has(name) ? "list" : "single";
        }
      }
      return Object.freeze(out);
    },
    ...(resize === undefined
      ? {}
      : {
          resize: (): void => {
            resize();
            if (started) draw();
          },
        }),
    counts(names?: readonly string[]): Readonly<Record<string, number>> {
      const candidates =
        names !== undefined ? names : started ? [...boundListNames] : discoveredNames();
      const out: Record<string, number> = {};
      for (const name of candidates) {
        const target = targetOf(name);
        if (target === undefined) continue;
        const classified = classifyTarget(target);
        switch (classified.kind) {
          case "list":
            out[name] = classified.items.length;
            break;
          case "node":
            if (names !== undefined || (started && boundListNames.has(name)))
              out[name] = classified.node.children.length;
            break;
          case "writer":
            break;
          default:
            unreachable(classified);
        }
      }
      return Object.freeze(out);
    },
    measure(
      names?: readonly string[],
      lists?: ReadonlySet<string>,
    ): Readonly<Record<string, ObjectBounds3d>> {
      const candidates = names !== undefined ? names : started ? boundNames : discoveredNames();
      const out: Record<string, ObjectBounds3d> = {};
      for (const name of candidates) {
        const target = targetOf(name);
        if (target === undefined) continue;
        const classified = classifyTarget(target);
        switch (classified.kind) {
          case "writer":
            break;
          case "list":
            measureList(name, classified.items, out);
            break;
          case "node":
            if (lists?.has(name) || boundListNames.has(name)) {
              measureList(name, classified.node.children, out);
            } else {
              const measured = measureObjectBounds(classified.node);
              if (measured !== undefined) out[name] = measured;
            }
            break;
          default:
            unreachable(classified);
        }
      }
      return Object.freeze(out);
    },
    start(player, stage) {
      const extraRoots: Object3D[] = [root];
      for (const name of Object.keys(objects)) {
        const target = objects[name];
        if (target === undefined) continue;
        const classified = classifyTarget(target);
        switch (classified.kind) {
          case "node":
            extraRoots.push(classified.node);
            break;
          case "list":
            extraRoots.push(...classified.items);
            break;
          case "writer":
            break;
          default:
            unreachable(classified);
        }
      }
      const materialStore = createMaterialStore({ isolate: true });
      const sharedMaterials = findSharedMaterials(extraRoots);
      const restores: (() => void)[] = [];
      const bound: {
        readonly name: string;
        readonly write: (raw: unknown, visible: boolean, force: boolean) => boolean;
      }[] = [];
      const nextListNames = new Set<string>();
      for (const member of stage.members)
        switch (member.kind) {
          case "object": {
            const target = targetOf(member.name);
            if (target === undefined) break;
            const classified = classifyTarget(target);
            if (member.parts === true) {
              nextListNames.add(member.name);
              let items: readonly Object3D[];
              switch (classified.kind) {
                case "list":
                  items = classified.items;
                  break;
                case "node":
                  items = [...classified.node.children];
                  break;
                case "writer":
                  throw new TypeError(
                    `threeBinder: object "${member.name}" has \`parts: true\` and takes Object3D[] or Group, not a writer.`,
                  );
                default:
                  return unreachable(classified);
              }
              const rests: Rest3d[] = items.map((item) => {
                const rest = captureRest3dWithStore(item, sharedMaterials, materialStore);
                restores.push(() => restoreRest3dWithStore(item, rest, materialStore));
                return rest;
              });
              const prevPoses: (Pose3d | undefined)[] = items.map(() => undefined);
              let prevVisible: boolean | undefined;
              bound.push({
                name: member.name,
                write: (raw, visible, force) => {
                  let dirty = force || prevVisible !== visible;
                  prevVisible = visible;
                  const count = items.length;
                  items.forEach((item, index) => {
                    if (force || item.visible !== visible) {
                      item.visible = visible;
                      dirty = true;
                    }
                    if (!visible || raw === undefined) return;
                    const pose = listPose3d(raw, index, count);
                    const rest = rests[index];
                    if (pose === undefined || rest === undefined) return;
                    if (!force && samePose3d(prevPoses[index], pose)) return;
                    prevPoses[index] = {
                      ...pose,
                      ...(pose.custom === undefined ? {} : { custom: { ...pose.custom } }),
                    };
                    applyPose3dWithStore(item, pose, rest, undefined, materialStore);
                    dirty = true;
                  });
                  return dirty;
                },
              });
              break;
            }
            switch (classified.kind) {
              case "writer": {
                let prevPose: Pose3d | undefined;
                let prevVisible: boolean | undefined;
                bound.push({
                  name: member.name,
                  write: (raw, visible, force) => {
                    const pose = pose3dOf(raw) ?? {};
                    if (!force && prevVisible === visible && samePose3d(prevPose, pose)) {
                      return false;
                    }
                    prevVisible = visible;
                    prevPose = {
                      ...pose,
                      ...(pose.custom === undefined ? {} : { custom: { ...pose.custom } }),
                    };
                    classified.write(pose, visible);
                    return true;
                  },
                });
                break;
              }
              case "node": {
                const { node } = classified;
                const rest = captureRest3dWithStore(node, sharedMaterials, materialStore);
                restores.push(() => restoreRest3dWithStore(node, rest, materialStore));
                let prevPose: Pose3d | undefined;
                let prevVisible: boolean | undefined;
                bound.push({
                  name: member.name,
                  write: (raw, visible, force) => {
                    let dirty = force || prevVisible !== visible;
                    prevVisible = visible;
                    if (force || node.visible !== visible) {
                      node.visible = visible;
                      dirty = true;
                    }
                    const pose = pose3dOf(raw);
                    if (pose !== undefined && (force || !samePose3d(prevPose, pose))) {
                      prevPose = {
                        ...pose,
                        ...(pose.custom === undefined ? {} : { custom: { ...pose.custom } }),
                      };
                      applyPose3dWithStore(node, pose, rest, undefined, materialStore);
                      dirty = true;
                    }
                    return dirty;
                  },
                });
                break;
              }
              case "list":
                throw new TypeError(
                  `threeBinder: object "${member.name}" takes a single Object3D or writer; pass \`parts: true\` for Object3D[].`,
                );
              default:
                return unreachable(classified);
            }
            break;
          }
          case "actor":
          case "list":
            break;
          default:
            unreachable(member);
        }
      started = true;
      boundNames = bound.map((entry) => entry.name);
      boundListNames = nextListNames;
      if (bound.length === 0) {
        draw();
        return () => undefined;
      }
      let initial = true;
      const write = (values: Readonly<Record<string, unknown>>): void => {
        const visible = frameVisible(values);
        let dirty = initial;
        for (const entry of bound) {
          if (entry.write(values[entry.name], visible?.[entry.name] ?? true, initial)) dirty = true;
        }
        initial = false;
        if (dirty) draw();
      };
      const stopObserve = player.observe(() => player.values, write);
      return () => {
        stopObserve();
        for (const restore of restores) restore();
      };
    },
  };
}
