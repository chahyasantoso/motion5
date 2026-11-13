import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkMove,
  collectRecords,
  isMove,
  loadAppModules,
  parseCatalogArgs,
  parsePromoteArgs,
  promoteMove,
  runCatalog,
  type CatalogArgs,
} from "@gerak/tools/scene";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const MOVE = `import { defineMove, mix, type Pose2d } from "@gerak/moves";
export const slideIn = defineMove({
  id: "slide-in",
  role: "enter",
  description: "Slides in from the left.",
  options: { distance: { kind: "number", min: 0, max: 500, default: 100, description: "Start offset, in px." } },
  example: { options: { distance: 100 } },
  moments: () => ({ arrive: 1 }),
  run: ({ distance }, { progress }): Pose2d => ({ x: mix(-distance, 0, progress) }),
});
`;

function fixture(): { readonly root: string; readonly movesPackage: string } {
  const base = mkdtempSync(join(tmpdir(), "motion-promote-"));
  dirs.push(base);
  const root = join(base, "app");
  mkdirSync(join(root, "src", "moves"), { recursive: true });
  mkdirSync(join(root, "src", "deep"), { recursive: true });
  writeFileSync(join(root, "src", "moves", "x.ts"), MOVE);
  writeFileSync(
    join(root, "src", "one.ts"),
    `import { fade } from "@gerak/moves";\nimport { slideIn } from "./moves/x";\nexport const a = [fade, slideIn];\n`,
  );
  writeFileSync(
    join(root, "src", "deep", "two.ts"),
    `import { slideIn } from "../moves/x";\nexport const b = slideIn;\n`,
  );
  const movesPackage = join(base, "moves");
  mkdirSync(movesPackage);
  cpSync(join(process.cwd(), "packages", "moves", "src"), join(movesPackage, "src"), {
    recursive: true,
  });
  return { root, movesPackage };
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

describe("motion:moves --candidates", () => {
  it("lists a local move imported by two files", async () => {
    const { root } = fixture();
    const run = await runCatalog(ok(["--candidates"]), root);
    expect(run.lines).toEqual(["slide-in | x.ts | importers: 2"]);
    expect(run.code).toBe(0);
  });

  it("leaves out a move imported by one file", async () => {
    const { root } = fixture();
    rmSync(join(root, "src", "deep", "two.ts"));
    const run = await runCatalog(ok(["--candidates"]), root);
    expect(run.lines).toEqual(["No candidates."]);
  });
});

describe("motion:promote", () => {
  it("moves the file, exports it and repoints the importers", async () => {
    const { root, movesPackage } = fixture();
    const run = await promoteMove("slide-in", root, { movesPackage });
    expect(run.code).toBe(0);
    expect(existsSync(join(root, "src", "moves", "x.ts"))).toBe(false);
    const moved = readFileSync(join(movesPackage, "src", "x.ts"), "utf8");
    expect(moved).not.toContain("@gerak/moves");
    expect(moved).toContain('import { defineMove } from "./declare";');
    expect(moved).toContain('import type { Pose2d } from "./pose";');
    expect(moved).toContain('import { mix } from "./mix";');
    expect(readFileSync(join(movesPackage, "src", "index.ts"), "utf8")).toContain(
      'export { slideIn } from "./x";',
    );
    expect(readFileSync(join(root, "src", "one.ts"), "utf8")).toBe(
      `import { fade, slideIn } from "@gerak/moves";\nexport const a = [fade, slideIn];\n`,
    );
    expect(readFileSync(join(root, "src", "deep", "two.ts"), "utf8")).toBe(
      `import { slideIn } from "@gerak/moves";\nexport const b = slideIn;\n`,
    );
    expect(run.lines.some((line) => line.includes("two.ts"))).toBe(true);
  });

  it("leaves a move that passes the gate in the moved copy", async () => {
    const { root, movesPackage } = fixture();
    await promoteMove("slide-in", root, { movesPackage });
    const module: Readonly<Record<string, unknown>> = await import(
      pathToFileURL(join(movesPackage, "src", "x.ts")).href
    );
    const moves = Object.values(module).filter(isMove);
    expect(moves.map((found) => found.id)).toEqual(["slide-in"]);
    for (const found of moves) expect(checkMove(found)).toEqual([]);
    const { modules } = await loadAppModules(root);
    expect(
      collectRecords(modules, {}).filter(({ record }) => record.source.kind === "app"),
    ).toEqual([]);
  });

  it("refuses a move that is not a candidate and changes nothing", async () => {
    const { root, movesPackage } = fixture();
    rmSync(join(root, "src", "deep", "two.ts"));
    const run = await promoteMove("slide-in", root, { movesPackage });
    expect(run.code).toBe(1);
    expect(run.lines[0]).toContain("not a candidate");
    expect(existsSync(join(root, "src", "moves", "x.ts"))).toBe(true);
    expect(existsSync(join(movesPackage, "src", "x.ts"))).toBe(false);
  });

  it("refuses an unknown id", async () => {
    const { root, movesPackage } = fixture();
    const run = await promoteMove("nonsense", root, { movesPackage });
    expect(run.code).toBe(1);
    expect(run.lines.join(" ")).toContain("slide-in | x.ts");
  });

  it("reads its arguments", () => {
    expect(parsePromoteArgs(["slide-in", "--root", "app"])).toEqual({
      kind: "ok",
      id: "slide-in",
      root: "app",
    });
    expect(parsePromoteArgs([]).kind).toBe("usage");
  });
});
