import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { MOVE_ROLES } from "@gerak/moves";
import {
  PARTS_HINT,
  PART_GROUPS,
  moveParts,
  collectRecords,
  parseCatalogArgs,
  runCatalog,
  type CatalogArgs,
} from "../src/index";
import { callerPiecesRoot } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const move = (id: string, end: string) => `import { type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
export const ${id.replace("-", "")} = defineMove({
  id: "${id}",
  role: "enter",
  description: "Slides in from the left.",
  options: { distance: { kind: "number", min: 0, max: 500, default: 100, description: "Start offset, in px." } },
  example: { options: { distance: 100 } },
  moments: () => ({ arrive: 1 }),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) ** 0.3${end} }),
});
`;

function app(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-moves-"));
  roots.push(dir);
  mkdirSync(join(dir, "reel/src/moves"), { recursive: true });
  writeFileSync(join(dir, "reel/src/moves/good.ts"), move("good", ""));
  writeFileSync(join(dir, "reel/src/moves/bad.ts"), move("bad", " - 4"));
  return dir;
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

// Read from the package, so a move added to it needs no change here.
const builtInIds = collectRecords([])
  .map(({ record }) => record.id)
  .sort();

describe("gerak moves", () => {
  it("lists every move by id with its source, fields and import under --all", async () => {
    const run = await runCatalog(ok(["--all"]), app());
    const ids = run.lines.map((line) => line.split(" | ")[0]);
    expect(ids).toEqual([...builtInIds, "bad", "good"].sort());
    expect(run.code).toBe(0);
    expect(run.lines).toContain(
      'good | reel | enter | x | passes | Slides in from the left. | import { good } from "./reel/src/moves/good"',
    );
    const drop = run.lines.find((line) => line.startsWith("drop | ")) ?? "";
    expect(drop).toContain("| @gerak/moves | enter | ");
    expect(drop.endsWith('import { drop } from "@gerak/moves"')).toBe(true);
  });

  it("prints the summary, not the moves, when asked for nothing", async () => {
    const run = await runCatalog(ok([]), app());
    expect(run.lines.length).toBeLessThanOrEqual(20);
    expect(run.lines.at(-1)).toBe(PARTS_HINT);
    expect(run.lines.some((line) => line.startsWith("good |"))).toBe(false);
  });

  it("applies the role filter to a named move, and prints a modifier's input in JSON", async () => {
    const dir = app();
    const mismatch = await runCatalog(ok(["good", "--role", "exit"]), dir);
    expect(mismatch.code).toBe(1);
    expect(mismatch.lines[0]).toContain('No move "good"');
    const json = await runCatalog(ok(["overshoot", "--json"]), dir);
    expect(json.lines[0]).toContain('"input":"(time');
  });

  it("lists the building blocks a move file imports, in source order, on the line and in full", async () => {
    const dir = app();
    writeFileSync(
      join(dir, "reel/src/moves/made.ts"),
      move("made", "").replace(
        'import { type Pose2d } from "@gerak/core";\nimport { defineMove } from "@gerak/moves";',
        'import { span, type Pose2d, type Time } from "@gerak/core";\nimport { defineMove, squashed } from "@gerak/moves";',
      ),
    );
    const full = await runCatalog(ok(["made"]), dir);
    expect(full.lines).toContain("parts: span + squashed");
    const json = await runCatalog(ok(["made", "--json"]), dir);
    expect(JSON.parse(json.lines.join("\n"))).toMatchObject([{ parts: ["span", "squashed"] }]);
  });

  it("reads the parts of the showreel's moves and of a built-in move from their source", async () => {
    const run = await runCatalog(ok(["--json"]), PIECES_ROOT);
    expect(JSON.parse(run.lines.join("\n"))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "lob", parts: expect.arrayContaining(["squashed"]) }),
        expect.objectContaining({ id: "implode", parts: expect.arrayContaining(["backEase"]) }),
        expect.objectContaining({ id: "drop", parts: expect.arrayContaining(["squashed"]) }),
      ]),
    );
  });

  it("reports an app file that exports no move", async () => {
    const dir = app();
    writeFileSync(join(dir, "reel/src/moves/plain.ts"), "export const plain = () => ({ x: 0 });");
    const run = await runCatalog(ok(["--check"]), dir);
    expect(run.code).toBe(1);
    expect(run.lines.some((line) => line.includes("plain.ts: exports no move"))).toBe(true);
  });

  it("lists the built-ins alone when the app has no moves folder", async () => {
    const dir = mkdtempSync(join(tmpdir(), "motion-moves-"));
    roots.push(dir);
    const run = await runCatalog(ok(["--all"]), dir);
    expect(run.lines.map((line) => line.split(" | ")[0])).toEqual(builtInIds);
    expect(run.code).toBe(0);
  });

  it("names the bad move under --check and fails", async () => {
    const run = await runCatalog(ok(["--check"]), app(), {
      baseline: new Set(["reel/bad reel/good"]),
    });
    expect(run.code).toBe(1);
    expect(run.lines.every((line) => line.startsWith("bad:"))).toBe(true);
    expect(run.lines[0]).toContain('"x" is -4');
  });

  it("passes --check when the app's moves are sound", async () => {
    const dir = app();
    rmSync(join(dir, "reel/src/moves/bad.ts"));
    const run = await runCatalog(ok(["--check"]), dir);
    expect(run.code).toBe(0);
  });

  it("reports an id declared twice within a source, and lets two sources share one", async () => {
    const dir = app();
    writeFileSync(join(dir, "reel/src/moves/again.ts"), move("good", ""));
    writeFileSync(join(dir, "reel/src/moves/clash.ts"), move("drop", ""));
    const run = await runCatalog(ok(["--check"]), dir);
    expect(run.code).toBe(1);
    expect(run.lines).toContainEqual(
      expect.stringMatching(/^good: declared 2 times, in .*again\.ts and .*good\.ts\.$/),
    );
    expect(run.lines.some((line) => line.startsWith("drop: declared"))).toBe(false);
  });

  it("filters by role, and refuses an unknown role with the known ones", async () => {
    const reveals = await runCatalog(ok(["--role", "reveal"]), app());
    expect(reveals.lines.map((line) => line.split(" | ")[0])).toEqual(["trace", "wipe"]);
    const usage = parseCatalogArgs(["--role", "dance"]);
    expect(usage.kind).toBe("usage");
    if (usage.kind === "usage")
      for (const role of MOVE_ROLES) expect(usage.message).toContain(role);
  });

  it("prints one move in full with a pasteable example and its file", async () => {
    const dir = app();
    const run = await runCatalog(ok(["good"]), dir);
    expect(run.code).toBe(0);
    expect(run.lines).toContain("  distance number 0..500, default 100: Start offset, in px.");
    expect(run.lines).toContain('example: good({"distance":100}, time)');
    expect(run.lines).toContain(`file: ${join(dir, "reel/src/moves/good.ts")}`);
    expect((await runCatalog(ok(["nothing"]), dir)).code).toBe(1);
  });

  it("prints records as JSON", async () => {
    const run = await runCatalog(ok(["--json", "--role", "reveal"]), app());
    expect(JSON.parse(run.lines.join("\n"))).toMatchObject([
      { id: "trace" },
      { id: "wipe", role: "reveal" },
    ]);
  });

  it("prints the parts under --parts, a heading per group and a line per part", async () => {
    const run = await runCatalog(ok(["--parts"]), app());
    expect(run.code).toBe(0);
    expect(run.lines.filter((line) => !line.startsWith("  "))).toEqual(
      PART_GROUPS.map((group) => `${group}:`),
    );
    expect(run.lines.filter((line) => line.startsWith("  "))).toHaveLength(moveParts().length);
    expect(run.lines).toContainEqual(expect.stringMatching(/^ {2}noise1d\(/));
  });

  it.each([["--bogus"], ["a", "b"], ["--role"]])("refuses the arguments %j", (...argv) => {
    expect(parseCatalogArgs(argv).kind).toBe("usage");
  });

  it("points PARTS_HINT at the library groups and recommends new-move when nothing fits", async () => {
    for (const group of PART_GROUPS) expect(PARTS_HINT).toContain(group);
    expect(PARTS_HINT).not.toContain("compose");
    const run = await runCatalog(ok(["--move", "custom.nonexistent:heavy", "--in", "reel"]), app());
    expect(run.lines).toContain("or write one: npx gerak new-move <id> --in reel");
  });
});
