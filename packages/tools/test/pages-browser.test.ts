import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { captureFrames, withPage } from "@gerak/tools/page";
import { pageFiles } from "@gerak/tools/scene";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const ALIASES = pathToFileURL(join(REPO, "scripts", "workspace-source-aliases.mjs")).href;
const STEP_TIMEOUT_MS = 30000;

let root = "";
let source: { readonly kind: "serve"; readonly root: string } = { kind: "serve", root: "" };

/** A stage module of one actor that slides in from the left over the whole piece. */
const FIXTURE = `import { slide } from "@gerak/moves";
import { defineStage } from "@gerak/stage";

export default defineStage({
  beats: { go: [0, 2000] },
  cast: (m) => ({ box: m.box() }),
  skins: { dom: { css: '[data-cast="box"] { width: 40px; height: 40px; background: #36c }' } },
  scene: ({ time, beats }) => ({
    box: slide({ distance: 300, from: "left" }, beats.go.of(time)),
  }),
});
`;

function brief(name: string): void {
  mkdirSync(join(root, name, "src"), { recursive: true });
  writeFileSync(join(root, name, "src", `${name}.ts`), FIXTURE, "utf8");
}

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "gerak-pages-"));
  source = { kind: "serve", root };
  for (const [name, text] of Object.entries(pageFiles())) writeFileSync(join(root, name), text);
  // An installed project resolves the packages' dist; this test reads their source instead.
  writeFileSync(
    join(root, "vite.config.mjs"),
    `import { workspaceSourceAliases } from ${JSON.stringify(ALIASES)};
export default {
  resolve: { alias: [...workspaceSourceAliases()] },
  optimizeDeps: { exclude: ["@gerak/moves", "@gerak/rig", "@gerak/dom", "@gerak/player", "@gerak/react"] },
  cacheDir: ${JSON.stringify(join(REPO, "node_modules", ".vite", "pages-browser"))},
  server: { fs: { allow: [${JSON.stringify(REPO)}] } },
};
`,
  );
  brief("first-piece");
});

afterAll(() => {
  if (root !== "" && existsSync(root)) rmSync(root, { recursive: true, force: true });
});

describe("the pages of a folder outside the repository", () => {
  it("plays a piece on stage.html, and one written after the server started", async () => {
    await withPage(
      { page: "stage.html?piece=first-piece", width: 640, height: 360, source },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        await page.locator('[data-cast="box"]').waitFor();
        brief("second-piece");
        const next = new URL("stage.html?piece=second-piece", page.url()).href;
        await expect
          .poll(
            async () => {
              await page.goto(next);
              return page
                .locator('[data-cast="box"]')
                .waitFor({ timeout: 5000 })
                .then(
                  () => 1,
                  () => 0,
                );
            },
            { timeout: STEP_TIMEOUT_MS, interval: 500 },
          )
          .toBe(1);
      },
    );
  }, 90000);

  it("renders a frame of a piece", async () => {
    const out = join(root, "frames");
    const result = await captureFrames({
      page: "stage.html?piece=first-piece",
      width: 640,
      height: 360,
      source,
      at: [1000],
      out,
    });
    expect(result.pageErrors).toEqual([]);
    expect(result.frames.length).toBe(1);
    expect(existsSync(result.sheet)).toBe(true);
  }, 90000);

  it("loads a scene in the live editor", async () => {
    await withPage(
      { page: "live.html?scene=first-piece", width: 1280, height: 720, source },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        await page.locator('[data-cast="box"]').waitFor();
        await page.locator("[data-live-time]").waitFor();
      },
    );
  }, 90000);
});
