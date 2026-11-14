import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { MOVE_ROLES } from "@gerak/moves";
import {
  MOVE_PARTS,
  PARTS_HINT,
  PART_GROUPS,
  collectRecords,
  parseCatalogArgs,
  runCatalog,
  type CatalogArgs,
} from "@gerak/tools/scene";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const move = (id: string, end: string) => `import { defineMove, type Pose2d } from "@gerak/moves";
export const ${id.replace("-", "")} = defineMove({
  id: "${id}",
  role: "enter",
  description: "Slides in from the left.",
  options: { distance: { kind: "number", min: 0, max: 500, default: 100, description: "Start offset, in px." } },
  example: { options: { distance: 100 } },
  moments: () => ({ arrive: 1 }),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress)${end} }),
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

describe("motion:moves", () => {
  it("lists the built-ins first and then the app's moves, each group by id", async () => {
    const run = await runCatalog(ok([]), app());
    const listed = run.lines.slice(0, -1);
    const ids = listed.map((line) => line.split(" ")[0]);
    expect(ids).toEqual([...builtInIds, "bad", "good"]);
    expect(run.code).toBe(0);
    expect(run.lines.at(-1)).toBe(PARTS_HINT);
    expect(listed.at(-1)).toBe(
      "good [enter] Slides in from the left. | options: distance number 0..500, default 100 | moments: arrive | import from ./moves/good",
    );
  });

  it("applies the role filter to a named move, and prints a modifier's input in JSON", async () => {
    const dir = app();
    const mismatch = await runCatalog(ok(["good", "--role", "exit"]), dir);
    expect(mismatch.code).toBe(1);
    expect(mismatch.lines[0]).toContain('No move "good"');
    const json = await runCatalog(ok(["overshoot", "--json"]), dir);
    expect(json.lines[0]).toContain('"input":"(time');
  });

  it("prints a recipe on the line and the full entry, and refuses an unknown part", async () => {
    const dir = app();
    writeFileSync(
      join(dir, "reel/src/moves/made.ts"),
      move("made", "").replace(
        '  role: "enter",',
        '  role: "enter",\n  recipe: ["span", "nonsense"],',
      ),
    );
    const line = (await runCatalog(ok([]), dir)).lines.find((text) => text.startsWith("made "));
    expect(line).toContain(" | recipe: span + nonsense | ");
    const full = await runCatalog(ok(["made"]), dir);
    expect(full.lines).toContain("recipe: span + nonsense");
    const checked = await runCatalog(ok(["made", "--check"]), dir);
    expect(checked.code).toBe(1);
    expect(checked.lines[0]).toContain('recipe names "nonsense"');
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
    const run = await runCatalog(ok([]), dir);
    expect(run.lines.slice(0, -1).map((line) => line.split(" ")[0])).toEqual(builtInIds);
    expect(run.code).toBe(0);
  });

  it("names the bad move under --check and fails", async () => {
    const run = await runCatalog(ok(["--check"]), app());
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

  it("reports an id declared twice, in the app or against a built-in", async () => {
    const dir = app();
    writeFileSync(join(dir, "reel/src/moves/again.ts"), move("good", ""));
    writeFileSync(join(dir, "reel/src/moves/clash.ts"), move("drop", ""));
    const run = await runCatalog(ok(["--check"]), dir);
    expect(run.code).toBe(1);
    expect(run.lines).toContainEqual(
      expect.stringMatching(/^good: declared 2 times, in .*again\.ts and .*good\.ts\.$/),
    );
    expect(run.lines).toContainEqual(
      expect.stringMatching(/^drop: declared 2 times, in @gerak\/moves and .*clash\.ts\.$/),
    );
  });

  it("filters by role, and refuses an unknown role with the known ones", async () => {
    const reveals = await runCatalog(ok(["--role", "reveal"]), app());
    expect(reveals.lines.map((line) => line.split(" ")[0])).toEqual(["trace", "wipe", "npm"]);
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
    expect(run.lines.filter((line) => line.startsWith("  "))).toHaveLength(MOVE_PARTS.length);
    expect(run.lines).toContainEqual(expect.stringMatching(/^ {2}trail\(/));
  });

  it.each([["--bogus"], ["a", "b"], ["--role"]])("refuses the arguments %j", (...argv) => {
    expect(parseCatalogArgs(argv).kind).toBe("usage");
  });
});
