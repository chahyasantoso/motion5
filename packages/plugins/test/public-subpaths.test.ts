import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { extractExportNames } from "../../../scripts/boundary-scan.mjs";
import { workspaceSourceAliases } from "../../../scripts/workspace-source-aliases.mjs";
import { code } from "../../core/test/helpers/source-region";

// Issue #534 and ADR-133: the public plugin surface is the explicit public subpaths that
// `packages/plugins/package.json` declares. The manifest is the one owner of that public list, so
// this case reads it rather than restating its targets: each public definition path names one source
// module and its emitted pair, and the module's public value is the one plugin the path is named for.
// Repository-only legacy paths are declared separately while Phase 5 cuts definitions over one at a
// time; they are not public definitions and are never loaded by this test.

const PLUGINS = new URL("../", import.meta.url);
const CORE = new URL("../../core/", import.meta.url);
const PLUGIN_SUBPATH = /^\.\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const PUBLIC_3D = ["transform3d", "fk3d", "ik3d"];
export const DEFINITION_SUBPATHS = ["transform", "fk", "ik", ...PUBLIC_3D, "rig"];
/** Public modules that are not one zero-config definition; R3 keeps them out of the catalog. */
const SUPPORT_SUBPATHS = ["frame3d", "catalog", "loader", "labels", "pose-classify", "runner"];
/** R2: support modules other than `frame3d` publish exactly these runtime names. */
const SUPPORT_EXPORTS: Readonly<Record<string, readonly string[]>> = {
  catalog: ["builtinCatalog"],
  loader: ["createPluginLoader", "describeLoadFailure", "ensuredOrThrow"],
  labels: ["onLabelChange", "readLabel"],
  "pose-classify": ["createPoseClassifyPlugin"],
  runner: ["attachRunners", "createLatestSlot", "describeRunnerFailure"],
};
export const PUBLIC_SUBPATHS = [...DEFINITION_SUBPATHS, ...SUPPORT_SUBPATHS];
const INTERNAL_LEGACY_EXPORTS: Readonly<Record<string, string>> = {
  "internal/legacy/transform": "legacyTransformPlugin",
  "internal/legacy/transform3d": "legacyTransform3dPlugin",
  "internal/legacy/fk": "legacyFkPlugin",
  "internal/legacy/fk3d": "legacyFk3dPlugin",
  "internal/legacy/ik": "legacyIkPlugin",
  "internal/legacy/ik3d": "legacyIk3dPlugin",
  "internal/legacy/rig": "legacyRigPlugin",
};
export const INTERNAL_LEGACY_SUBPATHS = Object.keys(INTERNAL_LEGACY_EXPORTS);

interface Manifest {
  readonly exports: Readonly<Record<string, unknown>>;
}

function readManifest(): Manifest {
  return JSON.parse(readFileSync(new URL("package.json", PLUGINS), "utf8")) as Manifest;
}

function declaredPlugins(manifest: Manifest): readonly string[] {
  return Object.keys(manifest.exports).flatMap((key) => {
    const name = PLUGIN_SUBPATH.exec(key)?.[1];
    return name === undefined ? [] : [name];
  });
}

function isPluginDefinition(value: unknown): value is { readonly name: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { name?: unknown }).name === "string" &&
    Array.isArray((value as { keys?: unknown }).keys) &&
    typeof (value as { compose?: unknown }).compose === "function"
  );
}

function isIdentifiedPlugin(value: unknown): value is { readonly id: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof (value as { id?: unknown }).id === "string" &&
    typeof (value as { transform?: unknown }).transform === "function"
  );
}

