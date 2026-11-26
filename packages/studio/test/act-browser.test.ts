import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSceneReviewArgs } from "@gerak/tools/scene";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PRESETS_EVENT, startStudio, type StudioReply } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const take = join(gerak, "presets", "cookie", "test-burst.json");

let base = "";
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  const started = await startStudio({ root: pieces, piece: "cookie", port: 0 });
  base = new URL(started.url).origin;
  close = started.close;
}, 120000);

afterAll(async () => {
  await close();
  rmSync(take, { force: true });
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
});

async function send(command: unknown): Promise<StudioReply> {
  const answer = await fetch(`${base}/__gerak/bus?piece=cookie`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  return answer.json();
}

describe("act on the studio server", () => {
  it("records clicks and a scroll on the cookie page, saves them and lets review read them", async () => {
    const reply = await send({
      kind: "act",
      actions: 'click:[data-cast="heroCta"]@300,click:[data-cast="heroCta"]@700,scroll:600@1100',
      savePreset: "test-burst",
    });
    expect(JSON.stringify(reply).slice(0, 400)).toContain('"kind":"act"');
    if (reply.kind !== "act") return;
    console.log(`act events: ${JSON.stringify(reply.events.slice(0, 6))}`);
    expect(reply.events.length).toBeGreaterThanOrEqual(3);
    expect(existsSync(take)).toBe(true);
    expect(reply.saved).toBe(take);

    const parsed = parseSceneReviewArgs([
      join(pieces, "cookie", "src", "cookie.ts"),
      "--events",
      "@test-burst",
    ]);
    expect(parsed.kind).toBe("ok");
    if (parsed.kind === "ok") expect(parsed.events?.length).toBe(reply.events.length);

    const listed = await fetch(`${base}/__gerak/presets?piece=cookie`);
    const listedBody: unknown = await listed.json();
    expect(Reflect.get(Object(listedBody), "names")).toContain("test-burst");
    const one = await fetch(`${base}/__gerak/presets?piece=cookie&name=test-burst`);
    expect(one.status).toBe(200);
    const missing = await fetch(`${base}/__gerak/presets?piece=cookie&name=nope`);
    expect(missing.status).toBe(404);
    const bad = await fetch(`${base}/__gerak/presets?piece=cookie&name=Bad`, {
      method: "PUT",
      body: "[]",
    });
    expect(bad.status).toBe(400);
    const taken = await fetch(`${base}/__gerak/presets?piece=cookie&name=test-burst`, {
      method: "PUT",
      body: "[]",
    });
    expect(taken.status).toBe(409);
  }, 180000);

  it("refuses a bad action list and a bad preset name without waiting behind a running act", async () => {
    let running = true;
    const slow = send({ kind: "act", actions: "scroll:10@0", savePreset: undefined }).finally(
      () => {
        running = false;
      },
    );
    expect((await send({ kind: "act", actions: "nonsense", savePreset: undefined })).kind).toBe(
      "failed",
    );
    expect((await send({ kind: "act", actions: "scroll:10@0", savePreset: "Bad Name" })).kind).toBe(
      "failed",
    );
    expect(running).toBe(true);
    expect(await slow).toMatchObject({ kind: "act" });
  }, 90000);

  it("names the presets event", () => {
    expect(PRESETS_EVENT).toBe("gerak:presets");
  });
});
