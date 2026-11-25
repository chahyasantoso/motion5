import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { checkMotion, parseCheckArgs } from "../src/page/check";
import { captureFrames } from "../src/page/frames";
import { decodePng } from "../src/page/png";

const FIXTURE = fileURLToPath(new URL("./fixtures/media/count.webm", import.meta.url));
const DIRS: string[] = [];

function appRoot(): string {
  const parent = join(process.cwd(), "apps/pieces/.scaffold");
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(join(parent, "media-"));
  DIRS.push(dir, parent);
  writeFileSync(join(dir, "vite.config.ts"), 'export { default } from "../../vite.config";\n');
  copyFileSync(FIXTURE, join(dir, "count.webm"));
  return dir;
}

function outDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-media-out-"));
  DIRS.push(dir);
  return dir;
}

function writeMediaPage(dir: string, sceneBody: string): void {
  writeFileSync(
    join(dir, "clip.html"),
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; width: 200px; height: 200px; background: rgb(16, 80, 144); overflow: hidden; }
      #frame { position: relative; width: 200px; height: 200px; background: rgb(16, 80, 144); }
      video { position: absolute; left: 0; top: 0; width: 200px; height: 200px; object-fit: fill; }
    </style>
  </head>
  <body>
    <div id="frame">
      <video data-cast="clip" muted playsinline src="count.webm"></video>
    </div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>`,
  );
  writeFileSync(
    join(dir, "main.ts"),
    `import { mount } from "@gerak/dom";
${sceneBody}
const root = document.getElementById("frame");
if (root === null) throw new Error("missing #frame");
mount(piece, { clock: "timed", frame: "fit", root });
`,
  );
}

function centrePixel(pngPath: string): readonly [number, number, number] {
  const picture = decodePng(readFileSync(pngPath));
  const x = Math.floor(picture.width / 2);
  const y = Math.floor(picture.height / 2);
  const offset = (y * picture.width + x) * 3;
  return [picture.rgb[offset] ?? 0, picture.rgb[offset + 1] ?? 0, picture.rgb[offset + 2] ?? 0];
}

afterEach(() => {
  for (const dir of DIRS.splice(0)) {
    rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});

describe("media seeks and clip length in browser", () => {
  it("waits for media seeks so each captured frame shows its exact clip frame", async () => {
    const dir = appRoot();
    const out = outDir();
    writeMediaPage(
      dir,
      `import { beat, box, scene } from "@gerak/stage";
const show = beat("show", 1600, { at: 400 });
const piece = scene({ length: 2200 }, box("clip", { media: true }).shows(show));`,
    );

    const times = [0, 400, 480, 640, 1040, 1440] as const;
    const captured = await captureFrames({
      page: "clip.html",
      width: 200,
      height: 200,
      source: { kind: "serve", root: dir },
      at: times,
      out,
    });
    expect(captured.pageErrors).toEqual([]);

    const pixels = captured.frames.map((frame) => ({
      at: frame.at,
      rgb: centrePixel(frame.path),
    }));
    expect(pixels[0]?.rgb).toEqual([16, 80, 144]);
    const checked = pixels.slice(1).map((sample) => {
      const expected = Math.floor((sample.at - 400) / 40) * 5;
      const within = sample.rgb.every((channel) => Math.abs(channel - expected) <= 3);
      return { at: sample.at, rgb: sample.rgb, expected, within };
    });
    expect(checked).toEqual(
      checked.map(({ at, rgb, expected }) => ({ at, rgb, expected, within: true })),
    );
  }, 60000);

  it("reports media-short when a 2 s clip sits in a 3 s window and not in a 1.5 s window", async () => {
    const longDir = appRoot();
    writeMediaPage(
      longDir,
      `import { box, scene } from "@gerak/stage";
const piece = scene({ length: 3000 }, box("clip", { media: true }));`,
    );
    const longArgs = parseCheckArgs([
      "clip.html",
      "--root",
      longDir,
      "--watch",
      '[data-cast="clip"]',
      "--size",
      "200x200",
      "--to",
      "3000",
    ]);
    if (longArgs.kind !== "ok") throw new Error(longArgs.message);
    const longCheck = await checkMotion(longArgs);
    expect(longCheck.pageErrors).toEqual([]);
    expect(longCheck.findings).toEqual([
      { kind: "media-short", element: "clip", clipMs: 2000, shownMs: 3000 },
    ]);

    const shortDir = appRoot();
    writeMediaPage(
      shortDir,
      `import { box, scene } from "@gerak/stage";
const piece = scene({ length: 1500 }, box("clip", { media: true }));`,
    );
    const shortArgs = parseCheckArgs([
      "clip.html",
      "--root",
      shortDir,
      "--watch",
      '[data-cast="clip"]',
      "--size",
      "200x200",
      "--to",
      "1500",
    ]);
    if (shortArgs.kind !== "ok") throw new Error(shortArgs.message);
    const shortCheck = await checkMotion(shortArgs);
    expect(shortCheck.pageErrors).toEqual([]);
    expect(shortCheck.findings).toEqual([]);
  }, 60000);
});
