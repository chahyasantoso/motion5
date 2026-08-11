import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { scanAcceptance } from "../../../../../scripts/acceptance-scan.mjs";

describe("acceptance mapping scan (D3)", () => {
  it("passes the repository map", async () => {
    await expect(scanAcceptance()).resolves.toEqual([]);
  });

  it("reports a mapped test that does not exist", async () => {
    const root = await mkdtemp(join(tmpdir(), "motion5-acceptance-"));
    try {
      await mkdir(join(root, "docs"), { recursive: true });
      await writeFile(
        join(root, "docs", "acceptance-map.json"),
        JSON.stringify({ version: 1, items: [{ id: "missing", test: "test/missing.test.ts" }] }),
      );
      await expect(scanAcceptance(root)).resolves.toEqual(["missing: missing test/missing.test.ts"]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
