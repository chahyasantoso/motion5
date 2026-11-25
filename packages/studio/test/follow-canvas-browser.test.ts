import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio, type StudioReply } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  const started = await startStudio({ root: pieces, piece: "reel", port: 0, busTimeoutMs: 1500 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
});

afterAll(async () => {
  await close();
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else rmSync(join(gerak, "canvas", "reel.json"), { force: true });
});

async function statusOf(command: unknown = { kind: "status" }): Promise<StudioStatusOf> {
  const answer = await fetch(`${base}__gerak/bus?piece=reel`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  const reply: StudioReply = await answer.json();
  if (reply.kind !== "status" && reply.kind !== "done")
    throw new Error(`The bus answered ${JSON.stringify(reply)}.`);
  return reply.status;
}

type StudioStatusOf = Extract<StudioReply, { kind: "status" }>["status"];

async function mounted(page: Page): Promise<void> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
  const handle = await page.waitForSelector("iframe[data-preview]");
  const frame = await handle.contentFrame();
  if (frame === null) throw new Error("The preview has no frame.");
  await frame.waitForFunction(
    `(() => { const m = window[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
    undefined,
    { timeout: 60000 },
  );
}

async function visibleMs(page: Page): Promise<number> {
  const value = await page.locator("[data-ruler]").getAttribute("aria-valuenow");
  return Number(value);
}

describe("the agent follows the canvas until the person takes it", () => {
  it("detaches on a real click, drives a hidden worker, and catches up on resume", async () => {
    await withPage(
      {
        page: "__gerak/studio?piece=reel",
        width: 1440,
        height: 900,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await mounted(page);
        await page.waitForTimeout(500);

        expect((await statusOf()).follow).toBe("idle");
        await statusOf({ kind: "seek", target: { kind: "ms", ms: 1000 } });
        expect((await statusOf()).follow).toBe("following");
        await page.getByText("Agent driving").waitFor();

        const pane = await page.locator(".react-flow__pane").boundingBox();
        if (pane === null) throw new Error("The canvas has no pane.");
        await page.mouse.click(pane.x + 8, pane.y + pane.height / 2);
        await page.getByRole("button", { name: "Resume follow" }).waitFor();
        expect((await statusOf()).follow).toBe("detached");

        const checked = await fetch(`${base}__gerak/bus?piece=reel`, {
          method: "POST",
          body: JSON.stringify({ kind: "check", sizes: undefined, safeZone: undefined }),
        });
        const checkReply: StudioReply = await checked.json();
        expect(checkReply.kind).toBe("check");
        expect((await statusOf()).follow).toBe("detached");

        const seeked = await statusOf({ kind: "seek", target: { kind: "ms", ms: 2000 } });
        expect(Math.abs(seeked.atMs - 2000)).toBeLessThanOrEqual(1);
        expect(Math.abs((await statusOf()).atMs - 2000)).toBeLessThanOrEqual(1);
        expect(Math.abs((await visibleMs(page)) - 1000)).toBeLessThanOrEqual(1);
        expect(await page.locator("iframe[data-worker]").count()).toBe(1);

        await page.getByRole("button", { name: "Resume follow" }).click();
        await page.locator("iframe[data-worker]").waitFor({ state: "detached" });
        await page.getByText("Agent driving").waitFor();
        await page.waitForTimeout(300);
        expect(Math.abs((await visibleMs(page)) - 2000)).toBeLessThanOrEqual(1);
        const after = await statusOf();
        expect(after.follow).toBe("following");
        expect(Math.abs(after.atMs - 2000)).toBeLessThanOrEqual(1);
      },
    );
  }, 120000);

  it("detaches on a real click inside the preview page", async () => {
    await withPage(
      {
        page: "__gerak/studio?piece=reel",
        width: 1440,
        height: 900,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await mounted(page);
        await statusOf({ kind: "seek", target: { kind: "ms", ms: 500 } });
        expect((await statusOf()).follow).toBe("following");
        const box = await page.locator("iframe[data-preview]").boundingBox();
        if (box === null) throw new Error("The preview has no box.");
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.getByRole("button", { name: "Resume follow" }).waitFor();
        expect((await statusOf()).follow).toBe("detached");
      },
    );
  }, 120000);
});
