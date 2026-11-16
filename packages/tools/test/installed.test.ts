import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { installedPackages } from "../src/scene/installed";

const temp = mkdtempSync(join(tmpdir(), "gerak-installed-"));
afterAll(() => rmSync(temp, { recursive: true, force: true }));

function install(base: string, name: string, commands: string): void {
  const folder = join(base, "node_modules", "@gerak", name);
  mkdirSync(folder, { recursive: true });
  writeFileSync(
    join(folder, "package.json"),
    JSON.stringify({ name: `@gerak/${name}`, gerak: { commands } }),
  );
}

describe("installed packages", () => {
  it("lists a package once, the nearest first, as node resolves it", () => {
    const inner = join(temp, "outer", "inner");
    mkdirSync(inner, { recursive: true });
    install(join(temp, "outer"), "x", "outer.mjs");
    install(inner, "x", "inner.mjs");
    install(join(temp, "outer"), "y", "y.mjs");
    const found = installedPackages([inner]);
    expect(found.filter(({ name }) => name === "@gerak/x").map(({ commands }) => commands)).toEqual(
      ["inner.mjs"],
    );
    expect(found.some(({ name }) => name === "@gerak/y")).toBe(true);
  });
});
