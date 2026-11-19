import { describe, expect, it } from "vitest";
import { atProgress } from "@gerak/core";
import {
  drop,
  fade,
  hop,
  nod,
  pop,
  pulse,
  rise,
  shake,
  slide,
  smudge,
  swing,
  trace,
  unfold,
  wipe,
  wobble,
  overshoot,
  rope,
  hopLandings,
  DROP_LANDING,
} from "@gerak/moves";

const ramp = (time: { readonly progress: number }) => ({ x: -200 * (1 - time.progress) });
const points = [
  { id: "a", x: 0, y: 0 },
  { id: "b", x: 60, y: 20 },
  { id: "c", x: 120, y: 0 },
];

/** Equal in every key, numbers within 1e-9. */
function expectClose(actual: unknown, expected: unknown): void {
  if (typeof expected === "number") {
    expect(actual).toBeCloseTo(expected, 9);
    return;
  }
  if (Array.isArray(expected)) {
    expect(Array.isArray(actual) && actual.length).toBe(expected.length);
    expected.forEach((item, index) =>
      expectClose(Array.isArray(actual) ? actual[index] : undefined, item),
    );
    return;
  }
  if (typeof expected === "object" && expected !== null) {
    const got = new Map(Object.entries(actual ?? {}));
    expect([...got.keys()].sort()).toEqual(Object.keys(expected).sort());
    for (const [key, value] of Object.entries(expected)) expectClose(got.get(key), value);
    return;
  }
  expect(actual).toEqual(expected);
}

