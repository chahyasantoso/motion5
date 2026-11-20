import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COMMANDS } from "../packages/tools/bin/commands.mjs";
import { build } from "./build.mjs";
import { INSTALLABLE_PACKAGES, exportSpecifiers, readManifest } from "./installable-packages.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

/** The core packages needed to make, play and check a 2D piece without modules or the library. */
export const CORE_INSTALL_SET = ["core", "player", "stage", "dom", "react", "tools"];
const CORE_PEERS = ["react", "react-dom", "vite", "playwright-core", "typescript"];
/** Commands an earlier package ran; `gerak` must list none and refuse each. */
const REMOVED_COMMANDS = ["moves", "new-move", "promote", "style"];

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

/** The bin targets and the `dist` and `bin` folders a manifest ships that the package lacks. */
export function missingBinFiles(manifest, exists) {
  const targets = Object.entries(manifest.bin ?? {}).map(([name, file]) => ({
    specifier: `${manifest.name} bin ${name}`,
    file,
  }));
  const folders = (manifest.files ?? [])
    .filter((entry) => entry === "dist" || entry === "bin")
    .map((entry) => ({ specifier: `${manifest.name} files ${entry}`, file: `./${entry}` }));
  return [...targets, ...folders]
    .filter(({ file }) => !exists(file))
    .map(({ specifier, file }) => ({ specifier, error: `missing file ${file}` }));
}

/** The names a help text has no line for. */
export function missingFromHelp(help, names) {
  const lines = help.split(/\r?\n/).map((line) => line.trim());
  return names.filter((name) => !lines.some((line) => line.startsWith(`${name} `)));
}

/** The names from `names` that appear as command lines in `help`. */
export function listedInHelp(help, names) {
  const lines = help.split(/\r?\n/).map((line) => line.trim());
  return names.filter((name) => lines.some((line) => line.startsWith(`${name} `)));
}

/** The exact versions the lockfile installed for the peers a consumer must bring, and their types. */
export function peerVersions(
  lock,
  names = [
    "react",
    "react-dom",
    "three",
    "typescript",
    "@types/react",
    "@types/react-dom",
    "@types/three",
    "vite",
    "playwright-core",
    "@types/node",
  ],
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
        types: ["node"],
      },
      files: ["consumer.ts"],
    }),
  };
}

/** A minimal stage module for the check's one brief. */
const DEMO_PIECE = `import { slide } from "@gerak/moves";
import { beat, box, sceneBuilder } from "@gerak/stage";

const go = beat("go", 2000);

export const skin = { css: '[data-cast="box"] { width: 40px; height: 40px; background: #36c }' };

export default sceneBuilder()
  .element(box("box"))
  .motion(slide({ distance: 300, from: "left" }).in(go));
`;

/** A script, run in the installed project, that serves `pieces/` with the installed tools and fetches the stage page. */
const SERVE_PAGES = `import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "vite";
import { pageServerConfig } from "@gerak/tools/page";
import { pageFiles } from "@gerak/tools/scene";

const root = resolve("pieces");
for (const [name, text] of Object.entries(pageFiles())) writeFileSync(resolve(root, name), text);
mkdirSync(resolve(root, "serveprobe", "src"), { recursive: true });
writeFileSync(resolve(root, "serveprobe", "src", "serveprobe.ts"), ${JSON.stringify(DEMO_PIECE)});
const added = pageServerConfig(root);
const server = await createServer({
  root,
  logLevel: "silent",
  plugins: added.plugins,
  optimizeDeps: added.optimizeDeps,
  server: { ...added.server, port: 0 },
});
try {
  await server.listen();
  const base = server.resolvedUrls.local[0];
  const problems = [];
  for (const path of ["stage.html", "stage.ts", "live.html", "live.ts", "talk.html", "talk.ts"]) {
    const response = await fetch(new URL(path, base));
    const body = await response.text();
    if (response.status !== 200) problems.push(path + " answered " + response.status);
    else if (/Failed to resolve|Pre-transform error/.test(body)) problems.push(path + " has a resolve error");
  }
  console.log(JSON.stringify(problems));
} catch (error) {
  console.error(String(error));
  process.exitCode = 1;
} finally {
  rmSync(resolve(root, "serveprobe"), { recursive: true, force: true });
  // Closing waits on a dependency scan that may never settle, so it gets a few seconds, then the process ends.
  await Promise.race([server.close(), new Promise((done) => setTimeout(done, 5000))]);
  await new Promise((done) => process.stdout.write("", done));
  process.exit(process.exitCode ?? 0);
}
`;

