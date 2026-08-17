import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import type { TriggerPort } from "../ports/trigger";
import type { TriggerSignal } from "../contract/v5";
import { Lifecycle } from "./lifecycle";
import type { Track } from "./track";

export interface MotionTrackEntry {
  readonly id: string;
  readonly duration?: number;
}
export interface MotionOptions {
  readonly clock: Clock;
  readonly scheduler: Scheduler;
  readonly tracks: readonly MotionTrackEntry[];
  /**
   * Resolves a node id to its compiled Track. Required, and called at every point of use: a Motion
   * never stores a Track, so it can never drive a disposed or superseded one. See ADR-031.
   */
  readonly resolveTrack: (id: string) => Track | undefined;
  readonly trigger?: TriggerPort;
  readonly invalidate?: (progress: number) => void;
  readonly stagger?: number;
  readonly disposeTracks?: boolean;
  readonly listenToClock?: boolean;
  readonly acceptsExternalSignal?: boolean;
}
export class Motion {
  readonly #clock: Clock;
  readonly #scheduler: Scheduler;
  readonly #tracks: MotionTrackEntry[];
  readonly #trackMap = new Map<string, MotionTrackEntry>();
  readonly #resolveTrack: (id: string) => Track | undefined;
  readonly #trigger: TriggerPort | undefined;
  readonly #invalidate: (progress: number) => void;
  readonly #stagger: number;
  readonly #disposeTracks: boolean;
  readonly #listenToClock: boolean;
  readonly #acceptsExternalSignal: boolean;
  readonly #lifecycle: Lifecycle;
  #pendingProgress: number | undefined;
  #progressJob: { cancel(): void } | undefined;
  #playing = false;
  #position = 0;
  #unsubscribe: (() => void) | undefined;
  #triggerUnsubscribe: (() => void) | undefined;
  constructor(options: MotionOptions) {
    if (typeof options.resolveTrack !== "function")
      throw new TypeError("Motion requires a resolveTrack function.");
    this.#resolveTrack = options.resolveTrack;
    if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? 0) < 0)
      throw new TypeError("Motion stagger must be a finite non-negative number.");
    for (const entry of options.tracks) {
      if (!entry.id || this.#trackMap.has(entry.id))
        throw new Error(`Duplicate Motion track id: ${entry.id}.`);
      if (entry.duration !== undefined && (!Number.isFinite(entry.duration) || entry.duration <= 0))
        throw new TypeError(`Motion track duration must be a finite positive number: ${entry.id}.`);
      this.#trackMap.set(entry.id, entry);
    }
    this.#clock = options.clock;
    this.#scheduler = options.scheduler;
    this.#tracks = [...options.tracks];
    this.#trigger = options.trigger;
    this.#invalidate = options.invalidate ?? (() => undefined);
    this.#stagger = options.stagger ?? 0;
    this.#disposeTracks = options.disposeTracks ?? true;
    this.#listenToClock = options.listenToClock ?? true;
    this.#acceptsExternalSignal = options.acceptsExternalSignal ?? true;
    this.#lifecycle = new Lifecycle({
      beforeDispose: () => {
        this.pause();
        if (this.#disposeTracks) {
          for (const entry of this.#tracks) this.#resolveTrack(entry.id)?.dispose();
        }
      },
    });
  }
  get state() {
    return this.#lifecycle.state;
  }
  get playing() {
    return this.#playing;
  }
  get position() {
    return this.#position;
  }
  get tracks(): readonly MotionTrackEntry[] {
    return Object.freeze([...this.#tracks]);
  }
  addTrack(entry: MotionTrackEntry): void {
    this.assertActive();
    if (!entry.id || this.#trackMap.has(entry.id))
      throw new Error(`Duplicate Motion track id: ${entry.id}.`);
    if (entry.duration !== undefined && (!Number.isFinite(entry.duration) || entry.duration <= 0))
      throw new TypeError(`Motion track duration must be a finite positive number: ${entry.id}.`);
    const track = this.#track(entry.id);
    this.#tracks.push(entry);
    this.#trackMap.set(entry.id, entry);
    const index = this.#tracks.length - 1;
    track.setProgress(this.#effectiveProgress(index, entry));
  }
  replaceTrack(entry: MotionTrackEntry): void {
    this.assertActive();
    const index = this.#tracks.findIndex((candidate) => candidate.id === entry.id);
    if (index === -1) throw new Error(`Unknown Motion track id: ${entry.id}.`);
    if (entry.duration !== undefined && (!Number.isFinite(entry.duration) || entry.duration <= 0))
      throw new TypeError(`Motion track duration must be a finite positive number: ${entry.id}.`);
    const track = this.#track(entry.id);
    this.#tracks[index] = entry;
    this.#trackMap.set(entry.id, entry);
    track.setProgress(this.#effectiveProgress(index, entry));
  }
  removeTrack(trackId: string): void {
    this.assertActive();
    const index = this.#tracks.findIndex((entry) => entry.id === trackId);
    if (index === -1) return;
    this.#tracks.splice(index, 1);
    this.#trackMap.delete(trackId);
  }
  schedule(): readonly number[] {
    return this.#tracks.map((_, index) => index * this.#stagger);
  }
  mount(): void {
    this.#lifecycle.mount();
    if (this.#listenToClock) this.#subscribe();
    this.#attachTrigger();
  }
  play(): void {
    this.assertActive();
    if (this.#lifecycle.state === "created" || this.#lifecycle.state === "detached") this.mount();
    this.#playing = true;
  }
  pause(): void {
    this.#playing = false;
    if (this.#progressJob !== undefined) {
      this.#progressJob.cancel();
      this.#progressJob = undefined;
    }
    this.#pendingProgress = undefined;
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
    this.#triggerUnsubscribe?.();
    this.#triggerUnsubscribe = undefined;
    this.#lifecycle.detach();
  }
  seek(progress: number): void {
    this.assertActive();
    if (!Number.isFinite(progress)) throw new TypeError("Motion progress must be finite.");
    if (this.#progressJob !== undefined) {
      this.#progressJob.cancel();
      this.#progressJob = undefined;
    }
    this.#pendingProgress = undefined;
    this.#setProgress(Math.max(0, Math.min(1, progress)));
  }
  signal(signal: TriggerSignal): void {
    this.assertActive();
    if (!this.#acceptsExternalSignal)
      throw new TypeError(
        "Motion has a configured trigger driver and does not accept external signals.",
      );
    if (typeof signal === "object" && signal !== null && typeof signal.progress === "number") {
      if (!Number.isFinite(signal.progress)) throw new TypeError("Motion progress must be finite.");
      if (signal.progress < 0 || signal.progress > 1)
        throw new RangeError("Progress must be between 0 and 1.");
      this.#scheduleProgress(signal.progress);
    }
  }
  onTick(event: ClockTick): void {
    this.assertActive();
    this.#onTick(event);
  }
  reflow(): readonly number[] {
    this.assertActive();
    return this.schedule();
  }
  dispose(): void {
    this.#lifecycle.dispose();
  }
  destroy(): void {
    this.#lifecycle.destroy();
  }
  #subscribe(): void {
    if (this.#unsubscribe === undefined)
      this.#unsubscribe = this.#clock.subscribe((event) => this.#onTick(event));
  }
  #attachTrigger(): void {
    if (this.#trigger === undefined || this.#triggerUnsubscribe !== undefined) return;
    this.#triggerUnsubscribe = this.#trigger.subscribe((progress) =>
      this.#scheduleProgress(progress),
    );
  }
  #onTick(event: ClockTick): void {
    if (!this.#playing || this.#lifecycle.state !== "mounted") return;
    const next = Math.min(1, this.#position + this.#progressDelta(event.delta));
    this.#scheduleProgress(next);
  }
  #scheduleProgress(progress: number): void {
    if (!this.#playing || this.#lifecycle.state !== "mounted") return;
    this.#pendingProgress = Math.max(0, Math.min(1, progress));
    if (this.#progressJob !== undefined) return;
    this.#progressJob = this.#scheduler.schedule(() => {
      const latest = this.#pendingProgress;
      this.#pendingProgress = undefined;
      this.#progressJob = undefined;
      if (latest !== undefined && this.#playing && this.#lifecycle.state === "mounted")
        this.#setProgress(latest);
    });
  }
  #track(id: string): Track {
    const track = this.#resolveTrack(id);
    if (track === undefined) throw new TypeError(`Motion track "${id}" has no compiled Track.`);
    return track;
  }
  #setProgress(progress: number): void {
    this.#position = progress;
    const unresolved: string[] = [];
    for (let index = 0; index < this.#tracks.length; index += 1) {
      const entry = this.#tracks[index]!;
      const track = this.#resolveTrack(entry.id);
      // An unresolved id must not abort the sweep. Siblings still advance and invalidation still
      // fires, then the failure is reported once. Issue #114 symptoms 1 and 2.
      if (track === undefined) {
        unresolved.push(entry.id);
        continue;
      }
      track.setProgress(this.#effectiveProgress(index, entry));
    }
    this.#invalidate(progress);
    if (unresolved.length > 0)
      throw new TypeError(`Motion tracks have no compiled Track: ${unresolved.join(", ")}.`);
  }
  #effectiveProgress(index: number, entry: MotionTrackEntry): number {
    const duration = this.#totalDuration();
    const staggerDelay = index * this.#stagger;
    return staggerDelay > 0 && duration > 0
      ? Math.max(
          0,
          Math.min(1, (this.#position * duration - staggerDelay) / (entry.duration ?? duration)),
        )
      : this.#position;
  }
  #totalDuration(): number {
    return this.#tracks.reduce((maximum, entry) => Math.max(maximum, entry.duration ?? 1), 1);
  }
  #progressDelta(delta: number): number {
    return delta / this.#totalDuration();
  }
  private assertActive(): void {
    if (this.#lifecycle.state === "destroyed") throw new Error("Motion is destroyed.");
  }
}
