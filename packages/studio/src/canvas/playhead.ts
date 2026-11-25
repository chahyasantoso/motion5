import type { Problem } from "./api";
import { mountOf, problemOfError, problemOfEvent, sceneOf, type MountView } from "./mount-view";

/** What the timeline shows of the page clock. */
export interface PlayheadState {
  readonly ms: number;
  readonly playing: boolean;
  /** The clock length in ms; the scene length when the page scrolls. */
  readonly length: number;
  /** `timed` drives the mount clock, `scroll` drives the page scroll position, `waiting` has no mount yet. */
  readonly mode: "timed" | "scroll" | "waiting";
  readonly rate: number;
  readonly loop: boolean;
  /** The id of the shot soloed, if any. */
  readonly solo: string | undefined;
}

interface Remembered {
  readonly ms: number;
  readonly scroll: number;
  readonly playing: boolean;
}

const FALLBACK_LENGTH = 1000;

/** The one playhead of a canvas: reads the preview clock, drives it, and keeps time across reloads and hot swaps. */
export class Playhead {
  private state: PlayheadState = {
    ms: 0,
    playing: false,
    length: FALLBACK_LENGTH,
    mode: "waiting",
    rate: 1,
    loop: false,
    solo: undefined,
  };
  private readonly listeners = new Set<() => void>();
  private frame: HTMLIFrameElement | undefined;
  private win: Window | undefined;
  private doc: Document | undefined;
  private handle: number | undefined;
  private remembered: Remembered | undefined;
  private pending: Remembered | undefined;
  private soloSpan: { readonly from: number; readonly to: number } | undefined;
  private resume = false;
  private sceneLength = FALLBACK_LENGTH;
  private readonly unhook: (() => void)[] = [];

  constructor(private readonly onProblem: (problem: Problem | undefined) => void) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  readonly snapshot = (): PlayheadState => this.state;

  private set(next: Partial<PlayheadState>): void {
    const merged = { ...this.state, ...next };
    const same =
      merged.ms === this.state.ms &&
      merged.playing === this.state.playing &&
      merged.length === this.state.length &&
      merged.mode === this.state.mode &&
      merged.rate === this.state.rate &&
      merged.loop === this.state.loop &&
      merged.solo === this.state.solo;
    if (same) return;
    this.state = merged;
    for (const listener of [...this.listeners]) listener();
  }

  /** The scene length in ms, used when the page has no timed clock. */
  setSceneLength(ms: number): void {
    this.sceneLength = ms > 0 ? ms : FALLBACK_LENGTH;
  }

  /** Starts following `frame`, and keeps following it across reloads. */
  attach(frame: HTMLIFrameElement): void {
    this.detach();
    this.frame = frame;
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
    this.pending = this.remembered;
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
    win.addEventListener("motion:hot", hot);
    win.addEventListener("motion:error", failed);
    win.addEventListener("error", thrown);
    this.unhook.push(() => {
      win.removeEventListener("motion:hot", hot);
      win.removeEventListener("motion:error", failed);
      win.removeEventListener("error", thrown);
    });
  }

  private mount(): MountView | undefined {
    this.hook();
    return mountOf(this.win);
  }

  private scrollSpan(): number {
    const root = this.win?.document.documentElement;
    return root === undefined ? 0 : Math.max(0, root.scrollHeight - (this.win?.innerHeight ?? 0));
  }

  private applyRange(mount: MountView): void {
    const span = this.soloSpan;
    if (span !== undefined) mount.clock?.setRange(span.from, span.to);
    else if (this.state.loop) mount.clock?.setRange(0, mount.durationMs ?? this.state.length);
    else mount.clock?.setRange();
  }

  private restore(mount: MountView, before: Remembered): void {
    const clock = mount.clock;
    if (clock === undefined) {
      this.win?.scrollTo(0, before.scroll);
      return;
    }
    const length = mount.durationMs ?? this.state.length;
    clock.setRate(this.state.rate);
    this.applyRange(mount);
    clock.seek(length > 0 ? Math.min(1, before.ms / length) : 0);
    if (before.playing) clock.play();
  }

  private read(): void {
    const mount = this.mount();
    if (mount === undefined) {
      this.set({ mode: "waiting", playing: false });
      return;
    }
    if (this.pending !== undefined) {
      const before = this.pending;
      this.pending = undefined;
      this.restore(mount, before);
    }
    const clock = mount.clock;
    if (clock !== undefined) {
      const length = mount.durationMs ?? this.sceneLength;
      const ms = Math.min(length, Math.max(0, clock.elapsed() ?? 0));
      const playing = clock.playing();
      this.remembered = { ms, scroll: this.remembered?.scroll ?? 0, playing };
      this.set({ ms: Math.round(ms), playing, length, mode: "timed" });
      return;
    }
    const span = this.scrollSpan();
    const scroll = this.win?.scrollY ?? 0;
    this.remembered = { ms: 0, scroll, playing: false };
    this.set({
      ms: span > 0 ? Math.round((scroll / span) * this.sceneLength) : 0,
      playing: false,
      length: this.sceneLength,
      mode: "scroll",
    });
  }

  /** Moves the page to `ms`: the mount clock, or the page scroll position. */
  seek(ms: number): void {
    const mount = this.mount();
    if (mount === undefined) return;
    const clock = mount.clock;
    const length = mount.durationMs ?? this.state.length;
    const at = Math.min(length, Math.max(0, ms));
    if (clock !== undefined) {
      clock.seek(length > 0 ? at / length : 0);
      this.set({ ms: Math.round(at), playing: false });
      return;
    }
    const span = this.scrollSpan();
    this.win?.scrollTo(0, this.state.length > 0 ? (at / this.state.length) * span : 0);
    this.set({ ms: Math.round(at) });
  }

  beginScrub(): void {
    this.resume = this.mount()?.clock?.playing() ?? false;
  }

  endScrub(): void {
    if (this.resume) this.mount()?.clock?.play();
    this.resume = false;
  }

  toggle(): void {
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
    const mount = this.mount();
    if (this.state.solo === id) {
      this.soloSpan = undefined;
      this.set({ solo: undefined });
      if (mount !== undefined) this.applyRange(mount);
      return;
    }
    this.soloSpan = { from, to };
    this.set({ solo: id });
    if (mount === undefined) return;
    this.applyRange(mount);
    this.seek(from);
    mount.clock?.play();
  }
}