/** The failure of serving the installed project's page files, or undefined when both pages answer cleanly. */
function pageServerError(project) {
  writeFileSync(join(project, "serve-pages.mjs"), SERVE_PAGES);
  const run = spawnSync(process.execPath, ["serve-pages.mjs"], { cwd: project, encoding: "utf8" });
  if (run.status !== 0) return firstErrorLine(run.stderr ?? "");
  const lines = (run.stdout ?? "").trim().split(/\r?\n/);
  try {
    const problems = JSON.parse(lines[lines.length - 1] ?? "[]");
    return problems.length === 0 ? undefined : problems.join("; ");
  } catch {
    return "prints no result";
  }
}

const LIVE_COMPONENT_SCENE = `import type { Time } from "@gerak/core";
import { clockDriver } from "@gerak/dom";
import { drop } from "@gerak/moves";

export const durationMs = 2000;
export const clock = () => clockDriver({ duration: durationMs });
export const scene = (time: Time) => ({
  box: drop({ distance: 200, squash: 0.2 })(time),
});
`;

const LIVE_COMPONENT_TSX = `import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./livecheck-scene";

export function Livecheck() {
  const playing = usePlayer(scene, clock);
  const box = useTarget(playing?.player, "box");
  return (
    <div style={{ position: "relative", width: 640, height: 360 }}>
      <div ref={box} data-cast="box" style={{ width: 40, height: 40, background: "#36c" }} />
    </div>
  );
}
`;

const CHECK_LIVE_DRAG = `import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { withPage } from "@gerak/tools/page";

const root = resolve("pieces");
const brief = join(root, "livecheck", "src");
mkdirSync(brief, { recursive: true });
writeFileSync(join(brief, "livecheck-scene.ts"), ${JSON.stringify(LIVE_COMPONENT_SCENE)});
writeFileSync(join(brief, "livecheck.tsx"), ${JSON.stringify(LIVE_COMPONENT_TSX)});
const errors = [];
try {
  await withPage(
    { page: "live.html?scene=livecheck", width: 1280, height: 720, source: { kind: "serve", root }, clock: "real" },
    async ({ page }) => {
      page.setDefaultTimeout(10000);
      page.on("pageerror", (error) => errors.push("pageerror: " + error.message));
      page.on("response", async (res) => {
        if (res.status() >= 400) {
          const text = await res.text().catch(() => "");
          errors.push("http " + res.status() + " " + res.url() + ": " + text);
        }
      });
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push("console: " + msg.text());
      });
      await page.locator('[data-cast="box"]').waitFor();
      const literal = page.locator('[data-live-number="0.2"]');
      await literal.waitFor();
      const index = await literal.getAttribute("data-live-index");
      const box = await literal.boundingBox();
      if (box === null) throw new Error("live number has no bounding box");
      await page.waitForTimeout(200);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 - 50, box.y + box.height / 2);
      await page.mouse.up();
      const dragged = await page.locator(\`[data-live-index="\${index}"]\`).textContent();
      if (dragged !== "-0.3") throw new Error("expected the drag to give -0.3, got " + dragged);
    },
  );
  if (errors.length > 0) throw new Error(errors.join("; "));
  console.log("ok");
} catch (error) {
  const msg = (error instanceof Error ? error.message : String(error)).replace(/\\r?\\n+/g, " | ");
  console.error("LIVECHECK Error:", msg + (errors.length > 0 ? " [" + errors.join("; ") + "]" : ""));
  process.exitCode = 1;
} finally {
  rmSync(join(root, "livecheck"), { recursive: true, force: true });
}
`;

/** Verifies live.html in an installed project drags a number literal in Chromium. */
function liveDragError(project) {
  writeFileSync(join(project, "check-live-drag.mjs"), CHECK_LIVE_DRAG);
  const run = spawnSync(process.execPath, ["check-live-drag.mjs"], {
    cwd: project,
    encoding: "utf8",
  });
  return run.status === 0 && run.stdout.trim() === "ok"
    ? undefined
    : firstErrorLine(run.stderr || run.stdout);
}

