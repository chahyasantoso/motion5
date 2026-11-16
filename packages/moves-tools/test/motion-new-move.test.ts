import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { format, resolveConfig } from "prettier";
import { afterEach, describe, expect, it } from "vitest";
import {
  NEW_MOVE_USAGE,
  parseCatalogArgs,
  parseNewMoveArgs,
  runCatalog,
  scaffoldMove,
} from "../src/index";

const roots: string[] = [];
function root(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-new-move-"));
  roots.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function appRoot(): string {
  const parent = join(process.cwd(), "apps/pieces/.scaffold-moves");
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(join(parent, "move-"));
  roots.push(dir, parent);
  return dir;
}

describe("gerak new-move", () => {
  it("writes a move the catalog finds and the gate refuses until it is filled in", async () => {
    const dir = appRoot();
    const result = scaffoldMove("rope-in", dir, "rope");
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual([join(dir, "rope/src/moves/rope-in.ts")]);
    const catalog = (argv: readonly string[]) => {
      const args = parseCatalogArgs(argv);
      if (args.kind !== "ok") throw new Error(args.message);
      return runCatalog(args, dir);
    };
    const listed = await catalog(["--all"]);
    expect(listed.lines.map((line) => line.split(" ")[0])).toContain("rope-in");
    const checked = await catalog(["--check"]);
    expect(checked.code).toBe(1);
    expect(checked.lines).toContain("rope-in: the move has no description.");
    expect(checked.lines.some((line) => line.includes('"x" is 1 at progress 1'))).toBe(true);
    const source = readFileSync(join(dir, "rope/src/moves/rope-in.ts"), "utf8");
    const config = await resolveConfig(
      join(process.cwd(), "apps/pieces/rope/src/moves/rope-in.ts"),
    );
    expect(await format(source, { ...config, filepath: "rope-in.ts" })).toBe(source);
  });

  it("refuses a move id that is not kebab-case or whose file exists", () => {
    const dir = root();
    for (const id of ["", "Rope", "rope_in", "../rope"])
      expect(scaffoldMove(id, dir, "rope").kind).toBe("refused");
    expect(scaffoldMove("rope-in", dir, "rope").kind).toBe("written");
    expect(scaffoldMove("new", dir, "rope").kind).toBe("written");
    expect(readFileSync(join(dir, "rope/src/moves/new.ts"), "utf8")).toContain(
      "export const newMove =",
    );
    writeFileSync(join(dir, "rope/src/moves/keep.ts"), "keep");
    expect(scaffoldMove("rope-in", dir, "rope").kind).toBe("refused");
    expect(scaffoldMove("keep", dir, "rope").kind).toBe("refused");
    expect(readFileSync(join(dir, "rope/src/moves/keep.ts"), "utf8")).toBe("keep");
  });

  it("writes a move into the brief's folder, and refuses a brief name that is not one", () => {
    const dir = root();
    const move = scaffoldMove("rope-in", dir, "ropes");
    if (move.kind !== "written") throw new Error(move.message);
    expect(move.files).toEqual([join(dir, "ropes/src/moves/rope-in.ts")]);
    expect(scaffoldMove("rope-y", dir, "Ropes").kind).toBe("refused");
    expect(scaffoldMove("rope-y", dir, "src").kind).toBe("refused");
  });

  it("refuses a call without --in or with an unknown flag and prints the usage line", () => {
    for (const argv of [["rope-in"], [], ["rope-in", "--in", "rope", "--three"], ["a", "b"]]) {
      expect(parseNewMoveArgs(argv)).toEqual({ kind: "usage", message: NEW_MOVE_USAGE });
    }
    expect(parseNewMoveArgs(["rope-in", "--in", "rope"])).toEqual({
      kind: "move",
      id: "rope-in",
      brief: "rope",
      root: undefined,
    });
    expect(NEW_MOVE_USAGE).toContain("gerak new-move <id> --in <brief>");
  });
});
