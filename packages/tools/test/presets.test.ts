import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { listPresets, presetPath, readPreset, writePreset } from "../src/page/presets";
import { removeTemp } from "../../../test/support/temp";

const made: string[] = [];
function temp(): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-presets-"));
  made.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of made.splice(0)) removeTemp(dir);
});

describe("recorded presets", () => {
  it("round-trips events sorted by time", () => {
    const root = temp();
    const path = writePreset(root, "cookie", "take-1", [
      { name: "click", at: 900, target: "a" },
      { name: "scroll", at: 100, value: 40 },
    ]);
    expect(path).toBe(presetPath(root, "cookie", "take-1"));
    expect(path.replaceAll("\\", "/")).toContain(".gerak/presets/cookie/take-1.json");
    expect(readPreset(root, "cookie", "take-1")).toEqual([
      { name: "scroll", at: 100, value: 40 },
      { name: "click", at: 900, target: "a" },
    ]);
  });

  it("refuses a bad name when writing", () => {
    const root = temp();
    expect(() => writePreset(root, "cookie", "Bad Name", [])).toThrow(/Bad Name/);
    expect(() => writePreset(root, "cookie", "../x", [])).toThrow();
    expect(() => writePreset(root, "cookie", "nul", [])).toThrow();
    expect(() => writePreset(root, "cookie", "com1", [])).toThrow();
    expect(() => writePreset(root, "cookie", "nullish", [])).not.toThrow();
  });

  it("gives a reason naming the path for a missing file, bad JSON or a non-event entry", () => {
    const root = temp();
    const missing = readPreset(root, "cookie", "none");
    expect(missing).toHaveProperty("reason");
    expect(JSON.stringify(missing)).toContain("none.json");

    const path = presetPath(root, "cookie", "broken");
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "{nope");
    expect(JSON.stringify(readPreset(root, "cookie", "broken"))).toContain("broken.json");
    writeFileSync(path, JSON.stringify([{ name: "x" }]));
    const bad = readPreset(root, "cookie", "broken");
    expect("reason" in bad && bad.reason).toContain("broken.json");
    writeFileSync(path, JSON.stringify({ name: "x", at: 1 }));
    expect("reason" in readPreset(root, "cookie", "broken")).toBe(true);
  });

  it("reads a bad name as a reason", () => {
    expect(readPreset(temp(), "cookie", "../x")).toHaveProperty("reason");
  });

  it("lists names sorted", () => {
    const root = temp();
    expect(listPresets(root, "cookie")).toEqual([]);
    writePreset(root, "cookie", "b", []);
    writePreset(root, "cookie", "a", []);
    writePreset(root, "other", "z", []);
    expect(listPresets(root, "cookie")).toEqual(["a", "b"]);
  });
});
