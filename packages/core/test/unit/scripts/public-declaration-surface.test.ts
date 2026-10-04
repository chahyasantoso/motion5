import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const root = fileURLToPath(new URL("../../../../..", import.meta.url));
const FORBIDDEN_DIRECTORY = /\/(?:runtime|graph)\//;

async function declarationFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await declarationFiles(path)));
    else if (entry.name.endsWith(".d.ts")) files.push(path);
  }
  return files;
}

/** Relative specifiers named by `from`, `import`, and inline `import("...")` type queries. */
export function importedSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  for (const match of source.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
    const specifier = match[1];
    if (specifier !== undefined) specifiers.push(specifier);
  }
  return specifiers;
}

/**
 * Every emitted declaration a relative specifier could name, most specific first.
 *
 * TypeScript preserves the authored specifier in the emitted `.d.ts`, so the same edge can
 * appear extensionless, with a runtime extension (`./x.js` under NodeNext), as a directory,
 * or already as a declaration path. Trying only `${specifier}.d.ts` meant every other
 * spelling resolved to nothing, and a scanner that ignores what it cannot resolve reports a
 * clean boundary for a closure it never walked. The caller treats an empty result as a
 * failure, never as an edge worth skipping.
 */
export function declarationCandidates(fromFile: string, specifier: string): string[] {
  const base = resolve(dirname(fromFile), specifier);
  const trimmed = (length: number) => base.slice(0, -length);
  if (/\.d\.(?:ts|mts|cts)$/.test(specifier)) return [base];
  if (specifier.endsWith(".js")) return [`${trimmed(3)}.d.ts`];
  if (specifier.endsWith(".mjs")) return [`${trimmed(4)}.d.mts`, `${trimmed(4)}.d.ts`];
  if (specifier.endsWith(".cjs")) return [`${trimmed(4)}.d.cts`, `${trimmed(4)}.d.ts`];
  return [`${base}.d.ts`, `${base}.d.mts`, `${base}.d.cts`, join(base, "index.d.ts")];
}

interface Closure {
  readonly reachable: ReadonlySet<string>;
  readonly unresolved: readonly string[];
  readonly forbidden: readonly string[];
}

/** Emits declarations for `sources` into a fresh directory under the repository and reads them. */
async function withEmitted<T>(
  sources: readonly string[],
  use: (out: string, emitted: ReadonlySet<string>) => Promise<T>,
): Promise<T> {
  const out = await mkdtemp(join(root, ".tmp-public-dts-"));
  try {
    await execFileAsync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      [
        "tsc",
        "--declaration",
        "--emitDeclarationOnly",
        "--target",
        "ES2023",
        "--module",
        "ESNext",
        "--moduleResolution",
        "Bundler",
        "--strict",
        "--skipLibCheck",
        "--outDir",
        out,
        ...sources,
      ],
      { cwd: root, shell: process.platform === "win32" },
    );
    return await use(out, new Set(await declarationFiles(out)));
  } finally {
    await rm(out, { recursive: true, force: true });
  }
}

/** Every declaration reachable from `entry` by relative edges, and every edge that did not resolve. */
async function closureOf(
  out: string,
  emitted: ReadonlySet<string>,
  entry: string,
): Promise<Closure> {
  const reachable = new Set<string>();
  const unresolved: string[] = [];
  const forbidden: string[] = [];
  const queue = [entry];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    const shown = relative(out, current).replaceAll("\\", "/");
    if (FORBIDDEN_DIRECTORY.test(`/${shown}`)) forbidden.push(shown);
    const source = await readFile(current, "utf8");
    for (const specifier of importedSpecifiers(source)) {
      if (!specifier.startsWith(".")) continue;
      const target = declarationCandidates(current, specifier).find((candidate) =>
        emitted.has(candidate),
      );
      if (target === undefined) {
        unresolved.push(`${shown} -> ${specifier}`);
        continue;
      }
      queue.push(target);
    }
  }
  return { reachable, unresolved, forbidden };
}

