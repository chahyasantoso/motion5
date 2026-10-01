import { describe, expect, it } from "vitest";
import { DEFAULT_KALMAN_NOISE } from "../src/filler/chain-kalman";
import { IMAGE_SPACE, WORLD_SPACE } from "../src/filler/space";
import { COMPARED_FILLERS, DEFAULT_MASKS, compareFillers } from "../src/replay/compare";
import { runReplay } from "../src/replay/replay";
import { createSyntheticRecording } from "../src/replay/synthetic";
import { createImageRigSolver } from "../src/rig/solver";
import { fakePorts } from "./engine";

const exercise = createSyntheticRecording({
  motion: { kind: "exercise" },
  seed: 11,
  durationMs: 6000,
  fps: 30,
});

describe("chain comparison in the shared Engine-backed harness", () => {
  it("GF-40 compares raw, hold and chain on fresh rigs and exposes finite measured metrics", () => {
    let created = 0;
    let disposed = 0;
    const options = {
      recording: exercise,
      space: IMAGE_SPACE,
      fillers: COMPARED_FILLERS,
      masks: DEFAULT_MASKS,
      createSolver: () => {
        created += 1;
        const solver = createImageRigSolver(fakePorts());
        return {
          ...solver,
          dispose() {
            disposed += 1;
            solver.dispose();
          },
        };
      },
    };
    const rows = compareFillers(options);
    expect(rows.map((row) => row.filler)).toEqual(["raw", "hold", "chain-kalman"]);
    expect(created).toBe(3);
    expect(disposed).toBe(3);
    for (const row of rows) {
      expect(row.metrics.positionError.count).toBeGreaterThan(0);
      expect(row.metrics.positionError.mean).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(row.metrics.jitter.mean)).toBe(true);
      expect(Number.isFinite(row.metrics.lagMs)).toBe(true);
    }
    expect(compareFillers(options)).toEqual(rows);
    expect(() => compareFillers({ ...options, space: WORLD_SPACE })).toThrow(/image space only/);
    expect(created).toBe(disposed);
  });

  it("GF-41 does not show stale rig solves after chain coast expires", () => {
    const solver = createImageRigSolver(fakePorts());
    try {
      const frames = runReplay({
        recording: exercise,
        space: IMAGE_SPACE,
        filler: { kind: "chain-kalman", noise: DEFAULT_KALMAN_NOISE, coastMs: 100 },
        masks: [{ kind: "span", joints: ["left-elbow", "left-wrist"], from: 30, to: 50 }],
        solver,
      });
      expect(frames[30]!.solved!.has("left-wrist")).toBe(true);
      expect(frames[40]!.solved!.has("left-wrist")).toBe(false);
      expect(frames[40]!.presented["left-wrist"]).toBeUndefined();
      expect(frames[50]!.solved!.has("left-wrist")).toBe(true);
    } finally {
      solver.dispose();
    }
  });
});
