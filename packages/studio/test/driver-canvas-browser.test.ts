import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Frame, Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio, type StudioReply } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const take = join(gerak, "presets", "cookie", "driver-test.json");
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";
const TAKE = [
  { name: "click", at: 400, target: "heroCta" },
  { name: "scroll", at: 1500, value: 700 },
];

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  const started = await startStudio({ root: pieces, piece: "cookie", port: 0, busTimeoutMs: 5000 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
}, 120000);

afterAll(async () => {
  await close();
  rmSync(take, { force: true });
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
});

type Status = Extract<StudioReply, { kind: "status" }>["status"];

async function send(piece: string, command: unknown): Promise<StudioReply> {
  const answer = await fetch(`${base}__gerak/bus?piece=${piece}`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  return answer.json();
}

async function statusOf(piece: string): Promise<Status> {
  const reply = await send(piece, { kind: "status" });
  if (reply.kind !== "status") throw new Error(`Status answered ${reply.kind}.`);
  return reply.status;
}

async function until(read: () => Promise<boolean>, what: string, tries = 100): Promise<void> {
  for (let attempt = 0; attempt < tries; attempt += 1) {
    if (await read()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

async function mounted(page: Page): Promise<Frame> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
  let found: Frame | undefined;
  // The preview frame is looked up on every try, since a reload while the server warms replaces it.
  await until(
    async () => {
      try {
        const frame = await (await page.$("iframe[data-preview]"))?.contentFrame();
        if (frame === null || frame === undefined) return false;
        const ready =
          (await frame.evaluate(
            `(() => { const m = window[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
          )) === true;
        if (ready) found = frame;
        return ready;
      } catch {
        return false;
      }
    },
    "the page to mount",
    300,
  );
  if (found === undefined) throw new Error("The preview has no frame.");
  return found;
}

function open<T>(piece: string, visit: (page: Page) => Promise<T>): Promise<T> {
  return withPage(
    {
      page: `__gerak/studio?piece=${piece}`,
      width: 1440,
      height: 900,
      clock: "real",
      source: { kind: "url", base },
    },
    ({ page }) => visit(page),
  ).then((done) => done.value);
}

describe("a live page driven by the canvas", () => {
  it("plays, seeks, grows its ruler with the page, replays a take and reloads at the top", async () => {
    await open("cookie", async (page) => {
      const frame = await mounted(page);
      const ruler = async (): Promise<number> =>
        Number(await page.locator("[data-ruler]").getAttribute("aria-valuemax"));
      // The timeline grows with the page as it loads, past the 3000 ms this test seeks to.
      await until(async () => (await ruler()) > 3000, "the timeline to cover the page", 300);
      const grown = Number(await page.locator("[data-ruler]").getAttribute("aria-valuemax"));
      const at = await frame.evaluate(`window[${MOUNTS}][0].driver.now().clock.elapsed`);
      await frame.evaluate(
        "(() => { const tall = document.createElement('div'); tall.style.height = '4000px'; document.body.appendChild(tall); })()",
      );
      await until(async () => (await ruler()) > grown, "the ruler to grow with the page");
      expect(await frame.evaluate(`window[${MOUNTS}][0].driver.now().clock.elapsed`)).toBe(at);
      expect(await frame.evaluate(`window[${MOUNTS}][0].driver.now().clock.kind`)).toBe("timed");
      await page.getByLabel("Replay").waitFor();

      const played = await send("cookie", { kind: "play", speed: 1 });
      expect(played.kind).toBe("done");
      await until(async () => {
        const now = await statusOf("cookie");
        return now.scrollY > 200 && now.atMs > 0;
      }, "the page to play and scroll");

      await send("cookie", { kind: "seek", target: { kind: "ms", ms: 3000 } });
      const far = await statusOf("cookie");
      expect(far.playing).toBe(false);
      expect(far.atMs).toBe(3000);
      await send("cookie", { kind: "seek", target: { kind: "ms", ms: 1000 } });
      const back = await statusOf("cookie");
      expect(back.atMs).toBe(1000);
      expect(back.scrollY).toBeLessThan(far.scrollY);

      const saved = await fetch(`${base}__gerak/presets?piece=cookie&name=driver-test`, {
        method: "PUT",
        body: JSON.stringify(TAKE),
      });
      expect(saved.status).toBe(200);
      await until(
        async () => (await page.locator('select[aria-label="Events preset"] option').count()) > 1,
        "the preset to be listed",
      );
      await frame.evaluate("window.__before = 1");
      await page.selectOption('select[aria-label="Events preset"]', "driver-test");
      await until(async () => {
        try {
          return (await frame.evaluate("window.__before")) === undefined;
        } catch {
          return false;
        }
      }, "the frame to reload with the take");
      await mounted(page);
      await send("cookie", { kind: "seek", target: { kind: "ms", ms: 2000 } });
      const clicks = await frame.evaluate(
        `window[${MOUNTS}][0].driver.events().filter((e) => e.name === "click").map((e) => [e.target, e.at])`,
      );
      expect(clicks).toEqual([["heroCta", 400]]);
      const scrolled = await statusOf("cookie");
      expect(scrolled.scrollY).toBeGreaterThan(500);

      await frame.evaluate("window.__before = 1");
      await page.getByLabel("Replay").click();
      await until(async () => {
        try {
          return (await frame.evaluate("window.__before")) === undefined;
        } catch {
          return false;
        }
      }, "the replay to reload the frame");
      await mounted(page);
      const fresh = await frame.evaluate(
        `({ y: window.scrollY, log: window[${MOUNTS}][0].events().length })`,
      );
      expect(fresh).toMatchObject({ y: 0 });
      await until(async () => (await statusOf("cookie")).playing, "the replay to play");
    });
  }, 180000);

  it("leaves a reel on its own timed clock, with no replay", async () => {
    await open("reel", async (page) => {
      const frame = await mounted(page);
      expect(await frame.evaluate(`typeof window[${MOUNTS}][0].driver.seek`)).toBe("function");
      expect(await page.getByLabel("Replay").count()).toBe(0);
      const played = await send("reel", { kind: "play" });
      expect(played.kind).toBe("done");
    });
  }, 90000);
});
