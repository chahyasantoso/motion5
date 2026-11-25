import { describe, expect, it } from "vitest";
import { runCommand, type CanvasControl } from "../src/canvas/commands";
import type { Card } from "../src/graph";
import type { StudioStatus } from "../src/protocol";

const cards: readonly Card[] = [
  { id: "scene:main", kind: "scene", name: "main" },
  { id: "shot:a", kind: "shot", name: "a" },
  { id: "shot:b", kind: "shot", name: "b" },
  { id: "member:box", kind: "box", name: "box" },
];

function fake(selected: readonly string[] = []): {
  readonly control: CanvasControl;
  readonly calls: unknown[];
} {
  const calls: unknown[] = [];
  const status: StudioStatus = {
    piece: "p",
    follow: "idle",
    focus: { kind: "all" },
    preset: "desktop",
    safeZone: undefined,
    atMs: 0,
    scrollY: 0,
    playing: false,
    selected,
    problem: undefined,
  };
  const control: CanvasControl = {
    cards: () => cards,
    zones: () => ["tiktok"],
    status: () => status,
    focus: (next, card) => void calls.push(["focus", next, card?.id]),
    viewport: (preset, zone) => void calls.push(["viewport", preset, zone]),
    seek: (target) => {
      calls.push(["seek", target]);
      return !(target.kind === "selector" && target.selector === ".none");
    },
    play: (from, to, speed) => {
      calls.push(["play", from, to, speed]);
      return true;
    },
    select: (id) => void calls.push(["select", id]),
    inspect: (card) => ({
      card: card.id,
      kind: card.kind,
      atMs: 0,
      pose: undefined,
      rect: undefined,
      rest: undefined,
      bounds: undefined,
      steps: [],
    }),
    settled: async () => undefined,
  };
  return { control, calls };
}

describe("runCommand", () => {
  it("answers status with the canvas status", async () => {
    const reply = await runCommand({ kind: "status" }, fake().control);
    expect(reply.kind).toBe("status");
  });

  it("leaves graph and check to the server", async () => {
    for (const command of [
      { kind: "graph" } as const,
      { kind: "check", sizes: undefined, safeZone: undefined } as const,
    ]) {
      expect(await runCommand(command, fake().control)).toEqual({
        kind: "failed",
        message: `${command.kind} is answered by the server.`,
      });
    }
  });

  it("routes focus to the named card", async () => {
    const { control, calls } = fake();
    await runCommand({ kind: "focus", target: { kind: "shot", name: "a" } }, control);
    await runCommand({ kind: "focus", target: { kind: "shot-index", index: 1 } }, control);
    await runCommand({ kind: "focus", target: { kind: "scene", name: "main" } }, control);
    await runCommand({ kind: "focus", target: { kind: "all" } }, control);
    expect(calls.map((call) => Reflect.get(Object(call), 2))).toEqual([
      "shot:a",
      "shot:b",
      "scene:main",
      undefined,
    ]);
  });

  it("refuses a focus that names nothing and lists what exists", async () => {
    const { control } = fake();
    const past = await runCommand(
      { kind: "focus", target: { kind: "shot-index", index: 2 } },
      control,
    );
    expect(past).toMatchObject({ kind: "failed" });
    expect(JSON.stringify(past)).toContain("a, b");
    const scene = await runCommand(
      { kind: "focus", target: { kind: "scene", name: "x" } },
      control,
    );
    expect(JSON.stringify(scene)).toContain("main");
    const shot = await runCommand({ kind: "focus", target: { kind: "shot", name: "x" } }, control);
    expect(JSON.stringify(shot)).toContain("a, b");
  });

  it("refuses an unknown preset or safe zone and applies a known one", async () => {
    const { control, calls } = fake();
    expect(
      await runCommand({ kind: "viewport", preset: "nope", safeZone: undefined }, control),
    ).toMatchObject({ kind: "failed" });
    expect(
      await runCommand({ kind: "viewport", preset: "mobile", safeZone: "x" }, control),
    ).toMatchObject({ kind: "failed" });
    expect(calls).toEqual([]);
    const ok = await runCommand(
      { kind: "viewport", preset: "1080x1920", safeZone: "tiktok" },
      control,
    );
    expect(ok.kind).toBe("done");
    expect(calls).toEqual([["viewport", "1080x1920", "tiktok"]]);
  });

  it("routes seek and refuses a selector with no match", async () => {
    const { control, calls } = fake();
    expect((await runCommand({ kind: "seek", target: { kind: "ms", ms: 5 } }, control)).kind).toBe(
      "done",
    );
    expect(
      await runCommand({ kind: "seek", target: { kind: "selector", selector: ".none" } }, control),
    ).toMatchObject({ kind: "failed" });
    expect(calls).toHaveLength(2);
  });

  it("routes play", async () => {
    const { control, calls } = fake();
    await runCommand({ kind: "play", from: 1, to: 2, speed: 0.5 }, control);
    expect(calls).toEqual([["play", 1, 2, 0.5]]);
  });

  it("selects a known card and refuses an unknown one", async () => {
    const { control, calls } = fake();
    expect((await runCommand({ kind: "select", card: "member:box" }, control)).kind).toBe("done");
    expect(await runCommand({ kind: "select", card: "member:nope" }, control)).toMatchObject({
      kind: "failed",
    });
    expect(calls).toEqual([["select", "member:box"]]);
  });

  it("inspects the named card, the single selected one, and refuses otherwise", async () => {
    expect(await runCommand({ kind: "inspect", card: "member:box" }, fake().control)).toMatchObject(
      {
        kind: "inspect",
        inspection: { card: "member:box" },
      },
    );
    expect(
      await runCommand({ kind: "inspect", card: undefined }, fake(["shot:a"]).control),
    ).toMatchObject({
      kind: "inspect",
      inspection: { card: "shot:a" },
    });
    expect(await runCommand({ kind: "inspect", card: undefined }, fake().control)).toMatchObject({
      kind: "failed",
    });
    expect(await runCommand({ kind: "inspect", card: "zzz" }, fake().control)).toMatchObject({
      kind: "failed",
    });
  });
});
