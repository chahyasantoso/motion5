// Pure checkpoint policy: manifest schema, patch grammar, and chain arithmetic.
// Contract: ADR-100 and ADR-101. No filesystem, network, Git, or credential access.
import { createHash } from "node:crypto";
import { identity } from "./automation-receipt.mjs";

export const CHECKPOINT_ROOT = ".ai/checkpoints";
export const MAX_PATCHES = 20;
export const MAX_PATHS = 50;
const SHA = /^[0-9a-f]{40}$/;
const DIGEST = /^[0-9a-f]{64}$/;
const CHECKPOINT_ID = /^cp[0-9]{3}$/;
const PATCH_FILE = /^([0-9]{3})-[a-z0-9][a-z0-9-]*\.diff$/;
const HUNK_HEADER = /^@@ -([0-9]+)(?:,([0-9]+))? \+([0-9]+)(?:,([0-9]+))? @@/;
const FILE_HEADER = /^diff --git a\/(.+) b\/(.+)$/;
const INDEX_LINE = /^index [0-9a-f]{7,40}\.\.[0-9a-f]{7,40}(?: 100644)?$/;
const FILE_MODE_LINE = /^(?:new|deleted) file mode /;
const CONTROL = /[\x00-\x08\x0b-\x1f\x7f\u2028\u2029]/u;
const SKIP_CI = /\[(?:skip ci|ci skip|no ci|skip actions|actions skip)\]|skip-checks\s*:/i;
const NO_NEWLINE = "\\ No newline at end of file";
const MODE = "100644";
const PROTECTED = [".git", ".github/workflows", ".ai", "node_modules"];
const MAX_ALLOW = 10;
const MAX_PATH_BYTES = 1024;
const MAX_SUBJECT_BYTES = 120;
const MAX_PATCH_BYTES = 1000000;
const REFUSED = [
  ["GIT binary patch", "binary patch"],
  ["Binary files ", "binary file summary"],
  ["rename from ", "rename"],
  ["rename to ", "rename"],
  ["copy from ", "copy"],
  ["copy to ", "copy"],
  ["similarity index ", "similarity index"],
  ["dissimilarity index ", "dissimilarity index"],
  ["old mode ", "mode change"],
  ["new mode ", "mode change"],
  ["Subproject commit ", "submodule update"],
];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function keys(value, allowed, label) {
  ensure(isObject(value), `${label} must be a JSON object`);
  for (const key of Object.keys(value))
    ensure(allowed.includes(key), `${label} carries the unknown key ${JSON.stringify(key)}`);
}

function plainText(value, label) {
  ensure(typeof value === "string" && value.length > 0, `${label} must be a non-empty string`);
  ensure(!CONTROL.test(value), `${label} carries a control character or a carriage return`);
}

/** A prefix or path is refused for shape alone, before any byte of it is quoted back. */
function canonical(value, label) {
  plainText(value, label);
  ensure(!/\s/u.test(value), `${label} must be whitespace-free: ${JSON.stringify(value)}`);
  ensure(!value.includes("\\"), `${label} must use forward slashes: ${JSON.stringify(value)}`);
  ensure(!value.startsWith("-"), `${label} must not start with a hyphen`);
  ensure(Buffer.byteLength(value) <= MAX_PATH_BYTES, `${label} exceeds ${MAX_PATH_BYTES} bytes`);
}

export function safePatchPath(value, allow) {
  canonical(value, "a patch path");
  const parts = value.split("/");
  ensure(
    parts.every((part) => part !== "" && part !== "." && part !== ".."),
    `a patch path must be canonical and relative: ${JSON.stringify(value)}`,
  );
  for (const prefix of PROTECTED)
    ensure(
      value !== prefix && !value.startsWith(`${prefix}/`),
      `${JSON.stringify(value)} is outside what a checkpoint may change`,
    );
  ensure(
    allow.some((prefix) => value.startsWith(prefix)),
    `${JSON.stringify(value)} is outside \`allow\``,
  );
  return value;
}

function allowPrefix(value) {
  canonical(value, "an `allow` prefix");
  ensure(
    value.endsWith("/"),
    `an \`allow\` prefix must end with a slash: ${JSON.stringify(value)}`,
  );
  const parts = value.slice(0, -1).split("/");
  ensure(
    parts.every((part) => part !== "" && part !== "." && part !== ".."),
    `an \`allow\` prefix must be canonical and relative: ${JSON.stringify(value)}`,
  );
  for (const prefix of PROTECTED)
    ensure(
      value !== `${prefix}/` && !value.startsWith(`${prefix}/`),
      `${JSON.stringify(value)} cannot be allowed to a checkpoint`,
    );
  return value;
}

