import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { installedPackages } from "../src/scene/installed";
import { removeTemp } from "../../../test/support/temp";

const temp = mkdtempSync(join(tmpdir(), "gerak-installed-"));
afterAll(() => removeTemp(temp));

function install(base: string, name: string): void {
  const folder = join(base, "node_modules", "@gerak", name);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "package.json"), JSON.stringify({ name: `@gerak/${name}` }));
}

describe("installed packages", () => {
  it("lists a package once, the nearest first, as node resolves it", () => {
    const inner = join(temp, "outer", "inner");
    mkdirSync(inner, { recursive: true });
    install(join(temp, "outer"), "x");
    install(inner, "x");
    install(join(temp, "outer"), "y");
    const found = installedPackages([inner]);
    expect(found.filter(({ name }) => name === "@gerak/x").map(({ folder }) => folder)).toEqual([
      realpathSync(join(inner, "node_modules", "@gerak", "x")),
    ]);
    expect(found.some(({ name }) => name === "@gerak/y")).toBe(true);
  });
});
