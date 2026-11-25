import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { groupOf, pieceGraph, type StudioGraph } from "../src";

const pieces = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const scratch = mkdtempSync(join(fileURLToPath(new URL("./", import.meta.url)), ".scratch-"));
afterAll(() => rmSync(scratch, { recursive: true, force: true }));

async function graph(root: string, name: string): Promise<StudioGraph> {
  const result = await pieceGraph(root, name);
  if (result.kind === "refused") throw new Error(result.message);
  return result.graph;
}

function hasWire(graph: StudioGraph, from: string, to: string, type: string): boolean {
  return graph.wires.some((wire) => wire.from === from && wire.to === to && wire.type === type);
}

describe("graphOf on the reel", () => {
  it("gives four shot cards in order inside the reel's scene card", async () => {
    const reel = await graph(pieces, "reel");
    const shots = reel.cards.filter((card) => card.kind === "shot");
    expect(shots.map((card) => card.id)).toEqual([
      "shot:hook",
      "shot:reveal",
      "shot:proof",
      "shot:cta",
    ]);
    expect(shots.every((card) => card.parent === "scene:reel")).toBe(true);
    expect(reel.cards.find((card) => card.id === "member:hookTitle")?.parent).toBe("shot:hook");
  });

  it("wires one beats job from its music into the scene and the shots that end on its cues", async () => {
    const reel = await graph(pieces, "reel");
    const jobs = reel.cards.filter((card) => card.kind === "beats");
    expect(jobs.map((card) => card.id)).toEqual(["job:src/music.cues.json"]);
    expect(hasWire(reel, "source:audio/music.m4a", "job:src/music.cues.json", "media")).toBe(true);
    expect(hasWire(reel, "job:src/music.cues.json", "scene:reel", "events")).toBe(true);
    expect(hasWire(reel, "job:src/music.cues.json", "shot:hook", "events")).toBe(true);
    expect(hasWire(reel, "job:src/music.cues.json", "shot:cta", "events")).toBe(false);
    const cues = reel.cards.find((card) => card.kind === "cues");
    expect(cues?.outputs).toEqual(["src/captions.cues.json", "src/captions.words.json"]);
  });

  it("wires time from beats into moves and pose from moves into their cast", async () => {
    const reel = await graph(pieces, "reel");
    expect(hasWire(reel, "beat:hook.enter", "move:hookEyebrow.0", "time")).toBe(true);
    expect(hasWire(reel, "move:hookEyebrow.0", "member:hookEyebrow", "pose")).toBe(true);
    for (const wire of reel.wires) {
      expect(reel.cards.some((card) => card.id === wire.from)).toBe(true);
      expect(reel.cards.some((card) => card.id === wire.to)).toBe(true);
    }
  });

  it("gives a package move a motion card and a hand-written one a code card at its source", async () => {
    const reel = await graph(pieces, "reel");
    const rise = reel.cards.find((card) => card.id === "move:hookEyebrow.0");
    expect(rise).toMatchObject({ kind: "motion", name: "rise" });
    const fadeOut = reel.cards.find((card) => card.id === "move:hookBg.0");
    expect(fadeOut).toMatchObject({ kind: "code", name: "fadeOut" });
    const line = readFileSync(join(pieces, "reel", fadeOut?.site?.file ?? ""), "utf8").split("\n")[
      (fadeOut?.site?.line ?? 0) - 1
    ];
    expect(line).toContain("const fadeOut = motion(");
  });

  it("puts preview, check and render after the scene by stage wires", async () => {
    const reel = await graph(pieces, "reel");
    for (const kind of ["preview", "check", "render"])
      expect(hasWire(reel, "scene:reel", `output:${kind}`, "stage")).toBe(true);
    expect(new Set(reel.cards.map((card) => groupOf(card.kind)))).toEqual(
      new Set(["timing", "cast", "move", "source", "tool", "output"]),
    );
  });
});

describe("graphOf across pieces", () => {
  it("draws the explainer's clip into its media box and launch-day's spread moves as set in code", async () => {
    const explainer = await graph(pieces, "explainer");
    expect(hasWire(explainer, "source:media/screen.webm", "member:screen", "media")).toBe(true);
    const launch = await graph(pieces, "launch-day");
    const loose = launch.cards.filter((card) => card.note === "set in code");
    expect(loose.some((card) => card.id.startsWith("code:src/launch-day.ts:"))).toBe(true);
    expect(launch.cards.find((card) => card.id === "move:one.0")?.note).toBe("set in code");
  });

  it("reads cookie's moves through its destructured cast and marks its input beats", async () => {
    const cookie = await graph(pieces, "cookie");
    expect(cookie.cards.filter((card) => card.note === "set in code")).toEqual([]);
    expect(cookie.cards.find((card) => card.id === "source:input")?.kind).toBe("input");
    expect(cookie.cards.find((card) => card.id === "beat:craftScroll")?.note).toBe(
      "driven by input",
    );
  });
});

describe("ids from code identity", () => {
  const copyReel = (name: string): string => {
    const root = join(scratch, name);
    cpSync(join(pieces, "reel"), join(root, "reel"), { recursive: true });
    return root;
  };

  it("keeps every card and wire id after a knob edit", async () => {
    const root = copyReel("knob");
    const before = await graph(root, "reel");
    const file = join(root, "reel", "src", "reel.ts");
    const text = readFileSync(file, "utf8");
    writeFileSync(
      file,
      text.replace("rise({ distance: 26 }).in(hookEnter", "rise({ distance: 40 }).in(hookEnter"),
    );
    const after = await graph(root, "reel");
    expect(after.cards.map((card) => card.id)).toEqual(before.cards.map((card) => card.id));
    expect(after.wires.map((wire) => wire.id)).toEqual(before.wires.map((wire) => wire.id));
  });

  it("turns a dynamic import into a card marked set in code, with no wires", async () => {
    const root = copyReel("dynamic");
    const file = join(root, "reel", "src", "reel.ts");
    writeFileSync(
      file,
      `${readFileSync(file, "utf8")}\nexport const later = () => import("./music.cues.json");\n`,
    );
    const reel = await graph(root, "reel");
    const card = reel.cards.find((each) => each.id.startsWith("code:src/reel.ts:"));
    expect(card?.note).toBe("set in code");
    expect(reel.wires.some((wire) => wire.from === card?.id || wire.to === card?.id)).toBe(false);
  });
});
