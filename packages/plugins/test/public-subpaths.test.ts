import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { extractExportNames } from "../../../scripts/boundary-scan.mjs";
import { workspaceSourceAliases } from "../../../scripts/workspace-source-aliases.mjs";
import { code } from "../../core/test/helpers/source-region";

// Issue #534 and ADR-133: the public plugin surface is the explicit public subpaths that
// `packages/plugins/package.json` declares. The manifest is the one owner of that public list, so
// this case reads it rather than restating its targets: each public definition path names one source
// module and its emitted pair, and the module's public value is the one plugin the path is named for.

const PLUGINS = new URL("../", import.meta.url);
const CORE = new URL("../../core/", import.meta.url);
const PLUGIN_SUBPATH = /^\.\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const PUBLIC_3D = ["transform3d", "fk3d", "ik3d"];
export const DEFINITION_SUBPATHS = ["transform", "fk", "ik", ...PUBLIC_3D];
/** Public modules that are not one zero-config definition; R3 keeps them out of the catalog. */
const SUPPORT_SUBPATHS = ["frame3d", "loader", "labels", "pose-classify", "runner"];
/** R2: support modules other than `frame3d` publish exactly these runtime names. */
const SUPPORT_EXPORTS: Readonly<Record<string, readonly string[]>> = {
  loader: ["createPluginLoader", "describeLoadFailure", "ensuredOrThrow"],
  labels: ["onLabelChange", "readLabel"],
  "pose-classify": ["createPoseClassifyPlugin"],
  runner: ["attachRunners", "createLatestSlot", "describeRunnerFailure"],
};
export const PUBLIC_SUBPATHS = [...DEFINITION_SUBPATHS, ...SUPPORT_SUBPATHS];

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
      if (DEFINITION_SUBPATHS.includes(name)) {
        const exportName = `${name}Plugin`;
        expect(Object.keys(module), name).toEqual([exportName]);
        expect(isIdentifiedPlugin(module[exportName]), name).toBe(true);
        expect((module[exportName] as { readonly id: string }).id).toBe(name);
        continue;
      }
      // The unchanged complete frame utility module is public, not only its frame reader.
      expect(name).toBe("frame3d");
      expect(typeof module.readFrame3d).toBe("function");
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
    expect(aliases).toHaveLength(PUBLIC_SUBPATHS.length);
    for (const name of PUBLIC_SUBPATHS) {
      const specifier = `@motion5/plugins/${name}`;
      expect(aliases.filter(({ find }) => find.test(specifier))).toHaveLength(1);
      expect(aliases.some(({ find }) => find.test(`${specifier}/private`))).toBe(false);
    }
    expect(aliases.some(({ find }) => find.test("@motion5/plugins/fabrik"))).toBe(false);
    expect(aliases.some(({ find }) => find.test("@motion5/plugins"))).toBe(false);
  });

  it("L15 every approved catalog entry lazily loads its matching definition subpath", async () => {
    const { identifiedCatalog } = await import("../src/identified-catalog");
    expect([...identifiedCatalog.keys()].sort()).toEqual([...DEFINITION_SUBPATHS].sort());
    for (const [name, descriptor] of identifiedCatalog) {
      const definition = await descriptor.load();
      expect(definition.id).toBe(name);
    }
  });
});
