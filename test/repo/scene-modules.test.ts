import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const APPS = join(import.meta.dirname, "..", "..", "apps");

function sceneModules(folder: string = APPS): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const path = join(folder, entry.name);
    if (entry.isDirectory()) found.push(...sceneModules(path));
    else if (entry.name.endsWith("-scene.ts")) found.push(path);
  }
  return found;
}

describe("scene modules", () => {
  it("finds the scene modules under apps", () => {
    expect(sceneModules().length).toBeGreaterThan(0);
  });

  it("never touch window or own the page's readiness promise", () => {
    for (const file of sceneModules()) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/\bwindow\b/);
      expect(source, file).not.toContain("__motionReady");
    }
  });
});
