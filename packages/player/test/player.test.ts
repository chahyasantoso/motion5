import { describe, expect, it } from "vitest";
import { atProgress, hop, type Time } from "@motion5/moves";
import { manualDriver, play } from "@motion5/player";

const scene = (time: Time) => ({
  ball: hop({ height: 100, bounces: 1 }, time),
  label: { text: time.progress < 0.5 ? "up" : "down" },
});

describe("play", () => {
  it("gives what the scene gives when called directly, at every position", () => {
    const driver = manualDriver();
    const player = play(scene, driver);
    for (const progress of [0, 0.2, 0.5, 0.9, 1]) {
      driver.seek(progress);
      expect(player.values).toEqual(scene(atProgress(progress)));
    }
  });

  it("tells each target's subscribers its new value on every step", () => {
    const driver = manualDriver();
    const player = play(scene, driver);
    const seen: number[] = [];
    player.subscribe("ball", (ball) => seen.push(ball.y ?? 0));
    driver.seek(0.25);
    driver.seek(0.5);
    expect(seen).toEqual([0, scene(atProgress(0.25)).ball.y, scene(atProgress(0.5)).ball.y]);
  });

  it("hands a late subscriber the current value at once", () => {
    const driver = manualDriver();
    const player = play(scene, driver);
    driver.seek(0.75);
    let label: string | undefined;
    player.subscribe("label", (value) => {
      label = value.text;
    });
    expect(label).toBe("down");
  });

  it("stops telling a subscriber that left, and everyone once disposed", () => {
    const driver = manualDriver();
    const player = play(scene, driver);
    let calls = 0;
    const leave = player.subscribe("ball", () => {
      calls += 1;
    });
    leave();
    driver.seek(0.5);
    player.subscribe("ball", () => {
      calls += 10;
    });
    player.dispose();
    driver.seek(0.9);
    // Each subscription hears its value once on joining, and nothing after leaving or disposal.
    expect(calls).toBe(11);
  });

  it("reruns the scene at the same time on refresh, for inputs the scene reads from outside", () => {
    let lift = 0;
    const driver = manualDriver();
    const player = play((time: Time) => ({ box: { y: time.progress * 10 + lift } }), driver);
    driver.seek(1);
    lift = 5;
    player.refresh();
    expect(player.values.box.y).toBe(15);
  });

  it("gives a timed clock when the driver has a duration", () => {
    const driver = manualDriver({ durationMs: 400 });
    const player = play((time: Time) => ({ clock: time.clock }), driver);
    driver.seek(0.25);
    expect(player.values.clock).toEqual({ kind: "timed", elapsed: 100, length: 400 });
    expect(player.time.progress).toBe(0.25);
  });
});

describe("a scene of events", () => {
  it("gets the driver's events beside its time, and none from a driver that keeps no log", () => {
    const log = [{ name: "enter", at: 10, target: "card" }];
    const watching = { ...manualDriver(), events: () => log };
    const seen = play((_time, events) => ({ count: events.length }), watching);
    expect(seen.values.count).toBe(1);
    expect(play((_time, events) => ({ count: events.length }), manualDriver()).values.count).toBe(
      0,
    );
  });
});
