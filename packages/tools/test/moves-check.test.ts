import { describe, expect, it } from "vitest";
import * as moves from "@gerak/moves";
import { defineMove, type Pose2d } from "@gerak/moves";
import { checkMove, describeFinding, isMove } from "../src/scene/moves";

const number = (description: string) => ({ kind: "number", description }) as const;

describe("the move gate", () => {
  it("passes every move the package exports", () => {
    const all: readonly unknown[] = Object.values(moves);
    const exported = all.filter(isMove);
    expect(exported.map((move) => move.id).sort()).toEqual([
      "anticipate",
      "drop",
      "hop",
      "overshoot",
      "repeated",
      "reversed",
      "rope",
      "trace",
      "wipe",
    ]);
    for (const move of exported)
      expect(checkMove(move).map((finding) => describeFinding(move.id, finding))).toEqual([]);
  });

  it("names the field and the amount when an entrance ends off its rest", () => {
    const late = defineMove({
      id: "late",
      role: "enter",
      description: "Slides in and stops short.",
      options: { distance: number("Start this far left, in px.") },
      example: { options: { distance: 100 } },
      moments: () => ({}),
      run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) - 4 }),
    });
    expect(checkMove(late)).toEqual([
      {
        kind: "not-at-rest",
        options: '{"distance":100}',
        field: "x",
        progress: 1,
        value: -4,
        rest: 0,
      },
    ]);
    expect(describeFinding("late", checkMove(late)[0] ?? { kind: "no-description" })).toBe(
      'late: "x" is -4 at progress 1, and its role holds rest (0) there, with {"distance":100}.',
    );
  });

  it("holds an emphasis to rest at both ends, and an exit at its start", () => {
    const pose = (progress: number): Pose2d => ({ scale: 1 + 0.2 * progress });
    const base = {
      description: "Grows a little.",
      options: {},
      example: { options: {} },
      moments: () => ({}),
      run: (_: object, { progress }: { readonly progress: number }) => pose(progress),
    };
    const emphasis = defineMove({ ...base, id: "swell", role: "emphasis" });
    const exit = defineMove({ ...base, id: "leave", role: "exit" });
    expect(checkMove(emphasis).map((finding) => finding.kind)).toEqual(["not-at-rest"]);
    expect(checkMove(exit)).toEqual([]);
  });

  it("finds a jump, a value that is not a number, and a moment outside the move", () => {
    const rough = defineMove({
      id: "Rough",
      role: "follow",
      description: " ",
      options: { amount: { kind: "number", min: 0, description: "" } },
      example: { options: { amount: 1 } },
      moments: () => ({ late: 1.5 }),
      run: ({ amount }, { progress }): Pose2d => ({
        x: progress < 0.5 ? 0 : 100,
        y: progress / amount,
      }),
    });
    const kinds = checkMove(rough).map((finding) => finding.kind);
    expect(kinds).toEqual([
      "bad-id",
      "no-description",
      "no-description",
      "jump",
      "not-finite",
      "moment-out-of-range",
    ]);
  });

  it("reports a move that throws on its own example", () => {
    const needy = defineMove({
      id: "needy",
      role: "follow",
      description: "Needs an input it was not given an example of.",
      options: {},
      example: { options: {} },
      moments: () => ({}),
      run(_options, _time, input: { readonly points: readonly number[] }): Pose2d {
        return { x: input.points.length };
      },
    });
    expect(checkMove(needy).map((finding) => finding.kind)).toEqual(["throws"]);
  });

  it("holds a reveal to end fully shown", () => {
    const fading = defineMove({
      id: "fading",
      role: "reveal",
      description: "Shows, then hides again.",
      options: {},
      example: { options: {} },
      moments: () => ({}),
      run: (_options, { progress }) => ({ drawn: Math.sin(Math.PI * progress) }),
    });
    expect(checkMove(fading).map((finding) => finding.kind)).toEqual(["not-shown"]);
  });
});
