import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addPin, clearPins, parsePins, pinsPath, readPins, resolvePin, type NewPin } from "../src";

function fresh(over: Partial<NewPin> = {}): NewPin {
  return {
    piece: "reel",
    place: { kind: "card" },
    card: "member:a",
    scene: undefined,
    shot: undefined,
    file: undefined,
    part: undefined,
    viewport: { preset: "desktop", safeZone: undefined },
    atMs: 0,
    scrollY: 0,
    preset: undefined,
    pose: undefined,
    restBox: undefined,
    note: "n",
    ...over,
  };
}

describe("the pin store", () => {
  let root = "";
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "pins-"));
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("numbers pins from 1 and never reuses a cleared number", () => {
    expect(addPin(root, fresh()).id).toBe(1);
    expect(addPin(root, fresh()).id).toBe(2);
    expect(clearPins(root, {})).toBe(2);
    expect(addPin(root, fresh()).id).toBe(3);
  });

  it("resolves a pin and answers undefined for a missing one", () => {
    const pin = addPin(root, fresh());
    expect(resolvePin(root, pin.id)?.status).toBe("resolved");
    expect(readPins(root)[0]?.status).toBe("resolved");
    expect(resolvePin(root, 99)).toBeUndefined();
  });

  it("resolves only a pin of the piece named", () => {
    const pin = addPin(root, fresh());
    expect(resolvePin(root, pin.id, "elsewhere")).toBeUndefined();
    expect(readPins(root)[0]?.status).toBe("open");
    expect(resolvePin(root, pin.id, pin.piece)?.status).toBe("resolved");
  });

  it("refuses to change a pins file that is not JSON, and leaves it as it was", () => {
    addPin(root, fresh());
    writeFileSync(pinsPath(root), "{ broken");
    expect(() => addPin(root, fresh())).toThrow(/not JSON/);
    expect(readFileSync(pinsPath(root), "utf8")).toBe("{ broken");
    expect(readPins(root)).toEqual([]);
  });

  it("drops malformed entries", () => {
    const good = { ...fresh(), id: 1, status: "open", createdAt: "2026-01-01T00:00:00.000Z" };
    const kept = parsePins({
      next: 5,
      pins: [good, { ...good, id: 2, atMs: "x" }, { ...good, id: 3, place: { kind: "nope" } }, 7],
    });
    expect(kept.map((pin) => pin.id)).toEqual([1]);
    expect(parsePins("nothing")).toEqual([]);
  });

  it("clears by piece and by status", () => {
    addPin(root, fresh({ piece: "reel" }));
    const second = addPin(root, fresh({ piece: "reel" }));
    addPin(root, fresh({ piece: "other" }));
    resolvePin(root, second.id);
    expect(clearPins(root, { piece: "reel", status: "resolved" })).toBe(1);
    expect(clearPins(root, { piece: "reel" })).toBe(1);
    expect(readPins(root).map((pin) => pin.piece)).toEqual(["other"]);
  });

  it("round-trips a pin on a member through the file", () => {
    const given = fresh({
      card: "member:builderCrumbs",
      atMs: 3100,
      scrollY: 8450,
      viewport: { preset: "mobile", safeZone: "tiktok" },
      pose: { x: 1, opacity: 0.5 },
      restBox: { x: 1, y: 2, width: 3, height: 4 },
    });
    const made = addPin(root, given, new Date("2026-01-01T00:00:00Z"));
    expect(made.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(readPins(root)).toEqual([made]);
    expect(JSON.parse(readFileSync(pinsPath(root), "utf8"))).toMatchObject({ next: 2 });
  });
});
