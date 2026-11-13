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
    expect(run.lines).toEqual(["slide-in | x.ts | briefs: 2"]);
    expect(run.code).toBe(0);
  });

  it("counts files of one brief once, files of two briefs twice, and a file with no brief as its own", async () => {
    const { root } = fixture();
    const one = join(root, "src", "one.ts");
    const two = join(root, "src", "deep", "two.ts");
    const text = (file: string) => readFileSync(file, "utf8");
    const oneText = text(one);
    const twoText = text(two);
    writeFileSync(
      one,
      `${oneText}export const brief = "reel";
`,
    );
    writeFileSync(
      two,
      `${twoText}export const brief = "reel";
`,
    );
    expect((await runCatalog(ok(["--candidates"]), root)).lines).toEqual(["No candidates."]);
    writeFileSync(
      two,
      `${twoText}export const brief = "title";
`,
    );
    expect((await runCatalog(ok(["--candidates"]), root)).lines).toEqual([
      "slide-in | x.ts | briefs: 2",
    ]);
    writeFileSync(two, twoText);
    expect((await runCatalog(ok(["--candidates"]), root)).lines).toEqual([
      "slide-in | x.ts | briefs: 2",
    ]);
    writeFileSync(one, `${oneText}export const brief = "reel's cut";\n`);
    writeFileSync(two, `${twoText}export const brief = \`reel's cut\`;\n`);
    expect((await runCatalog(ok(["--candidates"]), root)).lines).toEqual(["No candidates."]);
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

  it("writes the description above a moved move that has no doc comment, and keeps one it has", async () => {
    const { root, movesPackage } = fixture();
    await promoteMove("slide-in", root, { movesPackage });
    expect(readFileSync(join(movesPackage, "src", "x.ts"), "utf8")).toContain(
      "/** Slides in from the left. */\nexport const slideIn = defineMove(",
    );
    const again = fixture();
    const file = join(again.root, "src", "moves", "x.ts");
    writeFileSync(file, MOVE.replace("export const", "/** Mine. */\nexport const"));
    await promoteMove("slide-in", again.root, { movesPackage: again.movesPackage });
    const kept = readFileSync(join(again.movesPackage, "src", "x.ts"), "utf8");
    expect(kept).toContain("/** Mine. */\nexport const slideIn");
    expect(kept).not.toContain("Slides in from the left. */");
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

describe("motion:promote refuses what it cannot rewrite whole", () => {
  it("also repoints a test outside src that imports the move", async () => {
    const { root, movesPackage } = fixture();
    mkdirSync(join(root, "test"));
    const spec = join(root, "test", "x.test.ts");
    writeFileSync(spec, `import { slideIn } from "../src/moves/x";\nexport const t = slideIn;\n`);
    const run = await promoteMove("slide-in", root, { movesPackage });
    expect(run.code).toBe(0);
    expect(readFileSync(spec, "utf8")).toContain('from "@gerak/moves"');
  });

  it("refuses a re-export it cannot rewrite, and changes nothing", async () => {
    const { root, movesPackage } = fixture();
    writeFileSync(join(root, "src", "three.ts"), `export { slideIn } from "./moves/x";\n`);
    const run = await promoteMove("slide-in", root, { movesPackage });
    expect(run.code).toBe(1);
    expect(run.lines.join(" ")).toMatch(/three\.ts/);
    expect(existsSync(join(root, "src", "moves", "x.ts"))).toBe(true);
  });

  it("refuses a helper exported beside the move, and a name the library has", async () => {
    const { root, movesPackage } = fixture();
    const file = join(root, "src", "moves", "x.ts");
    writeFileSync(file, `${MOVE}export const clamp = (n: number) => n;\n`);
    expect((await promoteMove("slide-in", root, { movesPackage })).lines.join(" ")).toMatch(
      /clamp/,
    );
    writeFileSync(file, `${MOVE}export function overshoot(): void {}\n`);
    expect((await promoteMove("slide-in", root, { movesPackage })).lines.join(" ")).toMatch(
      /overshoot/,
    );
  });
});
