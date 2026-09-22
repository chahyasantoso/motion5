import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const coreLayers = [
  "contract",
  "domain",
  "graph",
  "runtime",
  "ports",
  "testing",
  "adapters",
  "lang",
];
const corePackage = "packages/core";
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
  "LivePatch",
  "PatchBatch",
  "PatchListener",
  "PatchRender",
  "patchRender",
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
  "Handle",
  "StaleHandleError",
  "TrackHandle",
  "StaleTrackHandleError",
  "RequireView",
  "MotionHandle",
  "StaleMotionHandleError",
  "SchemaTransaction",
  "ValueTransaction",
  "LiveValues",
  "LiveValueKeyError",
  "PluginRegistry",
  "PluginDefinition",
  "PluginStage",
  "ResolvedPlugins",
  "assertClock",
  "createManualClock",
  "Clock",
  "ClockTick",
  "assertTriggerPort",
  "createManualTriggerPort",
  "TriggerPort",
  "acceptsExternalSignal",
  "assertTriggerFactory",
  "TriggerBinding",
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
  "PatchKeysResult",
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
  return /(?:from|import)\s*["'](?:gsap|react|react-dom|node:dom|domino|(?:\.\/|\.\.\/)[^"']*(?:^|\/)\b(?:dom|renderer|react|gsap)\b)["'/]/i.test(
    source,
  );
}
export function importsCoreInternals(source) {
  return /(?:from|import)\s*["'][^"']*(?:packages\/core\/src|\.\.\/\.\.\/core\/src)(?:["'/]|$)/.test(
    source,
  );
}
export function importsTestingEntrypoint(source) {
  return /(?:from|import)\s*["'](?:@motion5\/core\/testing|[^"']*core\/src\/testing)(?:["'/]|$)/.test(
    source,
  );
}
const moduleSpecifier = /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\brequire\s*\(\s*)["']([^"']+)["']/g;
/**
 * The retired sink path, and only that path.
 *
 * Module specifiers are extracted from static imports and re-exports, dynamic imports, and
 * `require` calls before the exact relative path is tested. The extraction sees `.js`, `.mjs`, and
 * `.ts` suffixes plus either path separator. Three spellings stay invisible: a configured alias, a
 * computed specifier, and a block comment interposed between the keyword and its specifier, because
 * `moduleSpecifier` admits only whitespace there while an interposed comment is valid TypeScript in
 * a static import, a dynamic import and a `require` call alike. Teaching it comments widens the set
 * this gate refuses, so that is its own slice with its own cases rather than a correction here.
 * Five inward imports into domain survive: `contract/migrate-v4-to-v5.ts` and
 * `contract/validate-v5.ts` reach `domain/outcome`, `adapters/interpolator/gsap.ts` reaches
 * `domain/keyframe-compiler`, and `adapters/dom.ts` plus `adapters/index.ts` reach `domain/plugins`
 * type-only. A predicate over every `domain/` import would therefore refuse the tree it is added
 * to, and a gate introduced red earns an exemption list instead of a fix. This one is green the
 * moment the move lands and refuses the exact regression the move exists to prevent. ADR-099 names
 * all five and says which slice each belongs to.
 */
export function importsDomainSink(source) {
  for (const match of source.matchAll(moduleSpecifier)) {
    const specifier = match[1].replaceAll("\\", "/");
    if (/^(?:\.\.\/)+domain\/exhaustive(?:\.(?:js|mjs|ts))?$/.test(specifier)) return true;
  }
  return false;
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
function checkCoreSource(source, file, layer, violations) {
  if (layer !== "adapters" && (importsBoundary(source) || importsRenderer(source)))
    violations.push(`${file}: renderer or engine import`);
  if (bannedSymbol(source)) violations.push(`${file}: banned compatibility symbol`);
  if (["contract", "ports", "adapters"].includes(layer) && importsDomainSink(source))
    violations.push(`${file}: retired domain sink import`);
}
async function scanFiles(directory, scanRoot, layer, violations) {
  for (const path of await walk(directory)) {
    const source = await readFile(path, "utf8");
    checkCoreSource(source, relative(path, scanRoot), layer, violations);
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
    checkCoreSource(await readFile(path, "utf8"), relative(path, scanRoot), "entry", violations);
  }
}
/**
 * Workspace roots are read from the root manifest rather than named here, so a third workspace
 * glob is scanned the moment it is declared. A tree with no manifest is refused: a discovery step
 * that quietly walks nothing reports a clean boundary for a workspace it never opened, which is
 * the failure this scan was extended to remove.
 */
async function discoverConsumerWorkspaces(scanRoot) {
  const manifestPath = join(scanRoot, "package.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`boundary scan found no ${manifestPath}`);
    throw error;
  }
  const declared = Array.isArray(manifest.workspaces) ? manifest.workspaces : [];
  const roots = [];
  for (const entry of declared) {
    if (typeof entry !== "string") continue;
    const workspaceRoot = entry.endsWith("/*") ? entry.slice(0, -2) : entry;
    if (!workspaceRoot.includes("*") && !roots.includes(workspaceRoot)) roots.push(workspaceRoot);
  }
  if (roots.length === 0) throw new Error(`boundary scan found no workspaces in ${manifestPath}`);
  const workspaces = [];
  for (const workspaceRoot of roots) {
    let entries;
    try {
      entries = await readdir(join(scanRoot, workspaceRoot), { withFileTypes: true });
    } catch (error) {
      if (error?.code === "ENOENT") continue;
      throw error;
    }
    for (const entry of entries.filter((candidate) => candidate.isDirectory()))
      if (`${workspaceRoot}/${entry.name}` !== corePackage)
        workspaces.push(`${workspaceRoot}/${entry.name}`);
  }
  return workspaces;
}
export async function scan(scanRoot = root) {
  const violations = [];
  for (const layer of coreLayers)
    await scanFiles(join(scanRoot, "packages", "core", "src", layer), scanRoot, layer, violations);
  await scanCoreEntries(scanRoot, violations);
  for (const workspace of await discoverConsumerWorkspaces(scanRoot)) {
    for (const path of await walk(join(scanRoot, workspace, "src"))) {
      const source = await readFile(path, "utf8");
      const file = relative(path, scanRoot);
      if (importsCoreInternals(source)) violations.push(`${file}: core source-internal import`);
      if (importsTestingEntrypoint(source)) violations.push(`${file}: testing entrypoint import`);
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
