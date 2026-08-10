import type { ProjectDefinition } from "./contract/v5";
import { Track } from "./domain/track";
import type { ImmutableRecord } from "./domain/values";
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
    const tracks = new Map<string, Track>();
    const compose = (node: {
      id: string;
      track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> };
    }) => {
      let track = tracks.get(node.id);
      if (!track) {
        track = new Track({
          interpolator: this.#options.interpolator,
          interpolationConfig: node.track,
        });
        tracks.set(node.id, track);
      }
      const compiledTrack = track;
      return (inputs: Readonly<Record<string, unknown>>) => {
        const snapshot = compiledTrack.compose(inputs as Readonly<ImmutableRecord>);
        return {
          values: snapshot.values,
          sourceProgress: snapshot.progress,
          sourceRevisions: {},
        };
      };
    };
    return new ProjectRuntime(project, {
      clock: this.#options.clock,
      compose,
      disposeComposition: () => {
        for (const track of tracks.values()) track.dispose();
        tracks.clear();
      },
    });
  }
}
