import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { extractExportNames } from "../../../../../scripts/boundary-scan.mjs";

// Issue #500 phase 8 and ADR-125: the public plugin surface is the `./plugins/*` subpaths that
// `packages/core/package.json` declares, and nothing else. The manifest is the one owner of that
// list, so this case reads it rather than restating it: each declared subpath names one source
// module and its emitted pair, and the module's public value is the one plugin the path is named
// for. The root entry re-exports no plugin, so promoting the 3D plugins widened no root symbol and
// the boundary allow list is unchanged by decision rather than by omission.

const CORE = new URL("../../../", import.meta.url);
const PLUGIN_SUBPATH = /^\.\/plugins\/([a-z0-9]+)$/;
const PUBLIC_3D = ["transform3d", "fk3d", "ik3d"];

interface Manifest {
  readonly exports: Readonly<Record<string, unknown>>;
}

function readManifest(): Manifest {
  return JSON.parse(readFileSync(fileURLToPath(new URL("package.json", CORE)), "utf8")) as Manifest;
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

describe("public plugin subpaths", () => {
  it("TH-111 every declared plugin subpath is one module exporting exactly its plugin", async () => {
    const manifest = readManifest();
    const names = declaredPlugins(manifest);
    expect(names).toEqual(["transform", "fk", "ik", ...PUBLIC_3D]);
    for (const name of names) {
      expect(manifest.exports[`./plugins/${name}`], name).toEqual({
        types: `./dist/plugins/${name}.d.ts`,
        default: `./dist/plugins/${name}.js`,
      });
      const module = (await import(new URL(`src/plugins/${name}.ts`, CORE).href)) as Record<
        string,
        unknown
      >;
      const plugins = Object.entries(module).filter(([, value]) => isPluginDefinition(value));
      expect(
        plugins.map(([key, value]) => [key, (value as { name: string }).name]),
        name,
      ).toEqual([[`${name}Plugin`, name]]);
      // A newly public module publishes its plugin and nothing a consumer could come to rely on.
      if (PUBLIC_3D.includes(name)) expect(Object.keys(module), name).toEqual([`${name}Plugin`]);
    }
    const index = readFileSync(fileURLToPath(new URL("src/index.ts", CORE)), "utf8");
    expect(extractExportNames(index).filter((symbol) => /Plugin$/.test(symbol))).toEqual([]);
  });
});
