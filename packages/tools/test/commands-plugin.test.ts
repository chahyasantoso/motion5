import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { COMMANDS, listCommands } from "../bin/commands.mjs";
import { reviewSceneFile } from "../src/scene/review";

let dir = "";

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "gerak-plugin-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function installPackage(
  name: string,
  gerak: Record<string, string>,
  files: Record<string, string>,
) {
  const folder = join(dir, "node_modules", "@gerak", name);
  mkdirSync(join(folder, "bin"), { recursive: true });
  writeFileSync(
    join(folder, "package.json"),
    JSON.stringify({ name: `@gerak/${name}`, version: "0.1.0", type: "module", gerak }),
  );
  for (const [file, text] of Object.entries(files)) writeFileSync(join(folder, file), text);
}

const declaring = (...names: string[]): string =>
  `export const COMMANDS = {${names.map((name) => `${JSON.stringify(name)}: { file: "run-${name}.mjs", summary: "the ${name} command" }`).join(",")}};`;

describe("commands an installed package declares", () => {
  it("lists only this package's own without any installed", async () => {
    const listed = await listCommands({ starts: [dir] });
    expect(Object.keys(listed)).toEqual(Object.keys(COMMANDS));
    expect(listed.extra).toBeUndefined();
  });

  it("adds each installed package's list, its files relative to its module", async () => {
    installPackage(
      "lib",
      { commands: "./bin/commands.mjs" },
      { "bin/commands.mjs": declaring("extra") },
    );
    const listed = await listCommands({ starts: [dir] });
    expect(listed.extra?.summary).toBe("the extra command");
    expect(listed.extra?.from).toBe("@gerak/lib");
    expect(listed.extra?.url).toMatch(/node_modules\/@gerak\/lib\/bin\/run-extra\.mjs$/);
    expect(Object.keys(listed)).toEqual([...Object.keys(COMMANDS), "extra"]);
  });

  it("finds a package from a folder below the one holding node_modules", async () => {
    installPackage(
      "lib",
      { commands: "./bin/commands.mjs" },
      { "bin/commands.mjs": declaring("extra") },
    );
    const below = join(dir, "a", "b");
    mkdirSync(below, { recursive: true });
    expect(Object.keys(await listCommands({ starts: [below] }))).toContain("extra");
  });

  it("refuses a name two packages declare, naming both", async () => {
    installPackage(
      "one",
      { commands: "./bin/commands.mjs" },
      { "bin/commands.mjs": declaring("extra") },
    );
    installPackage(
      "two",
      { commands: "./bin/commands.mjs" },
      { "bin/commands.mjs": declaring("extra") },
    );
    await expect(listCommands({ starts: [dir] })).rejects.toThrow(
      'The command "extra" is declared by both @gerak/one and @gerak/two.',
    );
  });

  it("refuses a name this package already runs", async () => {
    installPackage(
      "one",
      { commands: "./bin/commands.mjs" },
      { "bin/commands.mjs": declaring("check") },
    );
    await expect(listCommands({ starts: [dir] })).rejects.toThrow(
      'The command "check" is declared by both @gerak/tools and @gerak/one.',
    );
  });
});

describe("review findings an installed package declares", () => {
  const scene =
    "export const durationMs = 1000;\nexport const scene = () => ({ ball: { y: 0 } });\n";

  async function reviewWith(files: Record<string, string>): Promise<unknown> {
    installPackage("lib", { review: "./bin/review.mjs" }, files);
    mkdirSync(join(dir, "tour", "src"), { recursive: true });
    const file = join(dir, "tour", "src", "ball.ts");
    writeFileSync(file, scene);
    const before = process.env.INIT_CWD;
    process.env.INIT_CWD = dir;
    try {
      return await reviewSceneFile({
        file,
        hold: 500,
        jump: 1000,
        turn: 150,
        ratio: 1.5,
        budget: 8,
      });
    } finally {
      if (before === undefined) delete process.env.INIT_CWD;
      else process.env.INIT_CWD = before;
    }
  }

  it("adds the finder's lines to the review", async () => {
    const result = await reviewWith({
      "bin/review.mjs": `export const prepare = async () => ({ kind: "ready", find: ({ module, samples }) => [\`seen \${Object.keys(module).includes("scene")} \${samples.length > 0}\`] });`,
    });
    expect(result).toMatchObject({ findings: expect.arrayContaining(["seen true true"]) });
  });

  it("returns a refusal as the review's usage message", async () => {
    const result = await reviewWith({
      "bin/review.mjs": `export const prepare = async () => ({ kind: "refused", message: "no cards" });`,
    });
    expect(result).toEqual({ kind: "usage", message: "no cards" });
  });
});
