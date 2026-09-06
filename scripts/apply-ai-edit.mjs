#!/usr/bin/env node
// Contract: docs/AI-EDIT-WORKFLOW.md. Tests: the AE- cases in apply-ai-edit.test.ts.
// Validate the complete request before changing files. The workflow owns publication.
import { createHash } from "node:crypto";
import { existsSync, lstatSync } from "node:fs";
import { appendFile, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_EDITS = 50;
const FORBIDDEN_PREFIXES = [".git", ".github/workflows", ".ai", "node_modules"];
const REQUEST_KEYS = new Set([
  "version",
  "expected_head",
  "expected_blobs",
  "message",
  "target",
  "dry_run",
  "edits",
]);
const EDIT_KEYS = new Set(["path", "find", "replace", "create", "delete"]);
const SHA = /^[0-9a-f]{40}$/;
const SKIP_CI = /\[(?:skip ci|ci skip|no ci|skip actions|actions skip)\]|skip-checks\s*:/i;
const DRY_RUN_SUBJECT = "chore(ai-edit): dry run, nothing applied";
const [requestPath, reportPath, touchedPath, formatPath] = process.argv.slice(2);
const report = [];
const problems = [];
let writing = false;

function say(line) {
  report.push(line);
}

function refuse(problem) {
  problems.push(problem);
}

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasControl(value) {
  return [...value].some((char) => {
    const code = char.codePointAt(0);
    return code < 32 || code === 127 || code === 0x2028 || code === 0x2029;
  });
}

function unknownKeys(value, allowed, label) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) refuse(`${label}: unknown key ${JSON.stringify(key)}`);
  }
}

/** Line-oriented workflow files require unambiguous paths. Never follow a symlink. */
function guardPath(target) {
  if (typeof target !== "string" || target.trim() === "") {
    return "the edit is missing its `path`";
  }
  if (path.isAbsolute(target)) return `\`${target}\` is an absolute path`;
  if (target === ".." || target.startsWith("../")) {
    return `\`${target}\` escapes the repository`;
  }
  if (
    hasControl(target) ||
    /\s/u.test(target) ||
    target.includes("\\") ||
    target.startsWith("-") ||
    target.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    return `${JSON.stringify(target)} is not a canonical, whitespace-free relative path`;
  }
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (target === prefix || target.startsWith(`${prefix}/`)) {
      return `\`${target}\` is outside what this workflow may edit`;
    }
  }
  let current = ".";
  const parts = target.split("/");
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    let stat;
    try {
      stat = lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT" && index === parts.length - 1) return null;
      return `\`${target}\` has a missing or unreadable parent`;
    }
    if (stat.isSymbolicLink()) return `\`${target}\` traverses a symbolic link`;
    if (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile()) {
      return `\`${target}\` is not a regular file beneath existing directories`;
    }
  }
  return null;
}

function blobSha(bytes) {
  return createHash("sha1")
    .update(`blob ${bytes.length}${String.fromCharCode(0)}`)
    .update(bytes)
    .digest("hex");
}

function listFile(paths) {
  return paths.length > 0 ? `${paths.join("\n")}\n` : "";
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

function describeMode(edit) {
  const modes = [];
  if (Object.hasOwn(edit, "find") || Object.hasOwn(edit, "replace")) modes.push("anchor");
  if (Object.hasOwn(edit, "create")) modes.push("create");
  if (Object.hasOwn(edit, "delete")) modes.push("delete");
  return modes;
}

async function emitOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  await appendFile(process.env.GITHUB_OUTPUT, `${key}=${value}\n`, "utf8");
}

async function finish(exitCode = 0) {
  if (problems.length > 0) {
    say("");
    say(
      writing
        ? "**Application failed.** The runner tree may be partially changed. Nothing was committed by this script."
        : "**Refused.** No file was written and nothing was committed.",
    );
    say("");
    for (const problem of problems) say(`- ${problem}`);
  }
  const text = `${report.join("\n")}\n`;
  if (reportPath) await writeFile(reportPath, text, "utf8");
  process.stdout.write(text);
  process.exitCode = problems.length > 0 ? 1 : exitCode;
}

