import type { Events } from "@gerak/core";
import type { Problem } from "./api";
import { registerOwner } from "./driver-hook";
import { mountOf, problemOfError, problemOfEvent, sceneOf, type MountView } from "./mount-view";

/** What the timeline shows of the page clock. */
export interface PlayheadState {
  readonly ms: number;
  readonly playing: boolean;
  /** The clock length in ms. */
  readonly length: number;
  /** `timed` drives the page clock, `waiting` has no clock yet. */
  readonly mode: "timed" | "waiting";
  /** Whether the Studio handed the page its clock, so the page can replay from a fresh load. */
  readonly driven: boolean;
  readonly rate: number;
  readonly loop: boolean;
  /** The id of the shot soloed, if any. */
  readonly solo: string | undefined;
}

interface Remembered {
  readonly ms: number;
  readonly playing: boolean;
}

const FALLBACK_LENGTH = 1000;

/** The inputs that count as a person using a page or the canvas. */
export const INPUT_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

/** The one playhead of a canvas: reads the preview clock, drives it, and keeps time across reloads and hot swaps. */
export class Playhead {
  private state: PlayheadState = {
    ms: 0,
    playing: false,
    length: FALLBACK_LENGTH,
    mode: "waiting",
    driven: false,
    rate: 1,
    loop: false,
    solo: undefined,
  };
  private readonly listeners = new Set<() => void>();
  private readonly inputs = new Set<() => void>();
  private frame: HTMLIFrameElement | undefined;
  private win: Window | undefined;
  private doc: Document | undefined;
  private handle: number | undefined;
  private remembered: Remembered | undefined;
  private pending: Remembered | undefined;
  private restart: Remembered | undefined;
  private soloSpan: { readonly from: number; readonly to: number } | undefined;
  private resume = false;
  private held = false;
  private stopAt: number | undefined;
  private sceneLength = FALLBACK_LENGTH;
  private events: Events = [];
  private unregister: (() => void) | undefined;
  private readonly unhook: (() => void)[] = [];

  constructor(private readonly onProblem: (problem: Problem | undefined) => void) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  readonly snapshot = (): PlayheadState => this.state;

  /** Calls `listener` on each trusted pointer, key or wheel input inside the page, until the returned function runs. */
  readonly onInput = (listener: () => void): (() => void) => {
    this.inputs.add(listener);
    return () => {
      this.inputs.delete(listener);
    };
  };

  private set(next: Partial<PlayheadState>): void {
    const merged = { ...this.state, ...next };
    const same =
      merged.ms === this.state.ms &&
      merged.playing === this.state.playing &&
      merged.length === this.state.length &&
      merged.mode === this.state.mode &&
      merged.driven === this.state.driven &&
      merged.rate === this.state.rate &&
      merged.loop === this.state.loop &&
      merged.solo === this.state.solo;
    if (same) return;
    this.state = merged;
    for (const listener of [...this.listeners]) listener();
  }

  /** Holds the clock paused on its frame while `on`, so an unused preview stays still. */
  setHeld(on: boolean): void {
    this.held = on;
    if (on) this.mount()?.clock?.pause();
  }

  /** The scene length in ms, used while the page has no clock yet. */
  setSceneLength(ms: number): void {
    this.sceneLength = ms > 0 ? ms : FALLBACK_LENGTH;
  }

  /** The events a driven page replays under its own input. */
  take(): Events {
    return this.events;
  }

  /** Sets the take; a driven page reloads on a changed one and returns to the same ms. */
  setTake(next: Events): void {
    if (JSON.stringify(next) === JSON.stringify(this.events)) return;
    this.events = next;
    if (this.state.driven) this.reload();
  }

  /** Reloads a driven page from the top, with a fresh driver and an empty log, and plays it. */
  replay(): void {
    if (!this.state.driven) return;
    this.restart = { ms: 0, playing: true };
    this.reload();
  }

  private reload(): void {
    const win = this.win;
    if (win === undefined) return;
    win.history.scrollRestoration = "manual";
    win.location.reload();
  }