describe("public plugin subpaths", () => {
  it("TH-111 every declared plugin subpath is one module exporting exactly its plugin", async () => {
    const manifest = readManifest();
    const names = declaredPlugins(manifest);
    expect(names).toEqual(PUBLIC_SUBPATHS);
    expect(manifest.exports["."]).toBeUndefined();
    for (const name of names) {
      expect(manifest.exports[`./${name}`], name).toEqual({
        types: `./dist/${name}.d.ts`,
        default: `./dist/${name}.js`,
      });
      const module = (await import(new URL(`src/${name}.ts`, PLUGINS).href)) as Record<
        string,
        unknown
      >;
      const supportExports = SUPPORT_EXPORTS[name];
      if (supportExports !== undefined) {
        expect(Object.keys(module).sort(), name).toEqual(supportExports);
        continue;
      }
      if (name === "transform") {
        expect(Object.keys(module), name).toEqual(["transformPlugin"]);
        expect(isIdentifiedPlugin(module.transformPlugin), name).toBe(true);
        expect((module.transformPlugin as { readonly id: string }).id).toBe(name);
        continue;
      }
      const plugins = Object.entries(module).filter(([, value]) => isPluginDefinition(value));
      if (name === "frame3d") {
        // The unchanged complete frame utility module is public, not only its frame reader.
        expect(typeof module.readFrame3d).toBe("function");
        expect(plugins).toEqual([]);
        continue;
      }
      expect(
        plugins.map(([key, value]) => [key, (value as { name: string }).name]),
        name,
      ).toEqual([[`${name}Plugin`, name]]);
      // A newly public module publishes its plugin and nothing a consumer could come to rely on.
      if (PUBLIC_3D.includes(name)) expect(Object.keys(module), name).toEqual([`${name}Plugin`]);
    }
    // Read through the one source-reading owner, as source-region-anchors.test.ts requires.
    const index = code(new URL("src/index.ts", CORE));
    expect(extractExportNames(index).filter((symbol) => /Plugin$/.test(symbol))).toEqual([]);
    const coreManifest = JSON.parse(
      readFileSync(new URL("package.json", CORE), "utf8"),
    ) as Manifest;
    expect(Object.keys(coreManifest.exports).filter((key) => key.startsWith("./plugins/"))).toEqual(
      [],
    );
    // Development aliases consume the same manifest and match declared subpaths exactly.
    const aliases = workspaceSourceAliases("plugins");
    expect(aliases).toHaveLength(PUBLIC_SUBPATHS.length + INTERNAL_LEGACY_SUBPATHS.length);
    for (const name of PUBLIC_SUBPATHS) {
      const specifier = `@motion5/plugins/${name}`;
      expect(aliases.filter(({ find }) => find.test(specifier))).toHaveLength(1);
      expect(aliases.some(({ find }) => find.test(`${specifier}/private`))).toBe(false);
    }
    expect(aliases.some(({ find }) => find.test("@motion5/plugins/fabrik"))).toBe(false);
    expect(aliases.some(({ find }) => find.test("@motion5/plugins"))).toBe(false);
  });

  it("A1 reserves explicit internal legacy paths without advertising them as public definitions", async () => {
    const manifest = readManifest();
    const entries = INTERNAL_LEGACY_SUBPATHS.map(
      (name) => [`./${name}`, manifest.exports[`./${name}`]] as const,
    );

    expect(entries.map(([name]) => name)).toEqual(
      INTERNAL_LEGACY_SUBPATHS.map((name) => `./${name}`),
    );
    for (const [name, entry] of entries) {
      const target = name.slice("./internal/".length);
      expect(entry, name).toEqual({
        types: `./dist/${target}.d.ts`,
        default: `./dist/${target}.js`,
      });
      expect(PUBLIC_SUBPATHS).not.toContain(name.slice(2));

      const module = (await import(new URL(`src/${target}.ts`, PLUGINS).href)) as Record<
        string,
        unknown
      >;
      expect(Object.keys(module), name).toEqual([INTERNAL_LEGACY_EXPORTS[name.slice(2)]]);
    }

    const aliases = workspaceSourceAliases("plugins");
    expect(aliases).toHaveLength(PUBLIC_SUBPATHS.length + INTERNAL_LEGACY_SUBPATHS.length);
    for (const name of INTERNAL_LEGACY_SUBPATHS) {
      const specifier = `@motion5/plugins/${name}`;
      expect(aliases.filter(({ find }) => find.test(specifier))).toHaveLength(1);
      expect(aliases.some(({ find }) => find.test(`${specifier}/private`))).toBe(false);
    }
  });

  it("L15 every built-in catalog entry lazily loads its matching definition subpath", async () => {
    const { builtinCatalog } = await import("../src/catalog");
    // The manifest pins PUBLIC_SUBPATHS (TH-111), so this one list owns both sides of R3.
    expect([...builtinCatalog.keys()]).toEqual(DEFINITION_SUBPATHS);
    for (const [name, descriptor] of builtinCatalog) {
      const definition = await descriptor.load();
      expect(definition.name).toBe(name);
    }
  });
});
