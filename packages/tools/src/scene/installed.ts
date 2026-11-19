import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** An installed `@gerak/*` package: its name and real folder. */
export interface InstalledPackage {
  readonly name: string;
  readonly folder: string;
}

function textOf(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const HERE = dirname(fileURLToPath(import.meta.url));

/** Every installed `@gerak/*` package, found in `node_modules` from each start folder upward, once by folder and name, the nearest first as node resolves. */
export function installedPackages(
  starts: readonly string[] = [process.env["INIT_CWD"] ?? process.cwd(), HERE],
): readonly InstalledPackage[] {
  const seen = new Set<string>();
  const named = new Set<string>();
  const found: InstalledPackage[] = [];
  for (const start of starts) {
    for (let dir = resolve(start); ; dir = dirname(dir)) {
      const scope = join(dir, "node_modules", "@gerak");
      if (existsSync(scope)) {
        for (const entry of readdirSync(scope).sort()) {
          const folder = join(scope, entry);
          const manifestFile = join(folder, "package.json");
          if (!existsSync(manifestFile)) continue;
          const real = realpathSync(folder);
          if (seen.has(real) || named.has(entry)) continue;
          seen.add(real);
          named.add(entry);
          const manifest: unknown = JSON.parse(readFileSync(manifestFile, "utf8"));
          found.push({
            name: textOf(Reflect.get(Object(manifest), "name")) ?? entry,
            folder: real,
          });
        }
      }
      if (dirname(dir) === dir) break;
    }
  }
  return found;
}
