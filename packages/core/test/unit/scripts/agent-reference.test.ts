import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const ROOT = new URL("../../../../../", import.meta.url);
const reference = readFileSync(new URL("docs/guide/agent-reference.md", ROOT), "utf8");
const PACKAGES = [
  "moves/src/index.ts",
  "player/src/index.ts",
  "dom/src/index.ts",
  "react/src/index.ts",
  "react/src/engine.ts",
  "rig/src/index.ts",
  "physics/src/index.ts",
  "rapier/src/index.ts",
  "three/src/index.ts",
  "three/src/engine.ts",
];

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
    for (const [name, exported] of exportsOf(PACKAGES)) {
      expect(exported.length, `${name} exports nothing the compiler can see`).toBeGreaterThan(0);
      for (const symbol of exported) {
        const pattern = new RegExp(`\`${symbol.replace(/\$/g, "\\$")}[\`(]`);
        if (!pattern.test(reference)) missing.push(`${name}: ${symbol}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("names every motion command the repository defines", () => {
    const manifest: { readonly scripts: Readonly<Record<string, string>> } = JSON.parse(
      readFileSync(new URL("package.json", ROOT), "utf8"),
    );
    const commands = Object.keys(manifest.scripts).filter((script) => script.startsWith("motion:"));
    const missing = commands.filter((command) => !reference.includes(`\`${command}`));
    expect(missing).toEqual([]);
  });

  it("is where the guide and the make-motion skill send an agent", () => {
    expect(readFileSync(new URL("docs/guide/agent-motion.md", ROOT), "utf8")).toContain(
      "./agent-reference.md",
    );
    expect(readFileSync(new URL(".claude/skills/make-motion/SKILL.md", ROOT), "utf8")).toContain(
      "agent-reference.md",
    );
  });
});
