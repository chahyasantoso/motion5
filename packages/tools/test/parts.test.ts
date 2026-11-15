import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PART_GROUPS, formatParts, moveParts } from "@gerak/tools/scene";

const CURRENT = {
  time: ["span", "timeAt", "elapsedOf"],
  ease: ["ease", "backEase", "springEase"],
  dynamics: ["spring"],
  path: ["along", "along3d"],
  geometry: ["toCubics", "toCubics3d"],
  blend: ["mix", "mixPoint", "mixAngle", "mixPose", "mixPose3d", "mixPoint3d"],
  coupling: ["squashed", "squashed3d", "squashFromSpeed", "smear", "smear3d"],
  signal: ["trail", "trailTurn", "velocity", "velocity3d", "react", "follow", "keyframes"],
  utility: ["mergeEvents", "seeded"],
  fields: ["combine", "combine3d", "lift2d"],
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
  write("src/index.ts", 'export { half } from "./parts/envelope/x";\nexport const LIMIT = 3;\n');
  write("src/parts/envelope/x.ts", laws);
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
      { name: "half", group: "envelope", call: "half(value, round?)", use: "Half of a number." },
    ]);
  });

  it("refuses a building block with no doc comment, naming it", () => {
    const entry = fixture(
      "export function half(value: number): number {\n  return value / 2;\n}\n",
    );
    expect(() => moveParts(entry)).toThrow(/half/);
  });
});
