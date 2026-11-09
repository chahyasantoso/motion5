import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../../../../..", import.meta.url));
const RETIRED = /\b(capabilityOf|dedicatedMembers|PluginCapability|UNJUDGED|NO_PLUGIN)\b/;

function sources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) sources(path, out);
    else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) out.push(path);
  }
  return out;
}

function roots(): readonly string[] {
  const roots: string[] = [];
  for (const group of ["packages", "apps"]) {
    for (const entry of readdirSync(join(ROOT, group), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const src = join(ROOT, group, entry.name, "src");
      try {
        readdirSync(src);
        roots.push(src);
      } catch {
        continue;
      }
    }
  }
  return roots;
}

describe("capability vocabulary scan", () => {
  it("has no retired capability fallback under src", () => {
    const offenders: string[] = [];
    for (const root of roots()) {
      for (const path of sources(root)) {
        if (RETIRED.test(readFileSync(path, "utf8"))) offenders.push(relative(ROOT, path));
      }
    }
    expect(offenders).toEqual([]);
  });
});
