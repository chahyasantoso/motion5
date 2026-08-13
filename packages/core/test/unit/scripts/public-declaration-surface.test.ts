import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));

describe("public declaration surface (P1-9)", () => {
  it("keeps public patch contracts out of runtime internals", async () => {
    const engine = await readFile(join(root, "packages/core/src/engine.ts"), "utf8");
    const entry = await readFile(join(root, "packages/core/src/index.ts"), "utf8");

    // Engine may import ProjectRuntime for its private implementation closure. The boundary
    // that matters here is that public Patch types do not come from runtime/patch-registry.
    expect(engine).not.toMatch(/(?:Patch|PatchBatch|PatchListener).*from ["']\.\/runtime\//s);
    expect(engine).toContain('from "./contract/v5"');
    expect(entry).toContain("PatchBatch");
    expect(entry).toContain("PatchListener");
  });
});