describe("plain moves match the recorded declared moves", () => {
  it("drop samples as recorded", () => {
    expectClose(drop({ distance: 400, squash: 0.2 })(atProgress(0)), {
      y: -400,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
    });
    expectClose(drop({ distance: 400, squash: 0.2 })(atProgress(0.5)), {
      y: -222.22222222222223,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
    });
    expectClose(drop({ distance: 400, squash: 0.2 })(atProgress(1)), {
      y: 0,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
    });
  });
  it("fade samples as recorded", () => {
    expectClose(fade()(atProgress(0)), { opacity: 0 });
    expectClose(fade()(atProgress(0.5)), { opacity: 0.5 });
    expectClose(fade()(atProgress(1)), { opacity: 1 });
  });
  it("hop samples as recorded", () => {
    expectClose(hop({ height: 200, bounces: 1, squash: 0.3, dx: 600 })(atProgress(0)), {
      x: -600,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
      contact: { hits: 0, justHit: 0 },
    });
    expectClose(hop({ height: 200, bounces: 1, squash: 0.3, dx: 600 })(atProgress(0.5)), {
      x: -237.8679656440357,
      y: -16.42135623730954,
      scaleX: 1.1666071496898844,
      scaleY: 0.8148809447890173,
      anchor: "bottom",
      contact: { hits: 1, justHit: 0.6170635173699424 },
    });
    expectClose(hop({ height: 200, bounces: 1, squash: 0.3, dx: 600 })(atProgress(1)), {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
      contact: { hits: 2, justHit: 0 },
    });
  });
  it("nod samples as recorded", () => {
    expectClose(nod({ distance: 16 })(atProgress(0)), { y: 0 });
    expectClose(nod({ distance: 16 })(atProgress(0.5)), { y: 16 });
    expectClose(nod({ distance: 16 })(atProgress(1)), { y: 2.399615652258972e-31 });
  });
  it("pop samples as recorded", () => {
    expectClose(pop({ overshoot: 0.2 })(atProgress(0)), { scale: 0 });
    expectClose(pop({ overshoot: 0.2 })(atProgress(0.5)), { scale: 1.1666666666666665 });
    expectClose(pop({ overshoot: 0.2 })(atProgress(1)), { scale: 1 });
  });
  it("pulse samples as recorded", () => {
    expectClose(pulse({ amount: 0.15 })(atProgress(0)), { scale: 1 });
    expectClose(pulse({ amount: 0.15 })(atProgress(0.5)), { scale: 1.15 });
    expectClose(pulse({ amount: 0.15 })(atProgress(1)), { scale: 1 });
  });
  it("rise samples as recorded", () => {
    expectClose(rise({ distance: 80 })(atProgress(0)), { y: 80 });
    expectClose(rise({ distance: 80 })(atProgress(0.5)), { y: 10 });
    expectClose(rise({ distance: 80 })(atProgress(1)), { y: 0 });
  });
  it("shake samples as recorded", () => {
    expectClose(shake({ distance: 12, count: 4 })(atProgress(0)), { x: 0 });
    expectClose(shake({ distance: 12, count: 4 })(atProgress(0.5)), { x: -2.7361810261261124e-15 });
    expectClose(shake({ distance: 12, count: 4 })(atProgress(1)), { x: 0 });
  });
  it("slide samples as recorded", () => {
    expectClose(slide({ distance: 200, from: "left" })(atProgress(0)), { x: -200 });
    expectClose(slide({ distance: 200, from: "left" })(atProgress(0.5)), { x: -25 });
    expectClose(slide({ distance: 200, from: "left" })(atProgress(1)), { x: 0 });
  });
  it("smudge samples as recorded", () => {
    expectClose(smudge({ amount: 5, build: 0.5 })(atProgress(0)), { blur: 0 });
    expectClose(smudge({ amount: 5, build: 0.5 })(atProgress(0.5)), { blur: 5 });
    expectClose(smudge({ amount: 5, build: 0.5 })(atProgress(1)), { blur: 5 });
  });
  it("swing samples as recorded", () => {
    expectClose(swing({ angle: 35, swings: 2, anchor: "top" })(atProgress(0)), {
      rotation: 35,
      anchor: "top",
    });
    expectClose(swing({ angle: 35, swings: 2, anchor: "top" })(atProgress(0.5)), {
      rotation: -12.374368670764584,
      anchor: "top",
    });
    expectClose(swing({ angle: 35, swings: 2, anchor: "top" })(atProgress(1)), {
      rotation: 0,
      anchor: "top",
    });
  });
  it("trace samples as recorded", () => {
    expectClose(trace({})(atProgress(0)), { drawn: 0, drawnFrom: 0 });
    expectClose(trace({})(atProgress(0.5)), { drawn: 0.5, drawnFrom: 0 });
    expectClose(trace({})(atProgress(1)), { drawn: 1, drawnFrom: 0 });
  });
  it("unfold samples as recorded", () => {
    expectClose(unfold({ from: "top" })(atProgress(0)), { scaleY: 0, anchor: "top" });
    expectClose(unfold({ from: "top" })(atProgress(0.5)), { scaleY: 0.75, anchor: "top" });
    expectClose(unfold({ from: "top" })(atProgress(1)), { scaleY: 1, anchor: "top" });
  });
  it("wipe samples as recorded", () => {
    expectClose(wipe({ radius: 900, x: 400, y: 300 })(atProgress(0)), {
      clipX: 400,
      clipY: 300,
      clipRadius: 0,
    });
    expectClose(wipe({ radius: 900, x: 400, y: 300 })(atProgress(0.5)), {
      clipX: 400,
      clipY: 300,
      clipRadius: 450,
    });
    expectClose(wipe({ radius: 900, x: 400, y: 300 })(atProgress(1)), {
      clipX: 400,
      clipY: 300,
      clipRadius: 900,
    });
  });
  it("wobble samples as recorded", () => {
    expectClose(wobble({ angle: 8, count: 3 })(atProgress(0)), { rotation: 0 });
    expectClose(wobble({ angle: 8, count: 3 })(atProgress(0.5)), {
      rotation: 1.368090513063056e-15,
    });
    expectClose(wobble({ angle: 8, count: 3 })(atProgress(1)), { rotation: 0 });
  });
  it("overshoot samples as recorded", () => {
    expectClose(overshoot({ share: 0.3, amount: 0.1 })(ramp)(atProgress(0)), { x: -200 });
    expectClose(overshoot({ share: 0.3, amount: 0.1 })(ramp)(atProgress(0.5)), {
      x: -57.14285714285714,
    });
    expectClose(overshoot({ share: 0.3, amount: 0.1 })(ramp)(atProgress(1)), {
      x: 3.400452096726303e-30,
    });
  });
  it("rope samples as recorded", () => {
    expectClose(rope({ angle: 90, points })(atProgress(0)), [
      {
        id: "a",
        x: 0,
        y: 0,
        inX: -6.454455357567313e-16,
        inY: -10.5409255338946,
        outX: 6.454455357567313e-16,
        outY: 10.5409255338946,
      },
      {
        id: "b",
        x: 3.872673214540388e-15,
        y: 63.24555320336759,
        inX: -1.2908910715134625e-15,
        inY: -21.0818510677892,
        outX: 1.2908910715134625e-15,
        outY: 21.0818510677892,
      },
      {
        id: "c",
        x: 7.745346429080775e-15,
        y: 126.49110640673518,
        inX: -6.454455357567313e-16,
        inY: -10.5409255338946,
        outX: 6.454455357567313e-16,
        outY: 10.5409255338946,
      },
    ]);
    expectClose(rope({ angle: 90, points })(atProgress(0.5)), [
      {
        id: "a",
        x: 0,
        y: 0,
        inX: -10,
        inY: -3.3333333333333357,
        outX: 10,
        outY: 3.3333333333333357,
      },
      {
        id: "b",
        x: 60,
        y: 20.000000000000014,
        inX: -10.000000000000002,
        inY: -13.874258867227935,
        outX: 10.000000000000002,
        outY: 13.874258867227935,
      },
      {
        id: "c",
        x: 60.00000000000001,
        y: 83.2455532033676,
        inX: -1.1842378929335002e-15,
        inY: -10.5409255338946,
        outX: 1.1842378929335002e-15,
        outY: 10.5409255338946,
      },
    ]);
    expectClose(rope({ angle: 90, points })(atProgress(1)), [
      {
        id: "a",
        x: 0,
        y: 0,
        inX: -10,
        inY: -3.3333333333333357,
        outX: 10,
        outY: 3.3333333333333357,
      },
      { id: "b", x: 60, y: 20.000000000000014, inX: -20, inY: 0, outX: 20, outY: 0 },
      {
        id: "c",
        x: 120,
        y: 0,
        inX: -10,
        inY: 3.3333333333333357,
        outX: 10,
        outY: -3.3333333333333357,
      },
    ]);
  });

  it("hopLandings and DROP_LANDING match", () => {
    expectClose(hopLandings({ height: 200, bounces: 1, squash: 0.3, dx: 600 }), {
      landings: [0.48528137423857026, 0.8284271247461901],
      lastLanding: 0.8284271247461901,
    });
    expect(DROP_LANDING).toBe(0.75);
  });
});
