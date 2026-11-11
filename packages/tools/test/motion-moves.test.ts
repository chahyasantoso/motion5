import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { MOVE_ROLES } from "@gerak/moves";
import { parseCatalogArgs, runCatalog, type CatalogArgs } from "@gerak/tools/scene";

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
  mkdirSync(join(dir, "src/moves"), { recursive: true });
  writeFileSync(join(dir, "src/moves/good.ts"), move("good", ""));
  writeFileSync(join(dir, "src/moves/bad.ts"), move("bad", " - 4"));
  return dir;
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

describe("motion:moves", () => {
  it("lists the built-ins first and then the app's moves, each group by id", async () => {
    const run = await runCatalog(ok([]), app());
    const ids = run.lines.map((line) => line.split(" ")[0]);
    expect(ids).toEqual(["drop", "hop", "rope", "trace", "wipe", "bad", "good"]);
    expect(run.code).toBe(0);
    expect(run.lines[6]).toBe(
      "good [enter] Slides in from the left. | options: distance number 0..500, default 100 | moments: arrive",
    );
  });

  it("lists the built-ins alone when the app has no moves folder", async () => {
    const dir = mkdtempSync(join(tmpdir(), "motion-moves-"));
    roots.push(dir);
    const run = await runCatalog(ok([]), dir);
    expect(run.lines).toHaveLength(5);
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
    rmSync(join(dir, "src/moves/bad.ts"));
    const run = await runCatalog(ok(["--check"]), dir);
    expect(run.code).toBe(0);
  });

  it("reports an id declared twice, in the app or against a built-in", async () => {
    const dir = app();
    writeFileSync(join(dir, "src/moves/again.ts"), move("good", ""));
    writeFileSync(join(dir, "src/moves/clash.ts"), move("drop", ""));
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
    expect(reveals.lines.map((line) => line.split(" ")[0])).toEqual(["trace", "wipe"]);
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
    expect(run.lines).toContain(`file: ${join(dir, "src/moves/good.ts")}`);
    expect((await runCatalog(ok(["nothing"]), dir)).code).toBe(1);
  });

  it("prints records as JSON", async () => {
    const run = await runCatalog(ok(["--json", "--role", "reveal"]), app());
    expect(JSON.parse(run.lines.join("\n"))).toMatchObject([
      { id: "trace" },
      { id: "wipe", role: "reveal" },
    ]);
  });

  it.each([["--bogus"], ["a", "b"], ["--role"]])("refuses the arguments %j", (...argv) => {
    expect(parseCatalogArgs(argv).kind).toBe("usage");
  });
});
