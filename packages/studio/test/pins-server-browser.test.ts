import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PINS_EVENT, pinsPath, runPins, startStudio, type NewPin } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));

const NEW: NewPin = {
  piece: "reel",
  place: { kind: "moment" },
  card: undefined,
  scene: undefined,
  shot: undefined,
  file: undefined,
  part: undefined,
  viewport: { preset: "desktop", safeZone: undefined },
  atMs: 10,
  scrollY: 0,
  preset: undefined,
  pose: undefined,
  restBox: undefined,
  note: "via route",
};

describe("pins on the studio server", () => {
  let base = "";
  let close: () => Promise<void> = async () => undefined;
  let socket: WebSocket | undefined;
  const file = pinsPath(pieces);
  const before = existsSync(file) ? readFileSync(file, "utf8") : undefined;
  const events: string[] = [];

  const url = (path: string): string => `${base}/__gerak/${path}`;

  beforeAll(async () => {
    rmSync(file, { force: true });
    const started = await startStudio({ root: pieces, piece: "reel", port: 0 });
    base = new URL(started.url).origin;
    close = started.close;
    socket = new WebSocket(base.replace(/^http/, "ws"), "vite-hmr");
    socket.addEventListener("message", (event: MessageEvent) => {
      const message: unknown = JSON.parse(String(event.data));
      const name: unknown = Reflect.get(Object(message), "event");
      if (typeof name === "string") events.push(name);
    });
    await new Promise<void>((done, fail) => {
      socket?.addEventListener("open", () => {
        done();
      });
      socket?.addEventListener("error", () => {
        fail(new Error("socket failed"));
      });
    });
  });
  afterAll(async () => {
    socket?.close();
    await close();
    if (before === undefined) rmSync(file, { force: true });
    else writeFileSync(file, before);
  });

  const waitFor = async (count: number): Promise<void> => {
    for (let tries = 0; tries < 100; tries += 1) {
      if (events.filter((name) => name === PINS_EVENT).length >= count) return;
      await new Promise((done) => setTimeout(done, 50));
    }
  };

  it("tells the canvas when the CLI adds a pin, and lists it", async () => {
    const graph = await fetch(url("graph?piece=reel"));
    const cards: unknown = Reflect.get(
      Object(Reflect.get(Object(await graph.json()), "graph")),
      "cards",
    );
    const shot = Array.isArray(cards)
      ? cards
          .map((each: unknown) => Reflect.get(Object(each), "id"))
          .find((id: unknown) => String(id).startsWith("shot:"))
      : undefined;
    expect(typeof shot).toBe("string");
    const added = await runPins([
      "add",
      "--piece",
      "reel",
      "--card",
      String(shot),
      "--note",
      "x",
      "--root",
      pieces,
    ]);
    expect(added.ok).toBe(true);
    await waitFor(1);
    expect(events).toContain(PINS_EVENT);
    const listed = await fetch(url("pins?piece=reel"));
    const pins: unknown = Reflect.get(Object(await listed.json()), "pins");
    expect(Array.isArray(pins) ? pins : []).toHaveLength(1);
  });

  it("adds and resolves through the routes", async () => {
    const posted = await fetch(url("pins?piece=reel"), {
      method: "POST",
      body: JSON.stringify(NEW),
    });
    expect(posted.status).toBe(200);
    const pin: unknown = Reflect.get(Object(await posted.json()), "pin");
    const id = Number(Reflect.get(Object(pin), "id"));
    expect(id).toBe(2);
    const resolved = await fetch(url(`pins/resolve?piece=reel&id=${id}`), { method: "POST" });
    expect(resolved.status).toBe(200);
    expect(Reflect.get(Object(Reflect.get(Object(await resolved.json()), "pin")), "status")).toBe(
      "resolved",
    );
    expect((await fetch(url("pins/resolve?piece=reel&id=99"), { method: "POST" })).status).toBe(
      404,
    );
    const bad = await fetch(url("pins?piece=reel"), {
      method: "POST",
      body: JSON.stringify({ note: 1 }),
    });
    expect(bad.status).toBe(400);
    const other = await fetch(url("pins?piece=reel"), {
      method: "POST",
      body: JSON.stringify({ ...NEW, piece: "x" }),
    });
    expect(other.status).toBe(400);
  });

  it("refuses a cross-origin call", async () => {
    const cross = await fetch(url("pins?piece=reel"), {
      method: "POST",
      body: JSON.stringify(NEW),
      headers: { origin: "http://evil.example" },
    });
    expect(cross.status).toBe(403);
  });
});
