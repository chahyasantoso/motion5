import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { restReader, type Box, type RestReader } from "@gerak/stage";
import { withPlacement } from "@gerak/stage/render";
import {
  cachePathOf,
  pageDigest,
  readMeasureCache,
  type MeasureCache,
} from "../page/measure-cache";

/** What the tools know of a scene file's cast: no page to measure, a fresh cache, or why they refuse. */
export type CacheLookup =
  | { readonly kind: "none" }
  | { readonly kind: "read"; readonly cache: MeasureCache }
  | { readonly kind: "refused"; readonly message: string };

/** The page of a scene file `<brief>/src/<name>.ts` or `<name>-scene.ts`: `<brief>/<name>.html`. */
export function pageOfSceneFile(file: string): string | undefined {
  const folder = dirname(file);
  if (basename(folder) !== "src") return undefined;
  const name = basename(file)
    .replace(/\.tsx?$/, "")
    .replace(/-scene$/, "");
  return join(dirname(folder), `${name}.html`);
}

/** The fresh cache of the page a scene file plays on; a page with no cache, or one older than the page, is refused. */
export function lookupCache(sceneFile: string): CacheLookup {
  const page = pageOfSceneFile(sceneFile);
  if (page === undefined || !existsSync(page)) return { kind: "none" };
  const file = cachePathOf(page);
  const command = `gerak measure ${relative(process.cwd(), page).replaceAll("\\", "/")}`;
  if (!existsSync(file))
    return { kind: "refused", message: `${basename(page)} is not measured: run \`${command}\`.` };
  const cache = readMeasureCache(readFileSync(file, "utf8"));
  if ("reason" in cache)
    return { kind: "refused", message: `${basename(file)}: ${cache.reason} Run \`${command}\`.` };
  if (cache.digest !== pageDigest(page))
    return {
      kind: "refused",
      message: `${basename(page)} changed since it was measured: run \`${command}\` again.`,
    };
  return { kind: "read", cache };
}

/** The cache's rest boxes, each with its placement, as the engine reads rest. */
export function restOfCache(cache: MeasureCache): RestReader {
  const boxes: Record<string, Box> = {};
  for (const [name, { placement, ...box }] of Object.entries(cache.rest))
    boxes[name] = withPlacement(box, placement);
  return restReader(boxes, cache.objects);
}
