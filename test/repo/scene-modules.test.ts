import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const APPS = join(import.meta.dirname, "..", "..", "apps");

function sceneModules(): string[] {
  const found: string[] = [];
  for (const app of readdirSync(APPS, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    const src = join(APPS, app.name, "src");
    let names: string[] = [];
    try {
      names = readdirSync(src);
    } catch {
      continue;
    }
    for (const name of names) if (name.endsWith("-scene.ts")) found.push(join(src, name));
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
