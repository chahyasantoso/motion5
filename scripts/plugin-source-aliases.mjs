import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Exact source aliases for the plugin package's declared exports.
 *
 * The manifest owns this list for tests and every app. Exact regular expressions
 * prevent a declared subpath from also admitting an undeclared nested subpath.
 */
export function pluginSourceAliases() {
  const packageRoot = new URL("../packages/plugins/", import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL("package.json", packageRoot), "utf8"));
  return Object.keys(manifest.exports).map((subpath) => {
    const name = subpath.slice(2);
    const specifier = `${manifest.name}/${name}`;
    return {
      find: new RegExp(`^${specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
      replacement: fileURLToPath(new URL(`src/${name}.ts`, packageRoot)),
    };
  });
}
