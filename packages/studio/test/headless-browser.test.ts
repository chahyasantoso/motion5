import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startStudio, type StudioReply } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const gerak = join(pieces, ".gerak");
const hadGerak = existsSync(gerak);
const MEMBER = "member:hookEyebrow";
const BUDGET_MS = 200;

let base = "";
let launches: () => number = () => -1;
let close: () => Promise<void> = async () => undefined;

beforeAll(async () => {
  const started = await startStudio({
    root: pieces,
    piece: "reel",
    port: 0,
    headless: true,
    busTimeoutMs: 1500,
  });
  base = `${new URL(started.url).origin}/`;
  launches = started.launches;
  close = started.close;
}, 120000);

afterAll(async () => {
  await close();
  if (!hadGerak) rmSync(gerak, { recursive: true, force: true });
  else rmSync(join(gerak, "canvas", "reel.json"), { force: true });
});

async function send(command: unknown): Promise<StudioReply> {
  const answer = await fetch(`${base}__gerak/bus?piece=reel`, {
    method: "POST",
    body: JSON.stringify(command),
  });
  return answer.json();
}

async function timed(command: unknown): Promise<number> {
  const started = performance.now();
  const reply = await send(command);
  const took = performance.now() - started;
  expect(reply.kind).not.toBe("failed");
  return took;
}

describe("a headless studio", () => {
  it("answers bus commands warm and checks on the one shared browser", async () => {
    const deadline = Date.now() + 90000;
    for (;;) {
      if ((await send({ kind: "status" })).kind === "status") break;
      if (Date.now() > deadline) throw new Error("The headless canvas never answered.");
      await new Promise((done) => setTimeout(done, 250));
    }
    await new Promise((done) => setTimeout(done, 500));

    const cases = [
      { kind: "seek", target: { kind: "ms", ms: 2000 } },
      { kind: "select", card: MEMBER },
      { kind: "status" },
    ];
    for (const command of cases) await timed(command);
    const times = [];
    for (const command of cases) times.push(await timed(command));
    console.log(`headless warm round trips (ms): ${JSON.stringify(times)}`);
    for (const took of times) expect(took).toBeLessThan(BUDGET_MS);

    const first = await send({ kind: "check", sizes: undefined, safeZone: undefined });
    expect(first.kind).toBe("check");
    if (first.kind !== "check") return;
    expect(first.result.kind).toBe("checked");
    expect(first.result.frames).toBeGreaterThan(0);

    const started = performance.now();
    const second = await send({ kind: "check", sizes: undefined, safeZone: undefined });
    console.log(`warm check (ms): ${Math.round(performance.now() - started)}`);
    expect(second.kind).toBe("check");
    expect(launches()).toBe(1);
  }, 240000);
});
