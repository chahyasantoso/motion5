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
  /** Set true only when the resolver's caller delegates Track lifetime to this Motion. */
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
    this.#disposeTracks = options.disposeTracks ?? false;
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
    // Resolved, then seeded, then committed. Resolution alone was already atomic; the seeding call
    // was not, and it can fail on its own: a resolvable Track can be disposed, and
    // #timeline.progress is injected code. Seeding against the prospective list rather than the
    // committed one is what keeps the value identical to the commit-first order, because
    // #totalDuration reduces over the entries. Issue #147.
    const entries = [...this.#tracks, entry];
    track.setProgress(this.#effectiveProgress(entries.length - 1, entry, entries));
    this.#tracks.push(entry);
    this.#trackMap.set(entry.id, entry);
  }
  replaceTrack(entry: MotionTrackEntry): void {
    this.assertActive();
    const index = this.#tracks.findIndex((candidate) => candidate.id === entry.id);
    if (index === -1) throw new Error(`Unknown Motion track id: ${entry.id}.`);
    if (entry.duration !== undefined && (!Number.isFinite(entry.duration) || entry.duration <= 0))
      throw new TypeError(`Motion track duration must be a finite positive number: ${entry.id}.`);
    const track = this.#track(entry.id);
    // Same order as addTrack, and the same reason for the prospective list. The replacement keeps
    // its original array index, so ADR-029's index and stagger guarantee is untouched. Issue #147.
    const entries = [...this.#tracks];
    entries[index] = entry;
    track.setProgress(this.#effectiveProgress(index, entry, entries));
    this.#tracks[index] = entry;
    this.#trackMap.set(entry.id, entry);
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
    // seek stays a clamping scrub and is deliberately not routed through #scheduleProgress: it is
    // leaf-level scrubbing rather than trigger input. See ADR-021 and ADR-037.
    this.#setProgress(Math.max(0, Math.min(1, progress)));
  }
  signal(signal: TriggerSignal): void {
    this.assertActive();
    if (!this.#acceptsExternalSignal)
      throw new TypeError(
        "Motion has a configured trigger driver and does not accept external signals.",
      );
    // Delegates rather than carrying its own copy of the range rule. The two error types and both
    // message strings are unchanged, so signal()'s contract is identical. See ADR-037.
    if (typeof signal === "object" && signal !== null && typeof signal.progress === "number")
      this.#scheduleProgress(signal.progress);
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
    // Clamps both bounds because this is internal arithmetic, not external input. It used to lean
    // on #scheduleProgress for the lower bound, and that clamp is gone. See ADR-037.
    const next = Math.max(0, Math.min(1, this.#position + this.#progressDelta(event.delta)));
    this.#scheduleProgress(next);
  }
  #scheduleProgress(progress: number): void {
    // Validated before the liveness guard on purpose. A paused or unmounted Motion that quietly
    // drops a malformed emission teaches the port nothing, and this is the one place every
    // TriggerPort reaches, so it is the only place the rule can live exactly once. Normalization
    // belongs to the source adapter, so by the time progress arrives here anything outside
    // [0, 1] is a contract violation and must be loud rather than clamped. See ADR-037.
    if (!Number.isFinite(progress)) throw new TypeError("Motion progress must be finite.");
    if (progress < 0 || progress > 1) throw new RangeError("Progress must be between 0 and 1.");
    if (!this.#playing || this.#lifecycle.state !== "mounted") return;
    this.#pendingProgress = progress;
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
      track.setProgress(this.#effectiveProgress(index, entry, this.#tracks));
    }
    this.#invalidate(progress);
    if (unresolved.length > 0)
      throw new TypeError(`Motion tracks have no compiled Track: ${unresolved.join(", ")}.`);
  }
  /**
   * Takes the entry list explicitly because the answer depends on which list is used: a mutation
   * seeds against the entries it is about to commit, while a sweep uses the live ones. Reading
   * #tracks here instead would make that difference invisible at the call site. Issue #147.
   */
  #effectiveProgress(
    index: number,
    entry: MotionTrackEntry,
    entries: readonly MotionTrackEntry[],
  ): number {
    const duration = this.#totalDuration(entries);
    const staggerDelay = index * this.#stagger;
    return staggerDelay > 0 && duration > 0
      ? Math.max(
          0,
          Math.min(1, (this.#position * duration - staggerDelay) / (entry.duration ?? duration)),
        )
      : this.#position;
  }
  #totalDuration(entries: readonly MotionTrackEntry[]): number {
    return entries.reduce((maximum, entry) => Math.max(maximum, entry.duration ?? 1), 1);
  }
  #progressDelta(delta: number): number {
    return delta / this.#totalDuration(this.#tracks);
  }
  private assertActive(): void {
    if (this.#lifecycle.state === "destroyed") throw new Error("Motion is destroyed.");
  }
}
