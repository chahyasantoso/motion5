import { describe, expect, it } from "vitest";
import {
  drop,
  hop,
  hopLandings,
  nod,
  overshoot,
  pop,
  pulse,
  rise,
  rope,
  shake,
  slide,
  smudge,
  swing,
  trace,
  unfold,
  wipe,
  wobble,
} from "@gerak/moves";

/** Options as a caller outside the type system would pass them. */
function loose<T>(json: string): T {
  return JSON.parse(json);
}

const points = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
];

const refusals: readonly (readonly [string, () => unknown, string])[] = [
  ["drop", () => drop({ distance: -1 }), 'drop: option "distance" must be at least 0.'],
  ["drop", () => drop(loose("{}")), 'drop: option "distance" is required.'],
  ["hop", () => hop({ height: 1, bounces: 17 }), 'hop: option "bounces" must be at most 16.'],
  [
    "hopLandings",
    () => hopLandings({ height: 1, bounces: 1, decay: 0 }),
    'hop: option "decay" must be at least 0.01.',
  ],
  ["nod", () => nod({ distance: -1 }), 'nod: option "distance" must be at least 0.'],
  ["overshoot", () => overshoot({ share: 0.95 }), 'overshoot: option "share" must be at most 0.9.'],
  ["pop", () => pop({ overshoot: 2 }), 'pop: option "overshoot" must be at most 1.'],
  ["pulse", () => pulse({ amount: 3 }), 'pulse: option "amount" must be at most 2.'],
  ["rise", () => rise({ distance: -5 }), 'rise: option "distance" must be at least 0.'],
  [
    "rope",
    () => rope({ points: points.slice(0, 1) }),
    'rope: option "points" needs at least 2 rows.',
  ],
  [
    "rope",
    () => rope({ points, release: loose('"sideways"') }),
    'rope: option "release" must be one of pin, free.',
  ],
  ["shake", () => shake({ distance: -1 }), 'shake: option "distance" must be at least 0.'],
  [
    "slide",
    () => slide({ distance: 10, from: loose('"up"') }),
    'slide: option "from" must be one of left, right, top, bottom.',
  ],
  ["slide", () => slide({ distance: Number.NaN }), 'slide: option "distance" must be a number.'],
  [
    "smudge",
    () => smudge({ amount: 1, build: 0.01 }),
    'smudge: option "build" must be at least 0.05.',
  ],
  [
    "swing",
    () => swing({ angle: 10, anchor: loose('"middle"') }),
    'swing: option "anchor" must be one of center, bottom, top, left, right.',
  ],
  ["trace", () => trace({ tail: 0 }), 'trace: option "tail" must be at least 0.001.'],
  [
    "unfold",
    () => unfold({ from: loose('"middle"') }),
    'unfold: option "from" must be one of top, bottom, left, right.',
  ],
  ["wipe", () => wipe({ radius: -1, x: 0, y: 0 }), 'wipe: option "radius" must be at least 0.'],
  ["wobble", () => wobble({ angle: -1 }), 'wobble: option "angle" must be at least 0.'],
];

describe("a refused option", () => {
  it.each(refusals)("throws a RangeError when %s is built", (_move, build, message) => {
    expect(build).toThrow(RangeError);
    expect(build).toThrow(message);
  });

  it("leaves a call with every option valid alone", () => {
    expect(() => drop({ distance: 0 })).not.toThrow();
    expect(() => slide({ distance: 0, from: "bottom" })).not.toThrow();
  });
});
