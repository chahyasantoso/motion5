import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { workspaceSourceAliases } from "../../../../../scripts/workspace-source-aliases.mjs";
import { code } from "../../helpers/source-region";

// PR #558: core aliases were a hand-written prefix list, so the declared
// `@motion5/core/adapters/browser-clock` subpath resolved through the `adapters` alias to a missing
// file and Vitest discovery failed. Every workspace manifest now owns its aliases (R1, widened).
const root = new URL("../../../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

interface Manifest {
  readonly name: string;
  readonly exports: Readonly<Record<string, unknown>>;
}

function declaredSpecifiers(directory: string): readonly string[] {
  const manifest = JSON.parse(read(`packages/${directory}/package.json`)) as Manifest;
  return Object.keys(manifest.exports).map((subpath) =>
    subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`,
  );
}

describe("workspace source aliases", () => {
  const packages = ["core", "plugins", "react", "three"];
  const aliases = workspaceSourceAliases(...packages);

  it("resolves every declared subpath through exactly one alias to an existing source file", () => {
    for (const specifier of packages.flatMap(declaredSpecifiers)) {
      const matches = aliases.filter(({ find }) => find.test(specifier));
      expect([specifier, matches.length]).toEqual([specifier, 1]);
      expect([specifier, existsSync(matches[0]!.replacement)]).toEqual([specifier, true]);
    }
  });

  it("resolves a nested core subpath to its own module, not its parent's", () => {
    const [clock] = aliases.filter(({ find }) => find.test("@motion5/core/adapters/browser-clock"));
    expect(clock!.replacement).toBe(
      fileURLToPath(new URL("packages/core/src/adapters/browser-clock.ts", root)),
    );
  });

  it("leaves undeclared subpaths unresolved", () => {
    for (const specifier of ["@motion5/core/domain/plugins", "@motion5/core/adapters/dom"]) {
      expect(aliases.some(({ find }) => find.test(specifier))).toBe(false);
    }
  });

  it("is the only alias source of the root and every app Vite config", () => {
    const configs = ["vite.config.ts", "apps/ik-playground/vite.config.ts"]
      .concat(["apps/pose-gap-filler/vite.config.ts", "apps/react-demo/vite.config.ts"])
      .map((path) => [path, code(new URL(path, root))] as const);
    for (const [path, source] of configs) {
      expect([path, /alias: \[\.\.\.workspaceSourceAliases\(/.test(source)]).toEqual([path, true]);
      expect([path, source.includes("find:")]).toEqual([path, false]);
    }
  });
});