/** The link targets of a markdown text that name a file, without their anchors. */
function fileLinks(text) {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((match) => match[1])
    .filter((link) => !/^[a-z][a-z0-9+.-]*:/i.test(link) && !link.startsWith("#"))
    .map((link) => link.replace(/#.*$/, ""));
}

const READ_WHOLE_BYTES = 20 * 1024;
const READ_WHOLE_PAGES = [
  "node_modules/@gerak/core/docs/core.md",
  "node_modules/@gerak/stage/docs/stage.md",
];

/** The first problem with the installed read-whole pages or the AGENTS.md that names them, or undefined. */
function readWholeError(project, exists = existsSync) {
  for (const page of READ_WHOLE_PAGES) {
    if (!exists(join(project, page))) return `missing ${page}`;
    const size = statSync(join(project, page)).size;
    if (size > READ_WHOLE_BYTES) return `${page} is ${size} bytes, over ${READ_WHOLE_BYTES}`;
  }
  const agents = readFileSync(join(project, "AGENTS.md"), "utf8");
  const unnamed = READ_WHOLE_PAGES.filter((page) => !agents.includes(page));
  return unnamed.length > 0 ? `AGENTS.md does not name ${unnamed.join(", ")}` : undefined;
}

/** Runs `gerak init` in a project holding only a package.json and the installed tarballs; the first failure, or undefined. */
function initError(project, exists = existsSync) {
  const run = sh("npx --no-install gerak init", project);
  if (run.code !== 0) return firstErrorLine(run.out || run.err);
  const skill = ".claude/skills/make-motion/SKILL.md";
  const expected = [
    ...["stage.html", "stage.ts", "live.html", "live.ts", "talk.html", "talk.ts"].map(
      (name) => `pieces/${name}`,
    ),
    skill,
    "AGENTS.md",
    "tsconfig.json",
    ...READ_WHOLE_PAGES,
  ];
  const absent = expected.filter((file) => !exists(join(project, file)));
  if (absent.length > 0) return `missing ${absent.join(", ")}`;
  const entry = JSON.parse(readFileSync(join(project, "package.json"), "utf8")).gerak?.pieces;
  if (entry !== "pieces") return "package.json names no gerak.pieces";
  const whole = readWholeError(project, exists);
  if (whole !== undefined) return whole;
  const links = fileLinks(readFileSync(join(project, skill), "utf8"));
  const broken = links.filter((link) => !exists(resolve(dirname(join(project, skill)), link)));
  if (links.length === 0) return "the skill has no links";
  return broken.length > 0 ? `skill links do not resolve: ${broken.join(", ")}` : undefined;
}

/** Installs a subset of packed tarballs and peers into a fresh folder, returning any install error. */
function installSubset(dir, packages, tarballs, lock, peers) {
  mkdirSync(dir, { recursive: true });
  const deps = Object.fromEntries(
    packages.map((dirName) => [`@gerak/${dirName}`, tarballs[`@gerak/${dirName}`]]),
  );
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "gerak-subset-check",
      private: true,
      type: "module",
      dependencies: deps,
    }),
  );
  const specs = peerVersions(lock, peers).map((spec) => `"${spec}"`);
  const run = sh(`npm install --no-audit --no-fund ${specs.join(" ")}`, dir);
  return run.code === 0 ? undefined : firstErrorLine(run.err);
}

