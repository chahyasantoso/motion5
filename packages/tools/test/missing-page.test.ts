import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkMotion, parseCheckArgs } from "../src/page/check";

describe("a page path the server does not have", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("rejects with the status instead of checking index.html", async () => {
    const root = mkdtempSync(join(tmpdir(), "gerak-missing-"));
    dirs.push(root);
    writeFileSync(join(root, "index.html"), "<!doctype html><title>home</title>");
    const parsed = parseCheckArgs(["missing.html", "--root", root, "--watch", ".a", "--to", "100"]);
    if (parsed.kind !== "ok") throw new Error(parsed.message);
    await expect(checkMotion(parsed)).rejects.toThrow("answered 404");
  });
});
