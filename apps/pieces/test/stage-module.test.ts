import { describe, expect, it } from "vitest";
import { loadStageModule, pickPieceFile } from "../src/stage-module";

const KEYS = [
  "/showreel/src/showreel-c.ts",
  "/penguin/src/penguin.ts",
  "/penguin/src/penguin-scene.ts",
  "/night/src/night-a-scene.ts",
  "/other/src/penguin.ts",
];

describe("the stage module lookup", () => {
  it("finds the one file with the name's basename in any brief", () => {
    expect(pickPieceFile(KEYS, "showreel-c.ts")).toEqual({
      kind: "found",
      path: "/showreel/src/showreel-c.ts",
    });
    expect(pickPieceFile(KEYS, "night-a-scene.ts")).toEqual({
      kind: "found",
      path: "/night/src/night-a-scene.ts",
    });
  });

  it("reports no file for a name no brief holds, and never matches part of a basename", () => {
    expect(pickPieceFile(KEYS, "nothing.ts")).toEqual({ kind: "none" });
    expect(pickPieceFile(KEYS, "scene.ts")).toEqual({ kind: "none" });
    expect(pickPieceFile(KEYS, "c.ts")).toEqual({ kind: "none" });
  });

  it("refuses two pieces of one name, naming both paths", () => {
    expect(pickPieceFile(KEYS, "penguin.ts")).toEqual({
      kind: "ambiguous",
      paths: ["/other/src/penguin.ts", "/penguin/src/penguin.ts"],
    });
  });
});

describe("the stage module of a name", () => {
  it("says why there is none", async () => {
    expect(await loadStageModule("no-such-piece")).toContain(
      'No stage piece named "no-such-piece"',
    );
    expect(await loadStageModule("Bad Name")).toContain("is not a piece name");
  });
});
