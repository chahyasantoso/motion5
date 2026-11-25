import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseLayout, prunedLayout, startStudio, type StudioGraph } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));

describe("the layout sidecar", () => {
  const graph: StudioGraph = {
    piece: "p",
    cards: [{ id: "shot:a", kind: "shot", name: "a" }],
    wires: [],
  };

  it("keeps only well-formed places, viewport and preview", () => {
    expect(
      parseLayout({
        cards: { "shot:a": { x: 1, y: 2, collapsed: true }, bad: { x: "1", y: 2 } },
        viewport: { x: 0, y: 0, zoom: 0 },
        preview: { preset: "tiktok", safeZone: 3 },
        extra: true,
      }),
    ).toEqual({
      cards: { "shot:a": { x: 1, y: 2, collapsed: true } },
      preview: { preset: "tiktok" },
    });
    expect(parseLayout("nope")).toEqual({ cards: {} });
  });

  it("drops the places of cards the graph no longer lists", () => {
    const layout = { cards: { "shot:a": { x: 1, y: 2 }, "shot:gone": { x: 3, y: 4 } } };
    expect(prunedLayout(layout, graph).cards).toEqual({ "shot:a": { x: 1, y: 2 } });
  });
});

describe("the studio server", () => {
  let base = "";
  let close: () => Promise<void> = async () => undefined;
  const layoutFile = join(pieces, ".gerak", "canvas", "reel.json");
  const hadLayout = existsSync(layoutFile);

  beforeAll(async () => {
    const started = await startStudio({ root: pieces, piece: "reel", port: 0 });
    base = new URL(started.url).origin;
    close = started.close;
  });
  afterAll(async () => {
    await close();
    if (!hadLayout) rmSync(join(pieces, ".gerak"), { recursive: true, force: true });
  });

  it("serves the canvas page with its client entry", async () => {
    const page = await fetch(`${base}/__gerak/studio?piece=reel`);
    expect(page.status).toBe(200);
    const html = await page.text();
    expect(html).toContain('<div id="studio"></div>');
    expect(html).toMatch(/src="\/@fs\/.+\/canvas\/main\.tsx"/);
  });

  it("answers the graph and the page of a piece, and refuses a bad name", async () => {
    const answer: unknown = await (await fetch(`${base}/__gerak/graph?piece=reel`)).json();
    expect(Reflect.get(Object(answer), "page")).toBe("reel/reel.html");
    const graph = Reflect.get(Object(answer), "graph");
    expect(Reflect.get(Object(graph), "piece")).toBe("reel");
    expect((await fetch(`${base}/__gerak/graph?piece=Reel`)).status).toBe(400);
    expect((await fetch(`${base}/__gerak/graph?piece=missing`)).status).toBe(422);
  });

  it("writes a layout pruned of stale ids and reads it back", async () => {
    const put = await fetch(`${base}/__gerak/layout?piece=reel`, {
      method: "PUT",
      body: JSON.stringify({
        cards: { "shot:hook": { x: 10, y: 20 }, "shot:gone": { x: 1, y: 1 } },
      }),
    });
    expect(await put.json()).toEqual({ cards: { "shot:hook": { x: 10, y: 20 } } });
    expect(JSON.parse(readFileSync(layoutFile, "utf8"))).toEqual({
      cards: { "shot:hook": { x: 10, y: 20 } },
    });
    expect(await (await fetch(`${base}/__gerak/layout?piece=reel`)).json()).toEqual({
      cards: { "shot:hook": { x: 10, y: 20 } },
    });
  });

  it("refuses a write from another site's page", async () => {
    const put = await fetch(`${base}/__gerak/layout?piece=reel`, {
      method: "PUT",
      headers: { "sec-fetch-site": "cross-site" },
      body: "{}",
    });
    expect(put.status).toBe(403);
  });
});
