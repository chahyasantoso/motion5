import { createManualClock, type ProjectHandle } from "@motion5/core";
// The same private path packages/react's tests use: `@motion5/core/testing` is a declared export
// of the built package, but neither the root `paths` nor the root Vitest aliases map it to source.
import {
  createFakeInterpolator,
  createFakeScheduler,
} from "../../../packages/core/src/testing/fakes";
import type { RigPorts } from "../src/rig/rig";

export function fakePorts(): RigPorts {
  return {
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  };
}

/** Counts `values` batches while delegating everything to the real project. */
export function countingProject(project: ProjectHandle): {
  project: ProjectHandle;
  batches: () => number;
} {
  let count = 0;
  return {
    project: {
      ...project,
      values(recipe) {
        count += 1;
        return project.values(recipe);
      },
    },
    batches: () => count,
  };
}
