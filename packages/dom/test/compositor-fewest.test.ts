import { seeded } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { TRACK_TOLERANCE, fewest, type TrackSample } from "../src/compositor";

const FIELDS = ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const;
const FIT = 0.8;

function missAt(a: TrackSample, b: TrackSample, mid: TrackSample): number {
  const at = b.at === a.at ? 0 : (mid.at - a.at) / (b.at - a.at);
  let worst = 0;
  for (const field of FIELDS) {
    const line = a.fields[field] + (b.fields[field] - a.fields[field]) * at;
    worst = Math.max(worst, Math.abs(line - mid.fields[field]) / TRACK_TOLERANCE[field]);
  }
  return worst;
}

/** The greedy reduction checked against every sample under each candidate line. */
function reference(samples: readonly TrackSample[], pinned: ReadonlySet<number>): number[] {
  const first = samples[0];
  if (first === undefined) return [];
  const kept = [first.at];
  let from = 0;
  while (from < samples.length - 1) {
    let to = from + 1;
    for (
      let next = to + 1;
      next < samples.length && !pinned.has(samples[to]?.at ?? NaN);
      next += 1
    ) {
      const a = samples[from];
      const b = samples[next];
      if (a === undefined || b === undefined) break;
      let fits = true;
      for (let k = from + 1; k < next && fits; k += 1) {
        const mid = samples[k];
        if (mid !== undefined && missAt(a, b, mid) > FIT) fits = false;
      }
      if (!fits) break;
      to = next;
    }
    kept.push(samples[to]?.at ?? NaN);
    from = to;
  }
  return kept;
}

function track(seed: number, length: number): TrackSample[] {
  const rand = seeded(seed);
  const knots = Array.from({ length: 6 }, () => rand() * 200 - 100);
  const out: TrackSample[] = [];
  for (let i = 0; i < length; i += 1) {
    const u = i / (length - 1);
    const k = Math.min(knots.length - 2, Math.floor(u * (knots.length - 1)));
    const local = u * (knots.length - 1) - k;
    const smooth = (knots[k] ?? 0) + ((knots[k + 1] ?? 0) - (knots[k] ?? 0)) * local * local;
    out.push({
      at: i * 16,
      fields: {
        x: smooth,
        y: rand() < 0.1 ? smooth * 0.5 : smooth * 0.3,
        rotation: 0,
        scale: 1 + u * 0.2,
        scaleX: 1,
        scaleY: 1,
        opacity: Math.min(1, u * 3),
      },
    });
  }
  return out;
}

describe("fewest", () => {
  it("keeps the same samples as checking every sample under each line", () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const samples = track(seed, 20 + (seed % 80));
      const pinned = new Set(seed % 3 === 0 ? [samples[7]?.at ?? 0] : []);
      expect(fewest(samples, pinned).map((sample) => sample.at)).toEqual(
        reference(samples, pinned),
      );
    }
  });

  it("reduces a long straight run to its ends", () => {
    const samples: TrackSample[] = Array.from({ length: 5000 }, (_, i) => ({
      at: i,
      fields: { x: i * 0.5, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1 },
    }));
    expect(fewest(samples, new Set()).map((sample) => sample.at)).toEqual([0, 4999]);
  });
});