const CORE_PIECE = `import { arcPath, chain, ease, lanes, mix, motion, type Pose2d } from "@gerak/core";
import { beat, box, many, sceneBuilder, shape, type MotionContext } from "@gerak/stage";

const [first, second] = chain([1000, 1000], { overlap: 200 });
const row = lanes([1, 1, 1], 0.25);
const intro = beat("intro", first.to - first.from, { at: first.from });
const follow = beat("follow", second.to - second.from, { at: second.from });
const reveal = beat("reveal", 800, { at: 1400 });

const dot = box("dot");
const bars = many("bars", 3);
const arc = shape(
  "arc",
  arcPath({
    x0: 200,
    y0: 360,
    x1: 440,
    y1: 360,
    rx: 120,
    ry: 120,
    sweep: true,
  }),
);

export const skin = {
  css: [
    '[data-cast="dot"] { width: 40px; height: 40px; border-radius: 50%; background: #36c }',
    '[data-cast^="bars."] { width: 24px; height: 48px; background: #2a9 }',
    '[data-path="arc"] { stroke: #f53; stroke-width: 4; fill: none }',
  ].join("\\n"),
};

export default sceneBuilder({
  length: 3000,
})
  .element(dot)
  .motion(
    motion((time): Pose2d => {
      const p = ease.cubicOut(time.progress);
      return { x: mix(-160, 0, p), opacity: mix(0, 1, p) };
    }).in(intro),
  )
  .element(bars)
  .motion(
    motion(
      (time, context?: MotionContext): Pose2d => ({
        y: mix(60, 0, ease.sineOut(row.of(time, context?.index ?? 0).progress)),
      }),
    ).in(follow),
  )
  .element(arc)
  .motion(
    motion((time): Pose2d => ({ drawn: mix(0, 1, ease.quadOut(time.progress)) })).in(reveal),
  );
`;

function jsonOf(run) {
  try {
    const lines = run.out.trim().split(/\r?\n/);
    return JSON.parse(lines[lines.length - 1] ?? "");
  } catch {
    return undefined;
  }
}

/** Verifies the core-only install set without modules or the library. */
function coreOnlyChecks(dir, tarballs, lock, check) {
  const installError = installSubset(dir, CORE_INSTALL_SET, tarballs, lock, CORE_PEERS);
  check("core-only install", installError);
  if (installError !== undefined) return;
  const scope = join(dir, "node_modules", "@gerak");
  const installed = existsSync(scope) ? readdirSync(scope).sort() : [];
  const expected = [...CORE_INSTALL_SET].sort();
  check(
    "core-only node_modules/@gerak",
    JSON.stringify(installed) === JSON.stringify(expected)
      ? undefined
      : `found ${installed.join(", ")} instead of ${expected.join(", ")}`,
  );
  check(
    "core-only no three peer",
    existsSync(join(dir, "node_modules", "three")) ? "three was installed" : undefined,
  );
  const help = sh("npx --no-install gerak --help", dir);
  const missing = missingFromHelp(help.out, Object.keys(COMMANDS));
  const extra = listedInHelp(help.out, REMOVED_COMMANDS);
  check(
    "core-only gerak --help",
    help.code !== 0
      ? firstErrorLine(help.err)
      : missing.length > 0
        ? `leaves out ${missing.join(", ")}`
        : extra.length > 0
          ? `lists removed commands: ${extra.join(", ")}`
          : undefined,
  );
  for (const command of REMOVED_COMMANDS) {
    const run = sh(`npx --no-install gerak ${command}`, dir);
    check(
      `core-only gerak ${command} refused`,
      run.code !== 0 && new RegExp(`Unknown command ${command}`).test(run.out)
        ? undefined
        : `expected unknown command, got ${run.code}: ${firstErrorLine(run.out || run.err)}`,
    );
  }
  const init = initError(dir);
  check("core-only gerak init", init);
  if (init === undefined) {
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    const unmentioned = ["moves", "rig", "rig-three", "physics", "rapier", "three"].filter((name) =>
      agents.includes(`@gerak/${name}`),
    );
    check(
      "core-only AGENTS.md",
      unmentioned.length > 0 ? `names uninstalled packages: ${unmentioned.join(", ")}` : undefined,
    );
  }
  check("core-only pages served from pieces/", pageServerError(dir));
  const created = sh("npx --no-install gerak new demo", dir);
  const demoFile = join(dir, "pieces", "demo", "src", "demo.ts");
  check(
    "core-only gerak new",
    created.code === 0 && existsSync(demoFile)
      ? undefined
      : firstErrorLine(created.out || created.err),
  );
  const tscAfterNew = sh("npx --no-install tsc --noEmit", dir);
  check(
    "core-only tsc after new",
    tscAfterNew.code === 0 ? undefined : firstErrorLine(tscAfterNew.out || tscAfterNew.err),
  );
  writeFileSync(demoFile, CORE_PIECE);
  const tscOnPiece = sh("npx --no-install tsc --noEmit", dir);
  check(
    "core-only tsc on piece",
    tscOnPiece.code === 0 ? undefined : firstErrorLine(tscOnPiece.out || tscOnPiece.err),
  );
  const reviewed = sh("npx --no-install gerak review pieces/demo/src/demo.ts", dir);
  const reviewJson = jsonOf(reviewed);
  check(
    "core-only gerak review",
    reviewed.code === 0 && reviewJson?.kind === "reviewed" && reviewJson.findings?.length === 0
      ? undefined
      : firstErrorLine(reviewed.out || reviewed.err),
  );
  const framesDir = join(dir, "frames-core");
  const framed = sh(
    'npx --no-install gerak frames "stage.html?piece=demo" --at 0,1200,3000 --out frames-core',
    dir,
  );
  const frameJson = jsonOf(framed);
  const renderedFiles = ["frame-000000.png", "frame-001200.png", "frame-003000.png", "sheet.png"];
  const absent = renderedFiles.filter(
    (file) => !existsSync(join(framesDir, file)) || statSync(join(framesDir, file)).size === 0,
  );
  check(
    "core-only gerak frames",
    framed.code === 0 &&
      frameJson?.kind === "captured" &&
      frameJson.pageErrors?.length === 0 &&
      absent.length === 0
      ? undefined
      : absent.length > 0
        ? `missing ${absent.join(", ")}`
        : firstErrorLine(framed.out || framed.err),
  );
}

