import {
  Engine,
  PluginRegistry,
  createTriggerFactory,
  type EngineOptions,
  type ProjectDefinition,
  type ProjectHandle,
  type ScrollSource,
} from "@motion5/core";
import { fkPlugin } from "@motion5/core/plugins/fk";
import { ikPlugin } from "@motion5/core/plugins/ik";
import { transformPlugin } from "@motion5/core/plugins/transform";
import { transform3dPlugin } from "@motion5/core/plugins/transform3d";
import { fk3dPlugin } from "@motion5/core/plugins/fk3d";
import { ik3dPlugin } from "@motion5/core/plugins/ik3d";
import { SCROLL_SOURCE, ikPlaygroundProject } from "./ik-playground-project";
import {
  IK3D_PERSPECTIVE,
  IK3D_SCROLL_SOURCE,
  ik3dPlaygroundMotion,
} from "./ik3d-playground-project";
import { bindScrollReach, createScrollReach } from "./scroll-reach";

/**
 * The one project the playground loads: the 2D rigs and the 3D arm as sibling Motions.
 *
 * Composed as a definition rather than grown at runtime, because `addMotion` accepts only a Motion
 * with empty tracks and the 3D arm is a whole authored rig. The perspective is the project's, as
 * `validate-v5.ts` requires of any project carrying 3D keyframes, and it moves no 2D byte.
 */
export const playgroundProject: ProjectDefinition = {
  ...ikPlaygroundProject,
  perspective: IK3D_PERSPECTIVE,
  motions: [...ikPlaygroundProject.motions, ik3dPlaygroundMotion],
};

/** Every plugin the composed project authors, through the public subpaths only. */
function playgroundPlugins(): PluginRegistry {
  const plugins = new PluginRegistry();
  for (const plugin of [
    transformPlugin,
    fkPlugin,
    ikPlugin,
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
  ])
    plugins.register(plugin);
  return plugins;
}

export interface PlaygroundRuntimeOptions
  extends Pick<EngineOptions, "clock" | "interpolator" | "scheduler"> {
  /** The page scroll both scroll triggers read; neither Motion owns a second progress driver. */
  readonly scroll: ScrollSource;
}

export interface PlaygroundRuntime {
  readonly project: ProjectHandle;
  readonly controller: ReturnType<typeof createScrollReach>;
}

/**
 * Loads, wires and mounts the playground, the one setup path the app and the suite share.
 *
 * The 2D Motion's source is decorated with pending-intent application; the 3D Motion reads the
 * page scroll as it is. Nodes are mounted from the runtime's own answer rather than from a list
 * written beside the document. A failure after load disposes the project it created, so a caller
 * owns a runtime only once this returns.
 */
export function loadPlayground(options: PlaygroundRuntimeOptions): PlaygroundRuntime {
  const { scroll, ...ports } = options;
  // Assigned before any delivery: the scroll adapter defers its first emission past this wiring.
  let controller: ReturnType<typeof createScrollReach> | undefined;
  const project = new Engine({
    ...ports,
    plugins: playgroundPlugins(),
    triggerFactory: createTriggerFactory({
      scroll: ({ trigger }) => {
        switch (trigger.source) {
          case SCROLL_SOURCE:
            return bindScrollReach(scroll, () => controller?.commit());
          case IK3D_SCROLL_SOURCE:
            return scroll;
          default:
            return undefined;
        }
      },
    }),
  }).load(playgroundProject);
  try {
    controller = createScrollReach(project);
    for (const motionId of project.motionIds())
      for (const trackNode of project.motion(motionId).trackIds) project.mount(trackNode);
    for (const freeNode of project.freeTrackIds()) project.mount(freeNode);
    return { project, controller };
  } catch (error) {
    try {
      project.dispose();
    } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], "Playground setup and cleanup failed.");
    }
    throw error;
  }
}
