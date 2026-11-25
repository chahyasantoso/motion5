import { describe, expect, it } from "vitest";
import { beatCues, levelCues, levelOf, rms } from "../src/audio/levels";

const SAMPLE_RATE = 48_000;

function makeClickTrack(durationMs: number, clickStartsMs: readonly number[]): Float32Array {
  const totalSamples = Math.round((durationMs * SAMPLE_RATE) / 1000);
  const samples = new Float32Array(totalSamples);
  const burstSamples = Math.round((10 * SAMPLE_RATE) / 1000);
  for (const startMs of clickStartsMs) {
    const startSample = Math.round((startMs * SAMPLE_RATE) / 1000);
    for (let i = 0; i < burstSamples && startSample + i < totalSamples; i += 1) {
      samples[startSample + i] = 0.8 * Math.sin((2 * Math.PI * 1000 * i) / SAMPLE_RATE);
    }
  }
  return samples;
}

describe("rms", () => {
  it("returns 0.5 for a constant 0.5 buffer and 0 for an empty range", () => {
    const buffer = new Float32Array(100).fill(0.5);
    expect(rms(buffer)).toBeCloseTo(0.5, 6);
    expect(rms(buffer, 10, 10)).toBe(0);
    expect(rms(buffer, 20, 10)).toBe(0);
    expect(rms([])).toBe(0);
  });
});

describe("levelOf", () => {
  it("is 0 at and under the floor, rises with the gain, and stops at 1", () => {
    expect(levelOf(0.02)).toBe(0);
    expect(levelOf(0.01)).toBe(0);
    expect(levelOf(0)).toBe(0);
    expect(levelOf(0.07)).toBeCloseTo(0.3, 10);
    expect(levelOf(0.5)).toBe(1);
    expect(levelOf(0.1, 0.1, 6)).toBe(0);
    expect(levelOf(0.2, 0.1, 5)).toBeCloseTo(0.5, 10);
  });
});

describe("levelCues", () => {
  it("emits one cue per window including a partial last window and matches levelOf(rms(window))", () => {
    const samples = new Float32Array(SAMPLE_RATE * 0.25);
    samples.fill(0.1, 0, SAMPLE_RATE * 0.1);
    samples.fill(0.01, SAMPLE_RATE * 0.1, SAMPLE_RATE * 0.2);
    samples.fill(0.25, SAMPLE_RATE * 0.2);

    const cues = levelCues(samples, SAMPLE_RATE, 100, "mouthOpen");
    expect(cues).toHaveLength(3);
    expect(cues.map((c) => c.at)).toEqual([0, 100, 200]);
    expect(cues.every((c) => c.name === "mouthOpen")).toBe(true);

    const windows: readonly [number, number][] = [
      [0, SAMPLE_RATE * 0.1],
      [SAMPLE_RATE * 0.1, SAMPLE_RATE * 0.2],
      [SAMPLE_RATE * 0.2, samples.length],
    ];
    for (let i = 0; i < windows.length; i += 1) {
      const [from, to] = windows[i]!;
      const expected = Math.round(levelOf(rms(samples, from, to)) * 1000) / 1000;
      expect(cues[i]?.value).toBe(expected);
    }
  });
});

describe("beatCues", () => {
  it("detects 4 clicks on a 48 kHz synthetic click track within 10 ms", () => {
    const clicks = [250, 750, 1250, 1750];
    const samples = makeClickTrack(2000, clicks);
    const cues = beatCues(samples, SAMPLE_RATE);
    expect(cues).toHaveLength(4);
    for (let i = 0; i < clicks.length; i += 1) {
      expect(cues[i]?.name).toBe("beat");
      expect(Math.abs((cues[i]?.at ?? -999) - clicks[i]!)).toBeLessThanOrEqual(10);
    }
  });

  it("returns no beats for pure silence", () => {
    const silence = new Float32Array(SAMPLE_RATE);
    expect(beatCues(silence, SAMPLE_RATE)).toEqual([]);
  });

  it("merges two clicks 50 ms apart into one beat", () => {
    const samples = makeClickTrack(1000, [250, 300]);
    const cues = beatCues(samples, SAMPLE_RATE);
    expect(cues).toHaveLength(1);
    expect(Math.abs((cues[0]?.at ?? -999) - 250)).toBeLessThanOrEqual(10);
  });

  it("ignores a steady low chord pad and detects only the 8 kicks", () => {
    const durationMs = 4000;
    const totalSamples = Math.round((durationMs * SAMPLE_RATE) / 1000);
    const samples = new Float32Array(totalSamples);
    const padFreqs = [146.83, 220, 293.66];
    for (let s = 0; s < totalSamples; s += 1) {
      const t = s / SAMPLE_RATE;
      let pad = 0;
      for (const freq of padFreqs) {
        pad += 0.08 * Math.sin(2 * Math.PI * freq * t);
      }
      samples[s] = pad;
    }

    const kicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500];
    const kickSamples = Math.round((200 * SAMPLE_RATE) / 1000);
    for (const startMs of kicks) {
      const startSample = Math.round((startMs * SAMPLE_RATE) / 1000);
      for (let i = 0; i < kickSamples && startSample + i < totalSamples; i += 1) {
        const t = i / SAMPLE_RATE;
        samples[startSample + i] =
          (samples[startSample + i] ?? 0) +
          0.8 * Math.exp(-30 * t) * Math.sin(2 * Math.PI * 60 * t);
      }
    }

    const cues = beatCues(samples, SAMPLE_RATE);
    expect(cues).toHaveLength(8);
    for (let i = 0; i < kicks.length; i += 1) {
      expect(cues[i]?.name).toBe("beat");
      expect(Math.abs((cues[i]?.at ?? -999) - kicks[i]!)).toBeLessThanOrEqual(10);
    }
  });
});
