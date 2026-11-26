import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { removeTemp } from "../../../test/support/temp";

const HOOK = new URL("../bin/ts-resolve.mjs", import.meta.url).href;
let folder = "";

afterEach(() => {
  removeTemp(folder);
});

function importWith(hook: boolean): number | null {
  folder = mkdtempSync(join(tmpdir(), "gerak-ts-resolve-"));
  mkdirSync(join(folder, "parts"));
  writeFileSync(join(folder, "parts", "index.ts"), "export const two: number = 2;\n");
  writeFileSync(join(folder, "one.ts"), "export const one: number = 1;\n");
  writeFileSync(
    join(folder, "piece.ts"),
    'import { one } from "./one";\nimport { two } from "./parts";\nif (one + two !== 3) process.exit(2);\n',
  );
  const entry = pathToFileURL(join(folder, "piece.ts")).href;
  const code = hook
    ? `const { registerTsResolve } = await import(${JSON.stringify(HOOK)}); registerTsResolve(); await import(${JSON.stringify(entry)});`
    : `await import(${JSON.stringify(entry)});`;
  return spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8" })
    .status;
}

describe("registerTsResolve", () => {
  it("imports a brief's .ts files that name each other without extensions", () => {
    expect(importWith(true)).toBe(0);
  });

  it("is what makes them import: Node alone refuses them", () => {
    expect(importWith(false)).not.toBe(0);
  });
});
