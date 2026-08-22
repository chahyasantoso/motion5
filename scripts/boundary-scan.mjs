import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const coreLayers = ["contract", "domain", "graph", "runtime", "ports", "testing"];
const scannedExtensions = [".ts", ".tsx", ".js", ".mjs"];
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
  "TriggerSignal",
  "TriggerDefinition",
  "ManualTriggerDefinition",
  "TimeTriggerDefinition",
  "ScrollTriggerDefinition",
  "PatchStatus",
  "Patch",
  "PatchBatch",
  "PatchListener",
  "migrateV4ToV5",
  "MigrationResult",
  "resolveTriggerDefinition",
  "validateV5",
  "ValidationResult",
  "validateTrackDefinition",
  "TrackValidationResult",
  "validateMotionTrigger",
  "parseGolden",
  "serializeGolden",
  "GoldenFixture",
  "GoldenValidationFixture",
  "Engine",
  "EngineOptions",
  "ProjectHandle",
  "TrackHandle",
  "PluginRegistry",
  "PluginDefinition",
  "ResolvedPlugins",
  "assertClock",
  "createManualClock",
  "Clock",
  "ClockTick",
  "assertTriggerPort",
  "createManualTriggerPort",
  "TriggerPort",
  "assertTriggerFactory",
  "ClockBinding",
  "ClockConsumer",
  "CreatedTrigger",
  "TriggerFactory",
  "TriggerFactoryContext",
  "createDefaultTriggerFactory",
  "createTriggerFactory",
  "ScrollSource",
  "ScrollSourceResolver",
  "ScrollSourceResolverContext",
  "TriggerFactoryOptions",
  "assertInterpolator",
  "InterpolationTimeline",
  "Interpolator",
  "assertScheduler",
  "Cancel",
  "Scheduler",
  "createMicrotaskScheduler",
  "MicrotaskSchedulerOptions",
  "SchedulerHost",
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
    else if (scannedExtensions.includes(extname(entry.name))) files.push(path);
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
  return /(?:from|import)\s*["'](?:gsap|react|react-dom|node:dom|domino|(?:\.\/)(?:\.\.)/[^"']*(?:^|\/)\b(?:dom|renderer|react|gsap)\b)["'/]/i.test(
    source,
  );
}
export function importsCoreInternals(source) {
  return /(?:from|import)\s*["'][^"']*(?:packages\/core\/src|\.\.\/)(?:\.\/)core\/src)["'/]|$)/.test(
    source,
  );
}
export function importsTestingEntrypoint(source) {
  return /(?:from|import)\s*["'](?:@motion5\/core\/testing|[^"']*core\/src\/testing)(?:["'/]|$)/.test(
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
  for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g))
    for (const item of match[1].split(",")) {
      const name = item.trim().split(/\s+as\s+/)[1] ?? item.trim().split(/\s+/)[0];
      if (name) names.push(name);
    }
  for (const match of source.matchAll(
    /export\s+(?:const|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g,
  ))
    names.push(match[1]);
  return names;
}
function checkCoreSource(source, file, violations) {
  if (importsBoundary(source) || importsRenderer(source))
    violations.push(`${file}: renderer or engine import`);
  if (bannedSymbol(source)) violations.push(`${file}: banned compatibility symbol`);
}
async function scanFiles(directory, scanRoot, violations) {
  for (const path of await walk(directory)) {
    const source = await readFile(path, "utf8");
    checkCoreSource(source, relative(path, scanRoot), violations);
  }
}
async function scanCoreEntries(scanRoot, violations) {
  const directory = join(scanRoot, "packages", "core", "src");
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
  for (const name of entries
    .filter((entry) => entry.isFile() && scannedExtensions.includes(extname(entry.name)))
    .map((entry) => entry.name)
    .sort()) {
    const path = join(directory, name);
    checkCoreSource(await readFile(path, "utf8"), relative(path, scanRoot), violations);
  }
}
async function discoverConsumerWorkspaces(scanRoot) {
  let rootPackageJson;
  try {
    rootPackageJson = JSON.parse(await readFile(join(scanRoot, "package.json"), "utf8"));
  } catch (error) {
    return [];
  }
  const workspaces = rootPackageJson.workspaces ?? [];
  const discovered = [];
  for (const globPattern of workspaces) {
    if (globPattern === "packages/*") {
      let entries;
      try {
        entries = await readdir(join(scanRoot, "packages"), { withFileTypes: true });
      } catch (error) {
        if (error?.code === "ENOENT") continue;
        throw error;
      }
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== "core") {
          discovered.push({ root: "packages", name: entry.name });
        }
      }
    } else if (globPattern === "apps/*") {
      let entries;
      try {
        entries = await readdir(join(scanRoot, "apps"), { withFileTypes: true });
      } catch (error) {
        if (error?.code === "ENOENT") continue;
        throw error;
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          discovered.push({ root: "apps", name: entry.name });
        }
      }
    }
  }
  return discovered;
}
export async function scan(scanRoot = root) {
  const violations = [];
  for (const layer of coreLayers)
    await scanFiles(join(scanRoot, "packages", "core", "src", layer), scanRoot, violations);
  await scanCoreEntries(scanRoot, violations);
  for (const workspace of await discoverConsumerWorkspaces(scanRoot)) {
    const directory = join(scanRoot, workspace.root, workspace.name, "src");
    for (const path of await walk(directory)) {
      const source = await readFile(path, "utf8");
      const file = relative(path, scanRoot);
      if (importsCoreInternals(source)) violations.push(`${file}: core source-internal import`);
      if (importsTestingEntrypoint(source)) violations.push(`${file}: test-only entrypoint import`);
    }
  }
  const indexPath = join(scanRoot, "packages", "core", "src", "index.ts");
  let indexSource = "";
  try {
    indexSource = await readFile(indexPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  for (const name of extractExportNames(indexSource))
    if (!allowedPublicExports.has(name))
      violations.push(`packages/core/src/index.ts: public export ${name} is not allow-listed`);
  return violations;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const violations = await scan();
  if (violations.length > 0) {
    console.error(violations.join("\n"));
    process.exitCode = 1;
  } else console.log("boundary scan passed");
}
