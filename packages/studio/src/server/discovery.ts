import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/** Where a running studio and its piece are found. */
export interface Discovery {
  readonly url: string;
  readonly piece: string;
}

/** The file under the pieces folder that names the studio running over it. */
export function discoveryPath(root: string): string {
  return join(root, ".gerak", "studio.json");
}

/** Records the running studio, creating the folder when missing. */
export function writeDiscovery(root: string, found: Discovery): void {
  const file = discoveryPath(root);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify({ url: found.url, piece: found.piece })}\n`);
}

/** Deletes the record when it still names `url`, so a later studio's record stays; a missing file is fine. */
export function removeDiscovery(root: string, url: string): void {
  if (readDiscovery(root)?.url === url) rmSync(discoveryPath(root), { force: true });
}

/** The recorded studio, or undefined when the file is missing or malformed. */
export function readDiscovery(root: string): Discovery | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(discoveryPath(root), "utf8"));
  } catch {
    return undefined;
  }
  const url: unknown = Reflect.get(Object(parsed), "url");
  const piece: unknown = Reflect.get(Object(parsed), "piece");
  if (typeof url !== "string" || typeof piece !== "string") return undefined;
  return { url, piece };
}
