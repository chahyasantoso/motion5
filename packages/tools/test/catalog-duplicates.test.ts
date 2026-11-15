import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  duplicatePairs,
  loadCatalog,
  parseCatalogArgs,
  promoteMove,
  runCatalog,
  type CatalogArgs,
} from "@gerak/tools/scene";
import { DEFAULT_ROOT } from "../src/page/page";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const ENTER = (
  id: string,
  name: string,
  curve = "-distance * (1 - progress)",
) => `import { defineMove, type Pose2d } from "@gerak/moves";
export const ${name} = defineMove({
  id: "${id}",
  role: "enter",
  description: "Slides in from the left.",
  options: { distance: { kind: "number", min: 0, max: 500, default: 100, description: "Start offset, in px." } },
  example: { options: { distance: 100 } },
  moments: () => ({}),
  run: ({ distance }, { progress }): Pose2d => ({ x: ${curve} }),
});
`;

function put(root: string, brief: string, file: string, text: string): void {
  mkdirSync(join(root, brief, "src", "moves"), { recursive: true });
  writeFileSync(join(root, brief, "src", "moves", file), text);
}

/** A root of folder sources only: `title` declares `jolt`, `reel` declares `copy` with the given curve. */
function pair(curve?: string): string {
  const root = mkdtempSync(join(tmpdir(), "catalog-duplicates-"));
  roots.push(root);
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({ gerak: { moves: ["./*/src/moves"] } }),
  );
  put(root, "title", "a.ts", ENTER("jolt", "jolt"));
  put(root, "reel", "b.ts", ENTER("jolt-copy", "joltCopy", curve));
  return root;
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

describe("near-duplicate moves", () => {
  it("finds a copy of another brief's move under a new id, naming it and how to import it", async () => {
    const run = await runCatalog(ok(["--check"]), pair());
    expect(run.code).toBe(1);
    expect(run.lines).toContain(
      'jolt-copy: close to `jolt` (title): import it instead (import { jolt } from "./title/src/moves/a"), or change what makes yours differ.',
    );
  });

  it("leaves a pair out when the baseline lists it, in either order", async () => {
    const run = await runCatalog(ok(["--check"]), pair(), {
      baseline: new Set(["reel/jolt-copy title/jolt"]),
    });
    expect(run).toEqual({ lines: ["ok: 2 moves pass."], code: 0 });
  });

  it("does not find a move that moves differently", async () => {
    const run = await runCatalog(ok(["--check"]), pair("-distance * (1 - progress) ** 4"));
    expect(run.code).toBe(0);
  });

  it("does not find two moves of different roles", async () => {
    const root = pair();
    put(
      root,
      "reel",
      "b.ts",
      ENTER("jolt-copy", "joltCopy").replace('role: "enter"', 'role: "travel"'),
    );
    expect((await runCatalog(ok(["--check"]), root)).code).toBe(0);
  });

  it("names the pairs a root has, sorted, source/id each", async () => {
    const { entries } = await loadCatalog(pair());
    expect(duplicatePairs(entries.map(({ record }) => record))).toEqual([
      "reel/jolt-copy title/jolt",
    ]);
  });

  it("refuses to promote a move with a near-duplicate finding, and changes nothing", async () => {
    const base = mkdtempSync(join(tmpdir(), "catalog-duplicates-"));
    roots.push(base);
    const root = join(base, "app");
    mkdirSync(root);
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ gerak: { moves: ["./*/src/moves"], promoteTo: "../moves/src/moves" } }),
    );
    put(root, "reel", "x.ts", ENTER("zig", "zig"));
    put(root, "other", "y.ts", ENTER("zag", "zag"));
    writeFileSync(
      join(root, "reel", "src", "one.ts"),
      `import { zig } from "./moves/x";\nexport const a = zig;\n`,
    );
    mkdirSync(join(root, "title", "src"), { recursive: true });
    writeFileSync(
      join(root, "title", "src", "two.ts"),
      `import { zig } from "../../reel/src/moves/x";\nexport const b = zig;\n`,
    );
    const library = join(base, "moves");
    mkdirSync(library);
    cpSync(join(process.cwd(), "packages", "moves", "src"), join(library, "src"), {
      recursive: true,
    });
    const run = await promoteMove("zig", root);
    expect(run.code).toBe(1);
    expect(run.lines.join(" ")).toContain("close to `zag` (other)");
    expect(readFileSync(join(root, "reel", "src", "moves", "x.ts"), "utf8")).toContain("zig");
  });
});

describe("the duplicate baseline", () => {
  const file = join(process.cwd(), "scripts", "duplicate-baseline.json");
  const baseline: unknown = JSON.parse(readFileSync(file, "utf8"));

  it("lists sorted pairs the tree still has, and the tree has no pair it does not list", async () => {
    expect(Array.isArray(baseline)).toBe(true);
    const listed = Array.isArray(baseline) ? baseline.map(String) : [];
    const { entries } = await loadCatalog(DEFAULT_ROOT);
    const found = duplicatePairs(entries.map(({ record }) => record));
    expect(listed).toEqual([...listed].sort());
    expect(found).toEqual(listed);
  });

  it("lets the tree's own check pass", async () => {
    const run = await runCatalog(ok(["--check"]), DEFAULT_ROOT);
    expect(run.lines.filter((line) => line.includes("close to"))).toEqual([]);
  });
});
