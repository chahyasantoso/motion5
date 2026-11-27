const MIN_BEAT_RISE = 0.02;
const BEAT_HOP_MS = 5;
const BEAT_WINDOW_MS = 20;
const HISTORY_WINDOWS = 40;
const REFRACTORY_WINDOWS = 20;

/** A single cue entry emitted from audio analysis, with `at` in ms. */
export interface Cue {
  readonly kind: "value" | "trigger";
  readonly name: string;
  readonly at: number;
  readonly value: number;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/** Root-mean-square of `samples[from..to)`, returning 0 for an empty range. */
export function rms(samples: ArrayLike<number>, from = 0, to = samples.length): number {
  const start = Math.max(0, from);
  const end = Math.min(samples.length, to);
  if (end <= start) return 0;
  let sum = 0;
  for (let i = start; i < end; i += 1) {
    const sample = samples[i] ?? 0;
    sum += sample * sample;
  }
  return Math.sqrt(sum / (end - start));
}

/** A microphone's level from its root-mean-square: 0 at or under the floor, rising with the gain, at most 1. */
export function levelOf(rmsValue: number, floor = 0.02, gain = 6): number {
  if (!(rmsValue > floor)) return 0;
  return Math.min(1, (rmsValue - floor) * gain);
}

/** Samples `levelOf(rms(window))` every `everyMs` across `samples`, including a partial trailing window. */
export function levelCues(
  samples: ArrayLike<number>,
  sampleRate: number,
  everyMs: number,
  name: string,
): readonly Cue[] {
  const cues: Cue[] = [];
  for (let windowIndex = 0; ; windowIndex += 1) {
    const at = windowIndex * everyMs;
    const from = Math.round((at * sampleRate) / 1000);
    if (from >= samples.length) break;
    const to = Math.min(samples.length, Math.round(((at + everyMs) * sampleRate) / 1000));
    cues.push({
      kind: "value",
      name,
      at,
      value: round3(levelOf(rms(samples, from, to))),
    });
  }
  return cues;
}

/** Detects energy onsets over 20 ms windows stepped by 5 ms hops with a 100 ms refractory period. */
export function beatCues(
  samples: ArrayLike<number>,
  sampleRate: number,
  threshold = 1.5,
): readonly Cue[] {
  const energies: number[] = [];
  const cues: Cue[] = [];
  let lastOnset = Number.NEGATIVE_INFINITY;
  for (let i = 0; ; i += 1) {
    const hopFrom = Math.round((i * BEAT_HOP_MS * sampleRate) / 1000);
    if (hopFrom >= samples.length) break;
    const endMs = (i + 1) * BEAT_HOP_MS;
    const from = Math.round((Math.max(0, endMs - BEAT_WINDOW_MS) * sampleRate) / 1000);
    const to = Math.min(samples.length, Math.round((endMs * sampleRate) / 1000));
    const energy = rms(samples, from, to);
    energies.push(energy);

    const historyStart = Math.max(0, i - HISTORY_WINDOWS);
    const historyCount = i - historyStart;
    let historySum = 0;
    for (let j = historyStart; j < i; j += 1) {
      historySum += energies[j] ?? 0;
    }
    const mean = historyCount > 0 ? historySum / historyCount : 0;

    if (
      energy - mean > MIN_BEAT_RISE &&
      energy > threshold * mean &&
      i - lastOnset >= REFRACTORY_WINDOWS
    ) {
      cues.push({
        kind: "trigger",
        name: "beat",
        at: i * BEAT_HOP_MS,
        value: round3(energy),
      });
      lastOnset = i;
    }
  }
  return cues;
}
