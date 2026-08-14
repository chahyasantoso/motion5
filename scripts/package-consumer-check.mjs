import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const core = join(root, "packages", "core");

async function run(command, args, cwd) {
  return execFileAsync(command, args, { cwd, maxBuffer: 2_000_000 });
}
async function rewriteEsmImports(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await rewriteEsmImports(path);
    else if (entry.name.endsWith(".js")) {
      const source = await readFile(path, "utf8");
      const fixed = source.replace(/(from\s+["']|import\(\s*["'])(\.[^"']+?)(["'])/g, (full, prefix, specifier, suffix) => {
        if (/\.(?:js|mjs|cjs|json)$/.test(specifier)) return full;
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
    // The current TS source is authored with bundler-style extensionless imports. Before
    // packing, normalize only the temporary emitted artifact to the explicit .js specifiers
    // required by Node's ESM resolver. This keeps the consumer test honest without changing
    // source/runtime boundaries or adding a production dependency in this slice.
    await rewriteEsmImports(join(core, "dist"));
    const pack = await run("npm", ["pack", "--pack-destination", temp], core);
    const tarball = pack.stdout.trim().split("\n").at(-1);
    if (!tarball) return { ok: false, errors: ["Core package tarball was not produced"] };
    const packagePath = join(temp, tarball);
    const packageJson = {
      name: "motion5-clean-consumer",
      private: true,
      type: "module",
      dependencies: { "@motion5/core": `file:${packagePath}` },
    };
    await writeFile(join(temp, "consumer", "package.json"), JSON.stringify(packageJson, null, 2));
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
