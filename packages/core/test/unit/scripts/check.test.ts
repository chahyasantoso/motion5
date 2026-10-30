import { describe, expect, it } from "vitest";
import { STEPS, run } from "../../../../../scripts/check.mjs";

function steps(codes: Record<string, number> = {}, logs: Record<string, string> = {}) {
  return (step: string) => ({ code: codes[step] ?? 0, log: logs[step] ?? "" });
}

function collect() {
  const lines: string[] = [];
  return { lines, log: (text: string) => lines.push(text) };
}

describe("check gate runner (S2)", () => {
  it("states one line per step when every step is green", () => {
    const { lines, log } = collect();
    expect(run(steps(), STEPS, log)).toBe(0);
    expect(lines).toEqual(STEPS.map((step) => `PASS ${step}`));
  });

  it("stops at the first failure and prints only that step's log", () => {
    const { lines, log } = collect();
    const code = run(
      steps(
        { "format:check": 1 },
        { "format:check": "Checking formatting...\ndrift.ts\n", typecheck: "never shown" },
      ),
      STEPS,
      log,
    );
    expect(code).toBe(1);
    expect(lines).toEqual([
      "PASS scan:raw-templates",
      "FAIL format:check",
      "Checking formatting...\ndrift.ts",
    ]);
  });

  it("names the step even when the step prints nothing", () => {
    const { lines, log } = collect();
    expect(run(steps({ typecheck: 7 }), STEPS, log)).toBe(7);
    expect(lines).toEqual(["PASS scan:raw-templates", "PASS format:check", "FAIL typecheck"]);
  });

  it("carries the failing step's own exit code out of the run", () => {
    const { log } = collect();
    expect(run(steps({ test: 2 }), STEPS, log)).toBe(2);
  });
});
