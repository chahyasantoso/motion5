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
const SUPPORT_SUBPATHS = ["frame3d", "loader", "labels", "models", "pose-classify", "runner"];
/** R2: support modules other than `frame3d` publish exactly these runtime names. */
const SUPPORT_EXPORTS: Readonly<Record<string, readonly string[]>> = {
  loader: ["createPluginLoader", "describeLoadFailure", "ensuredOrThrow"],
  labels: ["onLabelChange", "readLabel"],
  models: [
    "Anchors2d",
    "Body2d",
    "Body3d",
    "Clip2d",
    "CubicPath2d",
    "Goals2d",
    "Goals3d",
    "LocalAnchors2d",
    "PathData2d",
    "Point2d",
    "Point3d",
    "Points2d",
    "Points3d",
    "PoseLabel",
    "Solved2d",
    "Solved3d",
    "Sprite2d",
    "Stroke2d",
    "builtinModels",
  ],
  "pose-classify": ["createPoseClassifyPlugin"],
  runner: ["attachRunners", "createLatestSlot", "describeRunnerFailure"],
};
export const PUBLIC_SUBPATHS = [...DEFINITION_SUBPATHS, ...SUPPORT_SUBPATHS];
/** Path plugins and the drawing helper publish under `path/`; the catalog names them in camelCase. */
const PATH_SUBPATHS = [
  "path/anchors-to-cubic",
  "path/bezier",
  "path/skin-anchors",
  "path/draw",
  "path/svg-path",
];
const PATH_CATALOG_NAMES = ["anchorsToCubic", "bezier", "skinAnchors", "svgPath"];
/** Motion moves publish under `motion/`, one plugin per path. */
const MOTION_CATALOG_NAMES = ["drop", "hop", "layer", "rope", "trace", "wipe"];
const MOTION_SUBPATHS = MOTION_CATALOG_NAMES.map((name) => `motion/${name}`);

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
      const target = /^\.\/dist\/(.+)\.js$/.exec(
        String(Reflect.get(Object(manifest.exports[`./${name}`]), "default")),
      )?.[1];
      expect(target, name).toBeDefined();
      expect(manifest.exports[`./${name}`], name).toEqual({
        types: `./dist/${target}.d.ts`,
        default: `./dist/${target}.js`,
      });
      const module = (await import(new URL(`src/${target}.ts`, PLUGINS).href)) as Record<
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
    expect(aliases).toHaveLength(
      PUBLIC_SUBPATHS.length + PATH_SUBPATHS.length + MOTION_SUBPATHS.length,
    );
    expect(Object.keys(manifest.exports).filter((key) => key.startsWith("./motion/"))).toEqual(
      MOTION_SUBPATHS.map((name) => `./${name}`),
    );
    expect(Object.keys(manifest.exports).filter((key) => key.startsWith("./path/"))).toEqual(
      PATH_SUBPATHS.map((name) => `./${name}`),
    );
    for (const name of [...PUBLIC_SUBPATHS, ...PATH_SUBPATHS, ...MOTION_SUBPATHS]) {
      const specifier = `@motion5/plugins/${name}`;
      expect(aliases.filter(({ find }) => find.test(specifier))).toHaveLength(1);
      expect(aliases.some(({ find }) => find.test(`${specifier}/private`))).toBe(false);
    }
    expect(aliases.some(({ find }) => find.test("@motion5/plugins/fabrik"))).toBe(false);
    expect(aliases.some(({ find }) => find.test("@motion5/plugins"))).toBe(false);
  });

  it("L15 every approved catalog entry lazily loads its matching definition subpath", async () => {
    const { builtinCatalog } = await import("../src/host/builtin-catalog");
    expect([...builtinCatalog.keys()].sort()).toEqual(
      [...DEFINITION_SUBPATHS, ...PATH_CATALOG_NAMES, ...MOTION_CATALOG_NAMES].sort(),
    );
    for (const [name, descriptor] of builtinCatalog) {
      const definition = await descriptor.load();
      expect(definition.id).toBe(name);
    }
  });
});
