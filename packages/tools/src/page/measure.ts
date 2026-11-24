import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { cachePathOf, pageDigest, readMeasureCache, type MeasureCache } from "./measure-cache";
import { readPageArgs, withPage, type PageTarget } from "./page";

/** Parsed `gerak measure` arguments, or the usage text. */
export type MeasureArgs =
  | ({ readonly kind: "ok" } & PageTarget)
  | { readonly kind: "usage"; readonly message: string };

/** The cache written and its element names, or why nothing was written. */
export type MeasureResult =
  | {
      readonly kind: "measured";
      readonly file: string;
      readonly names: readonly string[];
      readonly pageErrors: readonly string[];
    }
  | { readonly kind: "refused"; readonly message: string; readonly pageErrors: readonly string[] };

const USAGE = "usage: gerak measure <brief>/<name>.html [--size WxH] [--root dir]";

/** Reads `<page> [--size WxH] [--root dir]`; a page measured into a cache must be served from a folder. */
export function parseMeasureArgs(argv: readonly string[]): MeasureArgs {
  const usage = (message: string): MeasureArgs => ({
    kind: "usage",
    message: `${message} ${USAGE}`,
  });
  const read = readPageArgs(argv, []);
  if (read.kind === "usage") return usage(read.message);
  if (read.target.source.kind !== "serve") return usage("A measured page is served from --root.");
  if (!read.target.page.endsWith(".html")) return usage("Expected an .html page.");
  return { kind: "ok", ...read.target };
}

/** Opens the page once, reads what every mount on it measured, and writes the cache beside it. */
export async function measurePage(request: PageTarget): Promise<MeasureResult> {
  const { source } = request;
  if (source.kind !== "serve")
    return { kind: "refused", message: "A measured page is served from --root.", pageErrors: [] };
  const { value, pageErrors } = await withPage(request, async ({ page, advanceTo }) => {
    await advanceTo(0);
    return page.evaluate(() => {
      const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
      if (!Array.isArray(listed)) return [];
      return listed.flatMap((mounted: unknown) => {
        const measure: unknown = Reflect.get(Object(mounted), "measure");
        return typeof measure === "function"
          ? [JSON.stringify(Reflect.apply(measure, mounted, []))]
          : [];
      });
    });
  });
  if (value.length === 0)
    return { kind: "refused", message: `${request.page} mounted no scene.`, pageErrors };
  const digest = pageDigest(join(source.root, request.page));
  const merged = merge(request.page, digest, value);
  if ("reason" in merged) return { kind: "refused", message: merged.reason, pageErrors };
  const file = cachePathOf(join(source.root, request.page));
  writeFileSync(file, `${JSON.stringify(merged, null, 1)}\n`);
  return { kind: "measured", file, names: Object.keys(merged.rest), pageErrors };
}

/** One cache from each mount's measure: one frame, and each name measured by one mount only. */
function merge(
  page: string,
  digest: string,
  texts: readonly string[],
): MeasureCache | { readonly reason: string } {
  const name = page.slice(page.lastIndexOf("/") + 1);
  let out: MeasureCache | undefined;
  for (const text of texts) {
    const head = `{"page":${JSON.stringify(name)},"digest":${JSON.stringify(digest)},`;
    const read = readMeasureCache(`${head}${text.slice(1)}`);
    if ("reason" in read) return { reason: `a mount's measure is not readable: ${read.reason}` };
    if (out === undefined) {
      out = read;
      continue;
    }
    const held = out.rest;
    const twice = Object.keys(read.rest).filter((key) => key in held);
    if (twice.length > 0)
      return { reason: `two mounts measure ${twice.map((key) => `"${key}"`).join(", ")}.` };
    const twiceObj = Object.keys(read.objects ?? {}).filter((key) => key in (out?.objects ?? {}));
    if (twiceObj.length > 0)
      return {
        reason: `two mounts measure objects ${twiceObj.map((key) => `"${key}"`).join(", ")}.`,
      };
    const twiceCounts = Object.keys(read.counts ?? {}).filter((key) => key in (out?.counts ?? {}));
    if (twiceCounts.length > 0)
      return {
        reason: `two mounts measure counts ${twiceCounts.map((key) => `"${key}"`).join(", ")}.`,
      };
    const mergedObjects = { ...(out.objects ?? {}), ...(read.objects ?? {}) };
    const mergedCounts = { ...(out.counts ?? {}), ...(read.counts ?? {}) };
    out = {
      ...out,
      rest: { ...out.rest, ...read.rest },
      lines: { ...out.lines, ...read.lines },
      parents: { ...out.parents, ...read.parents },
      ...(Object.keys(mergedObjects).length === 0 ? {} : { objects: mergedObjects }),
      ...(Object.keys(mergedCounts).length === 0 ? {} : { counts: mergedCounts }),
    };
  }
  return out ?? { reason: `${page} mounted no scene.` };
}
