import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import ts from "typescript";
import {
  bannedSymbol,
  extractExportNames,
  importsBoundary,
  importsCoreInternals,
  importsDomainLayer,
  importsRenderer,
  importsTestingEntrypoint,
  scan,
  undeclaredWorkspaceSubpaths,
  walk,
  withoutComments,
} from "../../../../../scripts/boundary-scan.mjs";
import {
  adapterEntrypointFixture,
  appCoreInternalViolationFixture,
  bannedSymbolFixture,
  cleanFixture,
  consumerInternalViolationFixture,
  coreEntrypointFixture,
  dynamicRendererViolationFixture,
  engineViolationFixture,
  importMentionFixture,
  plugin3dEntrypointFixture,
  pluginEntrypointFixture,
  pluginRendererViolationFixture,
  pluginApiFixture,
  pluginPrivateCoreFixture,
  pluginSiblingFixture,
  publicExportViolationFixture,
  rendererViolationFixture,
  testingEntrypointViolationFixture,
  testingSourcePathViolationFixture,
  undeclaredSubpathFixture,
} from "../../../../../scripts/boundary-scan-fixtures";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));
const WORKSPACES = JSON.stringify({ workspaces: ["packages/*", "apps/*"] });
const PACKAGES_ONLY = JSON.stringify({ workspaces: ["packages/*"] });

