import { describe, expect, it } from "vitest";
import { LANDMARKS, partnerIndex } from "../src/body/attachments";
import { actorFrame, actorPose, hipMidpoint } from "../src/synthetic/actor";
import { createCamera, defaultCameraSpec } from "../src/synthetic/camera";
import {
  corrupt,
  CORRUPTION_PRESETS,
  FALSE_HIGH_VISIBILITY,
  frameTiming,
  NO_CORRUPTION,
  swapActive,
  validateCorruption,
  type CorruptionSpec,
} from "../src/synthetic/corruption";
import { GEOMETRIC_SCORES, observe } from "../src/synthetic/observation";
import { gaussianAt, uniformAt } from "../src/synthetic/seeded";
import { createSimulator, frameIndexAt, SIMULATOR_FRAME_MS } from "../src/synthetic/simulator";

const STAGE = { width: 640, height: 480 };
const truth = actorFrame(actorPose());
const spec = defaultCameraSpec(STAGE, hipMidpoint(truth));
const camera = createCamera(spec);
const clean = observe(truth, camera, { scores: GEOMETRIC_SCORES });
const corruption = (patch: Partial<CorruptionSpec>): CorruptionSpec => ({
  ...NO_CORRUPTION,
  seed: 540,
  ...patch,
});
const mean = (values: readonly number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

describe("#540 seeded detector corruption", () => {
  it("GF-110 is reproducible by seed and frame, independent of evaluation order and leaves truth alone", () => {
    expect(corrupt(clean, NO_CORRUPTION, 0, camera)).toBe(clean);
    const noisy = CORRUPTION_PRESETS.phone;
    const before = JSON.stringify(truth);
    const frames = [99, 0, 7, 100, 7].map((k) => corrupt(clean, noisy, k, camera));
    expect(frames[2]).toEqual(frames[4]);
    expect(frames[0]).toEqual(corrupt(clean, noisy, 99, camera));
    expect(frames[0]).not.toEqual(corrupt(clean, { ...noisy, seed: 541 }, 99, camera));
    expect(JSON.stringify(truth)).toBe(before);
    expect(frames[0]!.map((landmark) => landmark.geometry)).toEqual(
      clean.map((landmark) => landmark.geometry),
    );
    for (let k = 0; k < 100; k += 1) {
      expect(uniformAt(540, 1, k)).toBeGreaterThanOrEqual(0);
      expect(uniformAt(540, 1, k)).toBeLessThan(1);
      expect(Number.isFinite(gaussianAt(540, 1, k))).toBe(true);
    }
  });

  it("GF-111 has the proposed jitter variance and correlation, with one noise field in both spaces", () => {
    const noisy = corruption({ jitter: { sigmaPx: 3, sigmaM: 0.02, rho: 0.8 } });
    const series: number[] = [];
    for (let k = 0; k < 4000; k += 1) {
      const moved = corrupt([clean[0]!], noisy, k, camera)[0]!;
      const px = (moved.image![0] - clean[0]!.image![0]) * STAGE.width;
      const metres = moved.world![0] - clean[0]!.world![0];
      expect(px / 3).toBeCloseTo(metres / 0.02, 9);
      series.push(px);
    }
    const average = mean(series);
    const variance = mean(series.map((value) => (value - average) ** 2));
    const covariance = mean(
      series.slice(1).map((value, k) => (value - average) * (series[k]! - average)),
    );
    expect(Math.abs(average)).toBeLessThan(0.3);
    expect(Math.sqrt(variance)).toBeGreaterThan(2.7);
    expect(Math.sqrt(variance)).toBeLessThan(3.3);
    expect(covariance / variance).toBeGreaterThan(0.74);
    expect(covariance / variance).toBeLessThan(0.86);
    expect(
      corrupt(clean, corruption({ jitter: { sigmaPx: 1, sigmaM: 1, rho: 0.99 } }), 1, camera).every(
        (landmark) => landmark.world!.every(Number.isFinite),
      ),
    ).toBe(true);
  });

  it("GF-112 applies false-high only to hidden imaged joints and outliers in both spaces at depth", () => {
    const moved = corrupt(
      clean,
      corruption({ falseHighRate: 1, outlierRate: 1, outlierPx: 60 }),
      0,
      camera,
    );
    for (let index = 0; index < clean.length; index += 1) {
      const before = clean[index]!;
      const after = moved[index]!;
      expect(after.visibility).toBe(
        before.geometry.kind === "visible" ? before.visibility : FALSE_HIGH_VISIBILITY,
      );
      expect(after.presence).toBe(before.presence);
      const dx = (after.image![0] - before.image![0]) * STAGE.width;
      const dy = (after.image![1] - before.image![1]) * STAGE.height;
      expect(Math.hypot(dx, dy)).toBeCloseTo(60, 9);
      const scale = camera.toCamera(before.scene!)[2] / camera.focal;
      expect(after.world![0] - before.world![0]).toBeCloseTo(dx * scale, 9);
      expect(after.world![1] - before.world![1]).toBeCloseTo(dy * scale, 9);
    }
    const absent = { ...clean[0]!, image: undefined, world: undefined };
    expect(corrupt([absent], CORRUPTION_PRESETS.harsh, 0, camera)[0]).toBe(absent);
  });

  it("GF-113 swaps whole arm and leg identities including roots, keeping each slot's geometry", () => {
    const swapped = corrupt(clean, corruption({ swapRate: 1 }), 0, camera);
    for (const landmark of LANDMARKS) {
      const partner = partnerIndex(landmark.index);
      const limb =
        /^(left|right)-(shoulder|elbow|wrist|pinky|index|thumb|hip|knee|ankle|heel|foot-index)$/.test(
          landmark.name,
        );
      const source = limb ? clean[partner!]! : clean[landmark.index]!;
      expect(swapped[landmark.index]!.image).toEqual(source.image);
      expect(swapped[landmark.index]!.world).toEqual(source.world);
      expect(swapped[landmark.index]!.geometry).toEqual(clean[landmark.index]!.geometry);
    }
  });

  it("GF-114 has multi-frame swap episodes and empirical proposal rates", () => {
    const noisy = corruption({
      swapRate: 0.004,
      falseHighRate: 0.2,
      outlierRate: 0.1,
      outlierPx: 60,
      dropRate: 0.15,
    });
    let drops = 0;
    let highs = 0;
    let outliers = 0;
    let active = 0;
    let adjacent = 0;
    let previous = false;
    const hidden = clean.findIndex((landmark) => landmark.geometry.kind === "occluded");
    for (let k = 0; k < 5000; k += 1) {
      if (frameTiming(noisy, k, SIMULATOR_FRAME_MS).kind === "dropped") drops += 1;
      const moved = corrupt(clean, { ...noisy, swapRate: 0 }, k, camera);
      if (moved[hidden]!.visibility === FALSE_HIGH_VISIBILITY) highs += 1;
      if (Math.abs(moved[0]!.image![0] - clean[0]!.image![0]) > 1e-12) outliers += 1;
      const swap = swapActive(noisy, 0, k);
      if (swap) active += 1;
      if (swap && previous) adjacent += 1;
      previous = swap;
    }
    expect(drops / 5000).toBeGreaterThan(0.12);
    expect(drops / 5000).toBeLessThan(0.18);
    expect(highs / 5000).toBeGreaterThan(0.17);
    expect(highs / 5000).toBeLessThan(0.23);
    expect(outliers / 5000).toBeGreaterThan(0.08);
    expect(outliers / 5000).toBeLessThan(0.12);
    expect(active).toBeGreaterThan(30);
    expect(adjacent / active).toBeGreaterThan(0.5);
    const rare = corruption({ swapRate: 0.001 });
    let runs = 0;
    let length = 0;
    for (let k = 0; k < 20000; k += 1) {
      if (swapActive(rare, 0, k)) length += 1;
      else if (length > 0) {
        // Ignore initial stationary episode and the rare overlap of starts.
        if (k > length && length <= 8) {
          expect(length).toBeGreaterThanOrEqual(2);
          runs += 1;
        }
        length = 0;
      }
    }
    expect(runs).toBeGreaterThan(5);
  });

  it("GF-115 keeps captured timestamps strictly increasing, deterministic, within their periods", () => {
    const noisy = CORRUPTION_PRESETS.harsh;
    let previous = -Infinity;
    for (let k = 0; k < 500; k += 1) {
      const timing = frameTiming(noisy, k, SIMULATOR_FRAME_MS);
      expect(timing).toEqual(frameTiming(noisy, k, SIMULATOR_FRAME_MS));
      if (timing.kind === "dropped") continue;
      expect(timing.tMs).toBeGreaterThan(previous);
      expect(timing.tMs).toBeGreaterThanOrEqual(k * SIMULATOR_FRAME_MS);
      expect(timing.tMs).toBeLessThan((k + 1) * SIMULATOR_FRAME_MS);
      expect(frameIndexAt(timing.tMs)).toBe(k);
      previous = timing.tMs;
    }
  });

  it("GF-116 refuses non-finite magnitudes and times, invalid rates, seeds, and frame periods", () => {
    for (const bad of [NaN, Infinity, -Infinity, -1]) {
      for (const field of ["sigmaPx", "sigmaM", "rho"] as const)
        expect(() =>
          validateCorruption(
            corruption({ jitter: { ...NO_CORRUPTION.jitter, [field]: bad } }),
            SIMULATOR_FRAME_MS,
          ),
        ).toThrow();
      for (const field of [
        "outlierPx",
        "timingJitterMs",
        "falseHighRate",
        "outlierRate",
        "swapRate",
        "dropRate",
      ] as const)
        expect(() =>
          validateCorruption(corruption({ [field]: bad }), SIMULATOR_FRAME_MS),
        ).toThrow();
      expect(() => validateCorruption(NO_CORRUPTION, bad)).toThrow();
    }
    for (const patch of [
      { seed: 0.5 },
      { seed: 2 ** 53 },
      { dropRate: 1 },
      { timingJitterMs: SIMULATOR_FRAME_MS },
      { jitter: { sigmaPx: 0, sigmaM: 0, rho: 1 } },
    ])
      expect(() => validateCorruption(corruption(patch), SIMULATOR_FRAME_MS)).toThrow();
    const simulator = createSimulator({
      drive: { kind: "manual", pose: actorPose() },
      camera: spec,
    });
    for (const bad of [NaN, Infinity, -Infinity]) {
      expect(() => simulator.frame(bad)).toThrow();
      expect(() => frameIndexAt(bad)).toThrow();
    }
    for (const bad of [-1, NaN, Infinity, 0.5]) expect(() => simulator.timing(bad)).toThrow();
    const original = simulator.state;
    expect(() =>
      simulator.observeWith({ corruption: corruption({ outlierPx: Infinity }) }),
    ).toThrow();
    expect(simulator.state).toBe(original);
  });
});
