import {
  INPUT_EVENTS,
  elapsedOf,
  eventLog,
  motion,
  pointer,
  springTo,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  bind,
  box,
  compileScene,
  formatStageError,
  frame,
  restReader,
  sceneBuilder,
  scrollPoint,
  travel,
  type MotionContext,
  type Moves,
  type SceneBuilder,
  type Stage,
} from "../src";

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const live = (ms: number): Time => ({ progress: 0, clock: { kind: "live", elapsed: ms } });
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));

function movesAt(
  stage: Stage,
  ms: number,
  events: Parameters<typeof frame>[1]["events"] = [],
): ReadonlyMap<string, Moves> {
  const moves = new Map<string, Moves>();
  frame(stage, { time: live(ms), events, moves });
  return moves;
}

describe("what a frame reports as moving with time alone", () => {
  it("a clock beat while it has not ended, and a loop always", () => {
    const stage = compiled(
      sceneBuilder()
        .element(box("intro"))
        .motion(slide.in(beat("introBeat", 300)))
        .element(box("looped"))
        .motion(slide.loop(500)),
    );
    expect(movesAt(stage, 100).get("intro")).toBe("time");
    expect(movesAt(stage, 400).has("intro")).toBe(false);
    expect(movesAt(stage, 4000).get("looped")).toBe("time");
  });

  it("a scroll beat never, a smooth one while its spring settles", () => {
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("plain"))
        .motion(slide.in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] })))
        .element(box("smoothed"))
        .motion(
          slide.in(beat("smooth", { scroll: [scrollPoint(0), scrollPoint(400)], smooth: true })),
        ),
    );
    const log = eventLog();
    log.add({ name: INPUT_EVENTS.scroll, at: 100, value: 300 });
    expect(movesAt(stage, 150, log.events).has("plain")).toBe(false);
    expect(movesAt(stage, 150, log.events).get("smoothed")).toBe("time");
    expect(movesAt(stage, 5000, log.events).has("smoothed")).toBe(false);
  });

  it("a trigger while its clock part runs, for each way back", () => {
    for (const back of ["reverse", "stay", "replay"] as const) {
      const stage = compiled(
        sceneBuilder({ length: 1000 })
          .element(box("revealed"))
          .motion(slide.in(beat(`t-${back}`, 400, { when: scrollPoint(200).reached, back }))),
      );
      const log = eventLog();
      expect(movesAt(stage, 50, log.events).has("revealed")).toBe(false);
      log.add({ name: INPUT_EVENTS.scroll, at: 100, value: 300 });
      expect(movesAt(stage, 200, log.events).get("revealed")).toBe("time");
      expect(movesAt(stage, 800, log.events).has("revealed")).toBe(false);
    }
  });

  it("an input-only bind as still, a settling spring as time, and a hand-made clock signal as maybe", () => {
    const leader = box("leader");
    const sprung = springTo(pointer.x, (x) => x);
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(leader)
        .motion(slide.in(beat("lead", 100)))
        .element(box("pointed"))
        .motion(bind({ x: (t, e) => pointer.x(t, e) * 100 }))
        .element(box("sprung"))
        .motion(bind({ x: (t, e) => sprung(t, e) * 100 }))
        .element(box("ticking"))
        .motion(bind({ x: (t) => elapsedOf(t.clock) ?? 0 }))
        .element(box("clocked"))
        .motion(
          motion(
            (_t: Time, context?: MotionContext): Pose2d => ({
              x: context === undefined ? 0 : (elapsedOf(context.time.clock) ?? 0),
            }),
          ).in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        )
        .element(box("follower"))
        .motion(
          motion(
            (_t: Time, context?: MotionContext): Pose2d => ({
              x: context === undefined ? 0 : (context.read(leader).x ?? 0),
            }),
          ).in(beat("range2", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        ),
    );
    const log = eventLog();
    log.add({ name: INPUT_EVENTS.pointerX, at: 1000, value: 0.9 });
    const settling = movesAt(stage, 1050, log.events);
    expect(settling.has("pointed")).toBe(false);
    expect(settling.get("sprung")).toBe("time");
    expect(settling.get("ticking")).toBe("maybe");
    expect(settling.get("clocked")).toBe("maybe");
    expect(settling.get("follower")).toBe("maybe");
    expect(settling.has("leader")).toBe(false);
    expect(movesAt(stage, 9000, log.events).has("sprung")).toBe(false);
  });

  it("a travel with no window as moving only with input", () => {
    const slot = box("slot");
    const stage = compiled(
      sceneBuilder({ length: 1000 })
        .element(box("drink"))
        .motion(travel({ to: slot })),
    );
    const boxes = {
      main: restReader({
        drink: { x: 0, y: 0, width: 10, height: 10 },
        slot: { x: 50, y: 50, width: 10, height: 10 },
      }),
    };
    const moves = new Map<string, Moves>();
    frame(stage, { time: live(100), boxes, moves });
    expect(moves.has("drink")).toBe(false);
  });

  it("runs only the elements named, and leaves the rest out", () => {
    const stage = compiled(
      sceneBuilder()
        .element(box("a"))
        .motion(slide.in(beat("ab", 100)))
        .element(box("b"))
        .motion(slide.in(beat("bb", 100))),
    );
    const out = frame(stage, { time: live(50), only: new Set(["b"]) });
    expect(Object.keys(out.targets)).toEqual(["b"]);
  });
});
