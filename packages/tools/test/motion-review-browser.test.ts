import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkMotion, describeCheckLines, parseCheckArgs } from "../src/page/check";
import { parseReviewArgs, reviewPage } from "../src/page/review";
import { removeTemp } from "../../../test/support/temp";

describe("multi-viewport gerak check and review in browser", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) removeTemp(dir);
  });

  it("checks and reviews multiple viewports against one page, prefixing mobile defects and writing labelled sheets", async () => {
    const root = mkdtempSync(join(tmpdir(), "gerak-multiview-"));
    const out = mkdtempSync(join(tmpdir(), "gerak-multiview-out-"));
    dirs.push(root, out);
    writeFileSync(
      join(root, "responsive.html"),
      `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; background: #fff; color: #111; font: 700 28px/1.2 sans-serif; }
      .badge { position: absolute; left: 40px; top: 40px; white-space: nowrap; }
    </style>
  </head>
  <body>
    <div class="badge">Wide desktop badge overflowing past the narrow mobile viewport width</div>
  </body>
</html>`,
    );

    const parsedCheck = parseCheckArgs([
      "responsive.html",
      "--root",
      root,
      "--watch",
      ".badge",
      "--to",
      "640",
      "--sizes",
      "1440x900,390x844",
    ]);
    if (parsedCheck.kind !== "ok") throw new Error(parsedCheck.message);
    const checked = await checkMotion(parsedCheck);
    expect(checked.viewports).toHaveLength(2);
    expect(checked.viewports?.[0]?.findings).toEqual([]);
    const checkLines = describeCheckLines(checked);
    expect(checkLines.length).toBeGreaterThan(0);
    expect(checkLines.every((line) => line.startsWith("[390x844] "))).toBe(true);

    const parsedReview = parseReviewArgs([
      "responsive.html",
      "--root",
      root,
      "--watch",
      ".badge",
      "--to",
      "640",
      "--at",
      "0,640",
      "--sizes",
      "1440x900,390x844",
      "--out",
      out,
    ]);
    if (parsedReview.kind !== "ok") throw new Error(parsedReview.message);
    const reviewed = await reviewPage(parsedReview);
    expect(reviewed.viewports).toHaveLength(2);
    expect(reviewed.viewports?.[0]?.findings).toEqual([]);
    expect(reviewed.findings.length).toBeGreaterThan(0);
    expect(reviewed.findings.every((line) => line.startsWith("[390x844] "))).toBe(true);
    expect(existsSync(join(out, "sheet-1440x900.png"))).toBe(true);
    expect(existsSync(join(out, "sheet-390x844.png"))).toBe(true);
  }, 120000);
});