describe("plugin declaration ownership guards (ADR-136)", () => {
  it("C5 no core source names a first-party plugin", async () => {
    const names = new Set(["fk", "ik", "fk3d", "ik3d", "transform3d", "rig"]);
    const violations: string[] = [];
    for (const path of await walk(join(root, "packages/core/src"))) {
      const source = ts.createSourceFile(
        path,
        withoutComments(await readFile(path, "utf8")),
        ts.ScriptTarget.Latest,
        true,
      );
      function visit(node: ts.Node): void {
        if (ts.isStringLiteralLike(node) && names.has(node.text))
          violations.push(`${path}: ${node.text}`);
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
    expect(violations).toEqual([]);
  });

  it("graph and contract refuse direct registry imports but admit the narrow port", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "motion5-capabilities-"));
    try {
      await writeFile(join(fixture, "package.json"), PACKAGES_ONLY);
      for (const layer of ["graph", "contract"]) {
        const directory = join(fixture, "packages/core/src", layer);
        await mkdir(directory, { recursive: true });
        await writeFile(
          join(directory, "leak.ts"),
          'import type { PluginRegistry } from "../domain/plugins";\n',
        );
      }
      const violations = await scan(fixture);
      expect(violations.filter((entry) => entry.includes("plugin capabilities port"))).toHaveLength(
        2,
      );
      for (const layer of ["graph", "contract"])
        await writeFile(
          join(fixture, "packages/core/src", layer, "leak.ts"),
          'import type { PluginCapabilities } from "../ports/plugin-capabilities";\n',
        );
      expect(await scan(fixture)).toEqual([]);
      expect(await scan(root)).toEqual([]);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  });
});

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

  it("extracts every retired sink spelling as an ordinary inward import", () => {
    for (const source of [
      'import { unreachable } from "../domain/exhaustive.js";',
      'export { unreachable } from "../../domain/exhaustive.mjs";',
      'const load = import("../domain/exhaustive.ts");',
      'const load = require("..\\domain\\exhaustive");',
    ])
      expect(importsDomainLayer(source)).toBe(true);
  });

  it("keeps the shared contract compiler, new sink, aliases, and longer names clean", () => {
    for (const source of [
      'import { compiler } from "../../contract/keyframe-compiler";',
      'import type { RenderMetadata } from "../../ports/render-metadata";',
      'import { exhaustive } from "../lang/exhaustive";',
      'import { helpers } from "../domain-helpers/exhaustive";',
      'import { sink } from "@motion5/core/domain/exhaustive";',
      "const load = import(path);",
    ])
      expect(importsDomainLayer(source)).toBe(false);
  });

  it("reads any inward domain import in all three outer layers", () => {
    for (const source of [
      'import { o } from "../lang/outcome";',
      'import { u } from "../lang/exhaustive";',
      'import type { D } from "../contract/v5";',
      'import { x } from "../domain-helpers/y";',
      'import { s } from "@motion5/core/domain/exhaustive";',
      "const load = import(path);",
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
    }
    for (const source of [
      'import { compiler } from "../../domain/keyframe-compiler";',
      'import type { Plugin } from "../../domain/plugins.js";',
      'const load = import("../domain/track");',
      'import { helpers } from "../domain/exhaustive-helpers";',
    ]) {
      expect(importsDomainLayer(source)).toBe(true);
    }
    for (const source of [
      'import { unreachable } from "../domain/exhaustive.js";',
      'export { unreachable } from "../../domain/exhaustive.mjs";',
      'const load = require("..\\domain\\exhaustive");',
    ]) {
      expect(importsDomainLayer(source)).toBe(true);
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
    // opener and swallow the line after it. See ADR-103.
    for (const source of [
      '// it used to read from "../domain/outcome" before ADR-103 moved it',
      '/** Once imported from "../domain/track". */',
      '/* from "../domain/exhaustive" */ export const clean = 1;',
      'const pattern = /domain\//; // from "../domain/track" is prose here',
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
    }
    expect(importsDomainLayer('import /* interposed */ { u } from "../domain/track";')).toBe(true);
    expect(
      importsDomainLayer('const load = import(/* interposed */ "../domain/exhaustive");'),
    ).toBe(true);
    const afterRegex = 'const pattern = /domain\//;\nimport { t } from "../domain/track";';
    expect(importsDomainLayer(afterRegex)).toBe(true);
    // A regular-expression literal is read whole, because it is the other place a comment opener
    // appears in code: `/[/*]/` opened a block comment inside its class on the first cut and hid
    // the import after it. Its body is not code either, so a specifier-shaped pattern is not an
    // import, and a division is still a division, so a comment after it is still prose.
    expect(importsDomainLayer('const p = /[/*]/;\nimport("../domain/x");')).toBe(true);
    expect(importsDomainLayer('const p = /[/*]/g;\nimport("../domain/exhaustive");')).toBe(true);
    expect(importsDomainLayer('const pattern = /from "../domain/x"/;')).toBe(false);
    expect(importsDomainLayer('const half = total / 2; // from "../domain/x"')).toBe(false);
    expect(importsDomainLayer('const r = a / b / c;\nimport { t } from "../domain/track";')).toBe(
      true,
    );
  });

  it("refuses the spellings that step around the anchor without widening past it", () => {
    // A leading `./`, an absent trailing slash, a doubled separator, an interior `./` and an
    // interior `..` are concrete spellings a violator can write and a reviewer will not see. Each
    // resolves to the layer, so the extraction canonicalises it and the anchor reads what module
    // resolution would reach rather than reporting a clean boundary it does not have. It stays
    // anchored at the front, which is why a longer sibling directory is still clean, and a path
    // that passes through `domain/` and leaves it again never reached the layer. See ADR-103.
    for (const source of [
      'import { t } from "./../domain/track";',
      'import { t } from ".././domain/track";',
      'import { t } from "..//domain/track";',
      'import { t } from "../lang/../domain/track";',
      'import { t } from "../domain";',
      'import { t } from "../domain/";',
    ])
      expect(importsDomainLayer(source)).toBe(true);
    for (const source of [
      'import { u } from "./../domain/exhaustive";',
      'import { u } from ".././domain/exhaustive";',
      'import { u } from "..//domain//exhaustive.js";',
    ])
      expect(importsDomainLayer(source)).toBe(true);
    for (const source of [
      'import { x } from "../domainfoo";',
      'import { x } from "../domain-helpers/y";',
      'import { x } from "../domain/../lang/outcome";',
    ]) {
      expect(importsDomainLayer(source)).toBe(false);
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

  // One planted file per layer proves the same inward rule covers adapters, ports, and contract.
  it("W-8: refuses every outer layer reaching domain", async () => {
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
        "packages/core/src/adapters/leak.ts: inward domain import",
      ]);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  });

  it("refuses an adapter reaching an ordinary domain module", async () => {
    const fixture = await mkdtemp(join(tmpdir(), "motion5-adapter-domain-"));
    try {
      await writeFile(join(fixture, "package.json"), PACKAGES_ONLY);
      await mkdir(join(fixture, "packages", "core", "src", "adapters"), { recursive: true });
      await writeFile(
        join(fixture, "packages", "core", "src", "adapters", "reach.ts"),
        'import { compilePercentKeyframes } from "../../domain/keyframe-compiler";\n',
      );
      expect(await scan(fixture)).toEqual([
        "packages/core/src/adapters/reach.ts: inward domain import",
      ]);
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
        '// ADR-103 moved this; it read from "../domain/outcome".\nexport const kept = 1;\n',
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

/**
 * Issue #500 phase 8 and ADR-125. Promoting the 3D plugins to package subpaths makes two claims a
 * gate has to hold: core imports no renderer, including under `plugins/`, where every solver lives
 * and which the layer list did not name; and a consumer reaches core only through a subpath the
 * core manifest declares, because the source aliases in `tsconfig.json` and the Vite apps resolve
 * any path under `packages/core/src` and would let an undeclared one pass in this repository.
 */
describe("boundary scan: the public 3D surface", () => {
  async function withTree<T>(
    files: Readonly<Record<string, string>>,
    use: (tree: string) => Promise<T>,
  ): Promise<T> {
    const tree = await mkdtemp(join(tmpdir(), "motion5-public-3d-"));
    try {
      await writeFile(join(tree, "package.json"), PACKAGES_ONLY);
      for (const workspace of ["core", "plugins"]) {
        await mkdir(join(tree, "packages", workspace), { recursive: true });
        await writeFile(
          join(tree, "packages", workspace, "package.json"),
          await readFile(join(root, "packages", workspace, "package.json"), "utf8"),
        );
      }
      for (const [path, source] of Object.entries(files)) {
        await mkdir(join(tree, path, ".."), { recursive: true });
        await writeFile(join(tree, path), `${source}\n`);
      }
      return await use(tree);
    } finally {
      await rm(tree, { recursive: true, force: true });
    }
  }
  const coreManifest = readFile(join(root, "packages", "core", "package.json"), "utf8");
  const pluginsManifest = readFile(join(root, "packages", "plugins", "package.json"), "utf8");
  const declared = Promise.all([coreManifest, pluginsManifest]).then(
    (texts) =>
      new Map<string, ReadonlySet<string>>(
        texts.map((text: string) => {
          const manifest = JSON.parse(text) as { name: string; exports: object };
          return [manifest.name, new Set(Object.keys(manifest.exports))] as const;
        }),
      ),
  );

  it("TH-112 discovers the extracted plugin workspace and refuses renderer imports", async () => {
    const violations = await withTree(
      { "packages/plugins/src/solver.ts": pluginRendererViolationFixture },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/plugins/src/solver.ts: import outside plugin package contract",
    ]);
  });

  it("TH-202 allows plugin siblings and the single plugin-authoring entrypoint", async () => {
    await withTree(
      {
        "packages/plugins/src/solver.ts": `${pluginApiFixture}\n${pluginSiblingFixture}`,
      },
      async (tree) => {
        expect(await walk(join(tree, "packages/plugins/src"))).toHaveLength(1);
        expect(await scan(tree)).toEqual([]);
        expect(await scan(`${tree}/`)).toEqual([]);
      },
    );
  });

  it("TH-203 refuses a plugin reaching past the plugin-authoring entrypoint", async () => {
    const violations = await withTree(
      { "packages/plugins/src/solver.ts": pluginPrivateCoreFixture },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/plugins/src/solver.ts: import outside plugin package contract",
    ]);
  });

  it("TH-204 checks nested, dynamic, and re-export plugin edges after path normalization", async () => {
    const violations = await withTree(
      {
        "packages/plugins/src/nested/good.ts":
          'import type { PluginDefinition } from "@motion5/core/plugin-api";\nexport * from "../frame";',
        "packages/plugins/src/nested/bad.ts": 'export * from "../../outside";',
        "packages/plugins/src/dynamic.ts": 'const privateCore = import("@motion5/core/internal");',
        "packages/plugins/src/lookalike.ts": 'export * from "../plugin-api-private";',
      },
      (tree) => scan(tree),
    );
    expect(violations.sort()).toEqual([
      "packages/plugins/src/dynamic.ts: import outside plugin package contract",
      "packages/plugins/src/lookalike.ts: import outside plugin package contract",
      "packages/plugins/src/nested/bad.ts: import outside plugin package contract",
    ]);
  });

  it("allows native lazy imports in the built-in plugin catalog", async () => {
    const violations = await withTree(
      {
        "packages/plugins/src/catalog.ts":
          'import type { PluginCatalog } from "./loader"; export const catalog: PluginCatalog = new Map([["fk", { load: () => import("./fk").then((module) => module.fkPlugin) }]]);',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([]);
  });

  it("refuses eager sibling imports in the built-in plugin catalog", async () => {
    const violations = await withTree(
      {
        "packages/plugins/src/catalog.ts": 'import { fkPlugin } from "./fk"; export { fkPlugin };',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/plugins/src/catalog.ts: plugin definitions must be reached through lazy imports",
    ]);
  });

  it("refuses a value import, re-export or side-effect import in the built-in plugin catalog", async () => {
    const eager = [
      'import { createPluginLoader } from "./loader"; export const c = createPluginLoader;',
      'export { fkPlugin } from "./fk";',
      'import "./fk";',
      'import type { PluginCatalog } from "./loader"; import * as fk from "../src/fk"; export { fk };',
    ];
    for (const source of eager) {
      const violations = await withTree({ "packages/plugins/src/catalog.ts": source }, (tree) =>
        scan(tree),
      );
      expect(violations, source).toEqual([
        "packages/plugins/src/catalog.ts: plugin definitions must be reached through lazy imports",
      ]);
    }
  });

  it("reads catalog imports through comments and strings as code, not prose", async () => {
    const violations = await withTree(
      {
        "packages/plugins/src/catalog.ts":
          '// import { fkPlugin } from "./fk";\nimport type { PluginCatalog } from "./loader";\nconst note = \'from "./fk"\';\nexport const catalog: PluginCatalog = new Map([["fk", { load: () => import("./fk").then((m) => m.fkPlugin) }]]);\nvoid note;',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([]);
  });

  it("TH-113 refuses a core source directory that no layer declares", async () => {
    const violations = await withTree(
      {
        "packages/core/src/renderer3d/mesh.ts": cleanFixture,
        "packages/plugins/src/clean.ts": cleanFixture,
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual(["packages/core/src/renderer3d: undeclared core layer"]);
  });

  it("TH-135 refuses dynamic renderer and engine imports but ignores prose mentions", async () => {
    expect(importsBoundary(dynamicRendererViolationFixture)).toBe(true);
    expect(importsRenderer(dynamicRendererViolationFixture)).toBe(true);
    expect(importsBoundary(importMentionFixture)).toBe(false);
    expect(importsRenderer(importMentionFixture)).toBe(false);

    const violations = await withTree(
      {
        "packages/plugins/src/dynamic.ts": `${dynamicRendererViolationFixture}\n${importMentionFixture}`,
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/plugins/src/dynamic.ts: import outside plugin package contract",
    ]);

    const proseOnly = await withTree(
      { "packages/plugins/src/prose.ts": importMentionFixture },
      (tree) => scan(tree),
    );
    expect(proseOnly).toEqual([]);
  });

  it("TH-114 refuses an undeclared subpath of any workspace package", async () => {
    const subpaths = await declared;
    expect(undeclaredWorkspaceSubpaths(undeclaredSubpathFixture, subpaths)).toEqual([
      "@motion5/plugins/fabrik",
    ]);
    for (const fixture of [
      plugin3dEntrypointFixture,
      pluginEntrypointFixture,
      coreEntrypointFixture,
      adapterEntrypointFixture,
      '// see "@motion5/plugins/fabrik" for the solve\nexport const kept = 1;',
    ])
      expect(undeclaredWorkspaceSubpaths(fixture, subpaths)).toEqual([]);

    const consumer = `${plugin3dEntrypointFixture}\n${undeclaredSubpathFixture}`;
    const withManifest = await withTree(
      {
        "packages/core/package.json": await coreManifest,
        "packages/three/src/index.ts": consumer,
      },
      (tree) => scan(tree),
    );
    expect(withManifest).toEqual([
      "packages/three/src/index.ts: undeclared workspace subpath @motion5/plugins/fabrik",
    ]);
    // With no core manifest nothing is declared, so the same consumer fails closed on both.
    const withoutManifest = await withTree(
      {
        "packages/plugins/package.json": '{"name":"@motion5/plugins"}',
        "packages/three/src/index.ts": consumer,
      },
      (tree) => scan(tree),
    );
    expect(withoutManifest).toEqual([
      "packages/three/src/index.ts: undeclared workspace subpath @motion5/plugins/ik3d",
      "packages/three/src/index.ts: undeclared workspace subpath @motion5/plugins/fabrik",
    ]);
  });
});
