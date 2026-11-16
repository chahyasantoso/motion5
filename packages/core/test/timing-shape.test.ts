import { describe, expect, it } from "vitest";
import * as core from "@gerak/core";
import { code } from "../../../test/repo/helpers/source-region";

const time: core.Time = { progress: 0.5, clock: { kind: "timed", elapsed: 500, length: 1000 } };

/** The shapes a time export may take; a new kind of helper is a decision, so it is a new row here. */
const SHAPES = {
  plain: (name: string, args: readonly unknown[]) => {
    const answer = call(name, time, ...args);
    expect(answer, name).toHaveProperty("progress");
    expect(answer, name).toHaveProperty("clock");
  },
  timing: (name: string, args: readonly unknown[], ofArgs: readonly unknown[]) => {
    const made = call(name, ...args);
    expect(timingOf(made)(time, ...ofArgs), name).toHaveProperty("progress");
  },
  spans: (name: string, args: readonly unknown[]) => {
    const made = call(name, ...args);
    if (!Array.isArray(made)) throw new TypeError(name + " is not a list");
    expect(made.length, name).toBeGreaterThan(0);
    for (const each of made) expect(timingOf(each)(time), name).toHaveProperty("progress");
  },
  constructor: (name: string, args: readonly unknown[]) => {
    expect(call(name, ...args), name).toHaveProperty("clock");
  },
  reader: (name: string, args: readonly unknown[]) => {
    expect(typeof call(name, ...args), name).toBe("number");
  },
  constant: (name: string) => {
    expect(Reflect.get(core, name), name).toEqual({ kind: "untimed" });
  },
  picker: (name: string, args: readonly unknown[]) => {
    expect(call(name, ...args), name).toBe(0.5);
  },
} as const;

type Row = {
  readonly shape: keyof typeof SHAPES;
  readonly args?: readonly unknown[];
  readonly ofArgs?: readonly unknown[];
};

/** Every value core exports from its time folder, by the shape it has. */
const ALLOWED: Readonly<Record<string, Row>> = {
  reversed: { shape: "plain", args: [] },
  repeated: { shape: "plain", args: [2] },
  timeAt: { shape: "plain", args: [250] },
  withProgress: { shape: "plain", args: [0.25] },
  span: { shape: "timing", args: [0, 1000] },
  lanes: { shape: "timing", args: [[1, 1], 0.25], ofArgs: [1] },
  loop: { shape: "timing", args: [500] },
  chain: { shape: "spans", args: [[100, 200]] },
  liveAt: { shape: "constructor", args: [10] },
  atProgress: { shape: "constructor", args: [0.5] },
  elapsedOf: { shape: "reader", args: [time.clock] },
  UNTIMED: { shape: "constant" },
  sequence: { shape: "picker", args: [time, [[core.span(0, 1000), (t: core.Time) => t.progress]]] },
};

function call(name: string, ...args: readonly unknown[]): unknown {
  const fn: unknown = Reflect.get(core, name);
  if (typeof fn !== "function") throw new TypeError(`${name} is not a function`);
  return Reflect.apply(fn, undefined, args);
}

function timingOf(value: unknown): (at: core.Time, ...args: unknown[]) => unknown {
  if (
    typeof value === "object" &&
    value !== null &&
    "of" in value &&
    typeof value.of === "function"
  ) {
    const of = value.of;
    return (at, ...args) => Reflect.apply(of, value, [at, ...args]);
  }
  throw new TypeError("not a Timing");
}

function timeExports(): string[] {
  const index = code(new URL("../src/index.ts", import.meta.url));
  const blocks = index.matchAll(/export\s*\{([^}]*)\}\s*from\s*"\.\/time\/[^"]+"/g);
  return [...blocks].flatMap((block) =>
    (block[1] ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry !== "" && !entry.startsWith("type ")),
  );
}

describe("time helpers have two shapes", () => {
  it("lists every value exported from the time folder in the allow table", () => {
    const names = timeExports();
    expect(names.length).toBeGreaterThan(0);
    const missing = names.filter((name) => !(name in ALLOWED));
    expect(missing, `time exports with no allowed shape: ${missing.join(", ")}`).toEqual([]);
    expect(Object.keys(ALLOWED).filter((name) => !names.includes(name))).toEqual([]);
  });

  for (const [name, row] of Object.entries(ALLOWED))
    it(`${name} is a ${row.shape}`, () => {
      SHAPES[row.shape](name, row.args ?? [], row.ofArgs ?? []);
    });
});
