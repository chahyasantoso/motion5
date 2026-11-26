import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { callerDir, callerPiecesRoot, piecesRoot } from "../src/page/root";
import { removeTemp } from "../../../test/support/temp";

let top: string;

beforeEach(() => {
  top = mkdtempSync(join(tmpdir(), "gerak-root-"));
});

afterEach(() => {
  removeTemp(top);
});

function writeJson(file: string, value: unknown): void {
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, JSON.stringify(value), "utf8");
}

describe("piecesRoot", () => {
  it("resolves the --root flag from cwd, ahead of any package.json", () => {
    writeJson(join(top, "package.json"), { gerak: { pieces: "elsewhere" } });
    expect(piecesRoot(top, "mine")).toEqual({ kind: "found", root: join(top, "mine") });
  });

  it("reads gerak.pieces from the nearest package.json, resolved from that file", () => {
    writeJson(join(top, "package.json"), { gerak: { pieces: "pieces" } });
    const deep = join(top, "a", "b");
    mkdirSync(deep, { recursive: true });
    expect(piecesRoot(deep)).toEqual({ kind: "found", root: join(top, "pieces") });
  });

  it("passes a package.json that names no pieces folder on the way up", () => {
    writeJson(join(top, "package.json"), { gerak: { pieces: "apps/pieces" } });
    writeJson(join(top, "packages", "tools", "package.json"), { name: "tools" });
    expect(piecesRoot(join(top, "packages", "tools"))).toEqual({
      kind: "found",
      root: join(top, "apps", "pieces"),
    });
  });

  it("passes a package.json that is not JSON on the way up", () => {
    writeJson(join(top, "package.json"), { gerak: { pieces: "pieces" } });
    mkdirSync(join(top, "sub"), { recursive: true });
    writeFileSync(join(top, "sub", "package.json"), "{bad", "utf8");
    expect(piecesRoot(join(top, "sub"))).toEqual({ kind: "found", root: join(top, "pieces") });
  });

  it("says both ways to name a folder when none is found", () => {
    const found = piecesRoot(top);
    expect(found.kind).toBe("missing");
    if (found.kind === "missing") {
      expect(found.message).toContain("--root");
      expect(found.message).toContain('"gerak": { "pieces"');
    }
  });

  it("finds this repository's pieces folder from its root", () => {
    expect(piecesRoot(process.cwd())).toEqual({
      kind: "found",
      root: join(process.cwd(), "apps", "pieces"),
    });
  });
});

describe("the caller's folder", () => {
  let saved: string | undefined;

  beforeEach(() => {
    saved = process.env.INIT_CWD;
  });

  afterEach(() => {
    if (saved === undefined) delete process.env.INIT_CWD;
    else process.env.INIT_CWD = saved;
  });

  it("is INIT_CWD under npm run", () => {
    process.env.INIT_CWD = top;
    expect(callerDir()).toBe(top);
  });

  it("is the process's own folder when INIT_CWD is unset, as under npx", () => {
    delete process.env.INIT_CWD;
    expect(callerDir()).toBe(process.cwd());
  });

  it("throws the missing message when the caller's folder names no pieces folder", () => {
    process.env.INIT_CWD = top;
    expect(() => callerPiecesRoot()).toThrow(/--root/);
    expect(callerPiecesRoot("x")).toBe(join(top, "x"));
  });
});
