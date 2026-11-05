import { describe, expect, it, vi } from "vitest";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler, createFakeInterpolator } from "../../../src/testing/fakes";
import { Motion } from "../../../src/domain/motion";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { LocalInput } from "../../../src/runtime/local-input";
import { PassthroughProcessor } from "../../../src/runtime/processors/passthrough";
import { Track } from "../../../src/runtime/track";

describe("idle and static track seeding", () => {
  it("does not invalidate tracks whose progress did not change", () => {
    const changed = new Set(["moving"]);
    const invalidate = vi.fn();
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      tracks: [{ id: "moving" }, { id: "idle" }],
      resolveTrack: (id) =>
        id === undefined
          ? undefined
          : {
              setProgress: (progress: number) => {
                void progress;
                return changed.has(id);
              },
              dispose: () => undefined,
            },
      invalidate,
    });

    motion.seek(0.5);

    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith(0.5, ["moving"]);
  });

  it("skips a time-invariant value track after its first composed progress", () => {
    const values = {
      kind: "record" as const,
      fields: { opacity: { kind: "static" as const, scalar: "number" as const, value: 1 } },
    };
    const interpolator = createFakeInterpolator();
    const localInput = new LocalInput(createValueEvaluator(values, interpolator));
    const processor = new PassthroughProcessor({
      nodeId: "~/static",
      values,
      interpolator,
    });
    const track = new Track("~/static", localInput, processor);

    expect(track.setProgress(0.5)).toBe(true);
    expect(track.setProgress(0.6)).toBe(false);
  });
});
