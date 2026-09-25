// Pure handover format, versions 1 and 2: the archive listing, the manifest schema, the patch chain, and the
// words every refusal is reported in. Contract: ADR-112, ADR-119 and docs/HANDOVER-FORMAT.md.
// Tests: packages/core/test/unit/scripts/handover-format.test.ts.
// No filesystem, process, network, or Git access: callers hand in what they read.
import { MAX_PATCHES, checkpointChain, checkpointManifest } from "./checkpoint-policy.mjs";

export const HANDOVER_FORMAT = "motion5-handover";
/**
 * The closed set of manifest versions this script reads. Version 1 is the #487 layout; version 2
 * adds the `title` and `target` a publication needs and the `review` component (issue #507). A
 * version outside the set is refused by name, never read as its neighbour.
 */
export const HANDOVER_VERSIONS = Object.freeze([1, 2]);
/** The version `pack` writes. */
export const HANDOVER_VERSION = 2;
export const REVIEW_FORMAT = "motion5-review";
export const REVIEW_VERSION = 1;
export const HANDOVER_MANIFEST = "handover.json";
export const HANDOVER_INBOX = ".handover";
export const PATCH_DIRECTORY = "patches";
// A handover is a human download, not a transport call, so it is bounded for safety rather than
// for a per-call ceiling: generous enough for a corpus and a bundle, small enough that a zip bomb
// is refused from its listing before one byte of it is extracted.
export const MAX_ENTRIES = 2000;
export const MAX_UNCOMPRESSED_BYTES = 64 * 1024 * 1024;

/** The closed set of optional and required components a manifest may declare beside its patches. */
export const COMPONENT_KINDS = Object.freeze(["notes", "checkpoint", "bundle", "opaque", "review"]);

/**
 * Where a version 2 handover's notes and review are published after it applies: an explicit pull
 * request, the pull request of the target branch (found, or created when there is none), or the
 * manifest's issue.
 */
export const DESTINATION_KINDS = Object.freeze(["pull-request", "branch", "issue"]);

/** Whether a manifest names where its notes go: version 1 cannot, version 2 must. */
export const ADDRESS_KINDS = Object.freeze(["unaddressed", "addressed"]);

/** The closed set of verdicts an independent review reports. */
export const REVIEW_STATUSES = Object.freeze(["passed", "failed", "pending"]);

/** How much a review finding weighs: a blocking one must be fixed before a review may pass. */
export const FINDING_SEVERITIES = Object.freeze(["blocking", "advisory"]);

/** Where a finding stands; only `fixed` resolves it. */
export const FINDING_STATES = Object.freeze(["open", "fixed", "deferred"]);

/** The closed set of answers the inbox gives before anything is read from an archive. */
export const DISCOVERY_KINDS = Object.freeze(["empty", "one", "ambiguous", "foreign"]);

/** The closed set of kinds a zip listing reports for one entry. */
export const ENTRY_KINDS = Object.freeze(["file", "directory", "symlink", "other"]);

/** The closed set of reasons a handover is refused before the checkout is touched. */
export const REFUSAL_KINDS = Object.freeze([
  "ambiguous-inbox",
  "foreign-entry",
  "tool-missing",
  "identity-missing",
  "detached-head",
  "operation-in-progress",
  "dirty-tree",
  "unreadable-archive",
  "unsafe-entry",
  "archive-too-large",
  "missing-file",
  "stray-file",
  "invalid-manifest",
  "unsupported-version",
  "digest-mismatch",
  "broken-chain",
  "base-missing",
  "base-not-ancestor",
  "base-disagrees",
  "checkpoint-disagrees",
  "bundle-invalid",
  "bundle-prerequisite",
  "head-moved",
  "invalid-review",
]);

