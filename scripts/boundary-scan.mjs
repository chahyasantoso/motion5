import { readdir, readFile } from "node:fs/promises";
import { extname, join, posix } from "node:path";
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
 * The end of the string literal opening at `start`, honouring backslash escapes.
 *
 * An unterminated literal returns the last index, which consumes the rest of the file. Such a file
 * does not compile, so this answer only has to be safe rather than useful.
 */
function closingDelimiter(source, start, delimiter) {
  for (let index = start + 1; index < source.length; index += 1) {
    if (source[index] === "\\") {
      index += 1;
      continue;
    }
    if (source[index] === delimiter) return index;
  }
  return source.length - 1;
}
/** Keywords after which a `/` begins an operand: a regular-expression literal, not a division. */
const regexKeywords = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "instanceof",
  "new",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield",
]);
/**
 * Whether a `/` after the code read so far opens a regular-expression literal rather than dividing.
 *
 * The question a lexer answers from the previous token, answered the same way: a value ends in an
 * identifier character, a closing bracket or a string delimiter, and a `/` after a value divides,
 * unless the identifier is a keyword that expects an operand. Everything else, an operator, an
 * opening bracket, a separator or the start of the file, expects an operand. It is a lexer's
 * approximation, not a parser's answer, and it errs one way: a literal directly after the `)` of an
 * `if (…)` or `while (…)` head reads as a division, so its body is read as code.
 */
function regexStarts(code) {
  const before = code.trimEnd();
  const last = before.at(-1);
  if (last === undefined) return true;
  if (/[)\]}"'`]/.test(last)) return false;
  if (!/[\w$]/.test(last)) return true;
  return regexKeywords.has(/[\w$]+$/.exec(before)?.[0] ?? "");
}
/**
 * The index after the regular-expression literal opening at `start`, flags included, or -1.
 *
 * A `/` inside a character class does not close the literal, and a backslash escapes the character
 * after it. A line break before the closing `/` means this was not a literal, because a literal
 * cannot span lines, and `//` or `/*` at `start` is a comment opener rather than an empty literal.
 */
function regexLiteralEnd(source, start) {
  if (source[start + 1] === "/" || source[start + 1] === "*") return -1;
  let inClass = false;
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\n") return -1;
    if (char === "\\") index += 1;
    else if (char === "[") inClass = true;
    else if (char === "]") inClass = false;
    else if (char === "/" && !inClass) {
      let end = index + 1;
      while (end < source.length && /[a-z]/i.test(source[end])) end += 1;
      return end;
    }
  }
  return -1;
}
/**
 * The source with its comments and regular-expression literals removed and its strings intact.
 *
 * A specifier is a property of code, and `moduleSpecifier` cannot tell code from prose: it accepts
 * any `from`, `import` or `require` that a quotation mark follows, so a doc comment naming a module
 * path read as an import of it. That was measured rather than imagined. A `contract/` module whose
 * only mention of the layer was the line comment `used to read from "../domain/outcome"` returned
 * one `inward domain import` from the shipped scan with no import anywhere in the file, and this
 * repository quotes module paths in prose constantly. A gate a documentation edit can turn red is a
 * gate that gets deleted, so the extraction reads code.
 *
 * Scanning left to right is what makes one pass enough. A comment opener inside a string literal is
 * never reached, because the literal is consumed whole at its opening delimiter; an apostrophe or a
 * quotation mark inside a comment never opens a literal, because the comment is consumed whole at
 * its opener. A regular-expression literal is consumed whole the same way, because it is the one
 * other place a comment opener can appear in code: measured on the first cut, `/[/*]/` opened a
 * block comment inside its character class and swallowed the import after it, so the scan reported
 * a clean file that reached `domain/`. The literal is replaced by an empty string, which keeps it a
 * value for `regexStarts` and removes its body, so `/from "../domain/x"/` is not read as an import.
 * A comment is replaced rather than deleted so that no two tokens it separated can join.
 */
