import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { parseSampleArgs } from "../src/scene/scene";

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
