import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { code } from "../../../test/repo/helpers/source-region";

const SRC = new URL("../src/", import.meta.url);

/** The only folders core holds; a primitive of a new kind is a decision, not a new folder. */
const FOLDERS = [
  "blend",
  "ease",
  "envelope",
  "events",
  "fields",
  "geometry",
  "measure",
  "path",
  "principles",
  "state",
  "time",
  "utility",
];

describe("core's fixed folders", () => {
  it("holds its source only in its folders and its index", () => {
    const entries = readdirSync(SRC, { withFileTypes: true });
    expect(entries.filter((entry) => entry.isFile()).map((entry) => entry.name)).toEqual([
      "index.ts",
    ]);
    for (const entry of entries.filter((each) => each.isDirectory()))
      expect(FOLDERS, `packages/core/src/${entry.name}`).toContain(entry.name);
  });

  it("exports only from its folders", () => {
    const index = code(new URL("index.ts", SRC));
    const sources = [...index.matchAll(/from\s+"\.\/([^/"]+)\//g)].map((match) => match[1]);
    expect(sources.length).toBeGreaterThan(0);
    for (const folder of sources) expect(FOLDERS).toContain(folder);
    expect(index).not.toMatch(/from\s+"(?!\.\/)/);
  });
});
