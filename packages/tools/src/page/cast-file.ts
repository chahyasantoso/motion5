import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { unreachable } from "./unreachable";

/** Whether a discovered cast target binds a single item or a list of parts. */
export type PageCastKind = "single" | "list";

/** DOM and 3D cast tables recorded into `<name>.cast.ts`. */
export interface PageCastSpec {
  readonly dom: Readonly<Record<string, PageCastKind>>;
  readonly objects: Readonly<Record<string, PageCastKind>>;
}

type CastEntry =
  | { readonly maker: "box"; readonly kind: PageCastKind }
  | { readonly maker: "object"; readonly kind: PageCastKind };

const LINE_LIMIT = 100;

/** The cast module file of a page `<dir>/<name>.html`: `<dir>/<name>.cast.ts`. */
export function castFilePathOf(page: string): string {
  return join(dirname(page), `${basename(page, ".html")}.cast.ts`);
}

function sortNames(names: Iterable<string>): readonly string[] {
  const unique = new Set<string>();
  for (const name of names) {
    if (name !== "" && !name.includes(".")) unique.add(name);
  }
  return [...unique].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function formatPropertyKey(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function formatUnion(typeName: string, names: readonly string[]): string {
  if (names.length === 0) return `export type ${typeName} = never;`;
  const literals = names.map((name) => JSON.stringify(name));
  const single = `export type ${typeName} = ${literals.join(" | ")};`;
  if (single.length <= LINE_LIMIT) return single;
  return [
    `export type ${typeName} =`,
    ...literals.map(
      (literal, index) => `  | ${literal}${index === literals.length - 1 ? ";" : ""}`,
    ),
  ].join("\n");
}

function formatEntry(name: string, entry: CastEntry): string {
  const key = formatPropertyKey(name);
  const literal = JSON.stringify(name);
  switch (entry.kind) {
    case "list":
      return `  ${key}: ${entry.maker}(${literal}, { parts: true }),`;
    case "single":
      return `  ${key}: ${entry.maker}(${literal}),`;
    default:
      return unreachable(entry.kind);
  }
}

/** Scans static HTML markup for `data-cast` tags, ignoring comments, scripts, and styles. */
export function scanHtmlCasts(html: string): Readonly<Record<string, PageCastKind>> {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const counts = new Map<string, number>();
  for (const tag of cleaned.matchAll(/<[a-zA-Z](?:[^>"']|"[^"]*"|'[^']*')*>/g)) {
    const match = /\bdata-cast\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(tag[0]);
    const raw = match?.[1] ?? match?.[2] ?? match?.[3];
    if (raw === undefined || raw === "" || raw.includes(".")) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  const out: Record<string, PageCastKind> = {};
  for (const [name, count] of counts) {
    out[name] = count > 1 ? "list" : "single";
  }
  return out;
}

/** Reads existing `object("name", ...)` entries from `<name>.cast.ts` so HTML sync preserves 3D casts. */
export function readCastFileObjects(source: string): Readonly<Record<string, PageCastKind>> {
  const out: Record<string, PageCastKind> = {};
  const entryPattern =
    /\bobject\s*\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*(?:,\s*\{([^}]*)\}\s*)?\)/g;
  for (const match of source.matchAll(entryPattern)) {
    const literal = match[1];
    if (literal === undefined) continue;
    let name: string;
    if (literal.startsWith("'")) {
      name = literal.slice(1, -1);
    } else {
      const parsed: unknown = JSON.parse(literal);
      name = typeof parsed === "string" ? parsed : "";
    }
    if (name === "" || name.includes(".")) continue;
    const opts = match[2] ?? "";
    out[name] = /\bparts\s*:\s*true\b/.test(opts) ? "list" : "single";
  }
  return out;
}

/** Formats deterministic, Prettier-aligned `<name>.cast.ts` exporting `cast`, `DomCast`, `ObjectCast`, and `CastName`. */
export function formatCastModule(spec: PageCastSpec): string {
  const domNames = sortNames(Object.keys(spec.dom));
  const domSet = new Set(domNames);
  const objectNames = sortNames(Object.keys(spec.objects)).filter((name) => !domSet.has(name));
  const entries = new Map<string, CastEntry>();
  for (const name of objectNames) {
    entries.set(name, { maker: "object", kind: spec.objects[name] ?? "single" });
  }
  for (const name of domNames) {
    entries.set(name, { maker: "box", kind: spec.dom[name] ?? "single" });
  }

  const allNames = sortNames(entries.keys());
  const usesBox = allNames.some((name) => entries.get(name)?.maker === "box");
  const usesObject = allNames.some((name) => entries.get(name)?.maker === "object");
  const imported = [...(usesBox ? ["box"] : []), ...(usesObject ? ["object"] : [])];

  const lines: string[] = [];
  if (imported.length > 0) {
    lines.push(`import { ${imported.join(", ")} } from "@gerak/stage";`, "");
  }
  if (allNames.length === 0) {
    lines.push("export const cast = {} as const;");
  } else {
    lines.push("export const cast = {");
    for (const name of allNames) {
      const entry = entries.get(name);
      if (entry !== undefined) lines.push(formatEntry(name, entry));
    }
    lines.push("} as const;");
  }
  lines.push(
    "",
    formatUnion("DomCast", domNames),
    formatUnion("ObjectCast", objectNames),
    "export type CastName = DomCast | ObjectCast;",
    "",
  );
  return lines.join("\n");
}

/** Syncs `<name>.cast.ts` from a page's HTML while preserving existing 3D `object(...)` casts; returns path or undefined. */
export function syncHtmlCastFile(page: string): string | undefined {
  if (!existsSync(page)) return undefined;
  const target = castFilePathOf(page);
  const existing = existsSync(target) ? readFileSync(target, "utf8") : undefined;
  const dom = scanHtmlCasts(readFileSync(page, "utf8"));
  const objects = existing === undefined ? {} : readCastFileObjects(existing);
  if (
    existing === undefined &&
    Object.keys(dom).length === 0 &&
    Object.keys(objects).length === 0
  ) {
    return undefined;
  }
  const formatted = formatCastModule({ dom, objects });
  if (existing !== formatted) writeFileSync(target, formatted);
  return target;
}
