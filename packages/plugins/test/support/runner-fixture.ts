import {
  createManualClock,
  Engine,
  PluginRegistry,
  type LiveValues,
  type ProjectHandle,
} from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { transformPlugin } from "../../src/transform";
import { attachRunners, type Runner, type RunnerFailure } from "../../src/runner";

/** One Engine-backed fixture for ordinary and adversarial runner contracts. */
export function fixture(ids = ["a", "b"], values: LiveValues = { x: 0 }) {
  const clock = createManualClock();
  const registry = new PluginRegistry();
  registry.register(transformPlugin);
  const project = new Engine({
    plugins: registry,
    clock,
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "scene",
        trigger: { type: "manual" },
        tracks: ids.map((id) => ({ id, keyframes: { transform: { values } } })),
      },
    ],
  });
  for (const id of ids) {
    project.mount(`scene/${id}`);
    project.seek(`scene/${id}`, 0);
  }
  const failures: RunnerFailure[] = [];
  let batches = 0;
  let inBatch = false;
  const port: Pick<ProjectHandle, "get" | "tryTrack" | "values"> = {
    get: (id) => project.get(id),
    tryTrack: (id) => project.tryTrack(id),
    values(recipe) {
      batches += 1;
      inBatch = true;
      try {
        return project.values(recipe);
      } finally {
        inBatch = false;
      }
    },
  };
  return {
    clock,
    project,
    port,
    failures,
    batches: () => batches,
    inBatch: () => inBatch,
    attach(
      runners: readonly Runner[],
      onFailure = (failure: RunnerFailure) => {
        failures.push(failure);
      },
    ) {
      return attachRunners(port, runners, { clock, onFailure });
    },
  };
}
