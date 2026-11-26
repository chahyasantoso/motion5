import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "@gerak/tools/page";
import type { Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio, type StudioReply } from "../src";
import { pinsPath } from "../src/pin-store";
import type { Pin } from "../src/pins";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const pinsFile = pinsPath(pieces);
const savedPins = existsSync(pinsFile) ? readFileSync(pinsFile, "utf8") : undefined;
const SCRATCH = "scratch-prompt-throws";

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
  rmSync(join(pieces, SCRATCH), { recursive: true, force: true });
  if (savedPins !== undefined) {
    mkdirSync(dirname(pinsFile), { recursive: true });
    writeFileSync(pinsFile, savedPins);
  } else rmSync(pinsFile, { force: true });
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else
    for (const piece of ["reel", SCRATCH])
      rmSync(join(gerak, "canvas", `${piece}.json`), { force: true });
});

async function send(piece: string, command: unknown): Promise<StudioReply> {
  const answer = await fetch(`${base}__gerak/bus?piece=${piece}`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  return answer.json();
}

async function pinsOf(piece: string): Promise<readonly Pin[]> {
  const answer = await fetch(`${base}__gerak/pins?piece=${piece}`);
  const body: { pins: Pin[] } = await answer.json();
  return body.pins;
}

async function mounted(page: Page): Promise<void> {
  await page.waitForSelector('.canvas-area[data-framed="true"] [data-card-id]');
  await page.waitForFunction(
    `(() => { const w = document.querySelector("iframe[data-preview]")?.contentWindow; const m = w?.[Symbol.for('@gerak/dom/mounts')]; return Array.isArray(m) && m.length > 0; })()`,
    undefined,
    { timeout: 60000 },
  );
}

describe("prompt seams on the canvas", () => {
  it("shows the selection toolbar for one selected card and copies its token", async () => {
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
        await expect
          .poll(async () => (await send("reel", { kind: "status" })).kind, { timeout: 20000 })
          .toBe("status");
        expect(await page.locator("[data-selection-toolbar]").count()).toBe(0);
        const graph = await send("reel", { kind: "graph" });
        if (graph.kind !== "graph") throw new Error("No graph.");
        const member = graph.graph.cards.find((card) => card.id.startsWith("member:"));
        if (member === undefined) throw new Error("The reel has no member card.");
        await send("reel", { kind: "select", card: member.id });
        const toolbar = page.locator("[data-selection-toolbar]");
        await toolbar.waitFor();
        expect(await toolbar.innerText()).toContain("Pins only");
        expect(await page.locator('[data-agent-slot="selection"]').count()).toBe(1);
        expect(await page.locator('[data-agent-slot="selection"]').innerText()).toBe("");
        const button = toolbar.getByRole("button", { name: "Copy @card" });
        await button.click();
        const token = await button.getAttribute("data-token");
        expect(token).toMatch(new RegExp(`^@${member.id}@\\d+ms`));
      },
    );
  }, 120000);

  it("queues a fix pin from the banner", async () => {
    const dir = join(pieces, SCRATCH);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(join(dir, "src"), { recursive: true });
    const source = join(pieces, "saved");
    const rename = (text: string): string => text.replaceAll("saved", SCRATCH);
    writeFileSync(
      join(dir, `${SCRATCH}.html`),
      rename(readFileSync(join(source, "saved.html"), "utf8")),
    );
    writeFileSync(
      join(dir, "src", `${SCRATCH}-main.ts`),
      rename(readFileSync(join(source, "src", "saved-main.ts"), "utf8")),
    );
    const scene = join(dir, "src", `${SCRATCH}.ts`);
    cpSync(join(source, "src", "saved.ts"), scene);
    const good = readFileSync(scene, "utf8");
    await withPage(
      {
        page: `__gerak/studio?piece=${SCRATCH}`,
        width: 1440,
        height: 900,
        clock: "real",
        source: { kind: "url", base },
      },
      async ({ page }) => {
        await mounted(page);
        expect(await page.locator("[data-banner]").count()).toBe(0);
        writeFileSync(scene, `${good}\nthrow new Error("boom in the scene");\n`);
        await page.locator("[data-banner]").waitFor({ timeout: 20000 });
        expect(await page.locator('[data-agent-slot="banner"]').count()).toBe(1);
        await page.getByRole("button", { name: "Queue fix pin" }).click();
        await expect.poll(async () => (await pinsOf(SCRATCH)).length, { timeout: 8000 }).toBe(1);
        const pins = await pinsOf(SCRATCH);
        expect(pins).toHaveLength(1);
        expect(pins[0]?.status).toBe("open");
        expect(pins[0]?.note.startsWith("Fix: ")).toBe(true);
        expect(pins[0]?.note).toContain("boom in the scene");
        writeFileSync(scene, good);
      },
    );
  }, 120000);
});
