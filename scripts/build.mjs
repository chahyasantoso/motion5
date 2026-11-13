import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INSTALLABLE_PACKAGES } from "./installable-packages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");
const RELATIVE = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)(["'])(\.{1,2}\/[^"']*)\2/g;

/** Source imports omit extensions; Node needs them, so each relative specifier names its emitted file. */
export function withExtensions(text, directory, exists = existsSync) {
  return text.replace(RELATIVE, (whole, lead, quote, specifier) => {
    if (/\.(js|json|css)$/.test(specifier)) return whole;
    const target = exists(join(directory, `${specifier}.js`))
      ? `${specifier}.js`
      : `${specifier.replace(/\/$/, "")}/index.js`;
    return `${lead}${quote}${target}${quote}`;
  });
}

function emitted(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return emitted(path);
    return /\.(js|d\.ts)$/.test(entry.name) ? [path] : [];
  });
}

/** Builds each installable package into its dist/ with its tsconfig.build.json, dependencies first. */
export function build(directories = INSTALLABLE_PACKAGES, log = console.log) {
  for (const directory of directories) {
    const packageRoot = `${root}packages/${directory}`;
    rmSync(`${packageRoot}/dist`, { recursive: true, force: true });
    const run = spawnSync(process.execPath, [tsc, "-p", `${packageRoot}/tsconfig.build.json`], {
      cwd: root,
      encoding: "utf8",
    });
    if (run.status !== 0) {
      log(`FAIL build ${directory}`);
      log(`${run.stdout ?? ""}${run.stderr ?? ""}`);
      return 1;
    }
    for (const file of emitted(`${packageRoot}/dist`)) {
      const text = readFileSync(file, "utf8");
      const next = withExtensions(text, dirname(file));
      if (next !== text) writeFileSync(file, next);
    }
    log(`PASS build ${directory}`);
  }
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exitCode = build();
