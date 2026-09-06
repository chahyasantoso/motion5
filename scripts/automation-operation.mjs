// Bounded operation policy and isolated preparation. No publication credentials or shell input.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { lstat, readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { identity, safeText } from "./automation-receipt.mjs";
import { ensure, SHA, blobSha } from "./automation-report.mjs";
import {
  checkSize,
  checkMirror,
  sisterDocOf,
  SISTER_DOC_TRIGGER_BYTES,
} from "./read-budget-scan.mjs";

const CHECKS = ["format", "read-budget"];
const digest = (text) => createHash("sha256").update(text).digest("hex");
const size = (text) => (text === null ? 0 : Buffer.byteLength(text));
function keys(value, allowed) {
  ensure(value && typeof value === "object" && !Array.isArray(value), "Expected object");
  ensure(
    Object.keys(value).every((key) => allowed.includes(key)),
    "Unknown operation field",
  );
}
export function safeRequestPath(value) {
  ensure(
    typeof value === "string" &&
      value.length > 0 &&
      value.length <= 1024 &&
      !/[\s\\\x00-\x1f\x7f]/u.test(value) &&
      !value.startsWith("-") &&
      value.split("/").every((part) => part && part !== "." && part !== ".."),
    "Unsafe candidate path",
  );
  ensure(
    ![".git", ".ai", ".github/workflows", "node_modules"].some(
      (prefix) => value === prefix || value.startsWith(prefix + "/"),
    ),
    "Protected candidate path",
  );
}
export function operationSpec(request) {
  keys(request, [
    "version",
    "expected_head",
    "expected_blobs",
    "message",
    "target",
    "dry_run",
    "edits",
    "operation",
    "paths",
    "checks",
  ]);
  identity(request);
  ensure(
    request.version === 1 &&
      typeof request.expected_head === "string" &&
      SHA.test(request.expected_head),
    "Invalid request version or source SHA",
  );
  ensure(request.dry_run === undefined || typeof request.dry_run === "boolean", "Invalid dry_run");
  ensure(
    request.operation === undefined || request.dry_run === undefined,
    "operation and dry_run are mutually exclusive",
  );
  const operation = request.operation ?? (request.dry_run === true ? "preview" : "apply");
  ensure(
    ["apply", "preview", "validate"].includes(operation),
    "Unsupported operation; maintenance is not activated",
  );
  ensure(
    typeof request.message === "string" &&
      request.message.trim().length > 0 &&
      !/[\x00-\x1f\x7f\u2028\u2029]/u.test(request.message) &&
      !/\[(?:skip ci|ci skip|no ci|skip actions|actions skip)\]|skip-checks\s*:/i.test(
        request.message,
      ),
    "Invalid commit subject",
  );
  ensure(
    request.target === undefined || (Number.isSafeInteger(request.target) && request.target > 0),
    "Invalid target",
  );
  let paths;
  if (operation === "validate") {
    ensure(
      request.edits === undefined &&
        Array.isArray(request.paths) &&
        request.paths.length > 0 &&
        request.paths.length <= 50,
      "Validation needs 1 through 50 paths and no edits",
    );
    ensure(
      Array.isArray(request.checks) &&
        request.checks.length > 0 &&
        request.checks.length <= CHECKS.length &&
        new Set(request.checks).size === request.checks.length &&
        request.checks.every((check) => CHECKS.includes(check)),
      "Validation checks must be allowlisted and unique",
    );
    paths = request.paths;
    ensure(new Set(paths).size === paths.length, "Duplicate validation path");
  } else {
    ensure(
      request.paths === undefined && request.checks === undefined,
      "Edit operations do not accept validation fields",
    );
    ensure(
      Array.isArray(request.edits) && request.edits.length > 0 && request.edits.length <= 50,
      "Expected 1 through 50 edits",
    );
    for (const edit of request.edits) {
      keys(edit, ["path", "find", "replace", "create", "delete"]);
      const anchor = Object.hasOwn(edit, "find") || Object.hasOwn(edit, "replace");
      ensure(
        Number(anchor) +
          Number(Object.hasOwn(edit, "create")) +
          Number(Object.hasOwn(edit, "delete")) ===
          1,
        "Expected exactly one edit operation",
      );
      ensure(
        !anchor ||
          (typeof edit.find === "string" &&
            edit.find.length > 0 &&
            typeof edit.replace === "string"),
        "Invalid anchor edit",
      );
      ensure(!Object.hasOwn(edit, "create") || typeof edit.create === "string", "Invalid create");
      ensure(!Object.hasOwn(edit, "delete") || edit.delete === true, "Invalid delete");
    }
    paths = [...new Set(request.edits.map((edit) => edit.path))];
  }
  paths.forEach(safeRequestPath);
  keys(request.expected_blobs, paths);
  ensure(Object.keys(request.expected_blobs).length === paths.length, "Missing blob precondition");
  for (const file of paths) {
    const value = request.expected_blobs[file];
    ensure(
      Object.hasOwn(request.expected_blobs, file) &&
        ((operation !== "validate" && value === null) ||
          (typeof value === "string" && SHA.test(value))),
      "Invalid blob precondition",
    );
  }
  return { operation, paths, checks: operation === "validate" ? request.checks : CHECKS };
}
async function textAt(root, file) {
  safeRequestPath(file);
  let current = root;
  const parts = file.split("/");
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    let stat;
    try {
      stat = await lstat(current);
    } catch (error) {
      if (error.code === "ENOENT" && i === parts.length - 1) return null;
      throw error;
    }
    ensure(
      !stat.isSymbolicLink() && (i === parts.length - 1 ? stat.isFile() : stat.isDirectory()),
      "Unsafe file or ancestor",
    );
    if (i === parts.length - 1) ensure(stat.size <= 1500000, "Input file exceeds byte limit");
  }
  const bytes = await readFile(current),
    text = bytes.toString("utf8");
  ensure(!text.includes("\0") && Buffer.from(text).equals(bytes), "Expected UTF-8 text");
  return text;
}
async function budgetResult(root, file, content) {
  if (!file.startsWith("packages/core/src/") || content === null)
    return { state: "not_applicable", detail: "No surviving core source file" };
  const problems = [];
  const tooLarge = checkSize(file, size(content));
  if (tooLarge) problems.push(tooLarge);
  if (/\.(?:ts|tsx)$/.test(file)) {
    const sister = await textAt(root, sisterDocOf(file));
    if (size(content) > SISTER_DOC_TRIGGER_BYTES || sister !== null)
      problems.push(...checkMirror(file, content, sister ?? undefined));
  }
  return {
    state: problems.length ? "failure" : "passed",
    detail: safeText(problems.join("\n")).slice(0, 4000),
  };
}
function diffFor(file, before, after, scratch) {
  if (before === after) return "";
  const result = spawnSync(
    "git",
    [
      "diff",
      "--no-index",
      "--no-ext-diff",
      "--no-textconv",
      "--unified=3",
      "--",
      "before.txt",
      "after.txt",
    ],
    {
      cwd: scratch,
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 1000000,
      env: {
        PATH: process.env.PATH,
        HOME: scratch,
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_GLOBAL: "/dev/null",
      },
    },
  );
  ensure(!result.error && [0, 1].includes(result.status), "Preview diff unavailable or oversized");
  return result.stdout
    .replace(/^diff --git .*$/m, () => "diff --git a/" + file + " b/" + file)
    .replace(/^--- .*$/m, () => (before === null ? "--- /dev/null" : "--- a/" + file))
    .replace(/^\+\+\+ .*$/m, () => (after === null ? "+++ /dev/null" : "+++ b/" + file));
}
export async function prepareOperation(
  root,
  trustedSha,
  formatterRoot,
  requestPath,
  requestCommit,
  source,
  request,
) {
  const spec = operationSpec(request);
  ensure(request.expected_head === source, "Stale source SHA");
  const before = new Map();
  let total = 0;
  for (const file of spec.paths) {
    const text = await textAt(root, file);
    total += size(text);
    ensure(total <= 1500000, "Combined input exceeds byte limit");
    ensure(
      request.expected_blobs[file] === (text === null ? null : blobSha(Buffer.from(text))),
      "Stale source blob",
    );
    before.set(file, text);
  }
  const scratch = await mkdtemp(path.join(tmpdir(), "motion5-operation-"));
  try {
    const prettier = await import(
      pathToFileURL(path.join(formatterRoot, "node_modules/prettier/index.mjs")).href
    );
    const options = JSON.parse(
      await readFile(new URL("../.prettierrc.json", import.meta.url), "utf8"),
    );
    let touched = [];
    if (spec.operation !== "validate") {
      const { operation, paths, checks, dry_run, ...normalized } = request;
      const input = path.join(scratch, "request.json"),
        report = path.join(scratch, "report.md"),
        touchedFile = path.join(scratch, "touched.txt"),
        format = path.join(scratch, "format.txt");
      await writeFile(input, JSON.stringify(normalized));
      const applied = spawnSync(
        process.execPath,
        [
          fileURLToPath(new URL("./apply-ai-edit.mjs", import.meta.url)),
          input,
          report,
          touchedFile,
          format,
        ],
        {
          cwd: root,
          encoding: "utf8",
          timeout: 60000,
          maxBuffer: 2000000,
          env: { PATH: process.env.PATH, AI_EDIT_BASE_SHA: source },
        },
      );
      ensure(
        applied.status === 0 && !applied.error,
        "Candidate application failed; disposable tree may be partially changed",
      );
      touched = (await readFile(touchedFile, "utf8")).split("\n").filter(Boolean);
      ensure(
        touched.every((file) => spec.paths.includes(file)),
        "Unexpected staged path",
      );
    }
    const files = [],
      measurements = [],
      results = [];
    let diff = "";
    for (const file of spec.paths) {
      let content = await textAt(root, file);
      const info =
        content === null
          ? null
          : await prettier.getFileInfo(file, { resolveConfig: false, ignorePath: [] });
      if (
        spec.operation !== "validate" &&
        touched.includes(file) &&
        content !== null &&
        info.inferredParser
      ) {
        content = await prettier.format(content, { ...options, parser: info.inferredParser });
        await writeFile(path.join(root, file), content);
      }
      if (touched.includes(file)) files.push({ path: file, content });
      const original = before.get(file);
      measurements.push({
        path: file,
        change:
          original === content
            ? "unchanged"
            : original === null
              ? "create"
              : content === null
                ? "delete"
                : "modify",
        before_bytes: size(original),
        after_bytes: size(content),
      });
      if (spec.operation === "preview") {
        await writeFile(path.join(scratch, "before.txt"), original ?? "");
        await writeFile(path.join(scratch, "after.txt"), content ?? "");
        diff += diffFor(file, original, content, scratch);
        ensure(size(diff) <= 1000000, "Formatted diff exceeds byte limit; split the request");
      }
      if (spec.checks.includes("format")) {
        let state = "not_applicable",
          detail = "No built-in parser or deleted file";
        if (info?.inferredParser) {
          try {
            state = (await prettier.check(content, { ...options, parser: info.inferredParser }))
              ? "passed"
              : "failure";
            detail = state === "passed" ? "" : "Formatting differs";
          } catch {
            state = "failure";
            detail = "Formatter refused input";
          }
        }
        results.push({ path: file, check: "format", state, detail });
      }
    }
    // All proposed files are formatted before checking mirrors spanning two touched files.
    if (spec.checks.includes("read-budget"))
      for (const file of spec.paths)
        results.push({
          path: file,
          check: "read-budget",
          ...(await budgetResult(root, file, await textAt(root, file))),
        });
    const candidate = {
      version: 1,
      trusted_sha: trustedSha,
      request_commit: requestCommit,
      source_sha: source,
      request_digest: identity(request).digest,
      files: spec.operation === "apply" ? files : [],
    };
    if (spec.operation !== "apply")
      candidate.operation_result = {
        version: 1,
        operation: spec.operation,
        trusted_sha: trustedSha,
        source_sha: source,
        request_commit: requestCommit,
        request_digest: candidate.request_digest,
        tested_sha: spec.operation === "validate" ? source : null,
        proposed_digest: spec.operation === "preview" ? identity(files).digest : null,
        required_ci: "not_replaced",
        files: measurements,
        checks: results,
        diff,
        diff_bytes: size(diff),
        diff_sha256: digest(diff),
      };
    ensure(size(JSON.stringify(candidate)) <= 1800000, "Candidate exceeds byte limit");
    return candidate;
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}
export function validateOperationResult(value, expected) {
  const operation = expected.operation ?? (expected.dry_run ? "preview" : "apply");
  if (operation === "apply") {
    ensure(value === undefined, "Apply must not carry preview authority");
    return;
  }
  keys(value, [
    "version",
    "operation",
    "trusted_sha",
    "source_sha",
    "request_commit",
    "request_digest",
    "tested_sha",
    "proposed_digest",
    "required_ci",
    "files",
    "checks",
    "diff",
    "diff_bytes",
    "diff_sha256",
  ]);
  ensure(
    value.version === 1 && value.operation === operation && value.required_ci === "not_replaced",
    "Operation evidence mismatch",
  );
  for (const key of ["trusted_sha", "source_sha", "request_commit", "request_digest"])
    ensure(value[key] === expected[key], "Operation identity mismatch");
  ensure(
    value.tested_sha === (operation === "validate" ? expected.source_sha : null),
    "Incorrect tested revision",
  );
  ensure(
    operation === "preview"
      ? typeof value.proposed_digest === "string" && /^[a-f0-9]{64}$/.test(value.proposed_digest)
      : value.proposed_digest === null,
    "Invalid proposed digest",
  );
  ensure(
    typeof value.diff === "string" &&
      size(value.diff) <= 1000000 &&
      value.diff_bytes === size(value.diff) &&
      value.diff_sha256 === digest(value.diff),
    "Invalid formatted diff",
  );
  ensure(operation !== "validate" || value.diff === "", "Validation cannot propose changes");
  ensure(
    Array.isArray(value.files) && value.files.length === expected.paths.length,
    "Missing file measurements",
  );
  const seen = new Set();
  for (const file of value.files) {
    keys(file, ["path", "change", "before_bytes", "after_bytes"]);
    safeRequestPath(file.path);
    ensure(expected.paths.includes(file.path) && !seen.has(file.path), "Unexpected measured path");
    seen.add(file.path);
    ensure(
      ["unchanged", "create", "delete", "modify"].includes(file.change) &&
        [file.before_bytes, file.after_bytes].every(
          (bytes) => Number.isSafeInteger(bytes) && bytes >= 0 && bytes <= 1500000,
        ),
      "Invalid file measurement",
    );
    ensure(
      operation !== "validate" ||
        (file.change === "unchanged" && file.before_bytes === file.after_bytes),
      "Validation cannot modify files",
    );
  }
  const checks = expected.checks ?? CHECKS;
  ensure(
    Array.isArray(value.checks) && value.checks.length === expected.paths.length * checks.length,
    "Missing validation evidence",
  );
  const measured = new Set();
  for (const check of value.checks) {
    keys(check, ["path", "check", "state", "detail"]);
    const key = JSON.stringify([check.path, check.check]);
    ensure(
      expected.paths.includes(check.path) && checks.includes(check.check) && !measured.has(key),
      "Unexpected or duplicate check",
    );
    measured.add(key);
    ensure(
      ["passed", "failure", "not_applicable"].includes(check.state) &&
        typeof check.detail === "string" &&
        check.detail.length <= 4000,
      "Invalid check result",
    );
  }
}
export async function persistOperation(api, run, value) {
  if (!value) return;
  const directory = `receipts/ai-edit/${run.id}/${run.run_attempt}/`;
  const files = {},
    paths = [];
  const sanitized = safeText(value.diff);
  let remaining = sanitized,
    index = 0;
  while (remaining.length) {
    const bytes = Buffer.from(remaining);
    let end = Math.min(bytes.length, 24000);
    while (end < bytes.length && end > 0 && (bytes[end] & 0xc0) === 0x80) end--;
    const text = bytes.subarray(0, end).toString("utf8");
    const file = directory + `diff-${String(index++).padStart(3, "0")}.txt`;
    paths.push(file);
    files[file] = text;
    remaining = remaining.slice(text.length);
  }
  const { diff, ...metadata } = value;
  files[directory + "operation.json"] =
    JSON.stringify({
      ...metadata,
      checks: value.checks.map((check) => ({ ...check, detail: safeText(check.detail) })),
      diff_paths: paths,
      retained_diff_bytes: size(sanitized),
      retained_diff_sha256: digest(sanitized),
      redacted: sanitized !== diff,
      next_action:
        value.operation === "preview"
          ? "inspect_diff_then_submit_fresh_apply"
          : "inspect_targeted_results_and_required_ci",
    }) + "\n";
  await api.persist(files);
}
