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
 * Every module specifier this scanner can see, normalised to forward slashes.
 *
 * One owner of the extraction, because the two predicates below ask different questions of the same
 * list, and a second copy of the walk is how they end up disagreeing about what a specifier is.
 * Specifiers are read from static imports and re-exports, dynamic imports, and `require` calls.
 * Four spellings stay invisible. A configured alias and a computed specifier are past the reach of
 * any pattern over source text. A template-literal delimiter is not beyond it: that is a concrete
 * specifier this pattern cannot see, because the delimiter class admits an apostrophe and a
 * quotation mark and nothing else, and widening it wants a backreferenced delimiter so one kind
 * cannot be closed by another, plus a decision about a substituted literal, which is a computed
 * specifier in concrete clothing. A block comment interposed between the keyword and its specifier
 * is invisible for the same shape of reason: the pattern admits only whitespace there, while an
 * interposed comment is valid TypeScript in all three forms. Each of the last two widens the set
 * these gates refuse, so each is its own slice with its own cases rather than a correction here.
 * Neither appears under `packages/core/src` today, measured over this scanner's own walk.
 */
function* importSpecifiers(source) {
  for (const match of source.matchAll(moduleSpecifier)) yield match[1].replaceAll("\\", "/");
}
/**
 * Any relative import of the domain layer, which is what ARCHITECTURE section 2 actually forbids.
 *
 * ADR-102 relocated the outcome algebra to `lang/` and dropped the `E = Diagnostic` default that
 * made it reach `contract/`. Those were the only two `contract/` imports of `domain/` in the tree,
 * so this predicate is green on `contract/` and on `ports/`, and it is applied to exactly those two
 * layers. `adapters/` keeps the narrower retired-sink rule below, because three real adapter
 * imports of `domain/` survive: `adapters/interpolator/gsap.ts` reaches `domain/keyframe-compiler`
 * for a value, and `adapters/dom.ts` plus `adapters/index.ts` reach `domain/plugins` type-only.
 * Widening this rule to adapters would refuse the tree it was added to, and a gate introduced red
 * earns an exemption list instead of a fix. ADR-099 named all three and ADR-102 records why they
 * stay their own slice.
 */
export function importsDomainLayer(source) {
  for (const specifier of importSpecifiers(source))
    if (/^(?:\.\.\/)+domain\//.test(specifier)) return true;
  return false;
}
/**
 * The retired sink path, and only that path, for the one layer the broad rule cannot reach yet.
 *
 * Kept as its own question rather than folded into `importsDomainLayer`, because `adapters/` may
 * import `domain/` and may not import the sink. The extraction sees `.js`, `.mjs`, and `.ts`
 * suffixes plus either path separator, and the anchored path is why `../lang/exhaustive` and
 * `../domain/exhaustive-helpers` stay clean. `contract/` and `ports/` no longer carry this rule: a
 * retired-sink import is a `domain/` import, so `importsDomainLayer` already refuses it there, and
 * two spellings of one question is the duplication this project files against itself.
 */
export function importsDomainSink(source) {
  for (const specifier of importSpecifiers(source))
    if (/^(?:\.\.\/)+domain\/exhaustive(?:\.(?:js|mjs|ts))?$/.test(specifier)) return true;
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
  if (["contract", "ports"].includes(layer) && importsDomainLayer(source))
    violations.push(`${file}: inward domain import`);
  if (layer === "adapters" && importsDomainSink(source))
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
