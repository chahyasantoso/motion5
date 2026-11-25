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
const MEMBER = "hookEyebrow";
const BUDGET_MS = 200;

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

async function send(
  piece: string,
  command: unknown,
): Promise<{ status: number; reply: StudioReply }> {
  const answer = await fetch(`${base}__gerak/bus?piece=${piece}`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  const reply: StudioReply = await answer.json();
  return { status: answer.status, reply };
}

async function statusOf(): Promise<Extract<StudioReply, { kind: "status" }>["status"]> {
  const { reply } = await send("reel", { kind: "status" });
  if (reply.kind !== "status") throw new Error(`Status answered ${reply.kind}.`);
  return reply.status;
}

async function timed(command: unknown): Promise<number> {
  const started = performance.now();
  const { reply } = await send("reel", command);
  const took = performance.now() - started;
  expect(reply.kind).not.toBe("failed");
  return took;
}

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

describe("the canvas answers bus commands", () => {
  it("runs each command through the canvas state", async () => {
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

        const first = await statusOf();
        expect(first).toMatchObject({ piece: "reel", follow: "following", focus: { kind: "all" } });

        const seeked = await send("reel", { kind: "seek", target: { kind: "ms", ms: 3000 } });
        expect(seeked.reply.kind).toBe("done");
        expect(Math.abs((await statusOf()).atMs - 3000)).toBeLessThanOrEqual(1);

        const focused = await send("reel", {
          kind: "focus",
          target: { kind: "shot-index", index: 1 },
        });
        expect(focused.reply.kind).toBe("done");
        expect((await statusOf()).focus).toEqual({ kind: "shot-index", index: 1 });
        await page.locator("[data-timeline] .is-soloed").first().waitFor();
        await send("reel", { kind: "focus", target: { kind: "all" } });
        expect(await page.locator("[data-timeline] .is-soloed").count()).toBe(0);

        const bad = await send("reel", { kind: "focus", target: { kind: "shot", name: "nope" } });
        expect(JSON.stringify(bad.reply)).toContain("hook");

        const view = await send("reel", {
          kind: "viewport",
          preset: "1080x1920",
          safeZone: "tiktok",
        });
        expect(view.reply.kind).toBe("done");
        await page.locator('[data-safe-zone="tiktok"]').waitFor();
        expect(await statusOf()).toMatchObject({ preset: "1080x1920", safeZone: "tiktok" });

        const id = `member:${MEMBER}`;
        const picked = await send("reel", { kind: "select", card: id });
        expect(picked.reply.kind).toBe("done");
        await page.locator(`.react-flow__node.selected[data-id="${id}"]`).waitFor();
        expect((await statusOf()).selected).toEqual([id]);

        const seen = await send("reel", { kind: "inspect", card: undefined });
        expect(seen.reply).toMatchObject({ kind: "inspect", inspection: { card: id } });
        if (seen.reply.kind !== "inspect") throw new Error("Not an inspection.");
        expect(seen.reply.inspection.pose).toBeDefined();
        expect(seen.reply.inspection.rect).toBeDefined();
        expect(seen.reply.inspection.steps.length).toBeGreaterThan(0);

        expect((await send("reel", { kind: "graph" })).reply.kind).toBe("graph");

        const other = await send("cookie", { kind: "status" });
        expect(other.status).toBe(504);

        const times: Record<string, number> = {};
        const cases: Record<string, unknown> = {
          status: { kind: "status" },
          seek: { kind: "seek", target: { kind: "ms", ms: 1000 } },
          select: { kind: "select", card: id },
          inspect: { kind: "inspect", card: id },
        };
        for (const command of Object.values(cases)) await timed(command);
        for (const [name, command] of Object.entries(cases)) times[name] = await timed(command);
        console.log(`warm round trips (ms): ${JSON.stringify(times)}`);
        for (const took of Object.values(times)) expect(took).toBeLessThan(BUDGET_MS);
      },
    );
  }, 120000);
});
