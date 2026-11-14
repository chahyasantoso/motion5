import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { parseSampleArgs, readSceneModule, sampleScene, watchScene } from "../src/scene/scene";
import * as moving from "./fixtures/review-clean-scene";

describe("parseSampleArgs", () => {
  it("parses a valid time request with nodes", () => {
    expect(parseSampleArgs(["s.ts", "--at", "0,250,500", "--nodes", "m/a,m/b"])).toEqual({
      kind: "ok",
      file: "s.ts",
      request: { kind: "time", ms: [0, 250, 500] },
      nodes: ["m/a", "m/b"],
    });
  });

  it("parses a valid progress request", () => {
    expect(parseSampleArgs(["--progress", "0,0.5,1", "s.ts"])).toEqual({
      kind: "ok",
      file: "s.ts",
      request: { kind: "progress", progress: [0, 0.5, 1] },
    });
  });

  it("reads fields", () => {
    expect(parseSampleArgs(["s.ts", "--at", "0", "--fields", "y,scaleY"])).toMatchObject({
      kind: "ok",
      fields: ["y", "scaleY"],
    });
    expect(parseSampleArgs(["s.ts", "--at", "0", "--fields"]).kind).toBe("usage");
  });

  it.each([
    ["both flags", ["s.ts", "--at", "0", "--progress", "0"]],
    ["neither flag", ["s.ts"]],
    ["descending values", ["s.ts", "--at", "500,250"]],
    ["a non-number", ["s.ts", "--at", "0,abc"]],
    ["a negative number", ["s.ts", "--at", "-1"]],
    ["progress above 1", ["s.ts", "--progress", "2"]],
    ["a missing file", ["--at", "0"]],
    ["an unknown flag", ["s.ts", "--at", "0", "--bogus", "1"]],
  ])("gives usage for %s", (_name, argv) => {
    expect(parseSampleArgs(argv).kind).toBe("usage");
  });
});

describe("motion:sample entry", () => {
  function run(...args: string[]) {
    return spawnSync(process.execPath, ["packages/tools/bin/motion-sample.mjs", ...args], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
  }

  it("prints an accepted result for a scene and exits 0", () => {
    const out = run("packages/tools/test/fixtures/review-moving-scene.ts", "--at", "1000");
    expect(out.status).toBe(0);
    expect(JSON.parse(out.stdout)).toMatchObject({
      kind: "accepted",
      samples: [{ at: 1000, targets: { still: { x: 100 }, drift: { y: 50 } } }],
    });
  });

  it("gives usage for a file that is not a scene and exits 1", () => {
    const out = run("project.json", "--at", "0");
    expect(out.status).toBe(1);
    expect(JSON.parse(out.stdout).kind).toBe("usage");
  });
});

describe("--watch", () => {
  const module = (() => {
    const read = readSceneModule(moving);
    if ("reason" in read) throw new Error(read.reason);
    return read;
  })();

  it("parses with the defaults and with every option", () => {
    expect(parseSampleArgs(["s.ts", "--watch", "ball.x"])).toEqual({
      kind: "watch",
      file: "s.ts",
      path: "ball.x",
      from: 0,
      every: 16,
    });
    expect(
      parseSampleArgs([
        "s.ts",
        "--watch",
        "letters[1].x",
        "--from",
        "100",
        "--to",
        "500",
        "--every",
        "50",
      ]),
    ).toMatchObject({ kind: "watch", path: "letters[1].x", from: 100, to: 500, every: 50 });
  });

  it.each([
    ["--at", "0"],
    ["--progress", "0"],
    ["--nodes", "ball"],
    ["--fields", "x"],
  ])("refuses --watch with %s", (flag, value) => {
    expect(parseSampleArgs(["s.ts", "--watch", "ball.x", flag, value]).kind).toBe("usage");
  });

  it("refuses a malformed watch", () => {
    expect(parseSampleArgs(["s.ts", "--watch"]).kind).toBe("usage");
    expect(parseSampleArgs(["s.ts", "--watch", "ball..x"]).kind).toBe("usage");
    expect(parseSampleArgs(["s.ts", "--watch", "ball.x", "--every", "0"]).kind).toBe("usage");
    expect(parseSampleArgs(["s.ts", "--watch", "ball.x", "--from", "9", "--to", "3"]).kind).toBe(
      "usage",
    );
    expect(parseSampleArgs(["s.ts", "--at", "0", "--every", "5"]).kind).toBe("usage");
  });

  it("answers the values sampleScene gives, by a dotted or bracketed path", () => {
    const ms = [0, 500, 1000, 1500];
    const sampled = sampleScene(module, { kind: "time", ms });
    const watched = watchScene(module, { path: "ball.x", from: 0, to: 1500, every: 500 });
    expect(watched).toEqual({
      kind: "watched",
      path: "ball.x",
      samples: sampled.map(({ at, targets }) => ({
        at,
        value: Reflect.get(Object(targets.ball), "x"),
      })),
    });
    const bracket = watchScene(module, { path: "letters[1].x", from: 0, to: 1500, every: 500 });
    const dotted = watchScene(module, { path: "letters.1.x", from: 0, to: 1500, every: 500 });
    expect(bracket).toMatchObject({ kind: "watched" });
    expect(bracket.kind === "watched" ? bracket.samples : []).toEqual(
      dotted.kind === "watched" ? dotted.samples : null,
    );
    expect(bracket.kind === "watched" ? bracket.samples[2]?.value : 0).toBe(140);
  });

  it("runs to the scene's end when --to is absent", () => {
    const watched = watchScene(module, { path: "ball.x", from: 0, every: 1000 });
    expect(watched.kind === "watched" ? watched.samples.map(({ at }) => at) : []).toEqual([
      0, 1000, 2000,
    ]);
  });

  it("refuses an unknown field and an unknown target, listing what the scene returns", () => {
    const field = watchScene(module, { path: "ball.z", from: 0, every: 500 });
    expect(field).toMatchObject({ kind: "usage" });
    expect(field.kind === "usage" ? field.message : "").toMatch(
      /ball\.z.*ball\.x, ball\.y, ball\.rotationY, ball\.scale/,
    );
    const target = watchScene(module, { path: "nope.x", from: 0, every: 500 });
    expect(target.kind === "usage" ? target.message : "").toMatch(/"nope".*ball, letters/);
  });
});
