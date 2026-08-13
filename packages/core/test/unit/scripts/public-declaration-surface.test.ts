import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));

describe("public declaration surface (P1-9)", () => {
  it("keeps the public engine closure out of runtime and graph internals", async () => {
    const engine = await readFile(join(root, "packages/core/src/engine.ts"), "utf8");
    const entry = await readFile(join(root, "packages/core/src/index.ts"), "utf8");
    expect(engine).not.toMatch(/from ["']\.\/runtime\//);
    expect(engine).not.toMatch(/from ["']\.\/graph\//);
    expect(engine).toContain('from "./contract/v5"');
    expect(entry).toContain("PatchBatch");
    expect(entry).toContain("PatchListener");
  });
});
