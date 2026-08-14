import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import type { TriggerCommand, TriggerDelegate, TriggerSignal } from "./triggers";
import { Lifecycle } from "./lifecycle";
import { Track } from "./track";

export interface MotionTrackEntry {
  readonly id: string;
  readonly track: Track;
  readonly duration?: number;
}
export interface MotionOptions {
  readonly clock: Clock;
  readonly scheduler: Scheduler;
  readonly tracks: readonly MotionTrackEntry[];
  readonly trigger?: TriggerDelegate;
  readonly invalidate?: (progress: number) => void;
  readonly stagger?: number;
  readonly disposeTracks?: boolean;
  readonly listenToClock?: boolean;
}

export class Motion {
  readonly #clock: Clock;
  readonly #scheduler: Scheduler;
  readonly #tracks: readonly MotionTrackEntry[];
  readonly #trigger: TriggerDelegate | undefined;
  readonly #invalidate: (progress: number) => void;
  readonly #stagger: number;
  readonly #disposeTracks: boolean;
  readonly #listenToClock: boolean;
  readonly #lifecycle: Lifecycle;
  readonly #scheduled = new Set<{ cancel(): void }>();
  #playing = false;
  #position = 0;
  #unsubscribe: (() => void) | undefined;
  #triggerAttached = false;

  constructor(options: MotionOptions) {
    if (!Number.isFinite(options.stagger ?? 0) || (options.stagger ?? 0) < 0)
      throw new TypeError("Motion stagger must be a finite non-negative number.");
    const ids = new Set<string>();
    for (const entry of options.tracks) {
      if (!entry.id || ids.has(entry.id))
        throw new Error(`Duplicate Motion track id: ${entry.id}.`);
      if (entry.duration !== undefined && (!Number.isFinite(entry.duration) || entry.duration <= 0))
        throw new TypeError(`Motion track duration must be a finite positive number: ${entry.id}.`);
      ids.add(entry.id);
    }
    this.#clock = options.clock;
    this.#scheduler = options.scheduler;
    this.#tracks = Object.freeze([...options.tracks]);
    this.#trigger = options.trigger;
    this.#invalidate = options.invalidate ?? (() => undefined);
    this.#stagger = options.stagger ?? 0;
    this.#disposeTracks = options.disposeTracks ?? true;
    this.#listenToClock = options.listenToClock ?? true;
    this.#lifecycle = new Lifecycle({
      beforeDispose: () => {
        this.pause();
        this.#trigger?.detach();
        if (this.#disposeTracks) for (const track of this.#tracks) track.track.dispose();
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
  get tracks() {
    return this.#tracks;
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
    for (const handle of this.#scheduled) handle.cancel();
    this.#scheduled.clear();
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
    this.#trigger?.detach();
    this.#triggerAttached = false;
    this.#lifecycle.detach();
  }
  seek(progress: number): void {
    this.assertActive();
    if (!Number.isFinite(progress)) throw new TypeError("Motion progress must be finite.");
    this.#setProgress(Math.max(0, Math.min(1, progress)));
  }
  signal(signal: TriggerSignal): void {
    this.assertActive();
    this.#trigger?.signal(signal);
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
    if (this.#trigger === undefined || this.#triggerAttached) return;
    this.#trigger.attach((command) => this.#onTrigger(command));
    this.#triggerAttached = true;
  }
  #onTrigger(command: TriggerCommand): void {
    if (!this.#playing || this.#lifecycle.state !== "mounted") return;
    if (command.setProgress !== undefined) {
      const progress = command.setProgress;
      const handle = this.#scheduler.schedule(() => {
        this.#scheduled.delete(handle);
        this.#setProgress(progress);
      });
      this.#scheduled.add(handle);
    }
  }
  #onTick(event: ClockTick): void {
    if (!this.#playing || this.#lifecycle.state !== "mounted") return;
    const next = Math.min(1, this.#position + this.#progressDelta(event.delta));
    const handle = this.#scheduler.schedule(() => {
      this.#scheduled.delete(handle);
      this.#setProgress(next);
    });
    this.#scheduled.add(handle);
  }
  #setProgress(progress: number): void {
    this.#position = progress;
    for (const entry of this.#tracks) entry.track.setProgress(progress);
    this.#invalidate(progress);
  }
  #progressDelta(delta: number): number {
    const duration = this.#tracks.reduce(
      (maximum, entry) => Math.max(maximum, entry.duration ?? 1),
      1,
    );
    return delta / duration;
  }
  private assertActive(): void {
    if (this.#lifecycle.state === "destroyed") throw new Error("Motion is destroyed.");
  }
}