describe("public declaration surface (P1-9)", () => {
  it("scans the emitted entry declaration closure, not just source strings", async () => {
    await withEmitted(["packages/core/src/index.ts"], async (out, emitted) => {
      const entries = [...emitted].filter((path) => path.endsWith("index.d.ts"));
      expect(entries).toHaveLength(1);
      const entry = entries[0];
      expect(entry).toBeDefined();
      const { reachable, unresolved, forbidden } = await closureOf(out, emitted, entry!);

      // Unresolved edges are asserted first. A traversal that silently stopped early would
      // otherwise report an empty forbidden list and look exactly like a clean boundary.
      expect(unresolved).toEqual([]);
      expect(forbidden).toEqual([]);
      expect(reachable.size).toBeGreaterThan(1);
    });
  }, 120_000);

  // Issue #500 phase 8 and ADR-125: the plugin subpaths are entries too, so the 3D ones that became
  // public are held to the root entry's rule. The entry list is read from the core manifest, the
  // one owner of what is declared, rather than restated.
  it("TH-122 keeps every declared plugin subpath's declaration closure out of runtime and graph", async () => {
    const manifest = JSON.parse(
      await readFile(join(root, "packages", "core", "package.json"), "utf8"),
    ) as { exports: Record<string, unknown> };
    const plugins = Object.keys(manifest.exports).flatMap((key) => {
      const name = /^\.\/plugins\/([a-z0-9]+)$/.exec(key)?.[1];
      return name === undefined ? [] : [name];
    });
    expect(plugins).toEqual(expect.arrayContaining(["transform3d", "fk3d", "ik3d"]));
    await withEmitted(
      plugins.map((name) => `packages/core/src/plugins/${name}.ts`),
      async (out, emitted) => {
        for (const name of plugins) {
          const entry = join(out, "plugins", `${name}.d.ts`);
          expect(emitted.has(entry), name).toBe(true);
          const { reachable, unresolved, forbidden } = await closureOf(out, emitted, entry);
          expect(unresolved, name).toEqual([]);
          expect(forbidden, name).toEqual([]);
          expect(reachable.size, name).toBeGreaterThan(1);
        }
      },
    );
  }, 120_000);

  it("resolves every declaration specifier shape and leaves unknown targets unresolved", () => {
    const emitRoot = join(root, ".fixture-dts");
    const entry = join(emitRoot, "index.d.ts");
    const contract = join(emitRoot, "contract", "v5.d.ts");
    const emitted = new Set([entry, contract, join(emitRoot, "ports", "index.d.ts")]);
    const pick = (specifier: string) =>
      declarationCandidates(entry, specifier).find((candidate) => emitted.has(candidate));

    expect(pick("./contract/v5")).toBe(contract);
    expect(pick("./contract/v5.js")).toBe(contract);
    expect(pick("./contract/v5.d.ts")).toBe(contract);
    expect(pick("./ports")).toBe(join(emitRoot, "ports", "index.d.ts"));
    // The shape the previous scanner skipped instead of rejecting.
    expect(pick("./runtime/project-runtime.js")).toBeUndefined();
  });

  it("TH-201 keeps the declared plugin-authoring API closure out of runtime and graph", async () => {
    const manifest = JSON.parse(
      await readFile(join(root, "packages/core/package.json"), "utf8"),
    ) as { exports: Record<string, unknown> };
    expect(manifest.exports["./plugin-api"]).toEqual({
      types: "./dist/plugin-api.d.ts",
      default: "./dist/plugin-api.js",
    });
    await withEmitted(["packages/core/src/plugin-api.ts"], async (out, emitted) => {
      const entry = join(out, "plugin-api.d.ts");
      expect(emitted.has(entry)).toBe(true);
      const { reachable, unresolved, forbidden } = await closureOf(out, emitted, entry);
      expect(unresolved).toEqual([]);
      expect(forbidden).toEqual([]);
      expect(reachable.size).toBeGreaterThan(1);
    });
  }, 120_000);

  it("reads relative specifiers from re-exports and inline dynamic type imports", () => {
    const source = [
      'export * from "./contract/v5";',
      'import type { Patch } from "./contract/v5.js";',
      'declare const handle: import("./runtime/project-runtime").ProjectRuntime;',
      'export { Engine } from "./engine";',
    ].join("\n");

    expect(importedSpecifiers(source)).toEqual([
      "./contract/v5",
      "./contract/v5.js",
      "./runtime/project-runtime",
      "./engine",
    ]);
  });
});
