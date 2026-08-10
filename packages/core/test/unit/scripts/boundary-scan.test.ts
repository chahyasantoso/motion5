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
  engineViolationFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

const consumerInternalViolationFixture =
  "import type { Patch } from '../../core/src/runtime/patch-registry';";

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
    expect(importsBoundary(consumerInternalViolationFixture)).toBe(false);
  });

  it("executes the shipped scanner against the current tree", async () => {
    expect(await scan()).toEqual([]);
  });
});
