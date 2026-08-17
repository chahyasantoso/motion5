import { describe, expect, it, vi } from "vitest";
import { Motion } from "../../../src/domain/motion";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/ports/fakes";

describe("Motion compiled Track disposal ownership", () => {
  it("does not dispose resolver-owned Tracks when Motion is disposed", () => {
    // The resolver owner, not Motion, must dispose compiled Tracks. Otherwise the resolver's
    // single-owner contract is false and a shared Track can be killed by an unrelated Motion.
    const track = { setProgress: vi.fn(), dispose: vi.fn() };
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      tracks: [{ id: "arm" }],
      resolveTrack: () => track as never,
    });

    motion.dispose();

    expect(track.dispose).not.toHaveBeenCalled();
  });

  it("does not dispose the replacement returned by a resolver after a Motion swap", () => {
    // A resolver can rotate compiled instances independently. Motion teardown must not dispose
    // either instance because it does not own their lifetime.
    const first = { setProgress: vi.fn(), dispose: vi.fn() };
    const second = { setProgress: vi.fn(), dispose: vi.fn() };
    let current = first;
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      tracks: [{ id: "arm" }],
      resolveTrack: () => current as never,
    });

    current = second;
    motion.dispose();

    expect(first.dispose).not.toHaveBeenCalled();
    expect(second.dispose).not.toHaveBeenCalled();
  });
});
