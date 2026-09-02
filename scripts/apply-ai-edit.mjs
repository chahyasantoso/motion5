#!/usr/bin/env node
// Applies one AI edit request from .ai/edits/. Anchors only, and all or nothing: every edit names
// the exact text it replaces, an anchor that does not match exactly once is refused, and no file is
// written until every edit has validated.
//
// Usage: node scripts/apply-ai-edit.mjs <request.json> <report.md> <touched.txt>
// Contract: docs/AI-EDIT-WORKFLOW.md

import { existsSync } from "node:fs";
import { appendFile, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_EDITS = 50;
const FORBIDDEN_PREFIXES = [".git/", ".github/workflows/", ".ai/", "node_modules/"];

const [requestPath, reportPath, touchedPath] = process.argv.slice(2);

const report = [];
const problems = [];

function say(line) {
  report.push(line);
}

function refuse(problem) {
  problems.push(problem);
}

function guardPath(target) {
  if (typeof target !== "string" || target.trim() === "") {
    return "the edit is missing its `path`";
  }
  if (path.isAbsolute(target)) {
    return `\`${target}\` is an absolute path`;
  }
  const normalized = path.normalize(target).split(path.sep).join("/");
  if (normalized === ".." || normalized.startsWith("../")) {
    return `\`${target}\` escapes the repository`;
  }
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      return `\`${normalized}\` is outside what this workflow may edit`;
    }
  }
  return null;
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

// A refusal must exit non-zero. The workflow skips the commit step when this one fails, which is
// what leaves a refused request in the directory for a corrected push, and the report is written
// before the exit code is set so the comment still reaches the author.
async function finish(exitCode = 0) {
  if (problems.length > 0) {
    say("");
    say("**Refused.** No file was written and nothing was committed.");
    say("");
    for (const problem of problems) {
      say(`- ${problem}`);
    }
  }
  const text = `${report.join("\n")}\n`;
  if (reportPath) {
    await writeFile(reportPath, text, "utf8");
  }
  process.stdout.write(text);
  process.exitCode = problems.length > 0 ? 1 : exitCode;
}

async function main() {
  if (!requestPath) {
    refuse("no request file was named on the command line");
    return;
  }
  if (!existsSync(requestPath)) {
    refuse(`\`${requestPath}\` does not exist`);
    return;
  }

  let request;
  try {
    request = JSON.parse(await readFile(requestPath, "utf8"));
  } catch (error) {
    refuse(`\`${requestPath}\` is not valid JSON: ${error.message}`);
    return;
  }
  if (request === null || typeof request !== "object" || Array.isArray(request)) {
    refuse(`\`${requestPath}\` must contain a JSON object`);
    return;
  }

  const message = typeof request.message === "string" ? request.message.trim() : "";
  if (message === "" || message.includes("\n")) {
    refuse("`message` must be a single non-empty line, used verbatim as the commit subject");
  } else {
    await emitOutput("message", message);
  }

  if (request.target !== undefined) {
    if (!Number.isInteger(request.target) || request.target <= 0) {
      refuse("`target` must be the issue or pull request number to report back to");
    } else {
      await emitOutput("target", request.target);
    }
  }

  const edits = request.edits;
  if (!Array.isArray(edits) || edits.length === 0) {
    refuse("`edits` must be a non-empty array");
    return;
  }
  if (edits.length > MAX_EDITS) {
    refuse(`\`edits\` holds ${edits.length} entries, and ${MAX_EDITS} is the ceiling`);
    return;
  }

  // Validation pass. Edits are staged against evolving in-memory content so that two anchors in
  // the same file are honest about what the second one will actually see.
  const staged = new Map();
  const removed = new Set();
  const created = new Set();

  for (const [index, edit] of edits.entries()) {
    const label = `edit ${index + 1}`;
    if (edit === null || typeof edit !== "object" || Array.isArray(edit)) {
      refuse(`${label} is not an object`);
      continue;
    }

    const pathProblem = guardPath(edit.path);
    if (pathProblem) {
      refuse(`${label}: ${pathProblem}`);
      continue;
    }
    const target = path.normalize(edit.path).split(path.sep).join("/");

    const modes = describeMode(edit);
    if (modes.length !== 1) {
      refuse(
        `${label} on \`${target}\` must name exactly one of find/replace, create, or delete, and it names ${modes.length}`,
      );
      continue;
    }
    const [mode] = modes;

    if (removed.has(target) && mode !== "create") {
      refuse(`${label} edits \`${target}\`, which an earlier edit in this request deleted`);
      continue;
    }

    if (mode === "delete") {
      if (edit.delete !== true) {
        refuse(`${label} on \`${target}\`: \`delete\` must be \`true\``);
        continue;
      }
      if (!existsSync(target) && !staged.has(target)) {
        refuse(`${label} deletes \`${target}\`, which does not exist`);
        continue;
      }
      staged.delete(target);
      created.delete(target);
      removed.add(target);
      continue;
    }

    if (mode === "create") {
      if (typeof edit.create !== "string") {
        refuse(`${label} on \`${target}\`: \`create\` must be the full file content as a string`);
        continue;
      }
      if (existsSync(target) && !removed.has(target)) {
        refuse(`${label} creates \`${target}\`, which already exists. Use find/replace instead.`);
        continue;
      }
      staged.set(target, edit.create);
      created.add(target);
      removed.delete(target);
      continue;
    }

    if (typeof edit.find !== "string" || edit.find === "") {
      refuse(`${label} on \`${target}\`: \`find\` must be a non-empty string`);
      continue;
    }
    if (typeof edit.replace !== "string") {
      refuse(`${label} on \`${target}\`: \`replace\` must be a string, empty to delete the anchor`);
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

    staged.set(
      target,
      current.replace(edit.find, () => edit.replace),
    );
  }

  if (problems.length > 0) return;

  // Write pass. Nothing above this line has touched the working tree.
  const touched = [];
  for (const [target, content] of staged) {
    const before = existsSync(target) ? await readFile(target, "utf8") : null;
    if (before === content) continue;
    await writeFile(target, content, "utf8");
    touched.push(target);
  }
  for (const target of removed) {
    if (!existsSync(target)) continue;
    await unlink(target);
    touched.push(target);
  }
  touched.sort();

  if (touchedPath) {
    await writeFile(touchedPath, touched.length > 0 ? `${touched.join("\n")}\n` : "", "utf8");
  }
  await emitOutput("changed", touched.length > 0 ? "true" : "false");

  say(`Applied ${edits.length} edit${edits.length === 1 ? "" : "s"} from \`${requestPath}\`.`);
  say("");
  if (touched.length === 0) {
    say("Every edit was already satisfied, so no file changed.");
    return;
  }
  say("Files written, before the formatter runs:");
  say("");
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
