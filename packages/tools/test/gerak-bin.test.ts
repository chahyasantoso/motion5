import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COMMANDS } from "../bin/commands.mjs";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const binFolder = fileURLToPath(new URL("../bin/", import.meta.url));
const gerak = `${binFolder}gerak.mjs`;

function run(file: string, args: string[]) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd: repoRoot, encoding: "utf8" });
  return { code: result.status, out: `${result.stdout}${result.stderr}`, stdout: result.stdout };
}

describe("the gerak bin", () => {
  it("lists every command in its help and exits 0", () => {
    for (const flag of ["--help", "-h"]) {
      const help = run(gerak, [flag]);
      expect(help.code).toBe(0);
      expect(help.out).toContain("usage: gerak <command> [args]");
      for (const name of Object.keys(COMMANDS)) expect(help.out).toContain(`  ${name}  `);
    }
  });

  it("lists only its own commands, none for moves, and refuses one", () => {
    const help = run(gerak, ["--help"]);
    const listed = [...help.out.matchAll(/^ {2}(\S+) {2}/gm)].map((match) => match[1]);
    expect(listed).toEqual(Object.keys(COMMANDS));
    for (const name of ["moves", "new-move", "promote", "style"]) {
      expect(listed).not.toContain(name);
      const refused = run(gerak, [name]);
      expect(refused.code).not.toBe(0);
      expect(refused.out).toContain(`Unknown command ${name}.`);
    }
  });

  it("prints the usage and exits 1 when given no command", () => {
    const none = run(gerak, []);
    expect(none.code).toBe(1);
    expect(none.out).toContain("usage: gerak <command> [args]");
  });

  it("names every motion script in the folder, and every named file exists", () => {
    const scripts = readdirSync(binFolder).filter(
      (file) => /^motion-.+\.mjs$/.test(file) && file !== "motion-frames-check.mjs",
    );
    const named = Object.values(COMMANDS).map((command) => command.file);
    expect([...named].sort()).toEqual([...scripts].sort());
    for (const file of named) expect(existsSync(`${binFolder}${file}`), file).toBe(true);
  });

  it("refuses an unknown command and exits 1", () => {
    const unknown = run(gerak, ["no-such-command"]);
    expect(unknown.code).toBe(1);
    expect(unknown.out).toContain("Unknown command no-such-command.");
  });

  it("names the @gerak package a missing command would come from", () => {
    const missing = run(gerak, ["no-such-command"]);
    expect(missing.out).toContain("No installed package @gerak/no-such-command adds it.");
  });

  it("runs a command with the output its own script gives", () => {
    const viaBin = run(gerak, ["points"]);
    const direct = run(`${binFolder}motion-points.mjs`, []);
    expect(viaBin.out.length).toBeGreaterThan(0);
    expect(viaBin.code).toBe(direct.code);
    expect(viaBin.out).toBe(direct.out);
  });

  it("resolves through the workspace bin link", () => {
    const result = spawnSync("npx --no-install gerak --help", {
      cwd: repoRoot,
      encoding: "utf8",
      shell: true,
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("usage: gerak <command> [args]");
  });
});
