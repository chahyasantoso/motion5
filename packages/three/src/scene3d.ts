import { unreachable, type Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import { frameVisible, listPose3d, pose3dOf, type ObjectBounds3d, type Stage } from "@gerak/stage";
import { Box3, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { applyPose3d } from "./pose3d";

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

/** What a mount runs to draw and measure object elements: claims, start, and optional resize, counts, measure. */
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
    ...(resize === undefined ? {} : { resize }),
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
      const bound: {
        readonly name: string;
        readonly write: (raw: unknown, visible: boolean) => void;
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
              const rests = items.map((item) => ({
                x: item.position.x,
                y: item.position.y,
                z: item.position.z,
              }));
              bound.push({
                name: member.name,
                write: (raw, visible) => {
                  const count = items.length;
                  items.forEach((item, index) => {
                    item.visible = visible;
                    if (!visible || raw === undefined) return;
                    const pose = listPose3d(raw, index, count);
                    const rest = rests[index];
                    if (pose !== undefined && rest !== undefined) applyPose3d(item, pose, rest);
                  });
                },
              });
              break;
            }
            switch (classified.kind) {
              case "writer":
                bound.push({
                  name: member.name,
                  write: (raw, visible) => classified.write(pose3dOf(raw) ?? {}, visible),
                });
                break;
              case "node": {
                const { node } = classified;
                const rest = { x: node.position.x, y: node.position.y, z: node.position.z };
                bound.push({
                  name: member.name,
                  write: (raw, visible) => {
                    node.visible = visible;
                    const pose = pose3dOf(raw);
                    if (pose !== undefined) applyPose3d(node, pose, rest);
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
      const write = (): void => {
        const visible = frameVisible(player.values);
        for (const { name, write } of bound) write(player.values[name], visible?.[name] ?? true);
        draw();
      };
      const first = bound[0];
      // One listener per step: the first object's carries every object's write and the one draw.
      if (first !== undefined) return player.subscribe(first.name, write);
      draw();
      return () => undefined;
    },
  };
}
