import { inputs, motion, state, type Pose2d } from "@gerak/core";
import { mount } from "@gerak/dom";
import { box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, fakeFrames } from "./fake-page";

const sampleInputs = inputs({ values: { sample: {} } });

function runStream(settleMs: number | undefined, expectedWindowMs: number): void {
  const root = new FakeRoot([new FakeNode("card")]);
  const frames = fakeFrames();
  let ms = 0;
  const latest = state(0, (current, event) =>
    event.name === "sample" ? (event.value ?? current) : current,
  );
  const piece = scene(
    box("card").moves(motion((t, ctx): Pose2d => ({ x: latest(t, ctx?.events ?? []) }))),
  );
  const mounted = mount(piece, {
    root,
    frames,
    clock: "live",
    now: () => ms,
    ...(settleMs === undefined ? {} : { settleMs }),
  });

  for (let t = 100; t <= 30_000; t += 100) {
    ms = t;
    mounted.set(sampleInputs, "sample", t);
    frames.tick(ms);
  }

  const retained = mounted.driver.input();
  const expectedRecentAts: number[] = [];
  for (let t = ms - expectedWindowMs; t <= ms; t += 100) {
    expectedRecentAts.push(t);
  }
  const keptRecentAts = retained
    .filter((entry) => entry.name === "sample" && entry.at >= ms - expectedWindowMs)
    .map((entry) => entry.at);
  expect(keptRecentAts).toEqual(expectedRecentAts);
  expect(
    retained.some((entry) => entry.name === "sample" && entry.at < ms - 2 * expectedWindowMs),
  ).toBe(false);
  expect(retained.length).toBeLessThan(300);

  mounted.dispose();
}

describe("mount live log window retention", () => {
  it("keeps 6 s of input when settleMs is 6000", () => {
    runStream(6000, 6000);
  });

  it("keeps at least 4 s of input with default settleMs", () => {
    runStream(undefined, 4000);
  });

  it("drops nothing on a timed mount", () => {
    const root = new FakeRoot([new FakeNode("card")]);
    const frames = fakeFrames();
    const latest = state(0, (current, event) =>
      event.name === "sample" ? (event.value ?? current) : current,
    );
    const piece = scene(
      { length: 40_000 },
      box("card").moves(motion((t, ctx): Pose2d => ({ x: latest(t, ctx?.events ?? []) }))),
    );
    const mounted = mount(piece, {
      root,
      frames,
      clock: "timed",
    });

    for (let t = 100; t <= 20_000; t += 100) {
      frames.tick(t);
      mounted.set(sampleInputs, "sample", t);
    }

    expect(mounted.driver.input().filter((entry) => entry.name === "sample")).toHaveLength(200);
    mounted.dispose();
  });
});
