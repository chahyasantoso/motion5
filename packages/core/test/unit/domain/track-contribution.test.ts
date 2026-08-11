import { describe, expect, it, vi } from "vitest";
import { Track } from "../../../src/domain/track";

describe("Track prepare-stage plugin contribution (B1)", () => {
  it("merges contribution into interpolation config before timeline creation, once", () => {
    const create = vi.fn((config: unknown) => ({
      duration: 1,
      state: { x: 1, y: 2 },
      progress: () => 0,
      kill: vi.fn(),
      config,
    }));
    const contribute = vi.fn(() => ({ y: 2 }));
    const track = new Track({
      interpolator: { create },
      interpolationConfig: { keyframes: { x: 1 } },
      plugins: {
        plugins: [
          {
            name: "prepare-y",
            stage: "prepare",
            contribute,
            compose: (values) => values,
          },
        ],
        diagnostics: [],
      },
    });

    expect(contribute).toHaveBeenCalledTimes(1);
    expect(contribute).toHaveBeenCalledWith({ x: 1 });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({ keyframes: { x: 1, y: 2 } });

    track.compose();
    track.compose();
    expect(contribute).toHaveBeenCalledTimes(1);
  });
});
