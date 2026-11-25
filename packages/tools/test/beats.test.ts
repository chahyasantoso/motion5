import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseBeatsArgs, runBeats } from "../src/audio/beats";
import type { Cue } from "../src/audio/levels";

const hasFfmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
const SAMPLE_RATE = 48_000;

function writeMonoWav(path: string, samples: Float32Array, sampleRate: number): void {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i] ?? 0));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  writeFileSync(path, buffer);
}

describe("parseBeatsArgs", () => {
  it("parses valid arguments and defaults", () => {
    const parsed = parseBeatsArgs(["voice.wav"]);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") {
      expect(parsed.audio).toMatch(/voice\.wav$/);
      expect(parsed.threshold).toBe(1.5);
      expect(parsed.out).toBeUndefined();
      expect(parsed.levels).toBeUndefined();
    }

    const full = parseBeatsArgs([
      "voice.wav",
      "--out",
      "out.cues.json",
      "--threshold",
      "2.2",
      "--levels",
      "mouth-open@50",
    ]);
    expect(full.kind).toBe("ok");
    if (full.kind === "ok") {
      expect(full.out).toMatch(/out\.cues\.json$/);
      expect(full.threshold).toBe(2.2);
      expect(full.levels).toEqual({ name: "mouth-open", everyMs: 50 });
    }
  });

  it("returns usage on missing, extra, unknown, or malformed arguments", () => {
    expect(parseBeatsArgs([]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "b.wav"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--unknown", "1"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--out"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--threshold", "0"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--threshold", "-1"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--threshold", "abc"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--levels", "mouth"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--levels", "1bad@100"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--levels", "mouth@0"]).kind).toBe("usage");
    expect(parseBeatsArgs(["a.wav", "--levels", "mouth@12.5"]).kind).toBe("usage");
  });
});

describe.skipIf(!hasFfmpeg)("runBeats end-to-end", () => {
  it("decodes a WAV click track and writes beat and level cues JSON", () => {
    const dir = mkdtempSync(join(tmpdir(), "beats-"));
    try {
      const wavPath = join(dir, "clicks.wav");
      const clicks = [250, 750, 1250, 1750];
      const totalSamples = SAMPLE_RATE * 2;
      const samples = new Float32Array(totalSamples);
      const burstSamples = Math.round((10 * SAMPLE_RATE) / 1000);
      for (const startMs of clicks) {
        const startSample = Math.round((startMs * SAMPLE_RATE) / 1000);
        for (let i = 0; i < burstSamples; i += 1) {
          samples[startSample + i] = 0.8 * Math.sin((2 * Math.PI * 1000 * i) / SAMPLE_RATE);
        }
      }
      writeMonoWav(wavPath, samples, SAMPLE_RATE);

      const parsed = parseBeatsArgs([wavPath, "--levels", "mouth@100"]);
      expect(parsed.kind).toBe("ok");
      if (parsed.kind !== "ok") return;

      const result = runBeats(parsed);
      expect(result.kind).toBe("beats");
      if (result.kind !== "beats") return;

      expect(result.path).toBe(join(dir, "clicks.cues.json"));
      expect(result.beats).toBe(4);
      expect(result.levels).toBe(20);

      const written: readonly Cue[] = JSON.parse(readFileSync(result.path, "utf8"));
      const beats = written.filter((c) => c.name === "beat");
      const levels = written.filter((c) => c.name === "mouth");
      expect(beats).toHaveLength(4);
      expect(levels).toHaveLength(20);
      for (let i = 0; i < clicks.length; i += 1) {
        expect(Math.abs((beats[i]?.at ?? -999) - clicks[i]!)).toBeLessThanOrEqual(10);
      }
      expect(levels.map((c) => c.at)).toEqual(Array.from({ length: 20 }, (_, i) => i * 100));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
