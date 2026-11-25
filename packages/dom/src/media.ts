import type { Window } from "@gerak/stage";

/** Minimum seek delta in seconds when paused or held. */
export const SEEK_EPSILON_S = 0.0005;
/** Maximum playhead drift in seconds before re-seeking during forward playback. */
export const DRIFT_TOLERANCE_S = 1 / 30;
/** Maximum delta in ms between target advance and real time to treat as forward playback. */
export const FORWARD_TOLERANCE_MS = 50;

/** Inputs for one media element's per-frame playback and seek decision. */
export interface MediaStepInput {
  readonly held: boolean;
  readonly visible: boolean;
  readonly target: number;
  readonly previousTarget: number | undefined;
  readonly realDt: number;
  readonly currentTime: number;
  readonly paused: boolean;
}

/** Desired playback state after applying any seek. */
export type MediaPlayback = "play" | "pause" | "keep";

/** Per-frame action for a media element: optional seek in seconds and playback change. */
export interface MediaStep {
  readonly seek?: number;
  readonly playback: MediaPlayback;
}

/** Decides whether a media element should seek, play, or pause on the current frame. */
export function mediaStep(input: MediaStepInput): MediaStep {
  const { held, visible, target, previousTarget, realDt, currentTime, paused } = input;
  const pauseIfPlaying: MediaPlayback = paused ? "keep" : "pause";
  if (!visible) return { playback: pauseIfPlaying };
  if (held) {
    return Math.abs(currentTime - target) > SEEK_EPSILON_S
      ? { seek: target, playback: pauseIfPlaying }
      : { playback: pauseIfPlaying };
  }
  const playingForward =
    previousTarget !== undefined &&
    target > previousTarget &&
    Math.abs((target - previousTarget) * 1000 - realDt) <= FORWARD_TOLERANCE_MS;
  if (playingForward) {
    if (paused) return { seek: target, playback: "play" };
    return Math.abs(currentTime - target) > DRIFT_TOLERANCE_S
      ? { seek: target, playback: "keep" }
      : { playback: "keep" };
  }
  return Math.abs(currentTime - target) > SEEK_EPSILON_S
    ? { seek: target, playback: pauseIfPlaying }
    : { playback: pauseIfPlaying };
}

/** Earliest start and latest end in ms across a member's show windows, falling back to `[0, durationMs]`. */
export function mediaBounds(
  windows: readonly Window[] | undefined,
  durationMs: number,
): { readonly from: number; readonly to: number } {
  if (windows === undefined || windows.length === 0) return { from: 0, to: durationMs };
  let from = Infinity;
  let maxEnd = -Infinity;
  for (const [start, end] of windows) {
    if (start < from) from = start;
    if (end > maxEnd) maxEnd = end;
  }
  return {
    from: Number.isFinite(from) ? from : 0,
    to: Number.isFinite(maxEnd) ? maxEnd : durationMs,
  };
}

/** Resolves once `node` has `readyState >= 2` and `seeking === false`, or when `onDispose` triggers. */
export function waitForMedia(
  node: HTMLMediaElement,
  onDispose: (listener: () => void) => () => void,
): Promise<void> {
  if (node.readyState >= 2 && !node.seeking) return Promise.resolve();
  return new Promise<void>((resolve) => {
    let stopDispose = (): void => undefined;
    const cleanup = (): void => {
      node.removeEventListener("loadeddata", checkDone);
      node.removeEventListener("seeked", checkDone);
      stopDispose();
    };
    const checkDone = (): void => {
      if (node.readyState >= 2 && !node.seeking) {
        cleanup();
        resolve();
      }
    };
    node.addEventListener("loadeddata", checkDone);
    node.addEventListener("seeked", checkDone);
    stopDispose = onDispose(() => {
      cleanup();
      resolve();
    });
    checkDone();
  });
}
