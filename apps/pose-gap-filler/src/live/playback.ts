import { writePoseResult } from "../filler/adapter";
import type { PoseRecording } from "../replay/recording";
import type { LandmarkSource } from "./source";

/** Browser frame loop and clock; injection lets a paced source run without either. */
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

/** Frames by index, what a paced source plays: `timeOf(i)` is frame `i`'s time or `undefined`
 * past the end; `resultOf(i)` builds a result only on emit. Times strictly increase. */
export interface FrameStream {
  /** Clears generation-local selection state before each start's first frame. */
  reset?(): void;
  timeOf(index: number): number | undefined;
  resultOf(index: number): unknown;
}

/** Paces every non-camera source: frame `i` emits on the first animation frame reaching
 * `timeOf(i) - timeOf(0)` after `start`, at most one per frame; `detectMs` is 0. */
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
      stream.reset?.();
      const first = stream.timeOf(0);
      if (first === undefined) return Promise.resolve();
      if (!Number.isFinite(first)) throw new Error("Stream timestamps must be finite.");
      const startedAt = ports.now();
      let index = 0;
      let frame = 0;
      let previous: number | undefined;
      const tick = () => {
        if (!live()) return;
        const tMs = stream.timeOf(index);
        if (tMs === undefined) {
          cancel = undefined;
          return;
        }
        if (!Number.isFinite(tMs) || (previous !== undefined && tMs <= previous)) {
          stop();
          throw new Error("Stream timestamps must be finite and strictly increasing.");
        }
        if (ports.now() - startedAt >= tMs - first) {
          try {
            onSample({ result: stream.resultOf(index), tMs, detectMs: 0 });
          } catch (error) {
            if (live()) stop();
            throw error;
          }
          if (!live()) return;
          previous = tMs;
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
  /** Restarts at the first frame after the last, one loop period later. */
  readonly loop: boolean;
}

const SINGLE_FRAME_MS = 1000 / 30;

/** Time from first frame to next lap's first: span plus one mean frame interval, so a take
 * of `n` frames at a fixed rate loops every `n` intervals exactly. */
export function loopPeriod(recording: PoseRecording): number {
  const { frames } = recording;
  const count = frames.length;
  if (count === 0) throw new Error("Playback needs a recording with at least one frame.");
  for (let index = 0; index < count; index += 1) {
    const tMs = frames[index]!.tMs;
    if (!Number.isFinite(tMs) || (index > 0 && tMs <= frames[index - 1]!.tMs))
      throw new Error("Playback timestamps must be finite and strictly increasing.");
  }
  if (count === 1) return SINGLE_FRAME_MS;
  const period = ((frames[count - 1]!.tMs - frames[0]!.tMs) * count) / (count - 1);
  if (!Number.isFinite(period)) throw new Error("Playback period must be finite.");
  return period;
}

/** A recording played as a live source, so the live page exercises the whole pipeline with no
 * MediaPipe or camera. Sample `tMs` is recorded time plus one `loopPeriod` per lap. */
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
