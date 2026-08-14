import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const core = join(root, "packages", "core");

async function run(command, args, cwd) {
  return execFileAsync(command, args, { cwd, maxBuffer: 2_000_000, timeout: 30_000 });
}
async function rewriteImports(directory, extension) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await rewriteImports(path, extension);
    else if (entry.name.endsWith(extension)) {
      const source = await readFile(path, "utf8");
      const fixed = source.replace(/((?:from|import)\s*\(?\s*["'])(\.[^"']+?)(["'])/g, (full, prefix, specifier, suffix) => {
        if (/\.(?:js|mjs|cjs|json|d\.ts|d\.mts|d\.cts)$/.test(specifier)) return full;
        return `${prefix}${specifier}.js${suffix}`;
      });
      if (fixed !== source) await writeFile(path, fixed);
    }
  }
}

export async function checkPackedConsumer(options = {}) {
  const temp = await mkdtemp(join(root, ".tmp-package-consumer-"));
  try {
    await mkdir(join(temp, "consumer"), { recursive: true });
    await run("npx", ["tsc", "-p", "tsconfig.build.json"], core);
    await rewriteImports(join(core, "dist"), ".js");
    await rewriteImports(join(core, "dist"), ".d.ts");
    const pack = await run("npm", ["pack", "--pack-destination", temp], core);
    const tarball = pack.stdout.trim().split("\n").at(-1);
    if (!tarball) return { ok: false, errors: ["Core package tarball was not produced"] };
    const packagePath = join(temp, tarball);
    await writeFile(join(temp, "consumer", "package.json"), JSON.stringify({ name: "motion5-clean-consumer", private: true, type: "module", dependencies: { "@motion5/core": `file:${packagePath}` } }, null, 2));
    await run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], join(temp, "consumer"));
    if (options.consumer === "deep-import") {
      try {
        await run("node", ["--input-type=module", "-e", 'await import("@motion5/core/dist/runtime/graph-runtime.js")'], join(temp, "consumer"));
        return { ok: false, errors: ["Deep import unexpectedly succeeded"] };
      } catch {
        return { ok: false, errors: ["Deep import is not part of the documented package surface"] };
      }
    }
    await writeFile(join(temp, "consumer", "esm.mjs"), 'import { CORE_VERSION, Engine, validateV5 } from "@motion5/core";\nif (!CORE_VERSION || typeof Engine !== "function" || typeof validateV5 !== "function") throw new Error("Documented ESM import failed");\n');
    await run("node", ["esm.mjs"], join(temp, "consumer"));
    await writeFile(join(temp, "consumer", "consumer.ts"), 'import { CORE_VERSION, validateV5, type ProjectDefinition } from "@motion5/core";\nconst project: ProjectDefinition = { schemaVersion: 5, motions: [] };\nvoid CORE_VERSION; void validateV5(project);\n');
    await run("npx", ["tsc", "--noEmit", "--strict", "--module", "NodeNext", "--moduleResolution", "NodeNext", "--target", "ES2023", "consumer.ts"], join(temp, "consumer"));
    return { ok: true, errors: [] };
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}
