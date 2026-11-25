import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkMotion, parseCheckArgs, type Finding } from "../src/page/check";
import { parseReviewArgs, reviewPage } from "../src/page/review";

describe("gerak check --safe-zone in browser", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  function site(caption: string, style: string, extra = ""): string {
    const root = mkdtempSync(join(tmpdir(), "gerak-safezone-"));
    dirs.push(root);
    writeFileSync(
      join(root, "reel.html"),
      `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; width: 1080px; height: 1920px; background: #fff; color: #111; overflow: hidden; }
      body { font: 700 40px/1.2 sans-serif; }
      .mark { position: absolute; left: 400px; top: 800px; width: 100px; height: 100px; background: #36c; }
      ${extra}
      .caption { position: absolute; white-space: nowrap; ${style} }
    </style>
  </head>
  <body>
    <div class="mark"></div>
    <p class="caption">${caption}</p>
  </body>
</html>`,
    );
    return root;
  }

  async function zoneFindingsOf(root: string, to = "200"): Promise<readonly Finding[]> {
    const parsed = parseCheckArgs([
      "reel.html",
      "--root",
      root,
      "--watch",
      ".mark",
      "--to",
      to,
      "--safe-zone",
      "tiktok",
    ]);
    if (parsed.kind !== "ok") throw new Error(parsed.message);
    expect([parsed.width, parsed.height]).toEqual([1080, 1920]);
    const checked = await checkMotion(parsed);
    return checked.findings.filter((finding) => finding.kind === "unsafe-zone");
  }

  it("reports text in the bottom margin", async () => {
    const found = await zoneFindingsOf(
      site("Bottom words", "left: 200px; top: 1780px; margin: 0;"),
    );
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ edge: "bottom", zone: "tiktok", at: 0 });
    expect(found[0]?.kind === "unsafe-zone" && found[0].element).toContain("Bottom words");
  });

  it("reports text in the right margin", async () => {
    const found = await zoneFindingsOf(site("Side", "left: 1010px; top: 600px; margin: 0;"));
    expect(found.map((finding) => finding.kind === "unsafe-zone" && finding.edge)).toContain(
      "right",
    );
  });

  it("reports nothing for text inside the margins", async () => {
    const found = await zoneFindingsOf(site("Centre", "left: 300px; top: 900px; margin: 0;"));
    expect(found).toEqual([]);
  });

  it("reports the step where text slides into the margin", async () => {
    const root = site(
      "Sliding",
      "left: 200px; top: 1000px; margin: 0; animation: slide 1000ms linear forwards;",
      "@keyframes slide { from { top: 1000px } to { top: 1800px } }",
    );
    const found = await zoneFindingsOf(root, "900");
    const bottom = found.find(
      (finding) => finding.kind === "unsafe-zone" && finding.edge === "bottom",
    );
    if (bottom?.kind !== "unsafe-zone") throw new Error("no bottom finding");
    // The 48 px line box crosses y 1600 when top passes 1552, 690 ms into the slide.
    expect(Math.abs(bottom.at - 690)).toBeLessThanOrEqual(32);
  });

  it("lists the finding in a review", async () => {
    const root = site("Bottom words", "left: 200px; top: 1780px; margin: 0;");
    const out = mkdtempSync(join(tmpdir(), "gerak-safezone-out-"));
    dirs.push(out);
    const parsed = parseReviewArgs([
      "reel.html",
      "--root",
      root,
      "--watch",
      ".mark",
      "--to",
      "100",
      "--at",
      "0",
      "--safe-zone",
      "tiktok",
      "--out",
      out,
    ]);
    if (parsed.kind !== "ok") throw new Error(parsed.message);
    const reviewed = await reviewPage(parsed);
    expect(reviewed.findings.some((line) => line.includes("enters the tiktok bottom margin"))).toBe(
      true,
    );
  });
});