function subject(value, label) {
  ensure(typeof value === "string" && value.trim().length > 0, `${label} needs a commit subject`);
  ensure(!CONTROL.test(value) && !value.includes("\n"), `${label} subject must be one clean line`);
  ensure(
    Buffer.byteLength(value) <= MAX_SUBJECT_BYTES,
    `${label} subject exceeds ${MAX_SUBJECT_BYTES} bytes`,
  );
  ensure(!SKIP_CI.test(value), `${label} subject must not carry a CI-skip directive`);
}

function imageMap(value, label, allow) {
  ensure(isObject(value), `${label} must be a JSON object`);
  const paths = Object.keys(value);
  ensure(
    paths.length > 0 && paths.length <= MAX_PATHS,
    `${label} must name 1 through ${MAX_PATHS} paths`,
  );
  for (const path of paths) {
    safePatchPath(path, allow);
    const blob = value[path];
    ensure(
      blob === null || (typeof blob === "string" && SHA.test(blob)),
      `${label} needs a blob SHA or null for ${JSON.stringify(path)}`,
    );
  }
  return paths.slice().sort();
}

export function checkpointManifest(value) {
  keys(value, ["version", "checkpoint", "base", "allow", "patches"], "manifest");
  ensure(value.version === 1, "`version` must be 1; unversioned checkpoints are refused");
  ensure(
    typeof value.checkpoint === "string" && CHECKPOINT_ID.test(value.checkpoint),
    "`checkpoint` must be a numbered id such as `cp001`",
  );
  ensure(
    typeof value.base === "string" && SHA.test(value.base),
    "`base` must be a full lowercase commit SHA",
  );
  ensure(
    Array.isArray(value.allow) && value.allow.length > 0 && value.allow.length <= MAX_ALLOW,
    `\`allow\` must carry 1 through ${MAX_ALLOW} directory prefixes`,
  );
  value.allow.forEach(allowPrefix);
  ensure(new Set(value.allow).size === value.allow.length, "`allow` repeats a prefix");
  ensure(
    Array.isArray(value.patches) && value.patches.length > 0 && value.patches.length <= MAX_PATCHES,
    `\`patches\` must carry 1 through ${MAX_PATCHES} entries`,
  );
  const names = new Set();
  const digests = new Set();
  value.patches.forEach((patch, index) => {
    const label = `patch ${index + 1}`;
    keys(patch, ["seq", "after", "file", "sha256", "message", "pre", "post"], label);
    ensure(patch.seq === index + 1, `${label} must declare \`seq: ${index + 1}\``);
    if (index === 0)
      ensure(!Object.hasOwn(patch, "after"), "the first patch declares no `after` predecessor");
    else ensure(patch.after === index, `${label} must declare \`after: ${index}\``);
    const name = PATCH_FILE.exec(typeof patch.file === "string" ? patch.file : "");
    ensure(name !== null, `${label} must name a patch file such as \`001-slug.diff\``);
    ensure(Number(name[1]) === patch.seq, `${label} filename must be numbered by its \`seq\``);
    ensure(!names.has(patch.file), `${label} repeats a patch filename`);
    names.add(patch.file);
    ensure(
      typeof patch.sha256 === "string" && DIGEST.test(patch.sha256),
      `${label} needs a SHA-256 digest over its patch bytes`,
    );
    ensure(!digests.has(patch.sha256), `${label} repeats a patch digest`);
    digests.add(patch.sha256);
    subject(patch.message, label);
    const pre = imageMap(patch.pre, `${label} \`pre\``, value.allow);
    const post = imageMap(patch.post, `${label} \`post\``, value.allow);
    ensure(
      pre.join("\n") === post.join("\n"),
      `${label} must declare the same paths in \`pre\` and \`post\``,
    );
    for (const path of pre)
      ensure(
        patch.pre[path] !== null || patch.post[path] !== null,
        `${label} declares ${JSON.stringify(path)} absent both before and after`,
      );
  });
  return value;
}

/**
 * A stack declares its predecessor by sequence and proves it by content: the first patch to name a
 * path fixes that path's base pre-image, and every later patch must match the running post-image.
 */
export function checkpointChain(manifest) {
  const base = new Map();
  const tip = new Map();
  for (const patch of manifest.patches)
    for (const path of Object.keys(patch.pre)) {
      if (tip.has(path))
        ensure(
          patch.pre[path] === tip.get(path),
          `patch ${patch.seq} contradicts the post-image of ${JSON.stringify(path)}`,
        );
      else base.set(path, patch.pre[path]);
      tip.set(path, patch.post[path]);
    }
  ensure(tip.size <= MAX_PATHS, `a checkpoint may touch at most ${MAX_PATHS} paths`);
  return { base, tip, paths: [...tip.keys()].sort() };
}

