import type { Diagnostic, PatchBatch, PatchListener, ProjectDefinition } from "./contract/v5";
import { validateV5 } from "./contract/validate-v5";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
import { Motion } from "./domain/motion";
import { PluginRegistry } from "./domain/plugins";
import { createTrigger, type TriggerSignal } from "./domain/triggers";
import { Track } from "./domain/track";
import type { ImmutableRecord } from "./domain/values";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { ProjectRuntime } from "./runtime/project-runtime";

export interface EngineOptions { readonly clock: Clock; readonly interpolator: Interpolator; readonly scheduler: Scheduler; readonly plugins?: PluginRegistry; }
export interface ProjectHandle { mount(nodeId: string, instance?: object): object; unmount(nodeId: string): void; seek(nodeId: string, progress: number): PatchBatch; signal(motionId: string, signal: TriggerSignal): void; subscribe(nodeId: string, listener: PatchListener): () => void; dispose(): void; }
type RuntimeLike = { mount(nodeId: string, instance?: object): object; unmount(nodeId: string): void; seek(nodeId: string, progress: number): PatchBatch; graph: { registry: { subscribeNode(nodeId: string, listener: PatchListener): () => void } }; dispose(): void; };
function createHandle(runtime: RuntimeLike, signal: (motionId: string, signal: TriggerSignal) => void): ProjectHandle { return { mount: (nodeId, instance = {}) => runtime.mount(nodeId, instance), unmount: (nodeId) => runtime.unmount(nodeId), seek: (nodeId, progress) => runtime.seek(nodeId, progress), signal, subscribe: (nodeId, listener) => runtime.graph.registry.subscribeNode(nodeId, listener), dispose: () => runtime.dispose() }; }
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string { return diagnostics.map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`).join(" "); }
function assertValidProject(project: unknown): ProjectDefinition { const result = validateV5(project); if (!result.valid || result.value === null) throw new TypeError(result.diagnostics.length === 0 ? "Project failed v5 validation." : describeDiagnostics(result.diagnostics)); return result.value; }

export class Engine {
  readonly #options: EngineOptions;
  readonly #plugins: PluginRegistry | undefined;
  constructor(options: EngineOptions) { assertClock(options.clock); assertInterpolator(options.interpolator); assertScheduler(options.scheduler); this.#options = options; this.#plugins = options.plugins; }
  load(project: ProjectDefinition): ProjectHandle {
    const acceptedProject = assertValidProject(project);
    const tracks = new Map<string, Track>();
    const nodes = new Map<string, { id: string; duration?: number; keyframes?: Readonly<Record<string, unknown>> }>();
    const motionTrackIds = new Map<string, readonly string[]>();
    for (const motion of acceptedProject.motions) { const ids = motion.tracks.map((track) => qualifyMotionTrack(motion.id, track.id).value); motionTrackIds.set(motion.id, ids); for (const track of motion.tracks) nodes.set(qualifyMotionTrack(motion.id, track.id).value, { ...track, id: track.id }); }
    for (const track of acceptedProject.freeTracks ?? []) nodes.set(qualifyFreeTrack(track.id).value, { ...track, id: track.id });
    const compile = (nodeId: string): Track => { const existing = tracks.get(nodeId); if (existing) return existing; const definition = nodes.get(nodeId); if (!definition) throw new TypeError(`Unknown graph node \"${nodeId}\".`); const path = `${nodeId}.keyframes`; const resolved = this.#plugins?.resolveForKeyframes(definition.keyframes ?? {}, path, { id: nodeId, duration: definition.duration }); const preparedKeyframes = { ...(definition.keyframes ?? {}), ...(resolved?.preparation.keyframes ?? {}) }; const keyframeCompilation = compilePercentKeyframes(preparedKeyframes, path); const diagnostics = [...(resolved?.diagnostics ?? []), ...keyframeCompilation.diagnostics]; if (diagnostics.some(({ severity }) => severity === "error")) throw new TypeError(describeDiagnostics(diagnostics)); const track = new Track({ interpolator: this.#options.interpolator, interpolationConfig: definition, ...(resolved ? { plugins: resolved } : {}) }); tracks.set(nodeId, track); return track; };
    const motions = new Map<string, Motion>();
    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
      const compose = (node: { id: string; track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> } }) => (inputs: Readonly<Record<string, unknown>>) => { const snapshot = tracks.get(node.id)!.compose(inputs as Readonly<ImmutableRecord>); return { values: snapshot.values, sourceProgress: snapshot.progress, sourceRevisions: {} }; };
      let runtime: ProjectRuntime;
      runtime = new ProjectRuntime(acceptedProject, { clock: this.#options.clock, scheduler: this.#options.scheduler, compose, setProgress: (nodeId, progress) => tracks.get(nodeId)!.setProgress(progress), disposeComposition: () => { for (const motion of motions.values()) motion.dispose(); motions.clear(); for (const track of tracks.values()) track.dispose(); tracks.clear(); } });
      for (const motionDefinition of acceptedProject.motions) {
        const ids = motionTrackIds.get(motionDefinition.id) ?? [];
        const entries = ids.map((id) => { const track = tracks.get(id); if (!track) throw new TypeError(`Unknown graph node \"${id}\".`); const definition = nodes.get(id); return { id, track, duration: definition?.duration }; });
        const motion = new Motion({ clock: this.#options.clock, scheduler: this.#options.scheduler, tracks: entries, trigger: createTrigger(motionDefinition.trigger.type), disposeTracks: false, listenToClock: false, invalidate: (progress) => { const first = ids[0]; if (first) runtime.seek(first, progress); }, stagger: motionDefinition.stagger });
        motion.play(); motions.set(motionDefinition.id, motion);
      }
      return createHandle(runtime, (motionId, signal) => { const motion = motions.get(motionId); if (!motion) throw new TypeError(`Unknown motion \"${motionId}\".`); motion.signal(signal); });
    } catch (error) { for (const motion of motions.values()) motion.dispose(); for (const track of tracks.values()) track.dispose(); throw error; }
  }
}