const SHA = /^[0-9a-f]{40}$/;
const DIGEST = /^[0-9a-f]{64}$/;
// One path segment of anything the format stores or names. Deliberately narrower than Git: a
// handover is machine-built, and a repository carries dotfiles (`.gitignore`, `.github/`), so a
// leading dot is allowed while `.` and `..` are refused separately. A space, a backslash or a non-ASCII byte is a defect to refuse
// rather than a spelling to preserve.
const SEGMENT = /^[A-Za-z0-9_.@+-]+$/;
const PATCH_FILE = /^patches\/([0-9]{4})-[A-Za-z0-9][A-Za-z0-9._-]*\.patch$/;
const CHECKPOINT_ID = /^cp[0-9]{3}$/;
const NOTES_FILE = /\.md$/;
const BUNDLE_FILE = /\.bundle$/;
const REVIEW_FILE = /\.json$/;
// `owner/name` as GitHub spells a repository.
const REPOSITORY = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})\/[A-Za-z0-9._-]{1,100}$/;
// A branch name narrowed to what a machine-built handover needs; `git check-ref-format` accepts
// more, and a name outside this is a defect to refuse rather than a spelling to preserve.
const BRANCH = /^[A-Za-z0-9_][A-Za-z0-9._\/-]*$/;
const MAX_TITLE = 256;
const ZIP_FILE = /\.zip$/i;
// `unzip -Z -s` (zipinfo short format): mode, version, host, size, type, method, date, time, name.
const LISTING_LINE = /^(\S{7,10})\s+[0-9]+\.[0-9]+\s+\S+\s+([0-9]+)\s+\S+\s+\S+\s+\S+\s+\S+ (.+)$/;
const LISTING_FOOTER = /^([0-9]+) files?, /;
const LISTING_EMPTY = /^Empty zipfile\.$/;
const BUNDLE_SIGNATURE = /^# v[23] git bundle$/;
const BUNDLE_PREREQUISITE = /^-([0-9a-f]{40})(?: .*)?$/;
const BUNDLE_REFERENCE = /^([0-9a-f]{40}) (\S+)$/;
const BUNDLE_CAPABILITY = /^@\S+$/;
const MANIFEST_KEYS_V1 = ["format", "version", "name", "issue", "base", "patches", "components"];
const MANIFEST_KEYS_V2 = [...MANIFEST_KEYS_V1, "title", "target"];
const TARGET_KEYS = ["repository", "branch", "into", "destination"];
const REVIEW_KEYS = ["format", "version", "status", "reviewer", "summary", "findings", "evidence"];
const FINDING_KEYS = ["severity", "state", "title", "detail"];
const PATCH_KEYS = ["seq", "file", "sha256", "pre", "post"];
const COMPONENT_KEYS = ["kind", "path"];

/**
 * A refusal is a value first and an exception second: pure checks throw it so a pipeline stops at
 * the first one, and the pipeline catches exactly this class and reports `refusal` unchanged. Any
 * other exception is a defect in this code and propagates as one.
 */
export class HandoverRefusal extends Error {
  constructor(refusal) {
    super(describeRefusal(refusal));
    this.name = "HandoverRefusal";
    this.refusal = Object.freeze(refusal);
  }
}

export function refuse(refusal) {
  throw new HandoverRefusal(refusal);
}

