// @ts-nocheck
import { pageInputs, value } from "@gerak/core";
import { mount } from "@gerak/dom";
import { bind, box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, fakeFrames } from "./fake-page";

function runPointerStream(settleMs: number | undefined, expectedWindowMs: number): void {
  const root = new FakeRoot([new FakeNode("card")]);
  const frames = fakeFrames();
  let ms = 0;
  const piece = scene(box("card").moves(bind({ x: value(pageInputs, "pointer-x") })));
  const mounted = mount(piece, {
    root,
    frames,
    clock: "live",
    now: () => ms,
    ...(settleMs === undefined ? {} : { settleMs }),
  });

  for (let t = 100; t <= 30_000; t += 100) {
    ms = t;
    mounted.set(pageInputs, "pointer-x", ((t / 100) % 100) / 100);
    frames.tick(ms);
  }

  const retained = mounted.driver.input();
  const expectedRecentAts: number[] = [];
  for (let t = ms - expectedWindowMs; t <= ms; t += 100) {
    expectedRecentAts.push(t);
  }
  const keptRecentAts = retained
    .filter((entry) => entry.name === "pointer-x" && entry.at >= ms - expectedWindowMs)
    .map((entry) => entry.at);
  expect(keptRecentAts).toEqual(expectedRecentAts);

  // Entries older than twice the window stay only when latest for their name and target.
  const latestSerialByKey = new Map<string, number>();
  for (const entry of retained) {
    const key = `${entry.name}\0${entry.target ?? ""}`;
    latestSerialByKey.set(key, Math.max(latestSerialByKey.get(key) ?? -Infinity, entry.serial));
  }
  for (const entry of retained) {
    if (entry.at < ms - 2 * expectedWindowMs) {
      const key = `${entry.name}\0${entry.target ?? ""}`;
      expect(entry.serial).toBe(latestSerialByKey.get(key));
    }
  }
  expect(
    retained.some((entry) => entry.name === "pointer-x" && entry.at < ms - 2 * expectedWindowMs),
  ).toBe(false);

  mounted.dispose();
}

describe("live retention window sizing", () => {
  it("keeps at least settleMs when settleMs is 6000", () => {
    runPointerStream(6000, 6000);
  });

  it("floors the retention window at 4000 ms for default and shorter settleMs", () => {
    runPointerStream(undefined, 4000);
    runPointerStream(1000, 4000);
  });
});
