import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

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
