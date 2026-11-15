import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { RESERVED_FOLDERS, briefFolders, movesFolders, pieceFiles } from "@gerak/tools/scene";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function scratch(files: readonly string[]): string {
  const root = mkdtempSync(join(tmpdir(), "briefs-"));
  roots.push(root);
  for (const file of files) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), "");
  }
  return root;
}

describe("brief folders", () => {
  it("lists the folders that hold a src, sorted, and skips the reserved names", () => {
    const root = scratch([
      "zeta/src/zeta.ts",
      "alpha/src/alpha.ts",
      "docs-only/notes.md",
      ...RESERVED_FOLDERS.map((name) => `${name}/src/x.ts`),
    ]);
    expect(briefFolders(root)).toEqual(["alpha", "zeta"]);
  });

  it("lists nothing for a root that does not exist", () => {
    expect(briefFolders(join(tmpdir(), "briefs-missing-root"))).toEqual([]);
  });

  it("finds a piece and its scene in its brief", () => {
    const root = scratch([
      "reel/src/saved.ts",
      "reel/src/saved-scene.ts",
      "reel/src/other.ts",
      "night/src/night-a-scene.ts",
    ]);
    expect(pieceFiles(root, "saved")).toEqual([
      join(root, "reel/src/saved.ts"),
      join(root, "reel/src/saved-scene.ts"),
    ]);
    expect(pieceFiles(root, "night-a")).toEqual([join(root, "night/src/night-a-scene.ts")]);
    expect(pieceFiles(root, "missing")).toEqual([]);
  });

  it("returns both paths when two briefs hold one name", () => {
    const root = scratch(["one/src/twin.ts", "two/src/twin.ts"]);
    expect(pieceFiles(root, "twin")).toEqual([
      join(root, "one/src/twin.ts"),
      join(root, "two/src/twin.ts"),
    ]);
  });

  it("lists the moves folder of each brief that has one", () => {
    const root = scratch(["one/src/moves/a.ts", "two/src/two.ts", "three/src/moves/b.ts"]);
    expect(movesFolders(root)).toEqual([
      join(root, "one/src/moves"),
      join(root, "three/src/moves"),
    ]);
  });
});
