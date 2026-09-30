import type { StageSize } from "../filler/adapter";
import {
  RECORDING_FORMAT,
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
      frames?.push(recordResult(result, tMs));
    },
    stop() {
      const take: PoseRecording = {
        format: RECORDING_FORMAT,
        version: 1,
        stage: { width: stage.width, height: stage.height },
        frames: frames ?? [],
      };
      frames = undefined;
      return take;
    },
  };
}
