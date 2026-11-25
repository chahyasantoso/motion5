import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { code } from "./helpers/source-region";

const canvas = fileURLToPath(new URL("../../packages/studio/src/canvas/", import.meta.url));

const NAMED = [
  "aliceblue",
  "aqua",
  "beige",
  "black",
  "blue",
  "brown",
  "coral",
  "crimson",
  "cyan",
  "gold",
  "gray",
  "green",
  "grey",
  "indigo",
  "ivory",
  "lime",
  "magenta",
  "maroon",
  "navy",
  "olive",
  "orange",
  "pink",
  "purple",
  "red",
  "salmon",
  "silver",
  "teal",
  "tomato",
  "violet",
  "white",
  "yellow",
];

const LITERALS = [
  /#[0-9a-fA-F]{3,8}\b/,
  /\brgba?\s*\(/i,
  /\bhsla?\s*\(/i,
  new RegExp(`(["'\`:\\s])(${NAMED.join("|")})(["'\`;\\s,)])`, "i"),
];

function sources(): readonly string[] {
  return readdirSync(canvas).filter((name) => name !== "theme.css");
}

describe("the Studio theme", () => {
  it("keeps every colour literal in theme.css", () => {
    expect(sources().length).toBeGreaterThan(5);
    const found: string[] = [];
    for (const name of sources()) {
      const path = join(canvas, name);
      const text = name.endsWith(".css")
        ? readFileSync(path, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
        : code(path);
      for (const [index, line] of text.split("\n").entries())
        if (name.endsWith(".css") || /["'`]/.test(line) || /^\s*[a-z-]+:/.test(line))
          if (LITERALS.some((literal) => literal.test(line))) found.push(`${name}:${index + 1}`);
    }
    expect(found).toEqual([]);
  });

  it("holds colours in theme.css, so the scan has something to find", () => {
    expect(readFileSync(join(canvas, "theme.css"), "utf8")).toMatch(/#[0-9a-f]{6}/);
  });
});
