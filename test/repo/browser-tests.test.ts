import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BROWSER_TESTS } from "../browser-tests.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const PAGE_SERVER = /\b(withPage|captureFrames|measureFps|startStudio|createServer)\(/;

/** Whether `file` matches one of the browser project's patterns. */
function inBrowserProject(file: string): boolean {
  return BROWSER_TESTS.some((pattern) => {
    if (pattern.startsWith("**/")) return file.endsWith(pattern.slice(3).replace("*", ""));
    return file === pattern;
  });
}

describe("browser tests", () => {
  it("run every test file that starts a page server in the one-at-a-time project", () => {
    const files = execFileSync("git", ["ls-files", "*.test.ts"], { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .filter((file) => file !== "");
    const starting = files.filter((file) =>
      PAGE_SERVER.test(readFileSync(join(ROOT, file), "utf8")),
    );
    expect(starting.length).toBeGreaterThan(5);
    expect(starting.filter((file) => !inBrowserProject(file))).toEqual([]);
  });
});
