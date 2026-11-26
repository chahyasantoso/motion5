import { INPUT_EVENTS, type Events } from "@gerak/core";
import { clockDriver, type ClockDriver, type FrameSource } from "@gerak/dom";

/** How fast the sweep scrolls a page that has no take: one px per ms at rate 1. */
export const SWEEP_PX_PER_MS = 1;
/** How long past a take's last event the timeline runs on, for the page to settle. */
export const SETTLE_MS = 2000;

/** The page window a driver scrolls. */
export interface ScrollHost {
  scrollTo(x: number, y: number): void;
  /** How far the page can scroll, in px. */
  maxScroll(): number;
}

/** What a Studio frame's playhead tells the driver builder: whether it owns a window, and its take. */
export interface DriverOwner {
  owns(win: Window): boolean;
  take(): Events;
}

/** The driver a page was handed, and the timeline length it runs over. */
export interface HandedDriver {
  readonly driver: ClockDriver;
  /** The timeline length in ms now; it follows the page's scroll height after each `refit`. */
  readonly length: number;
  /** Recomputes the length from the page's current scroll height and resizes the driver when it changed. */
  refit(): void;
}

const isScroll = (event: Events[number]): boolean => event.name === INPUT_EVENTS.scroll;

/** The page's scroll in px at `ms`: the take's last scroll sample at or before it, or a linear sweep when it has none. */
export function scrollAt(ms: number, take: Events, sweepMs: number, maxScroll: number): number {
  const samples = take.filter(isScroll);
  if (samples.length === 0)
    return sweepMs > 0 ? Math.min(maxScroll, Math.max(0, (ms / sweepMs) * maxScroll)) : 0;
  let last: Events[number] | undefined;
  for (const sample of samples)
    if (sample.at <= ms && (last === undefined || sample.at >= last.at)) last = sample;
  return last?.value ?? 0;
}

/** The timeline's length: the longest of the scene, the take's last event plus the settle, and the sweep. */
export function timelineLength(sceneMs: number, take: Events, sweepMs: number): number {
  const last = take.reduce((latest, event) => Math.max(latest, event.at), -Infinity);
  return Math.max(sceneMs, last === -Infinity ? 0 : last + SETTLE_MS, sweepMs);
}

/** A seekable driver over the timeline that scrolls `host` as it steps and hands the scene the take's inputs. */
export function studioDriver(options: {
  readonly host: ScrollHost;
  readonly length: number;
  readonly take: Events;
  readonly frames?: FrameSource;
}): HandedDriver {
  const { host, take } = options;
  const lengthNow = (): number =>
    timelineLength(options.length, take, host.maxScroll() / SWEEP_PX_PER_MS);
  let length = lengthNow();
  const clock = clockDriver({
    duration: length,
    autoplay: false,
    reducedMotion: "play",
    ...(options.frames === undefined ? {} : { frames: options.frames }),
  });
  const inputs = take.filter((event) => !isScroll(event));
  let last: number | undefined;
  clock.subscribe(() => {
    const elapsed = clock.now().clock;
    const ms = elapsed.kind === "timed" ? elapsed.elapsed : 0;
    if (ms === last) return;
    last = ms;
    host.scrollTo(0, scrollAt(ms, take, length, host.maxScroll()));
  });
  return {
    driver: { ...clock, events: () => inputs },
    get length() {
      return length;
    },
    refit() {
      const next = lengthNow();
      if (next === length) return;
      length = next;
      last = undefined;
      clock.setDuration(next);
    },
  };
}