function withoutComments(source) {
  let code = "";
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const regexEnd = char === "/" && regexStarts(code) ? regexLiteralEnd(source, index) : -1;
    if (regexEnd !== -1) {
      code += '""';
      index = regexEnd;
    } else if (char === "\\") {
      code += source.slice(index, index + 2);
      index += 2;
    } else if (char === '"' || char === "'" || char === "`") {
      const end = closingDelimiter(source, index, char);
      code += source.slice(index, end + 1);
      index = end + 1;
    } else if (char === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index);
      code += "\n";
      index = end === -1 ? source.length : end + 1;
    } else if (char === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      code += " ";
      index = end === -1 ? source.length : end + 2;
    } else {
      code += char;
      index += 1;
    }
  }
  return code;
}
/**
 * Every module specifier this scanner can see, in canonical form.
 *
 * One owner of the extraction, because the two predicates below ask different questions of the same
 * list, and a second copy of the walk is how they end up disagreeing about what a specifier is.
 * Specifiers are read from code, through `withoutComments`, in static imports and re-exports,
 * dynamic imports and `require` calls.
 *
 * Canonical means the spelling module resolution would reach, and it has one owner here so both
 * anchors stay literal. Backslashes become forward slashes, then `posix.normalize` collapses
 * repeated separators, drops interior `.` segments and folds an interior `..` into the segment it
 * cancels. Measured on the first cut: `.././domain/x` and `..//domain/x` both resolve to
 * `../domain/x` and both read clean, and so would `../lang/../domain/x`. After normalisation all
 * three are `../domain/x`, while `../domain/../lang/x` becomes `../lang/x` and stays clean because
 * it never reaches the layer. A leading `./` is folded too, which is why the anchors no longer
 * spell it. A package specifier has no dot segment and comes through unchanged.
 *
 * Three spellings stay invisible. A configured alias and a computed specifier are past the reach of
 * any pattern over source text: an alias is resolved by configuration this scanner does not read,
 * and a computed specifier has no literal to read. A template-literal delimiter is not past it,
 * which is what makes it the one a later slice can close without first deciding what an
 * unresolvable specifier means: the delimiter class admits an apostrophe and a quotation mark and
 * nothing else, and widening it wants a backreferenced delimiter so one kind cannot close another,
 * plus a decision about a substituted literal, which is a computed specifier in concrete clothing.
 * That widens the set these gates refuse, so it is its own slice with its own cases. None of the
 * three appears under `packages/core/src` today, measured over this scanner's own walk.
 *
 * One spelling is still read too eagerly, and it is named rather than chased: a specifier-shaped
 * phrase inside a string literal. Prose lives in comments here and no such string exists in the
 * tree, and narrowing it wants the keyword's own statement rather than a tighter delimiter class.
 *
 * One file kind is read without its grammar, and that is named too: `withoutComments` knows string,
 * template and comment delimiters and nothing of JSX, while `scannedExtensions` includes `.tsx`. A
 * `/*` in JSX element text therefore opens a comment that swallows the rest of the file, and a `//`
 * there hides the rest of its line, so a real import after either reads as absent. No `.tsx` file
 * exists under `packages/` today, so the gap is latent rather than live, and the repair is a JSX
 * lexer or a refusal of `.tsx` under the layers these gates read, not a wider pattern.
 */
function* importSpecifiers(source) {
  for (const match of withoutComments(source).matchAll(moduleSpecifier))
    yield posix.normalize(match[1].replaceAll("\\", "/"));
}
/**
 * Any relative import of the domain layer, which is what ARCHITECTURE section 2 actually forbids.
 *
 * ADR-103 relocated the outcome algebra to `lang/` and dropped the `E = Diagnostic` default that
 * made it reach `contract/`. Those were the only two `contract/` imports of `domain/` in the tree,
 * so this predicate is green on `contract/` and on `ports/`, and it is applied to exactly those two
 * layers. `adapters/` keeps the narrower retired-sink rule below, because three real adapter
 * imports of `domain/` survive: `adapters/interpolator/gsap.ts` reaches `domain/keyframe-compiler`
 * for a value, and `adapters/dom.ts` plus `adapters/index.ts` reach `domain/plugins` type-only.
 * Widening this rule to adapters would refuse the tree it was added to, and a gate introduced red
 * earns an exemption list instead of a fix. ADR-099 named all three and ADR-103 records why they
 * stay their own slice.
 *
 * The anchor admits an absent trailing slash, so a bare `../domain` is refused alongside
 * `../domain/track`, and it reads canonical specifiers, so `./../domain/track`, `.././domain/track`
 * and `..//domain/track` are refused as the spelling they resolve to. None of them appears in the
 * tree and none is one a formatter would produce, which is the reason they are worth refusing: a
 * gate whose anchor can be stepped around by a character nobody would notice in review is a gate
 * that reports a clean boundary it does not have. It stays anchored at the front, so
 * `../domain-helpers` and `../domainfoo` are still clean.
 */
export function importsDomainLayer(source) {
  for (const specifier of importSpecifiers(source))
    if (/^(?:\.\.\/)+domain(?:\/|$)/.test(specifier)) return true;
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
