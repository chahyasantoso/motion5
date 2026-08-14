import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function run(command, args, cwd) {
  return execFileAsync(command, args, { cwd, maxBuffer: 2_000_000 });
}

export async function checkPackedConsumer(options = {}) {
  const temp = await mkdtemp(join(root, ".tmp-package-consumer-"));
  try {
    await mkdir(join(temp, "consumer"), { recursive: true });
    await run("npx", ["tsc", "-p", "packages/core/tsconfig.build.json"], root);
    const pack = await run("npm", ["pack", "packages/core", "--pack-destination", temp], root);
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

    await writeFile(
      join(temp, "consumer", "esm.mjs"),
      'import { CORE_VERSION, Engine, validateV5 } from "@motion5/core";\nif (!CORE_VERSION || typeof Engine !== "function" || typeof validateV5 !== "function") throw new Error("Documented ESM import failed");\n',
    );
    await run("node", ["esm.mjs"], join(temp, "consumer"));

    await writeFile(
      join(temp, "consumer", "consumer.ts"),
      'import { CORE_VERSION, validateV5, type ProjectDefinition } from "@motion5/core";\nconst project: ProjectDefinition = { schemaVersion: 5, motions: [] };\nvoid CORE_VERSION; void validateV5(project);\n',
    );
    await run("npx", ["tsc", "--noEmit", "--strict", "--module", "NodeNext", "--moduleResolution", "NodeNext", "--target", "ES2023", "consumer.ts"], join(temp, "consumer"));
    return { ok: true, errors: [] };
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}
