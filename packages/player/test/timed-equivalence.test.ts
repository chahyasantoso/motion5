import { describe, expect, it } from "vitest";
import {
  elapsedOf,
  inputLog,
  inputs,
  mergeInput,
  seeded,
  springTo,
  state,
  tally,
  trail,
  type Input,
  type Signal,
  type Time,
} from "@gerak/core";
import { manualDriver, play, type ManualDriver } from "@gerak/player";

interface ScenePose {
  readonly count: number;
  readonly spring: number;
  readonly trailed: number;
  readonly integral: number;
  readonly elapsed: number;
  readonly progress: number;
}

function buildScene(): Signal<ScenePose> {
  const counter = state({ count: 0, target: 0 }, (current, event) => {
    if (event.name === "step") {
      return { count: current.count + 1, target: event.value };
    }
    if (event.name === "cue") {
      return { count: current.count + 10, target: current.target + event.value };
    }
    return current;
  });

  const springValue = springTo(counter, (s) => s.target, { stiffness: 180, damping: 24 });
  const trailedValue = trail((t, e) => springValue(t, e) + t.progress * 40, {
    stiffness: 180,
    damping: 24,
  });
  const integralValue = tally({ start: 0, on: { step: "value", cue: 2 } });

  return (time: Time, events: Input): ScenePose => ({
    count: counter(time, events).count,
    spring: springValue(time, events),
    trailed: trailedValue(time, events),
    integral: integralValue(time, events),
    elapsed: elapsedOf(time.clock) ?? 0,
    progress: time.progress,
  });
}

function withEvents(base: ManualDriver, events: Input): ManualDriver {
  return {
    ...base,
    events: () => events,
  };
}

function shuffled(values: readonly number[], seed: number): number[] {
  const copy = [...values];
  const next = seeded(seed);
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a !== undefined && b !== undefined) {
      copy[i] = b;
      copy[j] = a;
    }
  }
  return copy;
}

describe("timed equivalence", () => {
  it("matches across ordered seek, shuffled seek, fresh players, and direct evaluation", () => {
    const durationMs = 1000;
    const cues: Input = [
      { kind: "trigger", name: "cue", at: 150, value: 12 },
      { kind: "trigger", name: "cue", at: 620, value: -4 },
    ];
    const steps = inputs({ values: { step: {} } });
    const log = inputLog();
    log.set(80, steps, "step", 10);
    log.set(300, steps, "step", 25);
    log.set(500, steps, "step", -8);
    log.set(820, steps, "step", 16);
    log.set(1100, steps, "step", 4);

    const frameTimes = [0, 50, 120, 200, 350, 500, 750, 900, 1000, 1200];
    const scene = buildScene();

    const orderedDriver = withEvents(manualDriver({ durationMs }), log.input);
    const orderedPlayer = play(scene, orderedDriver, { cues });
    const orderedValues = new Map<number, ScenePose>();
    for (const ms of frameTimes) {
      orderedDriver.seekMs(ms);
      orderedValues.set(ms, orderedPlayer.values);
    }

    const shuffledDriver = withEvents(manualDriver({ durationMs }), log.input);
    const shuffledPlayer = play(scene, shuffledDriver, { cues });
    const shuffledValues = new Map<number, ScenePose>();
    for (const ms of shuffled(frameTimes, 42)) {
      shuffledDriver.seekMs(ms);
      shuffledValues.set(ms, shuffledPlayer.values);
    }

    const allEvents = mergeInput(cues, log.input);
    for (const ms of frameTimes) {
      const freshDriver = withEvents(manualDriver({ durationMs }), log.input);
      const freshPlayer = play(scene, freshDriver, { cues });
      freshDriver.seekMs(ms);

      const probeTime = freshDriver.now();
      const visibleEvents = allEvents.filter((event) => event.at <= ms);
      const probeValue = scene(probeTime, visibleEvents);

      const expected = orderedValues.get(ms);
      expect(shuffledValues.get(ms)).toEqual(expected);
      expect(freshPlayer.values).toEqual(expected);
      expect(probeValue).toEqual(expected);
    }
  });
});
