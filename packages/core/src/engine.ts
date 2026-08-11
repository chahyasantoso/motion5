import type { ProjectDefinition } from "./contract/v5";
import { PluginRegistry } from "./domain/plugins";
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
  readonly plugins?: PluginRegistry;
}

/** Composition root: validates ports and constructs the one project lifetime owner. */
export class Engine {
  readonly #options: EngineOptions;
  readonly #plugins: PluginRegistry | undefined;

  constructor(options: EngineOptions) {
    assertClock(options.clock);
    assertInterpolator(options.interpolator);
    assertScheduler(options.scheduler);
    this.#options = options;
    this.#plugins = options.plugins;
  }

  load(project: ProjectDefinition): ProjectRuntime {
    const tracks = new Map<string, Track>();
    const compose = (node: {
      id: string;
      track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> };
    }) => {
      let track = tracks.get(node.id);
      if (!track) {
        const resolved = this.#plugins?.resolveForKeyframes(
          node.track.keyframes ?? {},
          `${node.id}.keyframes`,
        );
        if (resolved?.diagnostics.some(({ severity }) => severity === "error"))
          throw new TypeError(resolved.diagnostics.map(({ message }) => message).join(" "));
        track = new Track({
          interpolator: this.#options.interpolator,
          interpolationConfig: node.track,
          ...(resolved ? { plugins: resolved } : {}),
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
