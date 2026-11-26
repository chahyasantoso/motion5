import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio, type StudioReply } from "../src";
import { pinsPath, resolvePin } from "../src/pin-store";
import type { Pin } from "../src/pins";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const pinsFile = pinsPath(pieces);
const savedPins = existsSync(pinsFile) ? readFileSync(pinsFile, "utf8") : undefined;
const MOUNTS = "Symbol.for('@gerak/dom/mounts')";

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  rmSync(pinsFile, { force: true });
  mkdirSync(gerak, { recursive: true });
  const started = await startStudio({ root: pieces, piece: "reel", port: 0, busTimeoutMs: 1500 });
  base = `${new URL(started.url).origin}/`;
  close = started.close;
});

afterAll(async () => {
  await close();
  if (savedPins !== undefined) {
    mkdirSync(dirname(pinsFile), { recursive: true });
    writeFileSync(pinsFile, savedPins);
  } else rmSync(pinsFile, { force: true });
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else
    for (const piece of ["reel", "cookie"])
      rmSync(join(gerak, "canvas", `${piece}.json`), { force: true });
});

type Status = Extract<StudioReply, { kind: "status" }>["status"];

async function send(piece: string, command: unknown): Promise<StudioReply> {
  const answer = await fetch(`${base}__gerak/bus?piece=${piece}`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  return answer.json();
}

async function drive(piece: string, command: unknown): Promise<Status> {
  const reply = await send(piece, command);
  if (reply.kind !== "status" && reply.kind !== "done")
    throw new Error(`The bus answered ${JSON.stringify(reply)}.`);
  return reply.status;
}

async function pinsOf(piece: string): Promise<readonly Pin[]> {
  const answer = await fetch(`${base}__gerak/pins?piece=${piece}`);
  const body: { pins: Pin[] } = await answer.json();
  return body.pins;
}

async function mounted(page: Page): Promise<void> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
  await page.waitForFunction(
    `(() => { const w = document.querySelector("iframe[data-preview]")?.contentWindow; const m = w?.[${MOUNTS}]; return Array.isArray(m) && m.length > 0; })()`,
    undefined,
    { timeout: 60000 },
  );
}

