import { describe, expect, it } from "vitest";
import type { MotionDefinition } from "../../src/contract/v5";
import { validateMotionTrigger } from "../../src/contract/validate-v5";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { testEngine } from "../support/builtin-registry";

function run(trigger: MotionDefinition["trigger"]) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = testEngine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger,
        tracks: [
          {
            id: "t",
            output: { model: "TestRecord" },
            input: {
              values: {
                x: [
                  { p: 0, v: 10 },
                  { p: 1, v: 110 },
                ],
              },
            },
          },
        ],
      },
    ],
  });
  handle.mount("m/t");
  return (delta: number) => {
    clock.tick(delta);
    scheduler.flush();
    const patch = handle.get("m/t");
    return patch?.status === "ready" ? patch.sourceProgress : patch?.status;
  };
}

describe("a time trigger's delay", () => {
  it("holds progress at zero until the delay has passed", () => {
    const advance = run({ type: "time", duration: 1000, delay: 500 });
    expect(advance(250)).toBe(0);
    expect(advance(250)).toBe(0);
    expect(advance(250)).toBe(0.25);
  });

  it("carries a tick that crosses the delay into the run", () => {
    expect(run({ type: "time", duration: 1000, delay: 500 })(750)).toBe(0.25);
  });

  it("finishes after delay plus duration", () => {
    const advance = run({ type: "time", duration: 1000, delay: 500 });
    advance(1499);
    expect(advance(1)).toBe(1);
  });

  it("publishes the first pose during the delay", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = testEngine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "time", duration: 1000, delay: 500 },
          tracks: [
            {
              id: "t",
              output: { model: "TestRecord" },
              input: {
                values: {
                  x: [
                    { p: 0, v: 10 },
                    { p: 1, v: 110 },
                  ],
                },
              },
            },
          ],
        },
      ],
    });
    handle.mount("m/t");
    clock.tick(16);
    scheduler.flush();
    const patch = handle.get("m/t");
    expect(patch?.status === "ready" ? patch.outputs.values : patch).toEqual({ x: 10 });
  });

  it("delays once, before the first pass of a loop", () => {
    const advance = run({ type: "time", duration: 100, delay: 50, repeat: 1 });
    expect(advance(50)).toBe(0);
    expect(advance(50)).toBe(0.5);
    expect(advance(100)).toBe(0.5);
    expect(advance(50)).toBe(1);
  });

  it("matches an undelayed run shifted by the delay", () => {
    const delayed = run({ type: "time", duration: 400, delay: 100, repeat: 1, yoyo: true });
    const plain = run({ type: "time", duration: 400, repeat: 1, yoyo: true });
    delayed(100);
    for (const step of [50, 150, 300, 100, 200]) expect(delayed(step)).toBe(plain(step));
  });

  it.each([[-1], [Number.NaN], [Number.POSITIVE_INFINITY], ["soon"]])(
    "refuses a delay of %s by rule id and path",
    (delay) => {
      expect(
        validateMotionTrigger({ type: "time", duration: 1, delay }, "motions[0].trigger").map(
          ({ ruleId, path }) => [ruleId, path],
        ),
      ).toEqual([["trigger-time-delay", "motions[0].trigger.delay"]]);
    },
  );

  it("accepts a zero delay as no delay", () => {
    expect(validateMotionTrigger({ type: "time", duration: 1, delay: 0 }, "t")).toEqual([]);
    expect(run({ type: "time", duration: 1000, delay: 0 })(500)).toBe(0.5);
  });
});
