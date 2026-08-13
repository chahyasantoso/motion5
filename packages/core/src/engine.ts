import type {
  Diagnostic,
  Patch,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
} from "./contract/v5";
import { validateV5 } from "./contract/validate-v5";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
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
export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  subscribe(nodeId: string, listener: PatchListener): () => void;
  dispose(): void;
}
type RuntimeLike = {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  graph: { registry: { subscribeNode(nodeId: string, listener: PatchListener): () => void } };
  dispose(): void;
};
function createHandle(runtime: RuntimeLike): ProjectHandle {
  return {
    mount: (nodeId, instance = {}) => runtime.mount(nodeId, instance),
    unmount: (nodeId) => runtime.unmount(nodeId),
    seek: (nodeId, progress) => runtime.seek(nodeId, progress),
    subscribe: (nodeId, listener) => runtime.graph.registry.subscribeNode(nodeId, listener),
    dispose: () => runtime.dispose(),
  };
}
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
function assertValidProject(project: unknown): ProjectDefinition {
  const result = validateV5(project);
  if (!result.valid || result.value === null)
    throw new TypeError(
      result.diagnostics.length === 0
        ? "Project failed v5 validation."
        : describeDiagnostics(result.diagnostics),
    );
  return result.value;
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
    const acceptedProject = assertValidProject(project);
    const tracks = new Map<string, Track>();
    const nodes = new Map<
      string,
      { id: string; duration?: number; keyframes?: Readonly<Record<string, unknown>> }
    >();
    for (const motion of acceptedProject.motions)
      for (const track of motion.tracks)
        nodes.set(`${motion.id}/${track.id}`, { ...track, id: track.id });
    for (const track of acceptedProject.freeTracks ?? [])
      nodes.set(`~/${track.id}`, { ...track, id: track.id });
    const compile = (nodeId: string): Track => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const definition = nodes.get(nodeId);
      if (!definition) throw new TypeError(`Unknown graph node "${nodeId}".`);
      const keyframeCompilation = compilePercentKeyframes(
        definition,
        `${nodeId}.keyframes`,
      );
      if (keyframeCompilation.diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(keyframeCompilation.diagnostics));
      const resolved = this.#plugins?.resolveForKeyframes(
        definition.keyframes ?? {},
        `${nodeId}.keyframes`,
        { id: nodeId, duration: definition.duration },
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
      const runtime = new ProjectRuntime(acceptedProject, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        setProgress: (nodeId, progress) => tracks.get(nodeId)!.setProgress(progress),
        disposeComposition: () => {
          for (const track of tracks.values()) track.dispose();
          tracks.clear();
        },
      });
      return createHandle(runtime);
    } catch (error) {
      for (const track of tracks.values()) track.dispose();
      throw error;
    }
  }
}
