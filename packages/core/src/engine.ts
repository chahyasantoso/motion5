import type { ProjectDefinition } from "./contract/v5";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { ProjectRuntime } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
}

/** Composition root: validates ports and constructs the one project lifetime owner. */
export class Engine {
  readonly #options: EngineOptions;

  constructor(options: EngineOptions) {
    assertClock(options.clock);
    assertInterpolator(options.interpolator);
    assertScheduler(options.scheduler);
    this.#options = options;
  }

  load(project: ProjectDefinition): ProjectRuntime {
    return new ProjectRuntime(project, {
      clock: this.#options.clock,
      compose: (node) => () => ({
        values: { nodeId: node.id },
        sourceProgress: 0,
        sourceRevisions: {},
      }),
    });
  }
}
