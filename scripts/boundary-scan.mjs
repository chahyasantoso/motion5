import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const coreLayers = ["contract", "domain", "graph", "runtime", "ports"];
const allowedPublicExports = new Set([
  "AUTHORED_SCHEMA_VERSION",
  "DIAGNOSTIC_SEVERITIES",
  "SUPPORTED_TRIGGER_TYPES",
  "AuthoredProperty",
  "AuthoredStop",
  "Diagnostic",
  "DiagnosticSeverity",
  "MigrationDiagnostic",
  "MotionDefinition",
  "ObservationDefinition",
  "ProjectDefinition",
  "TrackDefinition",
  "TriggerType",
  "migrateV4ToV5",
  "MigrationResult",
  "validateV5",
  "ValidationResult",
  "parseGolden",
  "serializeGolden",
  "GoldenFixture",
  "GoldenValidationFixture",
  "Engine",
  "PluginRegistry",
  "PluginDefinition",
  "ResolvedPlugins",
  "assertClock",
  "createManualClock",
  "assertInterpolator",
  "InterpolationTimeline",
  "Interpolator",
  "assertScheduler",
  "CORE_VERSION",
]);

export async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if ([".ts", ".tsx", ".js", ".mjs"].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

function relative(path, scanRoot) {
  return path.slice(scanRoot.length + 1).replaceAll("\\", "/");
}

export function importsBoundary(source) {
  return /(?:from|import)\s*["'](?:gsap|react|react-dom|@?motionpath|@?motion5|three|jsdom|happy-dom)(?:["'/]|$)/.test(
    source,
  );
}

export function importsRenderer(source) {
  return /(?:from|import)\s*["'](?:gsap|react|react-dom|node:dom|domino|(?:\.\/|\.\.\/)[^"']*(?:^|\/)\b(?:dom|renderer|react|gsap)\b)["'/]/i.test(
    source,
  );
}

export function importsCoreInternals(source) {
  return /(?:from|import)\s*["'][^"']*(?:packages\/core\/src|\.\.\/\.\.\/core\/src)(?:["'/]|$)/.test(
    source,
  );
}

export function bannedSymbol(source) {
  return /(?:compatibility|facade|parityMode|rollout|capabilityFlag|observationAlias|groupHost)/i.test(
    source,
  );
}

export function extractExportNames(source) {
  const names = [];
  for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
    for (const item of match[1].split(",")) {
      const name = item.trim().split(/\s+as\s+/)[1] ?? item.trim().split(/\s+/)[0];
      if (name) names.push(name);
    }
  }
  for (const match of source.matchAll(
    /export\s+(?:const|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g,
  ))
    names.push(match[1]);
  return names;
}

async function scanFiles(directory, scanRoot, violations) {
  for (const path of await walk(directory)) {
    const source = await readFile(path, "utf8");
    const file = relative(path, scanRoot);
    if (importsBoundary(source) || importsRenderer(source))
      violations.push(`${file}: renderer or engine import`);
    if (bannedSymbol(source)) violations.push(`${file}: banned compatibility symbol`);
  }
}

async function discoverConsumerPackages(scanRoot) {
  let entries;
  try {
    entries = await readdir(join(scanRoot, "packages"), { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  return entries.filter((entry) => entry.isDirectory() && entry.name !== "core").map((entry) => entry.name);
}

export async function scan(scanRoot = root) {
  const violations = [];
  for (const layer of coreLayers)
    await scanFiles(join(scanRoot, "packages", "core", "src", layer), scanRoot, violations);
  const enginePath = join(scanRoot, "packages", "core", "src", "engine.ts");
  try {
    const source = await readFile(enginePath, "utf8");
    if (importsBoundary(source) || importsRenderer(source))
      violations.push("packages/core/src/engine.ts: renderer or engine import");
    if (bannedSymbol(source))
      violations.push("packages/core/src/engine.ts: banned compatibility symbol");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  for (const packageName of await discoverConsumerPackages(scanRoot)) {
    const directory = join(scanRoot, "packages", packageName, "src");
    for (const path of await walk(directory)) {
      const source = await readFile(path, "utf8");
      const file = relative(path, scanRoot);
      if (importsCoreInternals(source)) violations.push(`${file}: core source-internal import`);
    }
  }

  const indexPath = join(scanRoot, "packages", "core", "src", "index.ts");
  let indexSource = "";
  try {
    indexSource = await readFile(indexPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  for (const name of extractExportNames(indexSource)) {
    if (!allowedPublicExports.has(name))
      violations.push(`packages/core/src/index.ts: public export ${name} is not allow-listed`);
  }
  return violations;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await scan();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("boundary scan passed");
  }
}
