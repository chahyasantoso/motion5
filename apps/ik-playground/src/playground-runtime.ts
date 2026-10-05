import {
  Engine,
  PluginRegistry,
  createTriggerFactory,
  type EngineOptions,
  type ProjectDefinition,
  type ProjectHandle,
  type ScrollSource,
} from "@motion5/core";
import { builtinCatalog } from "@motion5/plugins/catalog";
import { createPluginLoader, ensuredOrThrow } from "@motion5/plugins/loader";
import { createGoalControl, type GoalControl } from "./goal-control";
import { SCROLL_SOURCE, ikPlaygroundProject } from "./ik-playground-project";
import { IK3D_PERSPECTIVE, ik3dPlaygroundMotion } from "./ik3d-playground-project";

/**
 * The one project the playground loads: the 2D chain and the 3D chain as sibling Motions.
 *
 * Composed as a definition rather than grown at runtime, because `addMotion` accepts only a Motion
 * with empty tracks and the 3D chain is a whole authored rig. The perspective is the project's, as
 * `validate-v5.ts` requires of any project carrying 3D keyframes, and it moves no 2D byte.
 */
export const playgroundProject: ProjectDefinition = {
  ...ikPlaygroundProject,
  perspective: IK3D_PERSPECTIVE,
  motions: [...ikPlaygroundProject.motions, ik3dPlaygroundMotion],
};

const loader = createPluginLoader(builtinCatalog);

export interface PlaygroundRuntimeOptions
  extends Pick<EngineOptions, "clock" | "interpolator" | "scheduler"> {
  /** The page scroll both Motions read as their only progress driver. */
  readonly scroll: ScrollSource;
}

export interface PlaygroundRuntime {
  readonly project: ProjectHandle;
  readonly goals: GoalControl;
}

/**
 * Loads, wires and mounts the playground, the one setup path the app and the suite share.
 *
 * Both Motions read the page scroll as it is: scroll moves member weights and nothing else, and
 * gestures write through `GoalControl` without waiting for a scroll event. Nodes are mounted from the
 * runtime's own answer rather than from a list written beside the document. A failure after load
 * disposes the project it created, so a caller owns a runtime only once this resolves. The approved
 * loader ensures the authored demand before constructing an Engine; core loading stays synchronous.
 */
export async function loadPlayground(
  options: PlaygroundRuntimeOptions,
): Promise<PlaygroundRuntime> {
  const { scroll, ...ports } = options;
  const plugins = new PluginRegistry();
  ensuredOrThrow(await loader.ensure(plugins, { kind: "project", project: playgroundProject }));
  const project = new Engine({
    ...ports,
    plugins,
    triggerFactory: createTriggerFactory({
      scroll: ({ trigger }) => (trigger.source === SCROLL_SOURCE ? scroll : undefined),
    }),
  }).load(playgroundProject);
  try {
    for (const motionId of project.motionIds())
      for (const trackNode of project.motion(motionId).trackIds) project.mount(trackNode);
    for (const freeNode of project.freeTrackIds()) project.mount(freeNode);
    return { project, goals: createGoalControl(project) };
  } catch (error) {
    try {
      project.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Playground setup and cleanup failed.");
    }
    throw error;
  }
}
