import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  bannedSymbol,
  extractExportNames,
  importsBoundary,
  importsCoreInternals,
  importsRenderer,
  scan,
} from "../../../../../scripts/boundary-scan.mjs";
import {
  bannedSymbolFixture,
  cleanFixture,
  consumerInternalViolationFixture,
  engineViolationFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

/**
 * Plants one of every violation class the scanner owns into a throwaway tree:
 * a core layer file that imports an engine and names a banned symbol, a core
 * entry that exports outside the allow list, and a consumer package that is not
 * hardcoded anywhere and reaches into core source internals.
 */
async function plantFixtureRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
  await mkdir(join(root, "packages", "core", "src", "runtime"), { recursive: true });
  await mkdir(join(root, "packages", "vue", "src"), { recursive: true });
  await writeFile(
    join(root, "packages", "core", "src", "index.ts"),
    `${publicExportViolationFixture}\n`,
  );
  await writeFile(
    join(root, "packages", "core", "src", "runtime", "leak.ts"),
    `${engineViolationFixture}\n${bannedSymbolFixture}\n`,
  );
  await writeFile(
    join(root, "packages", "vue", "src", "index.ts"),
    `${rendererViolationFixture}\n${consumerInternalViolationFixture}\n`,
  );
  return root;
}

async function withPlantedRoot<T>(use: (root: string) => Promise<T>): Promise<T> {
  const root = await plantFixtureRoot();
  try {
    return await use(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

describe("boundary scan predicates", () => {
  it("passes a clean fixture", () => {
    expect(importsBoundary(cleanFixture)).toBe(false);
    expect(importsRenderer(cleanFixture)).toBe(false);
    expect(importsCoreInternals(cleanFixture)).toBe(false);
    expect(bannedSymbol(cleanFixture)).toBe(false);
  });

  it("fails on renderer and animation-engine imports", () => {
    expect(importsBoundary(rendererViolationFixture)).toBe(true);
    expect(importsRenderer(rendererViolationFixture)).toBe(true);
    expect(importsBoundary(engineViolationFixture)).toBe(true);
    expect(importsRenderer(engineViolationFixture)).toBe(true);
  });

  it("fails on banned compatibility vocabulary", () => {
    expect(bannedSymbol(bannedSymbolFixture)).toBe(true);
  });

  it("fails on a consumer reaching into core source internals", () => {
    expect(importsCoreInternals(consumerInternalViolationFixture)).toBe(true);
    expect(importsBoundary(consumerInternalViolationFixture)).toBe(false);
  });

  it("extracts exports outside the public allow list", () => {
    expect(extractExportNames(publicExportViolationFixture)).toEqual(["InternalGraphRuntime"]);
  });
});

describe("boundary scan planted violations", () => {
  it("reports every planted violation class through the shipped scanner", async () => {
    const violations = await withPlantedRoot((root) => scan(root));
    expect(violations).toEqual([
      "packages/core/src/runtime/leak.ts: renderer or engine import",
      "packages/core/src/runtime/leak.ts: banned compatibility symbol",
      "packages/vue/src/index.ts: core source-internal import",
      "packages/core/src/index.ts: public export InternalGraphRuntime is not allow-listed",
    ]);
  });

  it("discovers a consumer package that no list mentions", async () => {
    const violations = await withPlantedRoot((root) => scan(root));
    expect(violations).toContain("packages/vue/src/index.ts: core source-internal import");
  });

  it("keeps a consumer renderer import legal", async () => {
    const violations = await withPlantedRoot((root) => scan(root));
    expect(violations).not.toContain("packages/vue/src/index.ts: renderer or engine import");
  });

  it("executes the shipped scanner against the current tree", async () => {
    expect(await scan()).toEqual([]);
  });
});
