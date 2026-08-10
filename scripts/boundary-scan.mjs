import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const coreRoot = join(root, "packages", "core", "src");
const layers = ["contract", "domain", "graph", "runtime"];
const allowedPublicExports = new Set([
  "AUTHORED_SCHEMA_VERSION",
  "DIAGNOSTIC_SEVERITIES",
  "SUPPORTED_TRIGGER_TYPES",
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
  "assertClock",
  "createManualClock",
  "assertInterpolator",
  "assertScheduler",
  "CORE_VERSION",
]);

async function walk(directory) {
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

function relative(path) {
  return path.slice(root.length + 1).replaceAll("\\", "/");
}

function importsBoundary(source) {
  return /(?:from|import)\s*[\"'](?:gsap|react|react-dom|@?motionpath|@?motion5|three|jsdom|happy-dom)(?:[\"'/]|$)/.test(
    source,
  );
}

function importsRenderer(source) {
  return /(?:from|import)\s*[\"'](?:gsap|react|react-dom|node:dom|domino|(?:\.\/|\.\.\/)[^\"']*(?:dom|renderer|react|gsap)[^\"']*)(?:[\"'/]|$)/i.test(
    source,
  );
}

function bannedSymbol(source) {
  return /(?:compatibility|facade|parityMode|rollout|capabilityFlag|observationAlias|groupHost)/i.test(
    source,
  );
}

function extractExportNames(source) {
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

const violations = [];
for (const layer of layers) {
  const directory = join(coreRoot, layer);
  for (const path of await walk(directory)) {
    const source = await readFile(path, "utf8");
    const file = relative(path);
    if (importsBoundary(source) || importsRenderer(source))
      violations.push(`${file}: renderer or engine import`);
    if (bannedSymbol(source)) violations.push(`${file}: banned compatibility symbol`);
  }
}

const indexPath = join(coreRoot, "index.ts");
const indexSource = await readFile(indexPath, "utf8");
for (const name of extractExportNames(indexSource)) {
  if (!allowedPublicExports.has(name))
    violations.push(`packages/core/src/index.ts: public export ${name} is not allow-listed`);
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log("boundary scan passed");
}
