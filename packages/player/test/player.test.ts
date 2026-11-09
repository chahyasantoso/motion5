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

describe("cues", () => {
  const cues = [{ name: "land", at: 500, target: "ball" }];

  it("reach the scene merged with the page's events, oldest first", () => {
    const driver = {
      ...manualDriver({ durationMs: 1000 }),
      events: () => [{ name: "enter", at: 200 }],
    };
    const player = play((_time, events) => ({ names: events.map(({ name }) => name) }), driver, {
      cues,
    });
    expect(player.values.names).toEqual(["enter", "land"]);
  });

  it("call on() once as forward play passes them, and never on a seek back", () => {
    const driver = manualDriver({ durationMs: 1000 });
    const player = play(() => ({}), driver, { cues });
    const heard: number[] = [];
    player.on("land", (event) => heard.push(event.at));
    driver.seek(0.4);
    expect(heard).toEqual([]);
    driver.seek(0.6);
    expect(heard).toEqual([500]);
    driver.seek(0.1);
    driver.seek(0.3);
    expect(heard).toEqual([500]);
    driver.seek(0.9);
    expect(heard).toEqual([500, 500]);
  });
});

describe("seekMs", () => {
  it("holds progress at 1 past the length while the clock's ms runs on", () => {
    const driver = manualDriver({ durationMs: 400 });
    driver.seekMs(100);
    expect(driver.now()).toEqual({
      progress: 0.25,
      clock: { kind: "timed", elapsed: 100, length: 400 },
    });
    driver.seekMs(1000);
    expect(driver.now()).toEqual({
      progress: 1,
      clock: { kind: "timed", elapsed: 1000, length: 400 },
    });
    expect(() => manualDriver().seekMs(10)).toThrow(/seekMs/);
  });
});
