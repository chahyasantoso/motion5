import { writePoseResult } from "../filler/adapter";
import type { PoseRecording } from "../replay/recording";
import type { LandmarkSource } from "./source";

/** The browser's frame loop and clock, injected so a paced source is tested without either. */
export interface FramePorts {
  requestFrame(callback: () => void): number;
  cancelFrame(id: number): void;
  now(): number;
}

export const BROWSER_FRAMES: FramePorts = {
  requestFrame: (callback) => requestAnimationFrame(callback),
  cancelFrame: (id) => cancelAnimationFrame(id),
  now: () => performance.now(),
};

/**
 * A stream of frames by index, what a paced source plays: `timeOf(i)` is frame `i`'s time, or
 * `undefined` past the end, and `resultOf(i)` builds its result only when it is emitted. Times must
 * strictly increase with the index.
 */
export interface FrameStream {
  timeOf(index: number): number | undefined;
  resultOf(index: number): unknown;
}

/**
 * The one pacing loop every non-camera source shares. Frame `i` is emitted on the first animation
 * frame at least `timeOf(i) - timeOf(0)` after `start`, and at most one frame per animation frame,
 * so a slow device plays slower instead of skipping, and the emitted sequence is exactly the
 * stream's. `detectMs` is 0: nothing was detected.
 *
 * Every start is a generation, as for the webcam source: `stop` ends it, and a consumer that stops
 * the source from inside `onSample` gets no further frame. A throw from `onSample` stops the source
 * and propagates, so a broken consumer is never fed again.
 */
export function createPacedSource(
  stream: FrameStream,
  ports: FramePorts = BROWSER_FRAMES,
): LandmarkSource {
  let generation = 0;
  let cancel: (() => void) | undefined;
  const stop = () => {
    generation += 1;
    cancel?.();
    cancel = undefined;
  };
  return {
    start(onSample) {
      stop();
      const current = generation;
      const live = () => current === generation;
      const first = stream.timeOf(0);
      if (first === undefined) return Promise.resolve();
      const startedAt = ports.now();
      let index = 0;
      let frame = 0;
      const tick = () => {
        if (!live()) return;
        const tMs = stream.timeOf(index);
        if (tMs === undefined) {
          cancel = undefined;
          return;
        }
        if (ports.now() - startedAt >= tMs - first) {
          try {
            onSample({ result: stream.resultOf(index), tMs, detectMs: 0 });
          } catch (error) {
            if (live()) stop();
            throw error;
          }
          if (!live()) return;
          index += 1;
        }
        frame = ports.requestFrame(tick);
      };
      frame = ports.requestFrame(tick);
      cancel = () => ports.cancelFrame(frame);
      return Promise.resolve();
    },
    stop,
  };
}

export interface PlaybackOptions {
  /** Starts again at the first frame after the last, the take's own period later. */
  readonly loop: boolean;
}

/** The interval a single-frame recording repeats at: one 30 fps frame. */
const SINGLE_FRAME_MS = 1000 / 30;

/**
 * The time from a take's first frame to the first frame of its next lap: its span plus one mean
 * frame interval, so a take of `n` frames at a fixed rate loops every `n` intervals exactly.
 */
export function loopPeriod(recording: PoseRecording): number {
  const { frames } = recording;
  const count = frames.length;
  if (count === 0) throw new Error("Playback needs a recording with at least one frame.");
  if (count === 1) return SINGLE_FRAME_MS;
  return ((frames[count - 1]!.tMs - frames[0]!.tMs) * count) / (count - 1);
}

/**
 * A recording played as a live source: what the live page runs for a committed synthetic take, so
 * it exercises the whole pipeline with no MediaPipe download and no camera prompt. Each sample's
 * `tMs` is the recorded time plus one `loopPeriod` per completed lap, so time only increases across
 * a loop, and the sequence is the one replay steps through.
 */
export function createPlaybackSource(
  recording: PoseRecording,
  options: PlaybackOptions,
  ports: FramePorts = BROWSER_FRAMES,
): LandmarkSource {
  const period = loopPeriod(recording);
  const { frames } = recording;
  const lapOf = (index: number) => Math.floor(index / frames.length);
  const ended = (index: number) => !options.loop && index >= frames.length;
  return createPacedSource(
    {
      timeOf: (index) =>
        ended(index) ? undefined : frames[index % frames.length]!.tMs + lapOf(index) * period,
      resultOf: (index) => {
        const recorded = frames[index % frames.length]!;
        return writePoseResult(recorded.image, recorded.world);
      },
    },
    ports,
  );
}
