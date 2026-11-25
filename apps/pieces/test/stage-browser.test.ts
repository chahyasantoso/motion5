import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";
import { scaffold } from "@gerak/tools/scene";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;

const PREFIX = "stage-scratch-";
const STEP_TIMEOUT_MS = 5000;

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT))
    if (folder.startsWith(PREFIX))
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("pieces in the browser", () => {
  it("mounts the piece gerak new writes over its own page, with its one actor at rest", async () => {
    const name = `${PREFIX}new`;
    const result = scaffold(name, PIECES_ROOT);
    if (result.kind !== "written") throw new Error(result.message);
    await withPage(
      { page: `${name}/${name}.html`, width: 640, height: 360, source: PIECES_SOURCE },
      async ({ page }) => {
        page.setDefaultTimeout(STEP_TIMEOUT_MS);
        const title = page.locator('[data-cast="title"]');
        await title.waitFor();
        expect(
          await title.evaluate((el) => (el instanceof HTMLElement ? el.style.transform : "")),
        ).toBe("");
      },
    );
  }, 30000);
});
