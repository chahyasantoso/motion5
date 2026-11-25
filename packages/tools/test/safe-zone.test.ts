import { describe, expect, it } from "vitest";
import { describeFinding, parseCheckArgs, zoneFindings, type Frame } from "../src/page/check";
import { parseReviewArgs } from "../src/page/review";
import {
  SAFE_ZONE_NAMES,
  parseSafeZone,
  safeZone,
  unsafeEdges,
  type SafeZoneName,
} from "../src/page/safe-zone";

const TALL = { width: 1080, height: 1920 };
const tiktok = safeZone("tiktok");

describe("safe zone profiles", () => {
  it("lists the platforms in order", () => {
    expect(SAFE_ZONE_NAMES).toEqual(["tiktok", "reels", "shorts", "youtube"]);
  });

  it("holds each platform's frame and margins", () => {
    const table: Record<SafeZoneName, readonly number[]> = {
      tiktok: [1080, 1920, 140, 132, 320, 36],
      reels: [1080, 1920, 140, 120, 300, 36],
      shorts: [1080, 1920, 140, 128, 340, 36],
      youtube: [1920, 1080, 54, 96, 54, 96],
    };
    for (const name of SAFE_ZONE_NAMES) {
      const zone = safeZone(name);
      expect([zone.width, zone.height, zone.top, zone.right, zone.bottom, zone.left]).toEqual(
        table[name],
      );
    }
  });

  it("parses a name or answers undefined", () => {
    expect(parseSafeZone("reels")).toBe("reels");
    expect(parseSafeZone("vimeo")).toBeUndefined();
    expect(parseSafeZone(undefined)).toBeUndefined();
  });
});

describe("unsafeEdges", () => {
  it("names the band a box enters", () => {
    expect(unsafeEdges({ x: 100, y: 1780, width: 200, height: 60 }, tiktok, TALL)).toEqual([
      "bottom",
    ]);
    expect(unsafeEdges({ x: 1010, y: 500, width: 40, height: 40 }, tiktok, TALL)).toEqual([
      "right",
    ]);
    expect(unsafeEdges({ x: 100, y: 20, width: 200, height: 40 }, tiktok, TALL)).toEqual(["top"]);
    expect(unsafeEdges({ x: 10, y: 500, width: 40, height: 40 }, tiktok, TALL)).toEqual(["left"]);
  });

  it("lists several edges in top, right, bottom, left order", () => {
    expect(unsafeEdges({ x: 0, y: 0, width: 1080, height: 1920 }, tiktok, TALL)).toEqual([
      "top",
      "right",
      "bottom",
      "left",
    ]);
  });

  it("accepts a box inside the margins", () => {
    expect(unsafeEdges({ x: 36, y: 140, width: 912, height: 1460 }, tiktok, TALL)).toEqual([]);
  });

  it("scales the bands with the stage", () => {
    const half = { width: 540, height: 960 };
    expect(unsafeEdges({ x: 100, y: 830, width: 50, height: 20 }, tiktok, half)).toEqual([
      "bottom",
    ]);
    expect(unsafeEdges({ x: 100, y: 790, width: 50, height: 10 }, tiktok, half)).toEqual([]);
  });

  it("ignores a box with no area on stage and cuts a partly off box to the stage", () => {
    expect(unsafeEdges({ x: 100, y: 2000, width: 50, height: 20 }, tiktok, TALL)).toEqual([]);
    expect(unsafeEdges({ x: 400, y: -500, width: 50, height: 400 }, tiktok, TALL)).toEqual([]);
    expect(unsafeEdges({ x: 400, y: -500, width: 50, height: 700 }, tiktok, TALL)).toEqual(["top"]);
  });
});

describe("zoneFindings", () => {
  it("reports one finding per element and edge at the first frame", () => {
    const frames: Frame[] = [0, 16, 32, 48].map((at) => ({
      at,
      elements: [
        { name: "caption", box: { x: 100, y: at >= 16 ? 1700 : 500, width: 200, height: 60 } },
        { name: "title", box: { x: 100, y: 500, width: 200, height: 60 } },
      ],
    }));
    expect(zoneFindings(frames, tiktok, TALL)).toEqual([
      { kind: "unsafe-zone", element: "caption", zone: "tiktok", edge: "bottom", at: 16 },
    ]);
  });

  it("describes the finding", () => {
    expect(
      describeFinding({
        kind: "unsafe-zone",
        element: 'p "Hello"',
        zone: "reels",
        edge: "top",
        at: 320,
      }),
    ).toBe('p "Hello" enters the reels top margin at 320 ms');
  });
});

describe("--safe-zone arguments", () => {
  const base = ["a.html", "--watch", ".x", "--to", "400"];

  it("defaults the viewport to the platform's native size", () => {
    for (const parse of [parseCheckArgs, parseReviewArgs]) {
      const tall = parse([...base, "--safe-zone", "tiktok"]);
      if (tall.kind !== "ok") throw new Error(tall.message);
      expect([tall.width, tall.height, tall.safeZone]).toEqual([1080, 1920, "tiktok"]);
      const wide = parse([...base, "--safe-zone", "youtube"]);
      if (wide.kind !== "ok") throw new Error(wide.message);
      expect([wide.width, wide.height]).toEqual([1920, 1080]);
    }
  });

  it("keeps a size or sizes the caller passes", () => {
    for (const parse of [parseCheckArgs, parseReviewArgs]) {
      const sized = parse([...base, "--safe-zone", "tiktok", "--size", "720x1280"]);
      if (sized.kind !== "ok") throw new Error(sized.message);
      expect([sized.width, sized.height]).toEqual([720, 1280]);
      const many = parse([...base, "--safe-zone", "tiktok", "--sizes", "540x960,720x1280"]);
      if (many.kind !== "ok") throw new Error(many.message);
      expect([many.width, many.height, many.sizes?.length]).toEqual([540, 960, 2]);
    }
  });

  it("leaves safeZone unset without the flag", () => {
    const plain = parseCheckArgs(base);
    if (plain.kind !== "ok") throw new Error(plain.message);
    expect(plain.safeZone).toBeUndefined();
    expect([plain.width, plain.height]).toEqual([1280, 720]);
  });

  it("answers usage for a missing or unknown name", () => {
    for (const parse of [parseCheckArgs, parseReviewArgs])
      for (const args of [
        [...base, "--safe-zone", "vimeo"],
        [...base, "--safe-zone"],
      ]) {
        const bad = parse(args);
        expect(bad.kind).toBe("usage");
        if (bad.kind === "usage")
          expect(bad.message).toContain("--safe-zone needs one of tiktok, reels, shorts, youtube.");
      }
  });
});
