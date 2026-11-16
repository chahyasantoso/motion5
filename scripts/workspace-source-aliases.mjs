import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const packagesRoot = new URL("../packages/", import.meta.url);

/**
 * Exact source aliases for the declared exports of the named workspace packages.
 *
 * Each package manifest owns its subpath list for tests and every app, so adding an export needs
 * no config edit. Exact regular expressions make alias order irrelevant (a declared subpath such
 * as `adapters/browser-clock` is never captured by a shorter one) and keep undeclared nested
 * subpaths unresolvable. An emitted `./dist/<module>.js` target maps to `src/<module>.ts`; a
 * source-exporting package (`./src/...`) maps to its target as written.
 */
export function workspaceSourceAliases(...packageDirectories) {
  const directories = packageDirectories.length > 0 ? packageDirectories : allPackages();
  return directories.flatMap((directory) => {
    const packageRoot = new URL(`${directory}/`, packagesRoot);
    const manifest = JSON.parse(readFileSync(new URL("package.json", packageRoot), "utf8"));
    return Object.entries(manifest.exports).map(([subpath, target]) => {
      const specifier = subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
      return {
        find: new RegExp(`^${specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
        replacement: fileURLToPath(new URL(sourceOf(manifest.name, subpath, target), packageRoot)),
      };
    });
  });
}

/** A Vite plugin for the repository's own servers: the live page's built-in moves module is the moves source. */
export function builtInMovesPlugin() {
  return {
    name: "built-in-moves-from-source",
    resolveId: (id) =>
      id === "virtual:gerak/built-in-moves"
        ? fileURLToPath(new URL("moves/src/index.ts", packagesRoot))
        : null,
  };
}

/** Every workspace package with a manifest, so a new package needs no config edit. */
function allPackages() {
  return readdirSync(packagesRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && existsSync(new URL(`${entry.name}/package.json`, packagesRoot)),
    )
    .map((entry) => entry.name)
    .sort();
}

function sourceOf(name, subpath, target) {
  const emitted = /^\.\/dist\/(.+)\.js$/.exec(target.default);
  if (emitted !== null) return `src/${emitted[1]}.ts`;
  if (target.default.startsWith("./src/")) return target.default;
  throw new TypeError(`${name} export "${subpath}" targets neither ./dist/*.js nor ./src/.`);
}
