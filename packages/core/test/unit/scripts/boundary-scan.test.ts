import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  bannedSymbol,
  extractExportNames,
  importsBoundary,
  importsCoreInternals,
  importsRenderer,
  importsTestingEntrypoint,
  scan,
  walk,
} from "../../../../../scripts/boundary-scan.mjs";
import {
  appInternalViolationFixture,
  bannedSymbolFixture,
  cleanFixture,
  consumerInternalViolationFixture,
  engineViolationFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
  testingEntrypointViolationFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));

/**
 * Plants one of every violation class the scanner owns into a throwaway tree:
 * a core layer file and a core package entry that import an engine and name a
 * banned symbol, a core entry that exports outside the allow list, and a
 * consumer package that is hardcoded nowhere and reaches into core internals.
 */
async function plantFixtureRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
  const leaking = `${engineViolationFixture}\n${bannedSymbolFixture}\n`;
  await mkdir(join(root, "packages", "core", "src", "runtime"), { recursive: true });
  await mkdir(join(root, "packages", "vue", "src"), { recursive: true });
  await writeFile(
    join(root, "packages", "core", "src", "index.ts"),
    `${publicExportViolationFixture}\n`,
  );
  await writeFile(join(root, "packages", "core", "src", "internal.ts"), leaking);
  await writeFile(join(root, "packages", "core", "src", "runtime", "leak.ts"), leaking);
  await writeFile(
    join(root, "packages", "vue", "src", "index.ts"),
    `${rendererViolationFixture}\n${consumerInternalViolationFixture}\n`,
  );
  return root;
}

async function plantTestingEntrypointRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-testing-"));
  await mkdir(join(root, "packages", "core", "src", "testing"), { recursive: true });
  await mkdir(join(root, "apps", "demo", "src"), { recursive: true });
  await mkdir(join(root, "packages", "test-consumer", "src"), { recursive: true });
  
  // W-4: testing layer file that imports react (should fail renderer check)
  await writeFile(
    join(root, "packages", "core", "src", "testing", "fakes.ts"),
    `import React from 'react'; export const createFakeScheduler = () => {};\n`,
  );
  
  // W-2: app that imports testing entrypoint
  await writeFile(
    join(root, "apps", "demo", "src", "main.ts"),
    `${testingEntrypointViolationFixture}\n`,
  );
  
  // W-3: app that imports core internals (the #164 mistake)
  await writeFile(
    join(root, "apps", "demo", "src", "bug.ts"),
    `${appInternalViolationFixture}\n`,
  );
  
  // Consumer package importing testing entrypoint
  await writeFile(
    join(root, "packages", "test-consumer", "src", "index.ts"),
    `${testingEntrypointViolationFixture}\n`,
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

async function withTestingEntrypointRoot<T>(use: (root: string) => Promise<T>): Promise<T> {
  const root = await plantTestingEntrypointRoot();
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

  describe("W-1: importsTestingEntrypoint predicate", () => {
    it("fails on @motion5/core/testing imports", () => {
      expect(importsTestingEntrypoint(testingEntrypointViolationFixture)).toBe(true);
    });

    it("fails on relative core/src/testing imports", () => {
      expect(importsTestingEntrypoint("import { createFakeScheduler } from '../../core/src/testing/fakes';")).toBe(true);
    });

    it("passes for production adapters and plugins", () => {
      expect(importsTestingEntrypoint("import { createBrowserClock } from '@motion5/core/adapters/browser-clock';")).toBe(false);
      expect(importsTestingEntrypoint("import { fkPlugin } from '@motion5/core/plugins/fk';")).toBe(false);
    });

    it("passes for the main entrypoint", () => {
      expect(importsTestingEntrypoint("import { Engine } from '@motion5/core';")).toBe(false);
    });
  });
});

describe("boundary scan planted violations", () => {
  it("reports every planted violation class through the shipped scanner", async () => {
    const violations = await withPlantedRoot((root) => scan(root));
    expect(violations).toEqual([
      "packages/core/src/runtime/leak.ts: renderer or engine import",
      "packages/core/src/runtime/leak.ts: banned compatibility symbol",
      "packages/core/src/internal.ts: renderer or engine import",
      "packages/core/src/internal.ts: banned compatibility symbol",
      "packages/vue/src/index.ts: core source-internal import",
      "packages/core/src/index.ts: public export InternalGraphRuntime is not allow-listed",
    ]);
  });

  it("reads a core package entry that is not engine.ts", async () => {
    const violations = await withPlantedRoot((root) => scan(root));
    expect(violations).toContain("packages/core/src/internal.ts: renderer or engine import");
    expect(violations).toContain("packages/core/src/internal.ts: banned compatibility symbol");
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

  it("G-5: no file under packages/core/src imports gsap", async () => {
    const offenders: string[] = [];
    for (const path of await walk(join(root, "packages", "core", "src"))) {
      const source = await readFile(path, "utf8");
      if (/(?:from|import)\s*["']gsap(?:["'\/])/.test(source)) offenders.push(path);
    }
    expect(offenders).toEqual([]);
  });

  describe("W-2: apps are discovered and scanned for testing entrypoint imports", () => {
    it("reports testing entrypoint import from an app", async () => {
      const violations = await withTestingEntrypointRoot((root) => scan(root));
      expect(violations).toContain("apps/demo/src/main.ts: test-only entrypoint import");
    });
  });

  describe("W-3: apps are discovered and scanned for core source-internal imports", () => {
    it("reports core source-internal import from an app (the #164 mistake)", async () => {
      const violations = await withTestingEntrypointRoot((root) => scan(root));
      expect(violations).toContain("apps/demo/src/bug.ts: core source-internal import");
    });
  });

  describe("W-4: testing layer files are scanned for renderer/engine imports", () => {
    it("reports renderer import from the testing layer", async () => {
      const violations = await withTestingEntrypointRoot((root) => scan(root));
      expect(violations).toContain("packages/core/src/testing/fakes.ts: renderer or engine import");
    });
  });

  describe("W-6: real repository regression guard", () => {
    it("executes the shipped scanner against the current tree and expects no violations", async () => {
      expect(await scan()).toEqual([]);
    });
  });
});
