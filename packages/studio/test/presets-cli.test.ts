import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writePreset } from "@gerak/tools/page";
import { afterEach, describe, expect, it } from "vitest";
import { runPresets } from "../src/presets-cli";

const made: string[] = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("gerak studio presets", () => {
  it("lists a piece's recorded presets from the files", () => {
    const root = mkdtempSync(join(tmpdir(), "gerak-presets-cli-"));
    made.push(root);
    writePreset(root, "demo", "b", []);
    writePreset(root, "demo", "a", []);
    const result = runPresets(["--root", root, "--piece", "demo"]);
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.text)).toEqual({ piece: "demo", names: ["a", "b"] });
  });

  it("refuses an unknown flag and a missing piece", () => {
    expect(runPresets(["--nope", "x"]).ok).toBe(false);
    const root = mkdtempSync(join(tmpdir(), "gerak-presets-cli-"));
    made.push(root);
    expect(runPresets(["--root", root]).ok).toBe(false);
  });
});
