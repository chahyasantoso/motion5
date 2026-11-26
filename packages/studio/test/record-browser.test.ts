import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Events } from "@gerak/core";
import type { Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio } from "../src";
import { pinsPath } from "../src/pin-store";
import type { Pin } from "../src/pins";
import { parseSceneReviewArgs } from "../../tools/src/scene/review";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const presets = join(gerak, "presets", "cookie");
const backup = join(pieces, "..", ".record-test-backup");
const pinsFile = pinsPath(pieces);
const savedPins = existsSync(pinsFile) ? readFileSync(pinsFile, "utf8") : undefined;
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  rmSync(backup, { recursive: true, force: true });
  if (existsSync(presets)) cpSync(presets, backup, { recursive: true });
  rmSync(presets, { recursive: true, force: true });
  rmSync(pinsFile, { force: true });
  mkdirSync(gerak, { recursive: true });
  const started = await startStudio({ root: pieces, piece: "cookie", port: 0, busTimeoutMs: 1500 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
});

afterAll(async () => {
  await close();
  rmSync(presets, { recursive: true, force: true });
  if (existsSync(backup)) {
    cpSync(backup, presets, { recursive: true });
    rmSync(backup, { recursive: true, force: true });
  }
  if (savedPins !== undefined) {
    mkdirSync(dirname(pinsFile), { recursive: true });
    writeFileSync(pinsFile, savedPins);
  } else rmSync(pinsFile, { force: true });
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else rmSync(join(gerak, "canvas", "cookie.json"), { force: true });
});

async function mounted(page: Page): Promise<void> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
  await page.waitForFunction(
    `(() => { const w = document.querySelector("iframe[data-preview]")?.contentWindow; const m = w?.[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
    undefined,
    { timeout: 60000 },
  );
}

async function until(read: () => Promise<boolean>, what: string): Promise<void> {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await read()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

async function names(): Promise<readonly string[]> {
  const body: { names: string[] } = await (
    await fetch(`${base}__gerak/presets?piece=cookie`)
  ).json();
  return body.names;
}

describe("recording on the canvas", () => {
  it("records a take, shows its ticks, tags a pin and feeds review --events", async () => {
    await withPage(
      {
        page: "__gerak/studio?piece=cookie",
        width: 1440,
        height: 900,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await mounted(page);
        await page.getByLabel("Record events").click();
        await page.locator('[aria-label="Record events"][aria-pressed="true"]').waitFor();

        const frame = await (await page.waitForSelector("iframe[data-preview]")).contentFrame();
        if (frame === null) throw new Error("The preview has no frame.");
        const cta = frame.locator('[data-cast="heroCta"]');
        await cta.click();
        await cta.click();
        await frame.evaluate(() => window.scrollBy(0, 120));
        await frame.waitForFunction(() => window.scrollY > 0);

        await page.getByLabel("Record events").click();
        await until(async () => (await names()).length === 1, "the saved take");
        const [name] = await names();
        if (name === undefined) throw new Error("No take.");
        expect(name).toBe("take-1");

        const body: { events: Events } = await (
          await fetch(`${base}__gerak/presets?piece=cookie&name=${name}`)
        ).json();
        const saved = body.events;
        expect(saved.length).toBeGreaterThan(0);
        const kinds = new Set(saved.map((event) => event.name));
        expect(kinds.has("click")).toBe(true);
        expect(kinds.has("scroll")).toBe(true);

        await until(
          async () => (await page.getByLabel("Events preset").inputValue()) === name,
          "the preset choice",
        );
        await until(
          async () => (await page.locator("[data-event-tick]").count()) === saved.length,
          "the event ticks",
        );
        const title = await page.locator("[data-event-tick]").first().getAttribute("title");
        expect(title).toMatch(/@\d+ms$/);

        await page.keyboard.press("p");
        await page.locator('.canvas-area[data-pin-mode="true"]').waitFor();
        await page.locator('[data-card-id="member:builderCrumbs"]').dispatchEvent("click");
        await until(async () => {
          const answer = await fetch(`${base}__gerak/pins?piece=cookie`);
          const found: { pins: Pin[] } = await answer.json();
          return found.pins.some((pin) => pin.preset === name);
        }, "a pin carrying the preset");

        const parsed = parseSceneReviewArgs([
          join(pieces, "cookie", "src", "cookie.ts"),
          "--events",
          `@${name}`,
        ]);
        if (parsed.kind !== "ok") throw new Error(parsed.message);
        expect(parsed.events?.length).toBe(saved.length);
      },
    );
  }, 180000);
});
