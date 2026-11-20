import { elapsedOf, unreachable, type Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import {
  compileScene,
  formatStageError,
  isScene,
  pose3dOf,
  type SceneBuilder,
  type Stage,
} from "@gerak/stage";
import type { Object3D } from "three";
import { applyPose3d } from "./pose3d";

function stageOf(scene: Stage | SceneBuilder): Stage {
  if (!isScene(scene)) return scene;
  const compiled = compileScene(scene);
  if (!compiled.ok)
    throw new Error(
      `bindScene3d: invalid scene:\n${compiled.errors.map(formatStageError).join("\n")}`,
    );
  return compiled.stage;
}

/** Where a scene's object goes: an `Object3D`, posed from its position when bound, or a writer that takes the
 * pose and whether the object shows, such as one handing bone poses to `applyBones`. */
export type ObjectTarget3d = Object3D | ((pose: Pose3d, visible: boolean) => void);

/** Writes each object onto its target on every player step, `visible` from its `.show` windows, then
 * calls `draw` once, so the canvas draws on the step; returns the unsubscribe. */
export function bindScene3d(
  player: Player<Readonly<Record<string, unknown>>>,
  scene: Stage | SceneBuilder,
  objects: Readonly<Record<string, ObjectTarget3d>>,
  draw: () => void,
): () => void {
  const stage = stageOf(scene);
  const bound: {
    readonly name: string;
    readonly write: (pose: Pose3d | undefined, visible: boolean) => void;
  }[] = [];
  for (const member of stage.members)
    switch (member.kind) {
      case "object": {
        const target = objects[member.name];
        if (target === undefined)
          throw new TypeError(`bindScene3d: object "${member.name}" has no entry in \`objects\`.`);
        if (typeof target === "function") {
          bound.push({ name: member.name, write: (pose, visible) => target(pose ?? {}, visible) });
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
  // With no object the canvas still draws once, as it does when bound.
  draw();
  return () => undefined;
}