  /** Starts following `frame`, and keeps following it across reloads. */
  attach(frame: HTMLIFrameElement): void {
    this.detach();
    this.frame = frame;
    this.unregister = registerOwner({
      owns: (win) => frame.contentWindow === win,
      take: () => this.events,
    });
    const loaded = (): void => this.hook();
    frame.addEventListener("load", loaded);
    this.unhook.push(() => frame.removeEventListener("load", loaded));
    this.hook();
    const tick = (): void => {
      this.read();
      this.handle = requestAnimationFrame(tick);
    };
    this.handle = requestAnimationFrame(tick);
  }

  detach(): void {
    if (this.handle !== undefined) cancelAnimationFrame(this.handle);
    this.handle = undefined;
    for (const stop of this.unhook.splice(0)) stop();
    this.unregister?.();
    this.unregister = undefined;
    this.frame = undefined;
    this.win = undefined;
    this.doc = undefined;
  }

  private hook(): void {
    const win = this.frame?.contentWindow ?? undefined;
    if (win === undefined || win.document === this.doc) return;
    if (win.location.href === "about:blank") return;
    for (const stop of this.unhook.splice(1)) stop();
    this.win = win;
    this.doc = win.document;
    this.pending = this.restart ?? this.remembered;
    this.restart = undefined;
    this.onProblem(undefined);
    const hot = (event: Event): void => {
      const mount = mountOf(win);
      const scene = sceneOf(event);
      if (mount === undefined || scene === undefined) return;
      event.preventDefault();
      try {
        mount.replace(scene);
        this.onProblem(undefined);
      } catch (error) {
        this.onProblem(problemOfError(error));
      }
    };
    const failed = (event: Event): void => this.onProblem(problemOfEvent(event));
    const thrown = (event: Event): void => {
      const message: unknown = Reflect.get(event, "message");
      const file: unknown = Reflect.get(event, "filename");
      const line: unknown = Reflect.get(event, "lineno");
      this.onProblem({
        message: typeof message === "string" ? message : "The page threw an error.",
        ...(typeof file === "string" && file !== "" ? { file } : {}),
        ...(typeof line === "number" && line > 0 ? { line } : {}),
      });
    };
    const input = (event: Event): void => {
      if (event.isTrusted) for (const listener of [...this.inputs]) listener();
    };
    win.addEventListener("motion:hot", hot);
    win.addEventListener("motion:error", failed);
    win.addEventListener("error", thrown);
    for (const type of INPUT_EVENTS) win.addEventListener(type, input, true);
    this.unhook.push(() => {
      win.removeEventListener("motion:hot", hot);
      win.removeEventListener("motion:error", failed);
      win.removeEventListener("error", thrown);
      for (const type of INPUT_EVENTS) win.removeEventListener(type, input, true);
    });
  }

  private mount(): MountView | undefined {
    this.hook();
    return mountOf(this.win);
  }

  private applyRange(mount: MountView): void {
    const span = this.soloSpan;
    if (span !== undefined) mount.clock?.setRange(span.from, span.to);
    else if (this.state.loop) mount.clock?.setRange(0, mount.durationMs ?? this.state.length);
    else mount.clock?.setRange();
  }

  private restore(mount: MountView, before: Remembered): void {
    const clock = mount.clock;
    if (clock === undefined) return;
    const length = mount.durationMs ?? this.state.length;
    clock.setRate(this.state.rate);
    this.applyRange(mount);
    clock.seek(length > 0 ? Math.min(1, before.ms / length) : 0);
    if (before.playing) clock.play();
  }

