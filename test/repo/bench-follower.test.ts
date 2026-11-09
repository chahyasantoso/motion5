import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("follower benchmark", () => {
  it("runs at the smallest size and prints the conditions and every field", () => {
    const out = execFileSync(process.execPath, ["scripts/bench-follower.mjs", "--sizes", "1x2"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    expect(out).toMatch(/^node v\d+/);
    expect(out).toMatch(/followers=1 segments=2 ms\/frame=\d+\.\d+ budget=\d+\.\d%/);
  });
});
