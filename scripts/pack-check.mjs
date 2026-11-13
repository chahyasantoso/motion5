import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "./build.mjs";
import { INSTALLABLE_PACKAGES, exportSpecifiers, readManifest } from "./installable-packages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

/** Every import specifier the installable packages declare, in build order. */
export function allSpecifiers(directories = INSTALLABLE_PACKAGES, read = readManifest) {
  return directories.flatMap((directory) => exportSpecifiers(read(directory)));
}

/** One line per specifier: PASS, or FAIL with the first line of the error. */
export function formatResult(specifier, error) {
  return error === undefined ? `PASS ${specifier}` : `FAIL ${specifier}: ${error}`;
}

/** The first line of a failed import that names the error, else the first non-empty line. */
export function firstErrorLine(stderr) {
  const lines = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  return lines.find((line) => /Error/.test(line)) ?? lines[0] ?? "no output";
}

/** Exports whose declared files are absent from the package, as FAIL-able entries by specifier. */
export function missingExportFiles(manifest, exists) {
  return Object.entries(manifest.exports).flatMap(([subpath, target]) => {
    const specifier = subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`;
    return [target.default, target.types]
      .filter((file) => !exists(file))
      .map((file) => ({ specifier, error: `missing file ${file}` }));
  });
}

/** The exact versions the lockfile installed for the peers a consumer must bring, and their types. */
export function peerVersions(
  lock,
  names = ["react", "react-dom", "three", "typescript", "@types/react", "@types/three"],
) {
  return names.map((name) => {
    const version = lock.packages?.[`node_modules/${name}`]?.version;
    if (version === undefined) throw new TypeError(`package-lock.json has no ${name}`);
    return `${name}@${version}`;
  });
}

function sh(command, cwd) {
  const run = spawnSync(command, { cwd, encoding: "utf8", shell: true });
  return { code: run.status ?? 1, out: `${run.stdout ?? ""}`, err: `${run.stderr ?? ""}` };
}

function fileSpec(path) {
  return `file:${path.replace(/\\/g, "/")}`;
}

/** A consumer's module importing every export, and its strict tsconfig, for `tsc` to check. */
export function typeCheckFiles(specifiers) {
  const lines = specifiers.map((specifier, index) => `import * as m${index} from "${specifier}";`);
  lines.push(`export const all = [${specifiers.map((_, index) => `m${index}`).join(", ")}];`);
  return {
    "consumer.ts": `${lines.join("\n")}\n`,
    "tsconfig.json": JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        module: "nodenext",
        moduleResolution: "nodenext",
        target: "es2022",
        lib: ["esnext", "dom", "dom.iterable"],
        types: [],
      },
      files: ["consumer.ts"],
    }),
  };
}

/** Packs every package, installs the tarballs into an empty project, imports each export and
 * type-checks a consumer of them all. */
export function packCheck({ keep = false, log = console.log } = {}) {
  if (build(INSTALLABLE_PACKAGES, () => undefined) !== 0) {
    log("FAIL build");
    return 1;
  }
  const work = mkdtempSync(join(tmpdir(), "gerak-pack-"));
  const tarballs = join(work, "tarballs");
  const project = join(work, "project");
  mkdirSync(tarballs);
  mkdirSync(project);
  try {
    const files = {};
    for (const directory of INSTALLABLE_PACKAGES) {
      const packageRoot = join(root, "packages", directory);
      if (!existsSync(join(packageRoot, "LICENSE"))) log(`WARN ${directory}: no LICENSE file`);
      const manifest = readManifest(directory);
      const missing = missingExportFiles(manifest, (file) => existsSync(join(packageRoot, file)));
      for (const { specifier, error } of missing) log(formatResult(specifier, error));
      if (missing.length > 0) return 1;
      const pack = sh(`npm pack --silent --pack-destination "${tarballs}"`, packageRoot);
      if (pack.code !== 0) {
        log(`FAIL pack ${directory}: ${firstErrorLine(pack.err)}`);
        return 1;
      }
      files[manifest.name] = fileSpec(join(tarballs, pack.out.trim().split(/\r?\n/).pop()));
    }
    const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
    writeFileSync(
      join(project, "package.json"),
      JSON.stringify({
        name: "gerak-pack-check",
        private: true,
        type: "module",
        dependencies: files,
      }),
    );
    const specs = peerVersions(lock).map((spec) => `"${spec}"`);
    const install = sh(`npm install --no-audit --no-fund ${specs.join(" ")}`, project);
    if (install.code !== 0) {
      log(`FAIL install: ${firstErrorLine(install.err)}`);
      return 1;
    }
    let failed = 0;
    for (const specifier of allSpecifiers()) {
      const code = `await import(${JSON.stringify(specifier)})`;
      const run = spawnSync(process.execPath, ["--input-type=module", "-e", code], {
        cwd: project,
        encoding: "utf8",
      });
      const failure = run.status === 0 ? undefined : firstErrorLine(run.stderr ?? "");
      if (failure !== undefined) failed += 1;
      log(formatResult(specifier, failure));
    }
    for (const [name, text] of Object.entries(typeCheckFiles(allSpecifiers())))
      writeFileSync(join(project, name), text);
    const types = sh("npx --no-install tsc -p tsconfig.json", project);
    if (types.code !== 0) failed += 1;
    log(
      formatResult("types", types.code === 0 ? undefined : firstErrorLine(types.out || types.err)),
    );
    return failed === 0 ? 0 : 1;
  } finally {
    if (keep) log(`kept ${work}`);
    else rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = packCheck({ keep: process.argv.includes("--keep") });
}