  private read(): void {
    const mount = this.mount();
    if (mount?.clock === undefined) {
      this.set({ mode: "waiting", driven: false, playing: false });
      return;
    }
    if (this.pending !== undefined) {
      const before = this.pending;
      this.pending = undefined;
      this.restore(mount, before);
    }
    const clock = mount.clock;
    if (this.held && clock.playing()) clock.pause();
    const length = mount.durationMs ?? this.sceneLength;
    const ms = Math.min(length, Math.max(0, clock.elapsed() ?? 0));
    const playing = clock.playing();
    const driven = mount.driven;
    this.remembered = { ms, playing };
    if (playing && this.stopAt !== undefined && ms >= this.stopAt) {
      this.stopAt = undefined;
      clock.pause();
      this.set({ ms: Math.round(ms), playing: false, length, mode: "timed", driven });
      return;
    }
    this.set({ ms: Math.round(ms), playing, length, mode: "timed", driven });
  }

  /** Moves the page clock to `ms`. */
  seek(ms: number): void {
    this.stopAt = undefined;
    const mount = this.mount();
    const clock = mount?.clock;
    if (mount === undefined || clock === undefined) return;
    const length = mount.durationMs ?? this.state.length;
    const at = Math.min(length, Math.max(0, ms));
    clock.seek(length > 0 ? at / length : 0);
    this.set({ ms: Math.round(at), playing: false });
  }

  beginScrub(): void {
    this.resume = this.mount()?.clock?.playing() ?? false;
  }

  endScrub(): void {
    if (this.resume) this.mount()?.clock?.play();
    this.resume = false;
  }

  toggle(): void {
    this.stopAt = undefined;
    const clock = this.mount()?.clock;
    if (clock === undefined) return;
    if (clock.playing()) clock.pause();
    else clock.play();
  }

  setRate(rate: number): void {
    this.mount()?.clock?.setRate(rate);
    this.set({ rate });
  }

  toggleLoop(): void {
    this.set({ loop: !this.state.loop });
    const mount = this.mount();
    if (mount !== undefined) this.applyRange(mount);
  }

  /** Solos and loops the shot `id`, or clears the solo when it already is the one. */
  solo(id: string, from: number, to: number): void {
    if (this.state.solo === id) this.clearSolo();
    else this.soloOn(id, from, to);
  }

  /** Solos and loops the shot `id`, and keeps it when it already is the one. */
  soloOn(id: string, from: number, to: number): void {
    const mount = this.mount();
    this.soloSpan = { from, to };
    this.set({ solo: id });
    if (mount === undefined) return;
    this.applyRange(mount);
    this.seek(from);
    mount.clock?.play();
  }

  clearSolo(): void {
    if (this.soloSpan === undefined && this.state.solo === undefined) return;
    this.soloSpan = undefined;
    this.set({ solo: undefined });
    const mount = this.mount();
    if (mount !== undefined) this.applyRange(mount);
  }

  /** Plays the clock, optionally from `from` and pausing at `to`; `false` when the page has no timed clock. */
  playRange(from: number | undefined, to: number | undefined, speed: number | undefined): boolean {
    const mount = this.mount();
    const clock = mount?.clock;
    if (mount === undefined || clock === undefined) return false;
    if (from !== undefined) this.seek(from);
    if (speed !== undefined) this.setRate(speed);
    this.stopAt = to !== undefined && to < (mount.durationMs ?? this.state.length) ? to : undefined;
    clock.play();
    return true;
  }

  /** Scrolls the page window to `px`; `false` when no page is loaded. */
  scrollTo(px: number): boolean {
    if (this.win === undefined) return false;
    this.stopAt = undefined;
    this.win.scrollTo(0, px);
    return true;
  }

  /** Scrolls the page to the top of the first match of `selector`; `false` when nothing matches. */
  scrollToSelector(selector: string): boolean {
    const win = this.win;
    if (win === undefined) return false;
    let found: Element | null;
    try {
      found = win.document.querySelector(selector);
    } catch {
      return false;
    }
    if (found === null) return false;
    this.stopAt = undefined;
    win.scrollTo(0, found.getBoundingClientRect().top + win.scrollY);
    return true;
  }

  /** The page window, or `undefined` before one loads. */
  window(): Window | undefined {
    return this.win;
  }
}
