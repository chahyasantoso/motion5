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

/** Writes each object of a scene onto its `Object3D` on every player step, with `visible` from its `.show`
 * windows, then calls `draw` once, so the canvas draws on the player's step; returns the unsubscribe. */
export function bindScene3d(
  player: Player<Readonly<Record<string, unknown>>>,
  scene: Stage | SceneBuilder,
  objects: Readonly<Record<string, Object3D>>,
  draw: () => void,
): () => void {
  const stage = stageOf(scene);
  const bound: { readonly name: string; readonly target: Object3D }[] = [];
  for (const member of stage.members)
    switch (member.kind) {
      case "object": {
        const target = objects[member.name];
        if (target === undefined)
          throw new TypeError(`bindScene3d: object "${member.name}" has no entry in \`objects\`.`);
        bound.push({ name: member.name, target });
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
    for (const { name, target } of bound) {
      target.visible = visible[name] ?? true;
      const pose: Pose3d | undefined = pose3dOf(player.values[name]);
      if (pose !== undefined) applyPose3d(target, pose);
    }
    draw();
  };
  const first = bound[0];
  // One listener per step: the first object's carries every object's write and the one draw.
  return first === undefined ? () => undefined : player.subscribe(first.name, write);
}
