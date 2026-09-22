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
  importsDomainLayer,
  importsDomainSink,
  importsRenderer,
  importsTestingEntrypoint,
  scan,
  walk,
} from "../../../../../scripts/boundary-scan.mjs";
import {
  adapterEntrypointFixture,
  appCoreInternalViolationFixture,
  bannedSymbolFixture,
  cleanFixture,
  consumerInternalViolationFixture,
  coreEntrypointFixture,
  engineViolationFixture,
  pluginEntrypointFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
  testingEntrypointViolationFixture,
  testingSourcePathViolationFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));
const WORKSPACES = JSON.stringify({ workspaces: ["packages/*", "apps/*"] });
const PACKAGES_ONLY = JSON.stringify({ workspaces: ["packages/*"] });

/**
 * Plants one of every violation class the scanner owns into a throwaway tree:
 * a core layer file and a core package entry that import an engine and name a
 * banned symbol, a core entry that exports outside the allow list, and a
 * consumer package that is hardcoded nowhere and reaches into core internals.
 * The root manifest is planted too, because it is where the scan reads the set
 * of workspace roots from rather than naming them itself.
 */
async function plantFixtureRoot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
  const leaking = `${engineViolationFixture}\n${bannedSymbolFixture}\n`;
  await mkdir(join(root, "packages", "core", "src", "runtime"), { recursive: true });
  await mkdir(join(root, "packages", "vue", "src"), { recursive: true });
  await writeFile(join(root, "package.json"), WORKSPACES);
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

