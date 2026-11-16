import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

/** Top-level folders of an app that are never a brief. */
export const RESERVED_FOLDERS: readonly string[] = [
  "src",
  "references",
  "test",
  "dist",
  "node_modules",
];

/** The brief folders of the app at `root`: each top-level folder holding a `src/`, by name. */
export function briefFolders(root: string): readonly string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !RESERVED_FOLDERS.includes(entry.name) &&
        existsSync(join(root, entry.name, "src")),
    )
    .map((entry) => entry.name)
    .sort();
}

/** Every `<brief>/src/<name>.ts` and `<brief>/src/<name>-scene.ts` that exists, brief by brief. */
export function pieceFiles(root: string, name: string): readonly string[] {
  return briefFolders(root).flatMap((brief) =>
    [`${name}.ts`, `${name}-scene.ts`]
      .map((file) => join(root, brief, "src", file))
      .filter((path) => existsSync(path)),
  );
}

/** The `src/moves` folder of each brief that has one, in brief order. */
export function movesFolders(root: string): readonly string[] {
  return briefFolders(root)
    .map((brief) => join(root, brief, "src", "moves"))
    .filter((folder) => existsSync(folder));
}

/** Every `.ts` and `.tsx` file under `folder`, leaving out `node_modules`, `dist` and hidden folders. */
export function sourceFiles(folder: string): readonly string[] {
  if (!existsSync(folder)) return [];
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name);
    if (entry.isDirectory())
      return entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")
        ? []
        : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path] : [];
  });
}

const SPECIFIERS: readonly RegExp[] = [
  /\b(?:from|import)\s*\(?\s*["']([^"']+)["']/g,
  /\brequire\s*\(\s*["']([^"']+)["']/g,
  /\bimport\s*\(\s*`([^`]*)`/g,
];

/** The module specifier of every import, re-export, dynamic import and `require` in `source`, in order;
 * a template literal counts only when it has no `${`. */
export function importSpecifiers(source: string): readonly string[] {
  return SPECIFIERS.flatMap((pattern) =>
    [...source.matchAll(pattern)].map((found) => ({ at: found.index, specifier: found[1] ?? "" })),
  )
    .filter(({ specifier }) => !specifier.includes("${"))
    .sort((left, right) => left.at - right.at)
    .map(({ specifier }) => specifier);
}

/** Findings for brief files in src/moves and src/parts that import more than @gerak/core, @gerak/moves or
 * their own src/parts: one per import. */
export function portabilityFindings(root: string): readonly string[] {
  const homes = briefFolders(root).map((name) => join(root, name));
  return homes.flatMap((home) => {
    const parts = resolve(home, "src", "parts");
    return ["moves", "parts"].flatMap((folder) =>
      sourceFiles(join(home, "src", folder)).flatMap((file) =>
        importSpecifiers(readFileSync(file, "utf8"))
          .filter((specifier) => {
            if (specifier === "@gerak/core" || specifier === "@gerak/moves") return false;
            if (!specifier.startsWith(".")) return true;
            const target = resolve(dirname(file), specifier);
            return target !== parts && !target.startsWith(parts + sep);
          })
          .map((specifier) => `${relative(root, file)} imports ${specifier}`),
      ),
    );
  });
}
