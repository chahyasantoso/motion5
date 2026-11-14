import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PART_GROUPS, formatParts, moveParts } from "@gerak/tools/scene";

const CURRENT = {
  fields: ["combine", "combine3d", "lift2d"],
  time: ["span", "timeAt", "elapsedOf"],
  laws: ["ease", "backEase", "springEase", "keyframes", "spring"],
  blends: [
    "mix",
    "mixPoint",
    "mixAngle",
    "mixPose",
    "squashed",
    "mixPose3d",
    "mixPoint3d",
    "squashed3d",
  ],
  paths: ["toCubics", "along", "toCubics3d", "along3d"],
  "follow-through": [
    "trail",
    "trailTurn",
    "velocity",
    "smear",
    "squashFromSpeed",
    "velocity3d",
    "smear3d",
  ],
  events: ["react", "follow", "mergeEvents"],
  randomness: ["seeded"],
  compose: ["sequence", "reversed", "repeated", "lanes", "lane"],
} as const;

const folders: string[] = [];
afterEach(() => {
  for (const dir of folders.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function fixture(laws: string): string {
  const dir = mkdtempSync(join(tmpdir(), "parts-"));
  folders.push(dir);
  const write = (path: string, text: string) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  };
  write("src/index.ts", 'export { half } from "./parts/laws/x";\nexport const LIMIT = 3;\n');
  write("src/parts/laws/x.ts", laws);
  return join(dir, "src/index.ts");
}

describe("moveParts", () => {
  it("lists every building block the hand list named, each under its folder's group", () => {
    const parts = moveParts();
    for (const [group, names] of Object.entries(CURRENT))
      for (const name of names)
        expect(parts.find((part) => part.name === name)?.group, name).toBe(group);
  });

  it("lists only functions and the eases, never a constant or a type", () => {
    const names = moveParts().map(({ name }) => name);
    for (const name of ["VALUE_FIELDS", "UNTIMED", "NO_EVENTS", "drop", "defineMove", "Pose2d"])
      expect(names).not.toContain(name);
  });

  it("prints ease as an object of eases and a part's call with its optional parameters marked", () => {
    const parts = moveParts();
    expect(parts.find(({ name }) => name === "ease")?.call).toContain("ease.<name>");
    expect(parts.find(({ name }) => name === "squashed")?.call).toBe(
      "squashed(squash, weight, anchor?)",
    );
    expect(parts.find(({ name }) => name === "span")?.call).toBe("span(fromMs, toMs)");
  });

  it("gives every building block a one-sentence use, and the groups print in their order", () => {
    for (const part of moveParts()) {
      expect(part.use, part.name).not.toBe("");
      expect(PART_GROUPS).toContain(part.group);
    }
    const headings = formatParts().filter((line) => !line.startsWith("  "));
    expect(headings).toEqual(PART_GROUPS.map((group) => `${group}:`));
  });

  it("lists a function added in a parts folder with no other edit", () => {
    const entry = fixture(
      "/** Half of a number. Used for a midpoint. */\nexport function half(value: number, round?: boolean): number {\n  return round === true ? Math.round(value / 2) : value / 2;\n}\n",
    );
    expect(moveParts(entry)).toEqual([
      { name: "half", group: "laws", call: "half(value, round?)", use: "Half of a number." },
    ]);
  });

  it("refuses a building block with no doc comment, naming it", () => {
    const entry = fixture(
      "export function half(value: number): number {\n  return value / 2;\n}\n",
    );
    expect(() => moveParts(entry)).toThrow(/half/);
  });
});
