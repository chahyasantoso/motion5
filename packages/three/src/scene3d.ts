import { elapsedOf, unreachable, type Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import { pose3dOf, type Stage } from "@gerak/stage";
import type { Object3D } from "three";
import { applyPose3d } from "./pose3d";

/** Where a scene's object goes: an `Object3D`, posed from its position when bound, or a writer that takes the
 * pose and whether the object shows, such as one handing bone poses to `applyBones`. */
export type ObjectTarget3d = Object3D | ((pose: Pose3d, visible: boolean) => void);

/** Settings of `threeBinder`: targets that override the match by name, and the draw run once each step. */
export interface ThreeBinderOptions {
  readonly objects?: Readonly<Record<string, ObjectTarget3d>>;
  readonly draw?: () => void;
}

/** What a mount runs to draw the object elements of a scene: which it claims, and how it starts. */
export interface ThreeBinder {
  /** Whether it draws the object element `name`. */
  claims(name: string): boolean;
  /** Writes each object it claims from `player` on every step, then draws once; returns the stop. */
  start(player: Player<Readonly<Record<string, unknown>>>, stage: Stage): () => void;
}

/** Binds a scene's object elements to the `Object3D` of the same name under `root`, or to `objects[name]`. */
export function threeBinder(root: Object3D, options: ThreeBinderOptions = {}): ThreeBinder {
  const { objects = {}, draw = () => undefined } = options;
  const targetOf = (name: string): ObjectTarget3d | undefined =>
    objects[name] ?? root.getObjectByName(name);
  return {
    claims: (name) => targetOf(name) !== undefined,
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
          case "group":
          case "list":
            break;
          default:
            unreachable(member);
        }
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
