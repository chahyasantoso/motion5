import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COMMANDS } from "../../packages/tools/bin/commands.mjs";

const ROOT = new URL("../../", import.meta.url);

function trackedFiles(): string[] {
  const run = spawnSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" });
  return run.stdout
    .split("\0")
    .filter((file) => file !== "" && !/^plan\/|^docs\/ADR-|^package-lock\.json$/.test(file));
}

describe("the gerak command", () => {
  it("is the only way a tracked file runs a motion command", () => {
    const offenders = trackedFiles().filter((file) => {
      try {
        return readFileSync(new URL(file, ROOT), "utf8").includes(["npm run", "motion:"].join(" "));
      } catch {
        return false;
      }
    });
    expect(offenders).toEqual([]);
  });

  it("leaves no motion script in the root package.json but test:frames", () => {
    const manifest: { readonly scripts: Readonly<Record<string, string>> } = JSON.parse(
      readFileSync(new URL("package.json", ROOT), "utf8"),
    );
    expect(Object.keys(manifest.scripts).filter((name) => name.startsWith("motion:"))).toEqual([]);
    expect(manifest.scripts["test:frames"]).toBeDefined();
    expect(Object.keys(COMMANDS).length).toBeGreaterThan(0);
  });
});
