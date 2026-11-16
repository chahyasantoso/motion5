import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { pageFiles } from "@gerak/tools/scene";

const PIECES = fileURLToPath(new URL("../../../apps/pieces/", import.meta.url));
const KEYS = ["live.html", "live.ts", "stage.html", "stage.ts", "talk.html", "talk.ts"];

describe("the page files", () => {
  it("are the six a pieces folder holds", () => {
    expect(Object.keys(pageFiles()).sort()).toEqual(KEYS);
  });

  it("each entry imports only the tools' pages", () => {
    for (const key of KEYS.filter((name) => name.endsWith(".ts"))) {
      const text = pageFiles()[key] ?? "";
      const specifiers = [...text.matchAll(/from\s+"([^"]+)"/g)].map((match) => match[1]);
      expect(specifiers, key).toEqual(["@gerak/tools/pages"]);
    }
  });

  it("each page loads the entry of its own name", () => {
    for (const name of ["stage", "live", "talk"])
      expect(pageFiles()[`${name}.html`]).toContain(`src="/${name}.ts"`);
  });

  it("are what this repository's pieces folder holds, byte for byte", () => {
    for (const key of KEYS)
      expect(readFileSync(`${PIECES}${key}`, "utf8"), key).toBe(pageFiles()[key]);
  });
});
