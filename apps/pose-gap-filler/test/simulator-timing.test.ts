import { describe, expect, it } from "vitest";
import { actorFrame, actorPose, hipMidpoint } from "../src/synthetic/actor";
import { defaultCameraSpec } from "../src/synthetic/camera";
import { CORRUPTION_PRESETS, NO_CORRUPTION } from "../src/synthetic/corruption";
import { createPacedSource, createPlaybackSource, loopPeriod } from "../src/live/playback";
import { createSimulatorSource } from "../src/live/sources";
import type { SourceSample } from "../src/live/source";
import { createSimulator, reportResult, SIMULATOR_FRAME_MS } from "../src/synthetic/simulator";
import { SCENARIOS } from "../src/synthetic/scenarios";
import { landmarkInfo } from "../src/synthetic/inspect";
import { createSyntheticRecording, SYNTHETIC_TAKES } from "../src/replay/synthetic";
import { drawActor, GEOMETRY_COLOURS, projector, TRUTH_STYLE } from "../src/view/scene-view";
import { manualFrames } from "./frame-ports";

const STAGE = { width: 640, height: 480 };
const camera = defaultCameraSpec(STAGE, hipMidpoint(actorFrame(actorPose())));
const create = () =>
  createSimulator({ drive: { kind: "scenario", scenario: "arm-reversal" }, camera });

describe("#540 simulator delivery and geometry diagnostics", () => {
  it("GF-117 samples camera truth at capture time and reports delivery time, skipping drops", () => {
    const simulator = create();
    simulator.observeWith({ corruption: CORRUPTION_PRESETS.harsh });
    const expected: { k: number; tMs: number; result: unknown }[] = [];
    for (let k = 0; expected.length < 40; k += 1) {
      const timing = simulator.timing(k);
      if (timing.kind === "captured")
        expected.push({
          k,
          tMs: timing.tMs,
          result: reportResult(simulator.frame(k * SIMULATOR_FRAME_MS).report),
        });
    }
    const frames = manualFrames();
    const samples: SourceSample[] = [];
    const source = createSimulatorSource(simulator, frames.ports);
    void source.start((sample) => samples.push(sample));
    frames.advance(10000);
    for (let index = 0; index < expected.length; index += 1) {
      frames.frame();
      expect(samples[index]!.tMs).toBe(expected[index]!.tMs);
      expect(samples[index]!.result).toEqual(expected[index]!.result);
    }
    expect(expected.some((frame, index) => index > 0 && frame.k > expected[index - 1]!.k + 1)).toBe(
      true,
    );
    source.stop();
    expect(frames.pending).toBe(0);
  });

  it("GF-118 recomputes the first camera frame on restart even after exactly one output", () => {
    const simulator = create();
    const frames = manualFrames();
    const source = createSimulatorSource(simulator, frames.ports);
    const samples: SourceSample[] = [];
    simulator.observeWith({ corruption: { ...NO_CORRUPTION, seed: 4, dropRate: 0.5 } });
    void source.start((sample) => samples.push(sample));
    frames.frame();
    expect(samples).toHaveLength(1);
    source.stop();
    simulator.observeWith({ corruption: { ...NO_CORRUPTION, seed: 0, dropRate: 0.5 } });
    let k = 0;
    while (simulator.timing(k).kind === "dropped") k += 1;
    const timing = simulator.timing(k);
    if (timing.kind !== "captured") throw new Error("Fixture needs a captured frame.");
    const expected = reportResult(simulator.frame(k * SIMULATOR_FRAME_MS).report);
    void source.start((sample) => samples.push(sample));
    frames.frame();
    expect(samples[1]!.tMs).toBe(timing.tMs);
    expect(samples[1]!.result).toEqual(expected);
    source.stop();
  });

  it("GF-119 preserves scripted-loss boundary membership at camera time despite delivery lateness", () => {
    const simulator = createSimulator({
      drive: { kind: "scenario", scenario: "full-loss" },
      camera,
      corruption: { ...NO_CORRUPTION, seed: 123, timingJitterMs: 25 },
    });
    const scenario = SCENARIOS["full-loss"];
    expect(scenario.losses[0]!.kind).toBe("pose");
    const frames = manualFrames();
    const source = createSimulatorSource(simulator, frames.ports);
    const samples: SourceSample[] = [];
    void source.start((sample) => samples.push(sample));
    frames.advance(10000);
    for (let k = 0; k < 120; k += 1) {
      frames.frame();
      expect(samples[k]!.result).toEqual(
        reportResult(simulator.frame(k * SIMULATOR_FRAME_MS).report),
      );
    }
    source.stop();
  });

  it("GF-120 rejects malformed playback times and stops a nonmonotonic stream before emitting it", () => {
    const recording = createSyntheticRecording({ ...SYNTHETIC_TAKES.still, durationMs: 100 });
    for (const bad of [NaN, Infinity, -Infinity, recording.frames[0]!.tMs]) {
      const invalid = {
        ...recording,
        frames: [recording.frames[0]!, { ...recording.frames[1]!, tMs: bad }],
      };
      expect(() => loopPeriod(invalid)).toThrow();
      expect(() => createPlaybackSource(invalid, { loop: true })).toThrow();
    }
    const frames = manualFrames();
    const samples: SourceSample[] = [];
    const source = createPacedSource({ timeOf: () => 0, resultOf: () => ({}) }, frames.ports);
    void source.start((sample) => samples.push(sample));
    frames.frame();
    expect(() => frames.frame()).toThrow(/strictly increasing/);
    expect(samples).toHaveLength(1);
    expect(frames.pending).toBe(0);
  });

  it("GF-121 draws geometry colours independently of scores and names the blocker in inspection", () => {
    const simulator = create();
    simulator.drive({ kind: "manual", pose: actorPose() });
    simulator.edit({ kind: "score", landmark: 15, visibility: 1, presence: 0 });
    const frame = simulator.frame(0);
    const colours: string[] = [];
    const context = {
      fillStyle: "",
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
      arc() {},
      fill() {
        colours.push(this.fillStyle);
      },
    };
    drawActor(
      context as unknown as CanvasRenderingContext2D,
      frame.truth,
      projector(frame.camera),
      TRUTH_STYLE,
      frame.observed.map((landmark) => landmark.geometry),
    );
    expect(colours).toEqual(
      frame.observed.map((landmark) => GEOMETRY_COLOURS[landmark.geometry.kind]),
    );
    const wrist = frame.observed[15]!;
    expect(wrist.geometry.kind).toBe("occluded");
    expect(landmarkInfo(frame, 15).join("\n")).toContain("geometry occluded by");
    expect(landmarkInfo(frame, 15).join("\n")).toContain("visibility 1.00");
  });
});
