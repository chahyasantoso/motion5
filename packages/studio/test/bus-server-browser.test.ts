import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  COMMAND_EVENT,
  discoveryPath,
  REPLY_EVENT,
  runBus,
  startStudio,
  type StudioStatus,
} from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));

const STATUS: StudioStatus = {
  piece: "reel",
  follow: "idle",
  focus: { kind: "all" },
  preset: "desktop",
  safeZone: undefined,
  atMs: 12,
  scrollY: 0,
  playing: false,
  selected: [],
  problem: undefined,
};

type Handler = (id: string, command: unknown, send: (id: string, reply: unknown) => void) => void;

/** A canvas stand-in: a Vite socket client that hands each command to `handler`. */
async function canvas(base: string, handler: Handler): Promise<WebSocket> {
  const socket = new WebSocket(base.replace(/^http/, "ws"), "vite-hmr");
  const send = (id: string, reply: unknown): void => {
    socket.send(JSON.stringify({ type: "custom", event: REPLY_EVENT, data: { id, reply } }));
  };
  socket.addEventListener("message", (event: MessageEvent) => {
    const message: unknown = JSON.parse(String(event.data));
    if (Reflect.get(Object(message), "event") !== COMMAND_EVENT) return;
    const data: unknown = Reflect.get(Object(message), "data");
    const id: unknown = Reflect.get(Object(data), "id");
    if (typeof id === "string") handler(id, Reflect.get(Object(data), "command"), send);
  });
  await new Promise<void>((done, fail) => {
    socket.addEventListener("open", () => {
      done();
    });
    socket.addEventListener("error", () => {
      fail(new Error("socket failed"));
    });
  });
  return socket;
}

describe("the studio command bus", () => {
  let base = "";
  let close: () => Promise<void> = async () => undefined;
  const hadFolder = existsSync(join(pieces, ".gerak"));
  let socket: WebSocket | undefined;
  let handler: Handler = () => undefined;

  const post = (body: string, headers: Record<string, string> = {}): Promise<Response> =>
    fetch(`${base}/__gerak/bus?piece=reel`, { method: "POST", body, headers });

  beforeAll(async () => {
    const started = await startStudio({ root: pieces, piece: "reel", port: 0, busTimeoutMs: 300 });
    base = new URL(started.url).origin;
    close = started.close;
  });
  afterAll(async () => {
    socket?.close();
    await close();
    if (!hadFolder) rmSync(join(pieces, ".gerak"), { recursive: true, force: true });
  });

  it("writes the discovery file while listening", () => {
    const found: unknown = JSON.parse(readFileSync(discoveryPath(pieces), "utf8"));
    expect(Reflect.get(Object(found), "piece")).toBe("reel");
    expect(String(Reflect.get(Object(found), "url"))).toContain(new URL(base).host);
  });

  it("answers graph without a canvas", async () => {
    const answer = await post(JSON.stringify({ kind: "graph" }));
    expect(answer.status).toBe(200);
    const reply: unknown = await answer.json();
    expect(Reflect.get(Object(reply), "kind")).toBe("graph");
    const graph = Reflect.get(Object(reply), "graph");
    expect(Array.isArray(Reflect.get(Object(graph), "cards"))).toBe(true);
  });

  it("answers 504 failed when no canvas is open", async () => {
    const answer = await post(JSON.stringify({ kind: "status" }));
    expect(answer.status).toBe(504);
    const reply: unknown = await answer.json();
    expect(Reflect.get(Object(reply), "kind")).toBe("failed");
    expect(String(Reflect.get(Object(reply), "message"))).toContain("No canvas answered for reel");
  });

  it("refuses a malformed body and a cross-origin call", async () => {
    expect((await post("not json")).status).toBe(400);
    expect((await post(JSON.stringify({ kind: "dance" }))).status).toBe(400);
    expect((await post(JSON.stringify({ kind: "seek", target: { kind: "ms" } }))).status).toBe(400);
    const cross = await post(JSON.stringify({ kind: "status" }), {
      origin: "http://evil.example",
    });
    expect(cross.status).toBe(403);
  });

  it("routes a command to a canvas and returns the first reply for its id", async () => {
    handler = (id, command, send) => {
      if (Reflect.get(Object(command), "kind") !== "status") return;
      send(id, { kind: "status", status: STATUS });
      send(id, { kind: "failed", message: "late" });
    };
    socket = await canvas(base, (id, command, send) => {
      handler(id, command, send);
    });
    const answer = await post(JSON.stringify({ kind: "status" }));
    expect(answer.status).toBe(200);
    expect(await answer.json()).toEqual({ kind: "status", status: STATUS });
  });

  it("times out when the canvas answers another id", async () => {
    handler = (_id, _command, send) => {
      send("some-other-id", { kind: "status", status: STATUS });
    };
    const answer = await post(JSON.stringify({ kind: "status" }));
    expect(answer.status).toBe(504);
    expect(Reflect.get(Object(await answer.json()), "kind")).toBe("failed");
  });

  it("serves the CLI through the discovery file", async () => {
    handler = (id, _command, send) => {
      send(id, { kind: "status", status: STATUS });
    };
    const result = await runBus("status", ["--root", pieces]);
    expect(result.ok).toBe(true);
    expect(JSON.parse(result.text)).toEqual({ kind: "status", status: STATUS });
  });

  it("deletes the discovery file on close", async () => {
    socket?.close();
    await close();
    close = async () => undefined;
    expect(existsSync(discoveryPath(pieces))).toBe(false);
  });
});
