import type { StageSize } from "../filler/adapter";
import {
  RECORDING_FORMAT,
  RECORDING_VERSION,
  recordResult,
  type PoseRecording,
  type RecordedFrame,
} from "../replay/recording";

export interface Recorder {
  readonly recording: boolean;
  start(): void;
  /** Keeps one live result while recording; a no-op otherwise. */
  keep(result: unknown, tMs: number): void;
  /** Ends the take and returns it, landmarks only. */
  stop(): PoseRecording;
}

export function createRecorder(stage: StageSize): Recorder {
  let frames: RecordedFrame[] | undefined;
  return {
    get recording() {
      return frames !== undefined;
    },
    start() {
      frames = [];
    },
    keep(result, tMs) {
      if (frames === undefined) return;
      const frame = recordResult(result, tMs);
      if (frames.length > 0 && tMs <= frames.at(-1)!.tMs)
        throw new Error("Recording timestamps must be strictly increasing.");
      frames.push(frame);
    },
    stop() {
      const take: PoseRecording = {
        format: RECORDING_FORMAT,
        version: RECORDING_VERSION,
        stage: { width: stage.width, height: stage.height },
        frames: frames ?? [],
      };
      frames = undefined;
      return take;
    },
  };
}