async function withPlantedRoot<T>(use: (root: string) => Promise<T>): Promise<T> {
  const root = await plantFixtureRoot();
  try {
    return await use(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

/**
 * Plants the workspace shape the scan is meant to see: a root manifest that declares where
 * workspaces live, an app that both reaches into core source and imports the test-only
 * entrypoint, and a core testing layer that imports a renderer. `apps/` is the workspace #164 got
 * wrong and the one no gate in this file could see, so the tree exists to prove the scan can fail
 * there rather than to observe that today it does not.
 */
async function plantWorkspaceRoot(manifest: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "motion5-workspaces-"));
  await mkdir(join(root, "apps", "demo", "src"), { recursive: true });
  await mkdir(join(root, "packages", "core", "src", "testing"), { recursive: true });
  await writeFile(join(root, "package.json"), manifest);
  await writeFile(
    join(root, "apps", "demo", "src", "main.ts"),
    `${appCoreInternalViolationFixture}\n${testingEntrypointViolationFixture}\n`,
  );
  await writeFile(
    join(root, "packages", "core", "src", "testing", "fakes.ts"),
    `${rendererViolationFixture}\n`,
  );
  return root;
}

async function withWorkspaceRoot<T>(
  manifest: string,
  use: (root: string) => Promise<T>,
): Promise<T> {
  const root = await plantWorkspaceRoot(manifest);
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

  it("extracts every retired sink spelling from its module specifier", () => {
    for (const source of [
      'import { unreachable } from "../domain/exhaustive.js";',
      'export { unreachable } from "../../domain/exhaustive.mjs";',
      'const load = import("../domain/exhaustive.ts");',
      'const load = require("..\\domain\\exhaustive");',
    ])
      expect(importsDomainSink(source)).toBe(true);
  });

  it("keeps legitimate domain imports, the new sink, aliases, and longer names clean", () => {
    for (const source of [
      'import { track } from "../domain/track";',
      'import { track } from "../domain/track.ts";',
      'import { compiler } from "../../domain/keyframe-compiler";',
      'import type { Plugin } from "../../domain/plugins";',
      'import type { Plugin } from "../../domain/plugins.js";',
      'import { exhaustive } from "../lang/exhaustive";',
      'import { helpers } from "../domain/exhaustive-helpers";',
      'import { sink } from "@motion5/core/domain/exhaustive";',
      "const load = import(path);",
    ])
      expect(importsDomainSink(source)).toBe(false);
  });

  it("reads any domain import for the broad rule and only the sink for the narrow one", () => {
    // The two questions the scanner now asks, and the asymmetry between them is the whole point:
    // `contract/` and `ports/` may not reach `domain/` at all, while `adapters/` still legitimately
    // reaches `domain/keyframe-compiler` and `domain/plugins` and may only be held to the sink.
    // Backslash normalisation and the `.js`/`.mjs`/`.ts` suffixes are shared, because one extractor
    // owns them. See ADR-099 and ADR-102.
    for (const source of [
      'import { o } from "../lang/outcome";',
      'import { u } from "../lang/exhaustive";',
      'import type { D } from "../contract/v5";',
      'import { x } from "../domain-helpers/y";',
      'import { s } from "@motion5/core/domain/exhaustive";',
      "const load = import(path);",
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
      expect(importsDomainSink(source)).toBe(false);
    }
    for (const source of [
      'import { compiler } from "../../domain/keyframe-compiler";',
      'import type { Plugin } from "../../domain/plugins.js";',
      'const load = import("../domain/track");',
      'import { helpers } from "../domain/exhaustive-helpers";',
    ]) {
      expect(importsDomainLayer(source)).toBe(true);
      expect(importsDomainSink(source)).toBe(false);
    }
    for (const source of [
      'import { unreachable } from "../domain/exhaustive.js";',
      'export { unreachable } from "../../domain/exhaustive.mjs";',
      'const load = require("..\\domain\\exhaustive");',
    ]) {
      expect(importsDomainLayer(source)).toBe(true);
      expect(importsDomainSink(source)).toBe(true);
    }
  });

  it("reads a specifier from code rather than from prose", () => {
    // The repair this gate needed before it could ship. Measured on the first cut: a `contract/`
    // module whose only mention of the layer was the line comment `used to read from
    // "../domain/outcome"` returned one `inward domain import` from the shipped scan, with no
    // import anywhere in the file. This repository quotes module paths in prose constantly, so a
    // gate a documentation edit can turn red is a gate that gets deleted. The second group is the
    // other direction: stripping a comment must not hide a real import, including one a comment is
    // interposed into, and must not mistake an escaped slash in a regular expression for a comment
    // opener and swallow the line after it. See ADR-102.
    for (const source of [
      '// it used to read from "../domain/outcome" before ADR-102 moved it',
      '/** Once imported from "../domain/track". */',
      '/* from "../domain/exhaustive" */ export const clean = 1;',
      'const pattern = /domain\//; // from "../domain/track" is prose here',
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
      expect(importsDomainSink(source)).toBe(false);
    }
    expect(importsDomainLayer('import /* interposed */ { u } from "../domain/track";')).toBe(true);
    expect(importsDomainSink('const load = import(/* interposed */ "../domain/exhaustive");')).toBe(
      true,
    );
    const afterRegex = 'const pattern = /domain\//;\nimport { t } from "../domain/track";';
    expect(importsDomainLayer(afterRegex)).toBe(true);
  });

  it("refuses the spellings that step around the anchor without widening past it", () => {
    // A leading `./` and an absent trailing slash are concrete spellings a violator can write and a
    // reviewer will not see, so the anchor admits both rather than reporting a clean boundary it
    // does not have. It stays anchored at the front, which is why a longer sibling directory is
    // still clean. See ADR-102.
    for (const source of [
      'import { t } from "./../domain/track";',
      'import { t } from "../domain";',
      'import { t } from "../domain/";',
    ])
      expect(importsDomainLayer(source)).toBe(true);
    expect(importsDomainSink('import { u } from "./../domain/exhaustive";')).toBe(true);
    for (const source of [
      'import { x } from "../domainfoo";',
      'import { x } from "../domain-helpers/y";',
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
      expect(importsDomainSink(source)).toBe(false);
    }
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

  // The three outer layers ADR-099 measured, now held to the two different rules ADR-102 split
  // them into: `contract/` and `ports/` owe the whole inward direction, `adapters/` owes the sink
  // alone. The planted imports say so by being different: the first two reach an ordinary domain
  // module and are refused for reaching `domain/` at all, while the third reaches the retired sink
  // and is refused by name. One file per layer, because `walk` does not sort and two files in one
  // layer would make this assertion depend on `readdir` order. `lang/` is absent from this fixture
  // on purpose: the shipped scanner running green against the real tree, in the case below, is what
  // proves the new path passes, and a fixture cannot prove that about a directory it invents.
  it("W-8: refuses contract and ports reaching domain, and adapters the sink", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "motion5-inward-dependency-"));
    try {
      await writeFile(join(fixture, "package.json"), PACKAGES_ONLY);
      const planted = [
        ["contract", 'import type { LiveWriteResult } from "../domain/track";'],
        ["ports", 'import type { ResolvedPlugins } from "../domain/plugins";'],
        ["adapters", 'import { unreachable } from "../../domain/exhaustive";'],
      ] as const;
      for (const [layer, statement] of planted) {
        await mkdir(join(fixture, "packages", "core", "src", layer), { recursive: true });
        await writeFile(
          join(fixture, "packages", "core", "src", layer, "leak.ts"),
          `${statement}\n`,
        );
      }
      const violations = await scan(fixture);
      expect(violations).toEqual([
        "packages/core/src/contract/leak.ts: inward domain import",
        "packages/core/src/ports/leak.ts: inward domain import",
        "packages/core/src/adapters/leak.ts: retired domain sink import",
      ]);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  });

  // The other half of that asymmetry, and the reason the broad rule stops at two layers: the three
  // adapter imports of `domain/` ADR-099 measured are still legal, so a gate that refused them
  // would have been introduced red. Deleting this case is how that fact gets lost.
  it("keeps an adapter reaching an ordinary domain module clean", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "motion5-adapter-domain-"));
    try {
      await writeFile(join(fixture, "package.json"), PACKAGES_ONLY);
      await mkdir(join(fixture, "packages", "core", "src", "adapters"), { recursive: true });
      await writeFile(
        join(fixture, "packages", "core", "src", "adapters", "reach.ts"),
        'import { compilePercentKeyframes } from "../../domain/keyframe-compiler";\n',
      );
      expect(await scan(fixture)).toEqual([]);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  });

  // The same repair, planted through the shipped scanner rather than asserted at the predicate,
  // because prose is the one thing a `contract/` module reliably contains and the scan is what CI
  // runs. Red before the extraction read code, where this file alone turned the gate red.
  it("keeps a contract module whose only domain mention is a comment clean", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "motion5-domain-prose-"));
    try {
      await writeFile(join(fixture, "package.json"), PACKAGES_ONLY);
      await mkdir(join(fixture, "packages", "core", "src", "contract"), { recursive: true });
      await writeFile(
        join(fixture, "packages", "core", "src", "contract", "prose.ts"),
        '// ADR-102 moved this; it read from "../domain/outcome".\nexport const kept = 1;\n',
      );
      expect(await scan(fixture)).toEqual([]);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
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
});

describe("test-only entrypoint tier (issue #167, ADR-048)", () => {
  it("W-1: names the testing entrypoint and no production entrypoint", () => {
    expect(importsTestingEntrypoint(testingEntrypointViolationFixture)).toBe(true);
    expect(importsTestingEntrypoint(testingSourcePathViolationFixture)).toBe(true);
    expect(importsTestingEntrypoint(coreEntrypointFixture)).toBe(false);
    expect(importsTestingEntrypoint(pluginEntrypointFixture)).toBe(false);
    expect(importsTestingEntrypoint(adapterEntrypointFixture)).toBe(false);
  });

  it("W-2: reports an app that imports the test-only entrypoint", async () => {
    const violations = await withWorkspaceRoot(WORKSPACES, (planted) => scan(planted));
    expect(violations).toContain("apps/demo/src/main.ts: testing entrypoint import");
  });

  it("W-3: reports an app that reaches into core source, which is the #164 mistake", async () => {
    const violations = await withWorkspaceRoot(WORKSPACES, (planted) => scan(planted));
    expect(violations).toContain("apps/demo/src/main.ts: core source-internal import");
  });

  it("W-4: scans the core testing layer for renderer and engine imports", async () => {
    const violations = await withWorkspaceRoot(WORKSPACES, (planted) => scan(planted));
    expect(violations).toContain("packages/core/src/testing/fakes.ts: renderer or engine import");
  });

  it("W-5: declares ./testing and does not declare ./ports/fakes", async () => {
    const manifest = await readFile(join(root, "packages", "core", "package.json"), "utf8");
    const declared = (JSON.parse(manifest) as { exports: Record<string, unknown> }).exports;
    expect(Object.keys(declared)).toContain("./testing");
    expect(Object.keys(declared)).not.toContain("./ports/fakes");
    expect(declared["./testing"]).toEqual({
      types: "./dist/testing/fakes.d.ts",
      default: "./dist/testing/fakes.js",
    });
  });

  it("W-6: leaves the shipped tree with no testing entrypoint violation", async () => {
    const violations = await scan();
    expect(violations.filter((entry) => /testing/.test(entry))).toEqual([]);
  });

  it("W-7: takes the workspace roots from the root manifest", async () => {
    const declared = await withWorkspaceRoot(WORKSPACES, (planted) => scan(planted));
    const undeclared = await withWorkspaceRoot(PACKAGES_ONLY, (planted) => scan(planted));
    const violation = "apps/demo/src/main.ts: testing entrypoint import";
    expect(declared).toContain(violation);
    expect(undeclared).not.toContain(violation);
    const bare = await mkdtemp(join(tmpdir(), "motion5-no-manifest-"));
    try {
      await expect(scan(bare)).rejects.toThrow(/package\.json/);
    } finally {
      await rm(bare, { recursive: true, force: true });
    }
  });
});
