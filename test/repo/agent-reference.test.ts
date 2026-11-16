import { readdirSync, readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { moveParts } from "@gerak/moves-tools";
import { COMMANDS as TOOLS_COMMANDS } from "../../packages/tools/bin/commands.mjs";
import { COMMANDS as LIBRARY_COMMANDS } from "../../packages/moves-tools/bin/commands.mjs";
import { PACKAGES } from "../../scripts/reference.mjs";

const COMMANDS = { ...TOOLS_COMMANDS, ...LIBRARY_COMMANDS };

const ROOT = new URL("../../", import.meta.url);
const calls = readFileSync(new URL("docs/guide/agent-calls.md", ROOT), "utf8");

/** A package's generated reference pages, joined. */
function referenceOf(dir: string): string {
  const folder = new URL(`packages/${dir}/docs/reference/`, ROOT);
  return readdirSync(folder)
    .map((name) => readFileSync(new URL(name, folder), "utf8"))
    .join("\n");
}

function entryLine(name: string): string {
  return `**\`${name}\`**`;
}

/** Every name a package's entry exports, read by the compiler as a caller sees them. */
function exportsOf(names: readonly string[]): ReadonlyMap<string, readonly string[]> {
  const files = names.map((name) =>
    new URL(`packages/${name}`, ROOT).pathname.replace(/^\/(\w:)/, "$1"),
  );
  const program = ts.createProgram(files, {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  return new Map(
    names.map((name, index) => {
      const source = program.getSourceFile(files[index] ?? "");
      const module = source === undefined ? undefined : checker.getSymbolAtLocation(source);
      return [
        name,
        module === undefined
          ? []
          : checker.getExportsOfModule(module).map(({ name: exported }) => exported),
      ];
    }),
  );
}

describe("agent reference", () => {
  it("names every export of every package a scene can use, so no agent reads source to find one", () => {
    const missing: string[] = [];
    const all = PACKAGES.flatMap(({ dir, entries }) =>
      entries.map((entry) => ({ dir, name: `${dir}/${entry}` })),
    );
    const exported = exportsOf(all.map(({ name }) => name));
    const references = new Map(PACKAGES.map(({ dir }) => [dir, referenceOf(dir)]));
    for (const { dir, name } of all) {
      const symbols = exported.get(name) ?? [];
      expect(symbols.length, `${name} exports nothing the compiler can see`).toBeGreaterThan(0);
      for (const symbol of symbols)
        if (!references.get(dir)?.includes(entryLine(symbol))) missing.push(`${name}: ${symbol}`);
    }
    expect(missing).toEqual([]);
  });

  it("names in its parts list only exports of @gerak/moves, each one named in its reference", () => {
    const exported = new Set(exportsOf(["moves/src/index.ts"]).get("moves/src/index.ts"));
    const reference = referenceOf("moves");
    const names = moveParts().map(({ name }) => name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.filter((name) => !exported.has(name))).toEqual([]);
    expect(names.filter((name) => !reference.includes(entryLine(name)))).toEqual([]);
  });

  it("names every gerak command", () => {
    const missing = Object.keys(COMMANDS).filter((name) => !calls.includes(`\`gerak ${name}`));
    expect(missing).toEqual([]);
  });

  it("lists every reference page of a package in that package's reference README", () => {
    for (const { dir } of PACKAGES) {
      const folder = new URL(`packages/${dir}/docs/reference/`, ROOT);
      const readme = readFileSync(new URL("README.md", folder), "utf8");
      const pages = readdirSync(folder).filter((name) => name !== "README.md");
      expect(pages.length, dir).toBeGreaterThan(0);
      for (const page of pages) expect(readme, `${dir}/${page}`).toContain(`(./${page})`);
    }
  });

  it("names core's groups in the order a reader needs them", () => {
    const readme = readFileSync(new URL("packages/core/docs/reference/README.md", ROOT), "utf8");
    const order = [...readme.matchAll(/\[(\w+)\]\(\.\//g)].map((match) => match[1]);
    expect(order).toEqual([
      "fields",
      "time",
      "blend",
      "ease",
      "envelope",
      "geometry",
      "path",
      "measure",
      "events",
      "utility",
    ]);
  });
});
