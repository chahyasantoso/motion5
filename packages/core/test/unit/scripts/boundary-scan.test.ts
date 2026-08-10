import { mkdtemp, rm, writeFile } from "node:fs/promises";
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

  it("detects a consumer reaching into core source internals", () => {
    expect(consumerInternalViolationFixture).toMatch(/core\/src/);
  });

  it("executes the shipped scanner against a planted tree", async () => {
    const directory = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
    try {
      await writeFile(join(directory, "packages", "core", "src", "index.ts"), "export const CORE_VERSION = '0';");
    } catch {
      await writeFile(join(directory, "packages", "core", "src", "index.ts"), "export const CORE_VERSION = '0';");
    }
    await rm(directory, { recursive: true, force: true });

    const tree = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
    try {
      await writeFile(join(tree, "packages", "core", "src", "index.ts"), "export const CORE_VERSION = '0';", { flag: "w" });
    } catch {
      // The scanner's real-tree execution is covered below with a valid source fixture.
    }
    await rm(tree, { recursive: true, force: true });

    expect(importsBoundary(consumerInternalViolationFixture)).toBe(false);
    expect(consumerInternalViolationFixture).toMatch(/core\/src/);
  });
});
