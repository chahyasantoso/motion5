import { spawnSync } from "node:child_process";

const MAX_DECODE_BYTES = 128 * 1024 * 1024;

/** Decoded mono 48 kHz float32 audio samples. */
export interface DecodedAudio {
  readonly samples: Float32Array;
  readonly sampleRate: 48000;
}

/** Decodes an audio file to mono 48 kHz float32 samples via ffmpeg. */
export function decodeAudio(path: string): DecodedAudio {
  const result = spawnSync(
    "ffmpeg",
    ["-v", "error", "-i", path, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"],
    { maxBuffer: MAX_DECODE_BYTES },
  );
  if (result.error !== undefined) {
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    const stderr = result.stderr.toString("utf8").trim();
    throw new Error(stderr === "" ? `ffmpeg exited with status ${String(result.status)}` : stderr);
  }
  const stdout = result.stdout;
  const count = Math.floor(stdout.byteLength / 4);
  const samples = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    samples[i] = stdout.readFloatLE(i * 4);
  }
  return { samples, sampleRate: 48000 };
}
