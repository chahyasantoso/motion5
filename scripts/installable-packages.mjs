import { readFileSync } from "node:fs";

const packagesRoot = new URL("../packages/", import.meta.url);

/** The installable packages, in dependency order: each follows everything it depends on. */
export const INSTALLABLE_PACKAGES = [
  "core",
  "rig",
  "player",
  "stage",
  "moves",
  "physics",
  "dom",
  "react",
  "three",
  "rig-three",
  "rapier",
  "tools",
  "moves-tools",
];

/** The parsed package.json of a package directory under packages/. */
export function readManifest(directory) {
  return JSON.parse(readFileSync(new URL(`${directory}/package.json`, packagesRoot), "utf8"));
}

/** Every import specifier a manifest's exports declare, e.g. `@gerak/three/react`. */
export function exportSpecifiers(manifest) {
  return Object.keys(manifest.exports).map((subpath) =>
    subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`,
  );
}