function readHeader(lines, start, allow) {
  const header = FILE_HEADER.exec(lines[start] ?? "");
  ensure(header !== null, `expected a \`diff --git\` header at patch line ${start + 1}`);
  ensure(header[1] === header[2], "a patch may not move a file");
  const file = safePatchPath(header[1], allow);
  let index = start + 1;
  let change = "modify";
  while (index < lines.length) {
    const line = lines[index];
    if (line === `new file mode ${MODE}`) change = "create";
    else if (line === `deleted file mode ${MODE}`) change = "delete";
    else if (FILE_MODE_LINE.test(line)) ensure(false, "protocol v1 carries only 100644 files");
    else if (!INDEX_LINE.test(line)) break;
    index += 1;
  }
  const from = change === "create" ? "--- /dev/null" : `--- a/${file}`;
  const to = change === "delete" ? "+++ /dev/null" : `+++ b/${file}`;
  ensure(lines[index] === from, `expected \`${from}\` at patch line ${index + 1}`);
  ensure(lines[index + 1] === to, `expected \`${to}\` at patch line ${index + 2}`);
  return { file, change, index: index + 2 };
}

function readHunks(lines, start) {
  let index = start;
  let hunks = 0;
  while (index < lines.length && lines[index].startsWith("@@")) {
    const header = HUNK_HEADER.exec(lines[index]);
    ensure(header !== null, `malformed hunk header at patch line ${index + 1}`);
    const before = header[2] === undefined ? 1 : Number(header[2]);
    const after = header[4] === undefined ? 1 : Number(header[4]);
    ensure(before + after > 0, `a hunk at patch line ${index + 1} changes nothing`);
    index += 1;
    let seenBefore = 0;
    let seenAfter = 0;
    while (seenBefore < before || seenAfter < after) {
      const line = lines[index];
      ensure(line !== undefined, "a hunk ends before its declared line counts");
      if (line === NO_NEWLINE) {
        index += 1;
        continue;
      }
      const marker = line.slice(0, 1);
      ensure(
        line === "" || marker === " " || marker === "+" || marker === "-",
        `unexpected hunk body at patch line ${index + 1}`,
      );
      if (marker === "-") seenBefore += 1;
      else if (marker === "+") seenAfter += 1;
      else {
        seenBefore += 1;
        seenAfter += 1;
      }
      ensure(
        seenBefore <= before && seenAfter <= after,
        `a hunk at patch line ${index + 1} exceeds its declared line counts`,
      );
      index += 1;
    }
    while (lines[index] === NO_NEWLINE) index += 1;
    hunks += 1;
  }
  ensure(hunks > 0, "a file section carries no hunk");
  return index;
}

export function parsePatch(text, allow) {
  ensure(typeof text === "string" && text.length > 0, "a patch must be non-empty text");
  ensure(Buffer.byteLength(text) <= MAX_PATCH_BYTES, `a patch exceeds ${MAX_PATCH_BYTES} bytes`);
  ensure(!CONTROL.test(text), "a patch must be LF text without control characters");
  ensure(text.endsWith("\n"), "a patch must end with a newline");
  const lines = text.split("\n");
  lines.pop();
  for (const [marker, reason] of REFUSED)
    ensure(!lines.some((line) => line.startsWith(marker)), `protocol v1 carries no ${reason}`);
  const files = [];
  let index = 0;
  while (index < lines.length) {
    const header = readHeader(lines, index, allow);
    index = readHunks(lines, header.index);
    files.push({ path: header.file, change: header.change });
  }
  ensure(files.length > 0, "a patch must touch at least one file");
  const paths = files.map((file) => file.path);
  ensure(new Set(paths).size === paths.length, "a patch names one path twice");
  return files;
}

/** The parsed patch and its manifest entry must agree on both the paths and their shape. */
export function reconcilePatch(parsed, patch) {
  const declared = Object.keys(patch.pre).slice().sort();
  const touched = parsed.map((file) => file.path).sort();
  ensure(
    declared.join("\n") === touched.join("\n"),
    `patch ${patch.seq} touches a path set its manifest entry does not declare`,
  );
  for (const file of parsed) {
    const created = patch.pre[file.path] === null;
    const deleted = patch.post[file.path] === null;
    const change = created ? "create" : deleted ? "delete" : "modify";
    ensure(
      file.change === change,
      `patch ${patch.seq} declares ${JSON.stringify(file.path)} as a ${change}`,
    );
  }
}

export function patchDigest(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function checkpointDigest(manifest) {
  return identity(manifest).digest;
}

export function checkpointDirectory(manifest) {
  return `${CHECKPOINT_ROOT}/${manifest.checkpoint}`;
}

export function checkpointFiles(manifest) {
  const directory = checkpointDirectory(manifest);
  const patches = manifest.patches.map((patch) => `${directory}/${patch.file}`);
  return [`${directory}/manifest.json`, ...patches];
}