/** Runs `gerak init` and `gerak new --three` beside the full install, then `tsc`; the first failure, or undefined. */
function threeTscError(work, project) {
  const dir = join(work, "three");
  mkdirSync(dir);
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name: "three-check", private: true, type: "module" }),
  );
  symlinkSync(join(project, "node_modules"), join(dir, "node_modules"), "junction");
  for (const command of ["gerak init", "gerak new spin --three", "tsc --noEmit"]) {
    const run = sh(`npx --no-install ${command}`, dir);
    if (run.code !== 0) return `${command}: ${firstErrorLine(run.out || run.err)}`;
  }
  return undefined;
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
  mkdirSync(join(project, "pieces"));
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
        gerak: { pieces: "pieces" },
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
    const check = (label, failure) => {
      if (failure !== undefined) failed += 1;
      log(formatResult(label, failure));
    };
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
    const installed = join(project, "node_modules", "@gerak", "tools");
    const absent = missingBinFiles(readManifest("tools"), (file) =>
      existsSync(join(installed, file)),
    );
    for (const { specifier, error } of absent) log(formatResult(specifier, error));
    failed += absent.length;
    if (absent.length === 0) log(formatResult("bin and files"));
    const names = Object.keys(COMMANDS);
    const help = sh("npx --no-install gerak --help", project);
    const left = missingFromHelp(help.out, names);
    const helpError =
      help.code !== 0
        ? firstErrorLine(help.err)
        : left.length > 0
          ? `help leaves out ${left.join(", ")}`
          : undefined;
    if (helpError !== undefined) failed += 1;
    log(formatResult("gerak --help", helpError));
    const removed = listedInHelp(help.out, REMOVED_COMMANDS);
    const removedError =
      removed.length > 0 ? `help lists removed commands: ${removed.join(", ")}` : undefined;
    if (removedError !== undefined) failed += 1;
    log(formatResult("gerak --help lists no removed command", removedError));
    const threeError = threeTscError(work, project);
    if (threeError !== undefined) failed += 1;
    log(formatResult("tsc after new --three", threeError));
    const second = join(work, "second");
    mkdirSync(second);
    writeFileSync(
      join(second, "package.json"),
      JSON.stringify({
        name: "gerak-init-check",
        private: true,
        type: "module",
        dependencies: files,
      }),
    );
    const secondInstall = sh("npm install --no-audit --no-fund --legacy-peer-deps", second);
    const initFailure =
      secondInstall.code !== 0 ? firstErrorLine(secondInstall.err) : initError(second);
    if (initFailure !== undefined) failed += 1;
    log(formatResult("gerak init", initFailure));
    const pagesError = pageServerError(project);
    if (pagesError !== undefined) failed += 1;
    log(formatResult("pages served from pieces/", pagesError));
    coreOnlyChecks(join(work, "core-only"), files, lock, check);
    check("live.html drags a number", liveDragError(project));
    return failed === 0 ? 0 : 1;
  } finally {
    if (keep) log(`kept ${work}`);
    else rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = packCheck({ keep: process.argv.includes("--keep") });
}