async function until(read: () => Promise<boolean>, what: string): Promise<void> {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (await read()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

async function resumeFollow(page: Page): Promise<void> {
  const button = page.locator('[data-follow="detached"] button');
  if ((await button.count()) > 0) await button.click();
  await page.locator('[data-follow="following"]').waitFor();
}

describe("pins on the canvas", () => {
  it("drops a stage pin in a focused shot and restores its moment from the ruler", async () => {
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
        await until(
          async () => (await send("reel", { kind: "status" })).kind === "status",
          "the canvas to answer",
        );
        const graph = await send("reel", { kind: "graph" });
        if (graph.kind !== "graph") throw new Error("No graph.");
        const shots = graph.graph.cards.filter((card) => card.kind === "shot");
        const shot = shots[1];
        if (shot?.span === undefined) throw new Error("The reel has no second shot.");
        const middle = Math.round((shot.span.from + shot.span.to) / 2);

        await drive("reel", { kind: "viewport", preset: "1080x1920", safeZone: undefined });
        await drive("reel", { kind: "focus", target: { kind: "shot-index", index: 1 } });
        await drive("reel", { kind: "seek", target: { kind: "ms", ms: middle } });

        const frame = await (await page.waitForSelector("iframe[data-preview]")).contentFrame();
        if (frame === null) throw new Error("The preview has no frame.");
        const spot = await frame.evaluate(() => {
          for (const element of document.querySelectorAll("[data-cast]")) {
            const box = element.getBoundingClientRect();
            const x = box.x + box.width / 2;
            const y = box.y + box.height / 2;
            const inside = x > 0 && y > 0 && x < innerWidth && y < innerHeight;
            if (
              box.width > 0 &&
              inside &&
              document.elementFromPoint(x, y)?.closest("[data-cast]") === element
            )
              return { x, y, name: element.getAttribute("data-cast") };
          }
          return undefined;
        });
        if (spot === undefined) throw new Error("No cast element is on screen.");

        await page.keyboard.press("p");
        await page.locator('.canvas-area[data-pin-mode="true"]').waitFor();
        const surface = await page.locator("[data-pin-capture]").boundingBox();
        if (surface === null) throw new Error("No pin surface.");
        const scale = surface.width / 1080;
        await page.locator("[data-pin-capture]").dispatchEvent("click", {
          clientX: surface.x + spot.x * scale,
          clientY: surface.y + spot.y * scale,
        });

        await until(async () => (await pinsOf("reel")).length === 1, "the stage pin");
        const [pin] = await pinsOf("reel");
        if (pin === undefined) throw new Error("No pin.");
        expect(pin.place.kind).toBe("stage");
        expect(pin.shot).toBe(shot.name);
        expect(pin.viewport.preset).toBe("1080x1920");
        expect(Math.abs(pin.atMs - middle)).toBeLessThanOrEqual(16);
        expect(pin.card).toContain(String(spot.name));
        await page.locator('.canvas-area[data-pin-mode="false"]').waitFor();
        await page.locator(`.preview-frame [data-pin-id="${pin.id}"]`).waitFor();
        await page.locator(`[data-ruler] [data-pin-id="${pin.id}"]`).waitFor();

        await resumeFollow(page);
        await drive("reel", { kind: "viewport", preset: "desktop", safeZone: undefined });
        await drive("reel", { kind: "focus", target: { kind: "all" } });
        await drive("reel", { kind: "seek", target: { kind: "ms", ms: 0 } });
        await page.locator(`[data-ruler] [data-pin-id="${pin.id}"]`).click();
        await until(async () => {
          const now = await drive("reel", { kind: "status" });
          return (
            now.preset === "1080x1920" &&
            now.focus.kind === "shot" &&
            Math.abs(now.atMs - pin.atMs) <= 16
          );
        }, "the restored moment");
      },
    );
  }, 120000);

  it("drops a card pin on a scrolled mobile page, restores it, and shows a CLI resolve", async () => {
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
        await until(
          async () => (await send("cookie", { kind: "status" })).kind === "status",
          "the canvas to answer",
        );
        await drive("cookie", { kind: "viewport", preset: "mobile", safeZone: undefined });
        await drive("cookie", { kind: "seek", target: { kind: "scroll", px: 8450 } });
        const recorded = (await drive("cookie", { kind: "status" })).scrollY;
        expect(recorded).toBeGreaterThan(0);

        const card = "member:builderCrumbs";
        await page.keyboard.press("p");
        await page.locator('.canvas-area[data-pin-mode="true"]').waitFor();
        await page.locator(`[data-card-id="${card}"]`).dispatchEvent("click");
        await until(async () => (await pinsOf("cookie")).length === 1, "the card pin");
        const [pin] = await pinsOf("cookie");
        if (pin === undefined) throw new Error("No pin.");
        expect(pin).toMatchObject({ place: { kind: "card" }, card });
        expect(pin.viewport.preset).toBe("mobile");
        expect(Math.abs(pin.scrollY - recorded)).toBeLessThanOrEqual(2);

        const badge = page.locator(`[data-card-id="${card}"] [data-pin-id="${pin.id}"]`);
        await badge.waitFor({ state: "attached" });
        await resumeFollow(page);
        await drive("cookie", { kind: "viewport", preset: "desktop", safeZone: undefined });
        await drive("cookie", { kind: "seek", target: { kind: "scroll", px: 0 } });
        await badge.dispatchEvent("click");
        await until(async () => {
          const now = await drive("cookie", { kind: "status" });
          return (
            now.preset === "mobile" &&
            Math.abs(now.scrollY - recorded) <= 2 &&
            now.selected.includes(card)
          );
        }, "the restored view");

        resolvePin(pieces, pin.id);
        await page
          .locator(`[data-card-id="${card}"] [data-pin-id="${pin.id}"][data-status="resolved"]`)
          .waitFor({ state: "attached", timeout: 8000 });
      },
    );
  }, 180000);
});
