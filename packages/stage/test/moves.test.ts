import {
  elapsedOf,
  inputLog,
  motion,
  pageInputs,
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
  scene,
  scrollPoint,
  travel,
  type MotionContext,
  type Moves,
  type Scene,
  type Stage,
} from "../src";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
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
      scene(
        box("intro").moves(slide.in(beat("introBeat", 300))),
        box("looped").moves(slide.loop(500)),
      ),
    );
    expect(movesAt(stage, 100).get("intro")).toBe("time");
    expect(movesAt(stage, 400).has("intro")).toBe(false);
    expect(movesAt(stage, 4000).get("looped")).toBe("time");
  });

  it("a scroll beat never, a smooth one while its spring settles", () => {
    const stage = compiled(
      scene(
        { length: 1000 },
        box("plain").moves(slide.in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] }))),
        box("smoothed").moves(
          slide.in(beat("smooth", { scroll: [scrollPoint(0), scrollPoint(400)], smooth: true })),
        ),
      ),
    );
    const log = inputLog();
    log.set(100, pageInputs, "scroll", 300);
    expect(movesAt(stage, 150, log.input).has("plain")).toBe(false);
    expect(movesAt(stage, 150, log.input).get("smoothed")).toBe("time");
    expect(movesAt(stage, 5000, log.input).has("smoothed")).toBe(false);
  });

  it("a trigger while its clock part runs, for each way back", () => {
    for (const back of ["reverse", "stay", "replay"] as const) {
      const stage = compiled(
        scene(
          { length: 1000 },
          box("revealed").moves(
            slide.in(beat(`t-${back}`, 400, { when: scrollPoint(200).reached, back })),
          ),
        ),
      );
      const log = inputLog();
      expect(movesAt(stage, 50, log.input).has("revealed")).toBe(false);
      log.set(100, pageInputs, "scroll", 300);
      expect(movesAt(stage, 200, log.input).get("revealed")).toBe("time");
      expect(movesAt(stage, 800, log.input).has("revealed")).toBe(false);
    }
  });

  it("an input-only bind as still, a settling spring as time, and a hand-made clock signal as maybe", () => {
    const leader = box("leader");
    const sprung = springTo(pointer.x, (x) => x);
    const stage = compiled(
      scene(
        { length: 1000 },
        leader.moves(slide.in(beat("lead", 100))),
        box("pointed").moves(bind({ x: (t, e) => pointer.x(t, e) * 100 })),
        box("sprung").moves(bind({ x: (t, e) => sprung(t, e) * 100 })),
        box("ticking").moves(bind({ x: (t) => elapsedOf(t.clock) ?? 0 })),
        box("clocked").moves(
          motion(
            (_t: Time, context?: MotionContext): Pose2d => ({
              x: context === undefined ? 0 : (elapsedOf(context.time.clock) ?? 0),
            }),
          ).in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        ),
        box("follower").moves(
          motion(
            (_t: Time, context?: MotionContext): Pose2d => ({
              x: context === undefined ? 0 : (context.read(leader).x ?? 0),
            }),
          ).in(beat("range2", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        ),
      ),
    );
    const log = inputLog();
    log.set(1000, pageInputs, "pointer-x", 0.9);
    const settling = movesAt(stage, 1050, log.input);
    expect(settling.has("pointed")).toBe(false);
    expect(settling.get("sprung")).toBe("time");
    expect(settling.get("ticking")).toBe("maybe");
    expect(settling.get("clocked")).toBe("maybe");
    expect(settling.get("follower")).toBe("maybe");
    expect(settling.has("leader")).toBe(false);
    expect(movesAt(stage, 9000, log.input).has("sprung")).toBe(false);
  });

  it("a travel with no window as moving only with input", () => {
    const slot = box("slot");
    const stage = compiled(scene({ length: 1000 }, box("drink").moves(travel({ to: slot }))));
    const rest = restReader({
      drink: { x: 0, y: 0, width: 10, height: 10 },
      slot: { x: 50, y: 50, width: 10, height: 10 },
    });
    const moves = new Map<string, Moves>();
    frame(stage, { time: live(100), rest, moves });
    expect(moves.has("drink")).toBe(false);
  });

  it("runs only the elements named, and leaves the rest out", () => {
    const stage = compiled(
      scene(box("a").moves(slide.in(beat("ab", 100))), box("b").moves(slide.in(beat("bb", 100)))),
    );
    const out = frame(stage, { time: live(50), only: new Set(["b"]) });
    expect(Object.keys(out.targets)).toEqual(["b"]);
  });
});
