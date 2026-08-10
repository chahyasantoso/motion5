import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  bannedSymbol,
  extractExportNames,
  importsBoundary,
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

describe("boundary scan planted violations", () => {
  it("passes a clean fixture", () => {
    expect(importsBoundary(cleanFixture)).toBe(false);
    expect(importsRenderer(cleanFixture)).toBe(false);
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

  it("extracts exports outside the public allow list", () => {
    expect(extractExportNames(publicExportViolationFixture)).toEqual(["InternalGraphRuntime"]);
  });

  it("executes the shipped scanner against a planted consumer tree", async () => {
    const directory = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
    try {
      const indexPath = join(directory, "packages", "core", "src", "index.ts");
      const consumerPath = join(directory, "packages", "react", "src", "patch-store.ts");
      await mkdir(join(directory, "packages", "core", "src"), { recursive: true });
      await mkdir(join(directory, "packages", "react", "src"), { recursive: true });
      await writeFile(indexPath, "export const CORE_VERSION = '0';");
      await writeFile(consumerPath, consumerInternalViolationFixture);

      const violations = await scan(directory);
      expect(violations).toContain("packages/react/src/patch-store.ts: core source-internal import");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