async function main() {
  if (!requestPath || !existsSync(requestPath)) {
    refuse("no existing request file was named on the command line");
    return;
  }
  let request;
  try {
    request = JSON.parse(await readFile(requestPath, "utf8"));
  } catch (error) {
    refuse(`\`${requestPath}\` is not valid JSON: ${error.message}`);
    return;
  }
  if (!object(request)) {
    refuse(`\`${requestPath}\` must contain a JSON object`);
    return;
  }
  unknownKeys(request, REQUEST_KEYS, "request");
  if (request.version !== 1) refuse("`version` must be 1; unversioned requests are refused");
  if (typeof request.expected_head !== "string" || !SHA.test(request.expected_head)) {
    refuse("`expected_head` must be a full lowercase commit SHA");
  } else if (
    !SHA.test(process.env.AI_EDIT_BASE_SHA ?? "") ||
    request.expected_head !== process.env.AI_EDIT_BASE_SHA
  ) {
    refuse("stale or unverified `expected_head`; read the current branch and resubmit");
  }
  if (!object(request.expected_blobs)) refuse("`expected_blobs` must be an object");
  if (request.dry_run !== undefined && typeof request.dry_run !== "boolean") {
    refuse("`dry_run` must be `true` or `false`");
  }
  const dryRun = request.dry_run === true;
  const message = typeof request.message === "string" ? request.message.trim() : "";
  if (message === "" || hasControl(request.message)) {
    refuse("`message` must be a single non-empty line without control characters");
  } else if (SKIP_CI.test(message)) {
    refuse("`message` must not contain a CI-skip directive");
  }
  // A valid target remains useful for reporting a refused request.
  if (request.target !== undefined) {
    if (!Number.isSafeInteger(request.target) || request.target <= 0) {
      refuse("`target` must be the issue or pull request number to report back to");
    } else {
      await emitOutput("target", request.target);
    }
  }
  const edits = request.edits;
  if (!Array.isArray(edits) || edits.length === 0 || edits.length > MAX_EDITS) {
    refuse(`\`edits\` must contain 1 through ${MAX_EDITS} entries`);
    return;
  }

  // Preconditions refer to original bytes, never to preceding edits' staged output.
  const paths = new Set();
  for (const [index, edit] of edits.entries()) {
    const label = `edit ${index + 1}`;
    if (!object(edit)) {
      refuse(`${label} is not an object`);
      continue;
    }
    unknownKeys(edit, EDIT_KEYS, label);
    const problem = guardPath(edit.path);
    if (problem) refuse(`${label}: ${problem}`);
    else paths.add(edit.path);
  }
  if (problems.length > 0) return;
  for (const target of Object.keys(request.expected_blobs)) {
    if (!paths.has(target)) refuse(`unexpected blob precondition for \`${target}\``);
  }
  for (const target of paths) {
    if (!Object.hasOwn(request.expected_blobs, target)) {
      refuse(`missing blob precondition for \`${target}\``);
      continue;
    }
    const expected = request.expected_blobs[target];
    if (expected !== null && (typeof expected !== "string" || !SHA.test(expected))) {
      refuse(`invalid blob SHA for \`${target}\`; use null only for an absent file`);
      continue;
    }
    const actual = existsSync(target) ? blobSha(await readFile(target)) : null;
    if (actual !== expected) refuse(`stale blob precondition for \`${target}\``);
  }
  if (problems.length > 0) return;

  const staged = new Map();
  const removed = new Set();
  const created = new Set();
  const anchored = [];
  for (const [index, edit] of edits.entries()) {
    const label = `edit ${index + 1}`;
    const target = edit.path;
    const modes = describeMode(edit);
    if (modes.length !== 1) {
      refuse(`${label} on \`${target}\` must name exactly one of find/replace, create, or delete`);
      continue;
    }
    const [mode] = modes;
    if (removed.has(target) && mode !== "create") {
      refuse(`${label} edits \`${target}\`, which an earlier edit in this request deleted`);
      continue;
    }
    if (mode === "delete") {
      if (edit.delete !== true) refuse(`${label}: \`delete\` must be \`true\``);
      else if (!existsSync(target) && !staged.has(target)) {
        refuse(`${label} deletes \`${target}\`, which does not exist`);
      } else {
        staged.delete(target);
        created.delete(target);
        removed.add(target);
      }
      continue;
    }
    if (mode === "create") {
      if (typeof edit.create !== "string") refuse(`${label}: \`create\` must be a string`);
      else if (staged.has(target) || (existsSync(target) && !removed.has(target))) {
        refuse(`${label} creates \`${target}\`, which already exists. Use find/replace instead.`);
      } else {
        staged.set(target, edit.create);
        created.add(target);
        removed.delete(target);
      }
      continue;
    }
    if (typeof edit.find !== "string" || edit.find === "") {
      refuse(`${label}: \`find\` must be a non-empty string`);
      continue;
    }
    if (typeof edit.replace !== "string") {
      refuse(`${label}: \`replace\` must be a string`);
      continue;
    }
    let current = staged.get(target);
    if (current === undefined) {
      if (!existsSync(target)) {
        refuse(`${label} edits \`${target}\`, which does not exist`);
        continue;
      }
      current = await readFile(target, "utf8");
    }
    const occurrences = countOccurrences(current, edit.find);
    if (occurrences !== 1) {
      const first = edit.find.split("\n", 1)[0].slice(0, 80);
      refuse(
        `${label} on \`${target}\`: the anchor matched ${occurrences} times and must match exactly once. It starts \`${first}\`.`,
      );
      continue;
    }
    anchored.push(target);
    staged.set(
      target,
      current.replace(edit.find, () => edit.replace),
    );
  }
  if (problems.length > 0) return;
  await emitOutput("message", dryRun ? DRY_RUN_SUBJECT : message);
  if (dryRun) {
    await emitOutput("changed", "false");
    if (touchedPath) await writeFile(touchedPath, "", "utf8");
    if (formatPath) await writeFile(formatPath, "", "utf8");
    say(
      `**Dry run.** Validated ${edits.length} edit${edits.length === 1 ? "" : "s"} from \`${requestPath}\`.`,
    );
    say("");
    say("No file was written and the tree is unchanged.");
    if (anchored.length > 0) {
      const counts = new Map();
      for (const target of anchored) counts.set(target, (counts.get(target) ?? 0) + 1);
      say("");
      say("Anchors, counted against the file rather than against a prefix of it:");
      for (const [target, count] of counts) {
        say(
          `- \`${target}\`: ${count} anchor${count === 1 ? "" : "s"}, each matching exactly once`,
        );
      }
    }
    const planned = [];
    for (const [target, content] of staged) {
      const before = existsSync(target) ? await readFile(target, "utf8") : null;
      const state = created.has(target) ? "created" : "edited";
      const size = Buffer.byteLength(content, "utf8");
      const note =
        before === content
          ? "already satisfied, so nothing would be written"
          : `${state}, ${before === null ? "" : `${Buffer.byteLength(before, "utf8")} -> `}${size} bytes`;
      planned.push({ target, note });
    }
    for (const target of removed) {
      if (existsSync(target)) planned.push({ target, note: "deleted" });
    }
    planned.sort((a, b) => a.target.localeCompare(b.target));
    say("");
    say("What a real run would write:");
    for (const entry of planned) say(`- \`${entry.target}\` ${entry.note}`);
    say("");
    say("Sizes are measured before the formatter runs, so read them as close rather than exact.");
    return;
  }

  // A filesystem failure may partially change the disposable tree. Never publish after failure.
  writing = true;
  const touched = [];
  const formattable = [];
  for (const [target, content] of staged) {
    const before = existsSync(target) ? await readFile(target, "utf8") : null;
    if (before === content) continue;
    await writeFile(target, content, "utf8");
    touched.push(target);
    formattable.push(target);
  }
  for (const target of removed) {
    if (!existsSync(target)) continue;
    await unlink(target);
    touched.push(target);
  }
  touched.sort();
  formattable.sort();
  if (touchedPath) await writeFile(touchedPath, listFile(touched), "utf8");
  if (formatPath) await writeFile(formatPath, listFile(formattable), "utf8");
  await emitOutput("changed", touched.length > 0 ? "true" : "false");
  say(`Applied ${edits.length} edit${edits.length === 1 ? "" : "s"} from \`${requestPath}\`.`);
  say("");
  say("Runner changes only; the workflow reports whether a commit was published.");
  if (touched.length === 0) say("Every edit is already satisfied, so no file changed.");
  for (const target of touched) {
    const state = removed.has(target) ? "deleted" : created.has(target) ? "created" : "edited";
    say(`- \`${target}\` ${state}`);
  }
}

try {
  await main();
  await finish();
} catch (error) {
  refuse(`internal error: ${error instanceof Error ? error.message : String(error)}`);
  await finish(1);
}
