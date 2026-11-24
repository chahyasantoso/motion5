import { elapsedOf, unreachable, type Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import { pose3dOf, type ObjectBounds3d, type Stage } from "@gerak/stage";
import { Box3, Matrix4, Mesh, Vector3, type Object3D } from "three";
import { applyPose3d } from "./pose3d";

/** Where a scene's object goes: an `Object3D`, posed from its position when bound, or a writer that takes the
 * pose and whether the object shows, such as one handing bone poses to `applyBones`. */
export type ObjectTarget3d = Object3D | ((pose: Pose3d, visible: boolean) => void);

/** Settings of `threeBinder`: target overrides, optional viewport resize callback, and draw callback. */
export interface ThreeBinderOptions {
  readonly objects?: Readonly<Record<string, ObjectTarget3d>>;
  readonly resize?: () => void;
  readonly draw?: () => void;
}

/** What a mount runs to draw and measure object elements: claims, start, and optional resize and measure. */
export interface ThreeBinder {
  /** Whether it draws the object element `name`. */
  claims(name: string): boolean;
  /** Writes each object it claims from `player` on every step, then draws once; returns the stop. */
  start(player: Player<Readonly<Record<string, unknown>>>, stage: Stage): () => void;
  /** Resizes the renderer and camera before a mount measures DOM and 3D bounds. */
  readonly resize?: () => void;
  /** Measures local world-unit rest dimensions `{ width, height, depth }` for each bound `Object3D`. */
  measure?(names?: readonly string[]): Readonly<Record<string, ObjectBounds3d>>;
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

/** Binds a scene's object elements to the `Object3D` of the same name under `root`, or to `objects[name]`. */
export function threeBinder(root: Object3D, options: ThreeBinderOptions = {}): ThreeBinder {
  const { objects = {}, resize, draw = () => undefined } = options;
  const targetOf = (name: string): ObjectTarget3d | undefined =>
    (Object.hasOwn(objects, name) ? objects[name] : undefined) ?? root.getObjectByName(name);
  let boundNames: readonly string[] = [];
  let started = false;
  return {
    claims: (name) => targetOf(name) !== undefined,
    ...(resize === undefined ? {} : { resize }),
    measure(names?: readonly string[]): Readonly<Record<string, ObjectBounds3d>> {
      const candidates =
        names !== undefined
          ? names
          : started
            ? boundNames
            : (() => {
                const discovered = new Set<string>(Object.keys(objects));
                root.traverse((obj) => {
                  if (obj.name !== "") discovered.add(obj.name);
                });
                return [...discovered];
              })();
      const out: Record<string, ObjectBounds3d> = {};
      for (const name of candidates) {
        const target = targetOf(name);
        if (target === undefined || typeof target === "function") continue;
        const measured = measureObjectBounds(target);
        if (measured !== undefined) out[name] = measured;
      }
      return Object.freeze(out);
    },
    start(player, stage) {
      const bound: {
        readonly name: string;
        readonly write: (pose: Pose3d | undefined, visible: boolean) => void;
      }[] = [];
      for (const member of stage.members)
        switch (member.kind) {
          case "object": {
            const target = targetOf(member.name);
            if (target === undefined) break;
            if (typeof target === "function") {
              bound.push({
                name: member.name,
                write: (pose, visible) => target(pose ?? {}, visible),
              });
              break;
            }
            const rest = { x: target.position.x, y: target.position.y, z: target.position.z };
            bound.push({
              name: member.name,
              write: (pose, visible) => {
                target.visible = visible;
                if (pose !== undefined) applyPose3d(target, pose, rest);
              },
            });
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
      const write = (): void => {
        const time = player.time;
        const ms = elapsedOf(time.clock) ?? time.progress * stage.durationMs;
        const visible = stage.visibleAt(ms);
        for (const { name, write } of bound)
          write(pose3dOf(player.values[name]), visible[name] ?? true);
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
