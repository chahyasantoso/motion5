import type { Diagnostic, ProjectDefinition } from "./contract/v5";
import { validateV5 } from "./contract/validate-v5";
import { PluginRegistry } from "./domain/plugins";
import { Track } from "./domain/track";
import type { ImmutableRecord } from "./domain/values";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import type { Patch, PatchListener } from "./runtime/patch-registry";
import { ProjectRuntime } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry;
}

export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatchLike;
  subscribe(nodeId: string, listener: PatchListener): () => void;
  dispose(): void;
}

export interface PatchBatchLike {
  readonly tick: number;
  readonly seeds: readonly string[];
  readonly patches: readonly Patch[];
  readonly diagnostics: readonly Diagnostic[];
}

class RuntimeProjectHandle implements ProjectHandle {
  readonly #runtime: ProjectRuntime;
  constructor(runtime: ProjectRuntime) {
    this.#runtime = runtime;
  }
  mount(nodeId: string, instance: object = {}): object {
    return this.#runtime.mount(nodeId, instance);
  }
  unmount(nodeId: string): void {
    this.#runtime.unmount(nodeId);
  }
  seek(nodeId: string, progress: number): PatchBatchLike {
    return this.#runtime.seek(nodeId, progress);
  }
  subscribe(nodeId: string, listener: PatchListener): () => void {
    return this.#runtime.graph.registry.subscribeNode(nodeId, listener);
  }
  dispose(): void {
    this.#runtime.dispose();
  }
}

function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}

function assertValidProject(project: unknown): asserts project is ProjectDefinition {
  const result = validateV5(project);
  if (!result.valid) {
    throw new TypeError(
      result.diagnostics.length === 0
        ? "Project failed v5 validation."
        : describeDiagnostics(result.diagnostics),
    );
  }
}

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

  load(project: ProjectDefinition): ProjectHandle {
    assertValidProject(project);
    const tracks = new Map<string, Track>();
    const nodes = new Map<
      string,
      { duration?: number; keyframes?: Readonly<Record<string, unknown>> }
    >();
    for (const motion of project.motions)
      for (const track of motion.tracks) nodes.set(`${motion.id}/${track.id}`, track);
    for (const track of project.freeTracks ?? []) nodes.set(`~/${track.id}`, track);

    const compile = (nodeId: string): Track => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const definition = nodes.get(nodeId);
      if (!definition) throw new TypeError(`Unknown graph node "${nodeId}".`);
      const resolved = this.#plugins?.resolveForKeyframes(
        definition.keyframes ?? {},
        `${nodeId}.keyframes`,
      );
      if (resolved?.diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(resolved.diagnostics));
      const track = new Track({
        interpolator: this.#options.interpolator,
        interpolationConfig: definition,
        ...(resolved ? { plugins: resolved } : {}),
      });
      tracks.set(nodeId, track);
      return track;
    };

    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
      const compose =
        (node: {
          id: string;
          track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> };
        }) =>
        (inputs: Readonly<Record<string, unknown>>) => {
          const snapshot = tracks.get(node.id)!.compose(inputs as Readonly<ImmutableRecord>);
          return {
            values: snapshot.values,
            sourceProgress: snapshot.progress,
            sourceRevisions: {},
          };
        };
      const runtime = new ProjectRuntime(project, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        setProgress: (nodeId, progress) => tracks.get(nodeId)!.setProgress(progress),
        disposeComposition: () => {
          for (const track of tracks.values()) track.dispose();
          tracks.clear();
        },
      });
      return new RuntimeProjectHandle(runtime);
    } catch (error) {
      for (const track of tracks.values()) track.dispose();
      throw error;
    }
  }
}