/** The exhaustive sink for a closed union read by a switch; see the declaration file. */
export function unreachable(value, union) {
  throw new TypeError(`Unhandled ${union}: ${JSON.stringify(value)}`);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function invalid(reason) {
  refuse({ kind: "invalid-manifest", reason });
}

function ensureManifest(condition, reason) {
  if (!condition) invalid(reason);
}

function exactKeys(value, allowed, label) {
  ensureManifest(isObject(value), `${label} must be a JSON object`);
  for (const key of Object.keys(value))
    ensureManifest(
      allowed.includes(key),
      `${label} carries the unknown key ${JSON.stringify(key)}`,
    );
  for (const key of allowed)
    ensureManifest(Object.hasOwn(value, key), `${label} is missing ${JSON.stringify(key)}`);
}

/** Why a relative path is unsafe, or null when it is safe. Shared by the listing and the manifest. */
export function unsafePath(path) {
  if (typeof path !== "string" || path.length === 0) return "it is empty";
  if (path.startsWith("/")) return "it is absolute";
  if (path.includes("\\")) return "it uses a backslash";
  if (path.endsWith("/")) return "it names a directory";
  for (const segment of path.split("/")) {
    if (segment === "") return "it has an empty segment";
    if (segment === "." || segment === "..") return "it has a dot segment";
    if (!SEGMENT.test(segment))
      return `the segment ${JSON.stringify(segment)} is outside [A-Za-z0-9_.@+-]`;
  }
  return null;
}

function kindOfMode(mode) {
  switch (mode[0]) {
    case "-":
      return "file";
    case "d":
      return "directory";
    case "l":
      return "symlink";
    default:
      return "other";
  }
}

/**
 * The entries of `unzip -Z -s <zip>`, in archive order. The footer's count is compared with the
 * lines read, so a name this parser cannot read refuses the archive instead of vanishing from it.
 */
export function zipListing(text) {
  const entries = [];
  let declared = null;
  for (const line of String(text).split("\n")) {
    const entry = LISTING_LINE.exec(line);
    if (entry !== null) {
      entries.push({ name: entry[3], kind: kindOfMode(entry[1]), size: Number(entry[2]) });
      continue;
    }
    const footer = LISTING_FOOTER.exec(line);
    if (footer !== null) declared = Number(footer[1]);
    else if (LISTING_EMPTY.test(line)) declared = 0;
  }
  if (declared === null)
    refuse({ kind: "unreadable-archive", reason: "the listing has no entry count" });
  if (declared !== entries.length)
    refuse({
      kind: "unreadable-archive",
      reason: `the listing declares ${declared} entries and ${entries.length} were readable`,
    });
  return entries;
}

/**
 * The archive's shape, read from its listing alone: exactly one top-level directory, every entry
 * a safe relative path under it, only regular files and directories, bounded in count and size,
 * and a manifest at the root. Returns the root name and the regular files relative to it, sorted.
 */
export function handoverListing(entries) {
  const bytes = entries.reduce((total, entry) => total + entry.size, 0);
  if (entries.length > MAX_ENTRIES || bytes > MAX_UNCOMPRESSED_BYTES)
    refuse({ kind: "archive-too-large", entries: entries.length, bytes });
  const roots = new Set();
  const files = [];
  for (const entry of entries) {
    const name = entry.kind === "directory" ? entry.name.replace(/\/$/, "") : entry.name;
    const reason = unsafePath(name);
    if (reason !== null) refuse({ kind: "unsafe-entry", entry: entry.name, reason });
    switch (entry.kind) {
      case "file":
        break;
      case "directory":
        roots.add(name.split("/")[0]);
        continue;
      case "symlink":
        refuse({ kind: "unsafe-entry", entry: entry.name, reason: "it is a symbolic link" });
        break;
      case "other":
        refuse({ kind: "unsafe-entry", entry: entry.name, reason: "it is not a regular file" });
        break;
      default:
        unreachable(entry.kind, "ENTRY_KINDS");
    }
    const [root, ...rest] = name.split("/");
    if (rest.length === 0)
      refuse({ kind: "unsafe-entry", entry: entry.name, reason: "it sits outside a root folder" });
    roots.add(root);
    files.push(rest.join("/"));
  }
  if (roots.size !== 1)
    refuse({
      kind: "unsafe-entry",
      entry: [...roots].sort().join(", ") || "(none)",
      reason: "an archive holds exactly one top-level folder",
    });
  const [root] = roots;
  files.sort();
  if (!files.includes(HANDOVER_MANIFEST)) refuse({ kind: "missing-file", path: HANDOVER_MANIFEST });
  return { root, files };
}

function manifestPath(value, label) {
  const reason = unsafePath(value);
  ensureManifest(reason === null, `${label} is not a safe relative path: ${reason}`);
  return value;
}

function imageMap(value, label) {
  ensureManifest(isObject(value), `${label} must be an object of path to blob id`);
  const paths = Object.keys(value);
  ensureManifest(paths.length > 0, `${label} must declare at least one path`);
  for (const path of paths) {
    manifestPath(path, `${label} path ${JSON.stringify(path)}`);
    const blob = value[path];
    ensureManifest(
      blob === null || (typeof blob === "string" && SHA.test(blob)),
      `${label} needs a full blob id or null for ${JSON.stringify(path)}`,
    );
  }
  return paths.slice().sort();
}

function patchEntry(patch, index) {
  const label = `patch ${index + 1}`;
  exactKeys(patch, PATCH_KEYS, label);
  ensureManifest(patch.seq === index + 1, `${label} must declare \`seq: ${index + 1}\``);
  const file = PATCH_FILE.exec(typeof patch.file === "string" ? patch.file : "");
  ensureManifest(file !== null, `${label} must name a file such as \`patches/0001-slug.patch\``);
  manifestPath(patch.file, `${label} \`file\``);
  ensureManifest(Number(file[1]) === patch.seq, `${label} file must be numbered by its \`seq\``);
  ensureManifest(
    typeof patch.sha256 === "string" && DIGEST.test(patch.sha256),
    `${label} needs a SHA-256 digest over its patch bytes`,
  );
  const pre = imageMap(patch.pre, `${label} \`pre\``);
  const post = imageMap(patch.post, `${label} \`post\``);
  ensureManifest(
    pre.join("\n") === post.join("\n"),
    `${label} must declare the same paths in \`pre\` and \`post\``,
  );
  for (const path of pre)
    ensureManifest(
      patch.pre[path] !== null || patch.post[path] !== null,
      `${label} declares ${JSON.stringify(path)} absent both before and after`,
    );
}

function componentEntry(component, index, kinds) {
  const label = `component ${index + 1}`;
  exactKeys(component, COMPONENT_KEYS, label);
  ensureManifest(
    kinds.includes(component.kind),
    `${label} \`kind\` must be one of ${kinds.join(", ")}`,
  );
  const path = manifestPath(component.path, `${label} \`path\``);
  ensureManifest(
    path !== HANDOVER_MANIFEST &&
      path !== PATCH_DIRECTORY &&
      !path.startsWith(`${PATCH_DIRECTORY}/`),
    `${label} may not claim the manifest or the patch folder`,
  );
  const last = path.split("/").at(-1);
  switch (component.kind) {
    case "notes":
      ensureManifest(NOTES_FILE.test(path), `${label} notes must be a markdown file`);
      break;
    case "checkpoint":
      ensureManifest(CHECKPOINT_ID.test(last), `${label} checkpoint must be a folder named cpNNN`);
      break;
    case "bundle":
      ensureManifest(BUNDLE_FILE.test(path), `${label} bundle must be a .bundle file`);
      break;
    case "review":
      ensureManifest(REVIEW_FILE.test(path), `${label} review must be a .json file`);
      break;
    case "opaque":
      break;
    default:
      unreachable(component.kind, "COMPONENT_KINDS");
  }
}

function isBranch(value) {
  return (
    typeof value === "string" &&
    BRANCH.test(value) &&
    !value.includes("..") &&
    !value.includes("//") &&
    !value.endsWith("/") &&
    !value.endsWith(".") &&
    !value.endsWith(".lock")
  );
}

function positive(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function destinationEntry(value) {
  const label = "`target.destination`";
  ensureManifest(isObject(value), `${label} must be a JSON object`);
  ensureManifest(
    DESTINATION_KINDS.includes(value.kind),
    `${label} \`kind\` must be one of ${DESTINATION_KINDS.join(", ")}`,
  );
  switch (value.kind) {
    case "pull-request":
      exactKeys(value, ["kind", "number"], label);
      ensureManifest(positive(value.number), `${label} needs a positive pull request \`number\``);
      break;
    case "branch":
    case "issue":
      exactKeys(value, ["kind"], label);
      break;
    default:
      unreachable(value.kind, "DESTINATION_KINDS");
  }
}

/** The version 2 publication address: which repository, which branch into which, posted where. */
function targetEntry(value) {
  exactKeys(value, TARGET_KEYS, "`target`");
  ensureManifest(
    typeof value.repository === "string" && REPOSITORY.test(value.repository),
    "`target.repository` must be a GitHub `owner/name`",
  );
  ensureManifest(isBranch(value.branch), "`target.branch` must be a plain branch name");
  ensureManifest(isBranch(value.into), "`target.into` must be a plain branch name");
  ensureManifest(value.branch !== value.into, "`target.branch` and `target.into` must differ");
  destinationEntry(value.destination);
}

function manifestKeys(version) {
  switch (version) {
    case 1:
      return MANIFEST_KEYS_V1;
    case 2:
      return MANIFEST_KEYS_V2;
    default:
      return unreachable(version, "HANDOVER_VERSIONS");
  }
}

/** Version 1 predates the review component, so a v1 manifest declaring one is invalid, not v2. */
function componentKinds(version) {
  switch (version) {
    case 1:
      return COMPONENT_KINDS.filter((kind) => kind !== "review");
    case 2:
      return COMPONENT_KINDS;
    default:
      return unreachable(version, "HANDOVER_VERSIONS");
  }
}

function countOf(components, kind) {
  return components.filter((component) => component.kind === kind).length;
}

function overlaps(a, b) {
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

/**
 * The manifest, validated whole before anything else reads it. The format and version are read
 * first and refused by name, so a future layout is never parsed as this one; every other defect
 * is `invalid-manifest`, except a chain that contradicts itself, which is `broken-chain`. The
 * chain arithmetic is `checkpointChain()`, the one the checkpoint route already proves a stack
 * with, so both routes agree on what "patch N follows patch N-1" means.
 */
export function handoverManifest(value, root) {
  if (!isObject(value)) invalid("the manifest must be a JSON object");
  if (value.format !== HANDOVER_FORMAT || !HANDOVER_VERSIONS.includes(value.version))
    refuse({
      kind: "unsupported-version",
      format: value.format ?? null,
      version: value.version ?? null,
    });
  exactKeys(value, manifestKeys(value.version), "the manifest");
  ensureManifest(
    value.name === root,
    `\`name\` must equal the archive's root folder ${JSON.stringify(root)}`,
  );
  ensureManifest(
    Number.isSafeInteger(value.issue) && value.issue > 0,
    "`issue` must be a positive issue number",
  );
  ensureManifest(
    typeof value.base === "string" && SHA.test(value.base),
    "`base` must be a full commit SHA",
  );
  ensureManifest(
    Array.isArray(value.patches) && value.patches.length > 0 && value.patches.length <= MAX_PATCHES,
    `\`patches\` must carry 1 through ${MAX_PATCHES} entries`,
  );
  value.patches.forEach(patchEntry);
  ensureManifest(
    new Set(value.patches.map((patch) => patch.file)).size === value.patches.length,
    "`patches` repeats a file",
  );
  if (value.version === 2) {
    ensureManifest(
      typeof value.title === "string" &&
        value.title.trim() === value.title &&
        value.title.length > 0 &&
        value.title.length <= MAX_TITLE &&
        !/[\r\n]/.test(value.title),
      `\`title\` must be one trimmed line of 1 through ${MAX_TITLE} characters`,
    );
    targetEntry(value.target);
  }
  ensureManifest(Array.isArray(value.components), "`components` must be an array");
  const kinds = componentKinds(value.version);
  value.components.forEach((component, index) => componentEntry(component, index, kinds));
  ensureManifest(
    countOf(value.components, "notes") === 1,
    "exactly one `notes` component is required",
  );
  ensureManifest(
    countOf(value.components, "checkpoint") <= 1,
    "at most one `checkpoint` component",
  );
  ensureManifest(countOf(value.components, "bundle") <= 1, "at most one `bundle` component");
  ensureManifest(countOf(value.components, "review") <= 1, "at most one `review` component");
  value.components.forEach((component, index) =>
    value.components
      .slice(index + 1)
      .forEach((other) =>
        ensureManifest(
          !overlaps(component.path, other.path),
          `components ${JSON.stringify(component.path)} and ${JSON.stringify(other.path)} overlap`,
        ),
      ),
  );
  let chain;
  try {
    chain = checkpointChain(value);
  } catch (error) {
    refuse({ kind: "broken-chain", reason: error.message });
  }
  return { manifest: value, chain };
}

/** The files a component owns within the archive's file list. */
function componentFiles(component, files) {
  switch (component.kind) {
    case "notes":
    case "bundle":
    case "review":
      return files.filter((file) => file === component.path);
    case "checkpoint":
      return files.filter((file) => file.startsWith(`${component.path}/`));
    case "opaque":
      return files.filter((file) => overlaps(file, component.path));
    default:
      return unreachable(component.kind, "COMPONENT_KINDS");
  }
}

/**
 * The archive must hold exactly what the manifest declares: the manifest, every patch, every
 * component, and nothing else. Returns each component with the files it owns.
 */
export function handoverContents(files, manifest) {
  const claimed = new Set([HANDOVER_MANIFEST]);
  for (const patch of manifest.patches) {
    if (!files.includes(patch.file)) refuse({ kind: "missing-file", path: patch.file });
    claimed.add(patch.file);
  }
  const components = manifest.components.map((component) => {
    const owned = componentFiles(component, files);
    const required =
      component.kind === "checkpoint" ? `${component.path}/manifest.json` : component.path;
    if (owned.length === 0 || (component.kind === "checkpoint" && !owned.includes(required)))
      refuse({ kind: "missing-file", path: required });
    owned.forEach((file) => claimed.add(file));
    return { ...component, files: owned };
  });
  const stray = files.find((file) => !claimed.has(file));
  if (stray !== undefined) refuse({ kind: "stray-file", path: stray });
  return components;
}

/**
 * An optional checkpoint store is derived from the patch series, never a second owner of it: its
 * own manifest must pass `checkpointManifest()`, name its folder, share the handover's base, hold
 * exactly its manifest and patches with the digests it declares, and end every path at the blob
 * the series ends it at. `digests` maps each file in the store, relative to the handover root, to
 * its SHA-256.
 */
export function checkpointAgreement(value, component, digests, chain, base) {
  const disagree = (reason) => refuse({ kind: "checkpoint-disagrees", reason });
  let checkpoint;
  try {
    checkpoint = checkpointManifest(value);
  } catch (error) {
    disagree(`its manifest is invalid: ${error.message}`);
  }
  const id = component.path.split("/").at(-1);
  if (checkpoint.checkpoint !== id)
    disagree(`its manifest names ${checkpoint.checkpoint}, not ${id}`);
  if (checkpoint.base !== base) disagree(`its base ${checkpoint.base} is not the handover base`);
  const declared = new Map(
    checkpoint.patches.map((patch) => [`${component.path}/${patch.file}`, patch.sha256]),
  );
  for (const file of component.files) {
    if (file === `${component.path}/manifest.json`) continue;
    if (!declared.has(file)) disagree(`${file} is stored but not declared by its manifest`);
  }
  for (const [file, digest] of declared) {
    if (!digests.has(file)) disagree(`${file} is declared by its manifest but absent`);
    if (digests.get(file) !== digest) disagree(`${file} does not match its declared SHA-256`);
  }
  const tip = checkpointChain(checkpoint).tip;
  const paths = new Set([...tip.keys(), ...chain.tip.keys()]);
  for (const path of [...paths].sort())
    if (tip.get(path) !== chain.tip.get(path))
      disagree(
        `it ends ${path} at ${tip.get(path) ?? "absent"} and the series ends it at ${chain.tip.get(path) ?? "absent"}`,
      );
  return checkpoint;
}

/**
 * Where a validated manifest says its notes go. Version 1 carries no address, which is a value
 * rather than an error: it applies exactly as before and its publication is `unaddressed`.
 */
export function handoverAddress(manifest) {
  switch (manifest.version) {
    case 1:
      return { kind: "unaddressed" };
    case 2:
      return { kind: "addressed", title: manifest.title, target: manifest.target };
    default:
      return unreachable(manifest.version, "HANDOVER_VERSIONS");
  }
}

function invalidReview(reason) {
  refuse({ kind: "invalid-review", reason });
}

function ensureReview(condition, reason) {
  if (!condition) invalidReview(reason);
}

function reviewKeys(value, allowed, label) {
  ensureReview(isObject(value), `${label} must be a JSON object`);
  for (const key of Object.keys(value))
    ensureReview(allowed.includes(key), `${label} carries the unknown key ${JSON.stringify(key)}`);
  for (const key of allowed)
    ensureReview(Object.hasOwn(value, key), `${label} is missing ${JSON.stringify(key)}`);
}

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/** Whether a finding still stands in the way: blocking and not fixed. */
export function isUnresolvedBlocking(finding) {
  switch (finding.severity) {
    case "advisory":
      return false;
    case "blocking":
      switch (finding.state) {
        case "fixed":
          return false;
        case "open":
        case "deferred":
          return true;
        default:
          return unreachable(finding.state, "FINDING_STATES");
      }
    default:
      return unreachable(finding.severity, "FINDING_SEVERITIES");
  }
}

/**
 * An independent review's result, validated whole. The one rule beyond shape is the one issue
 * #507 names: a review may not claim `passed` while a blocking finding is open or deferred, so a
 * publication can never label unresolved work as passed. `failed` and `pending` carry no such
 * constraint, because they already say the work is not through.
 */
export function handoverReview(value) {
  reviewKeys(value, REVIEW_KEYS, "the review");
  ensureReview(
    value.format === REVIEW_FORMAT && value.version === REVIEW_VERSION,
    `the review must declare format ${JSON.stringify(REVIEW_FORMAT)} version ${REVIEW_VERSION}`,
  );
  ensureReview(
    REVIEW_STATUSES.includes(value.status),
    `\`status\` must be one of ${REVIEW_STATUSES.join(", ")}`,
  );
  ensureReview(text(value.reviewer), "`reviewer` must name who reviewed");
  ensureReview(text(value.summary), "`summary` must say what the review concluded");
  ensureReview(
    value.evidence === null || text(value.evidence),
    "`evidence` must be a link or identifier for the full evidence, or null",
  );
  ensureReview(Array.isArray(value.findings), "`findings` must be an array");
  value.findings.forEach((finding, index) => {
    const label = `finding ${index + 1}`;
    reviewKeys(finding, FINDING_KEYS, label);
    ensureReview(
      FINDING_SEVERITIES.includes(finding.severity),
      `${label} \`severity\` must be one of ${FINDING_SEVERITIES.join(", ")}`,
    );
    ensureReview(
      FINDING_STATES.includes(finding.state),
      `${label} \`state\` must be one of ${FINDING_STATES.join(", ")}`,
    );
    ensureReview(text(finding.title), `${label} needs a \`title\``);
    ensureReview(typeof finding.detail === "string", `${label} \`detail\` must be a string`);
  });
  switch (value.status) {
    case "passed": {
      const standing = value.findings.findIndex(isUnresolvedBlocking);
      ensureReview(
        standing === -1,
        `it claims \`passed\` while blocking finding ${standing + 1} is not fixed`,
      );
      break;
    }
    case "failed":
    case "pending":
      break;
    default:
      unreachable(value.status, "REVIEW_STATUSES");
  }
  return value;
}

/** The header of a Git bundle (v2 or v3), read up to the blank line that starts its pack. */
export function bundleHeader(text) {
  const lines = String(text).split("\n");
  if (!BUNDLE_SIGNATURE.test(lines[0] ?? ""))
    refuse({ kind: "bundle-invalid", reason: "it does not start with a Git bundle signature" });
  const prerequisites = [];
  const references = [];
  for (const line of lines.slice(1)) {
    if (line === "") return { prerequisites, references };
    const prerequisite = BUNDLE_PREREQUISITE.exec(line);
    const reference = BUNDLE_REFERENCE.exec(line);
    if (prerequisite !== null) prerequisites.push(prerequisite[1]);
    else if (reference !== null) references.push({ sha: reference[1], name: reference[2] });
    else if (!BUNDLE_CAPABILITY.test(line))
      refuse({ kind: "bundle-invalid", reason: `its header carries ${JSON.stringify(line)}` });
  }
  return refuse({ kind: "bundle-invalid", reason: "its header never ends" });
}

/**
 * A bundle is fetchable only by someone who already has its prerequisites, and the one commit a
 * human is guaranteed to have is the base. A bundle cut from a sandbox's local mirror names that
 * mirror's commit instead, which no one else holds, so it is refused rather than shipped unusable.
 */
export function bundleAgreement(header, base) {
  if (header.prerequisites.length !== 1 || header.prerequisites[0] !== base)
    refuse({ kind: "bundle-prerequisite", expected: base, observed: header.prerequisites });
  return header;
}

/** What the inbox holds, read from its directory entries before any archive is opened. */
export function discoverInbox(entries) {
  const zips = [];
  const foreign = [];
  for (const entry of entries)
    (entry.kind === "file" && ZIP_FILE.test(entry.name) ? zips : foreign).push(entry.name);
  zips.sort();
  foreign.sort();
  if (foreign.length > 0) return { kind: "foreign", entries: foreign };
  if (zips.length === 0) return { kind: "empty" };
  if (zips.length > 1) return { kind: "ambiguous", zips };
  return { kind: "one", zip: zips[0] };
}

function list(values) {
  return values.map((value) => JSON.stringify(value)).join(", ");
}

/** The one sentence a human reads for each refusal. Every kind is named here and nowhere else. */
export function describeRefusal(refusal) {
  switch (refusal.kind) {
    case "ambiguous-inbox":
      return `${HANDOVER_INBOX}/ holds more than one zip (${list(refusal.zips)}); leave exactly one`;
    case "foreign-entry":
      return `${HANDOVER_INBOX}/ holds something that is not a zip (${list(refusal.entries)}); remove it`;
    case "tool-missing":
      return `\`${refusal.tool}\` is not installed or not on PATH`;
    case "identity-missing":
      return "Git has no committer identity; set user.name and user.email first";
    case "detached-head":
      return "HEAD is detached; check out the branch the handover should land on";
    case "operation-in-progress":
      return `a ${refusal.operation} is in progress; finish or abort it first`;
    case "dirty-tree":
      return `the working tree is not clean (${list(refusal.paths)}); commit or stash (with -u) first`;
    case "unreadable-archive":
      return `the archive cannot be read: ${refusal.reason}`;
    case "unsafe-entry":
      return `the archive entry ${JSON.stringify(refusal.entry)} is refused: ${refusal.reason}`;
    case "archive-too-large":
      return `the archive holds ${refusal.entries} entries and ${refusal.bytes} bytes, over ${MAX_ENTRIES} entries or ${MAX_UNCOMPRESSED_BYTES} bytes`;
    case "missing-file":
      return `the archive is missing ${JSON.stringify(refusal.path)}`;
    case "stray-file":
      return `the archive holds ${JSON.stringify(refusal.path)}, which the manifest does not declare`;
    case "invalid-manifest":
      return `${HANDOVER_MANIFEST} is invalid: ${refusal.reason}`;
    case "unsupported-version":
      return `${HANDOVER_MANIFEST} declares format ${JSON.stringify(refusal.format)} version ${JSON.stringify(refusal.version)}; this script reads ${HANDOVER_FORMAT} version ${HANDOVER_VERSIONS.join(" or ")}`;
    case "digest-mismatch":
      return `${JSON.stringify(refusal.file)} has SHA-256 ${refusal.observed}, not the declared ${refusal.expected}`;
    case "broken-chain":
      return `the patch chain contradicts itself: ${refusal.reason}`;
    case "base-missing":
      return `the base commit ${refusal.base} is not in this repository, and HEAD is not its content either: ${JSON.stringify(refusal.path)} is ${refusal.observed ?? "absent"} where the first patch expects ${refusal.expected ?? "absent"}; run \`git fetch\`, or apply the handover this one is stacked on first`;
    case "base-not-ancestor":
      return `the base commit ${refusal.base} is not an ancestor of HEAD ${refusal.head}; check out a branch that contains it`;
    case "base-disagrees":
      return `the first patch expects ${JSON.stringify(refusal.path)} at ${refusal.expected ?? "absent"} in the base, and the base has ${refusal.observed ?? "absent"}`;
    case "checkpoint-disagrees":
      return `the checkpoint store disagrees with the patch series: ${refusal.reason}`;
    case "bundle-invalid":
      return `the bundle is invalid: ${refusal.reason}`;
    case "bundle-prerequisite":
      return `the bundle needs ${list(refusal.observed)}, and the only prerequisite a handover may name is its base ${refusal.expected}`;
    case "head-moved":
      return `HEAD moved from ${refusal.expected} to ${refusal.observed} while the handover was being proved; run the command again`;
    case "invalid-review":
      return `the review result is invalid: ${refusal.reason}`;
    default:
      return unreachable(refusal, "REFUSAL_KINDS");
  }
}
