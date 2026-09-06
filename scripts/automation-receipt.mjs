#!/usr/bin/env node
// Pure receipt policy. GitHub identity verification belongs to the reporting adapter.
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const CONCLUSIONS = new Set([
  "not_run",
  "pending",
  "success",
  "failure",
  "cancelled",
  "timed_out",
  "skipped",
  "unavailable",
  "neutral",
  "action_required",
  "stale",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function keys(value, allowed) {
  assert(value !== null && typeof value === "object" && !Array.isArray(value), "Expected object");
  for (const key of Object.keys(value)) assert(allowed.includes(key), `Unknown field: ${key}`);
}

function positive(value, label) {
  assert(Number.isSafeInteger(value) && value > 0, `Invalid ${label}`);
  return value;
}

function sha(value, label, optional = false) {
  if (optional && value == null) return null;
  assert(typeof value === "string" && SHA.test(value), `Invalid ${label}`);
  return value;
}

function canonical(value, depth = 0) {
  assert(depth <= 32, "JSON nesting limit exceeded");
  if (Array.isArray(value)) return `[${value.map((item) => canonical(item, depth + 1)).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key], depth + 1)}`)
      .join(",")}}`;
  }
  assert(value === null || ["string", "boolean", "number"].includes(typeof value), "Not JSON");
  assert(typeof value !== "number" || Number.isFinite(value), "Non-finite number");
  return JSON.stringify(value);
}

export function identity(value) {
  const text = canonical(value);
  assert(Buffer.byteLength(text) <= 1500000, "Request identity exceeds byte limit");
  return { digest: createHash("sha256").update(text).digest("hex") };
}

export function receipt(input) {
  keys(input, [
    "kind",
    "repository",
    "run_id",
    "run_attempt",
    "source_sha",
    "request_commit",
    "request_digest",
    "phase",
    "candidate_sha",
    "published_sha",
    "head_sha",
    "tested_sha",
    "ci",
  ]);
  assert(
    typeof input.repository === "string" && REPOSITORY.test(input.repository),
    "Invalid repository",
  );
  assert(["ai-edit", "ci"].includes(input.kind), "Invalid receipt kind");
  const common = {
    version: 1,
    kind: input.kind,
    repository: input.repository,
    run_id: positive(input.run_id, "run_id"),
    run_attempt: positive(input.run_attempt, "run_attempt"),
  };
  const evidence_path = `receipts/${common.kind}/${common.run_id}/${common.run_attempt}/receipt.json`;
  if (input.kind === "ci") {
    assert(CONCLUSIONS.has(input.ci), "Invalid CI conclusion");
    for (const key of [
      "source_sha",
      "request_commit",
      "request_digest",
      "phase",
      "candidate_sha",
      "published_sha",
    ]) {
      assert(!Object.hasOwn(input, key), `AI-only field: ${key}`);
    }
    return {
      ...common,
      evidence_path,
      head_sha: sha(input.head_sha, "head_sha"),
      tested_sha: sha(input.tested_sha, "tested_sha", true),
      publication: "not_applicable",
      ci: input.ci,
      next_action: input.ci === "success" ? "review_exact_commit" : "inspect_evidence",
    };
  }
  for (const key of ["head_sha", "tested_sha", "ci"])
    assert(!Object.hasOwn(input, key), `CI-only field: ${key}`);
  assert(
    ["selection", "validated", "applied", "formatted", "committed", "publication"].includes(
      input.phase,
    ),
    "Invalid phase",
  );
  const candidate_sha = sha(input.candidate_sha, "candidate_sha", true);
  const published_sha = sha(input.published_sha, "published_sha", true);
  assert(
    published_sha === null || published_sha === candidate_sha,
    "Publication differs from candidate",
  );
  assert(
    input.request_digest == null ||
      (typeof input.request_digest === "string" && DIGEST.test(input.request_digest)),
    "Invalid request digest",
  );
  const publication = published_sha
    ? "confirmed"
    : candidate_sha || input.phase === "publication"
      ? "unconfirmed"
      : "not_attempted";
  return {
    ...common,
    evidence_path,
    source_sha: sha(input.source_sha, "source_sha", true),
    request_commit: sha(input.request_commit, "request_commit"),
    request_digest: input.request_digest ?? null,
    phase: input.phase,
    candidate_sha,
    published_sha,
    publication,
    ci: published_sha ? "pending" : "not_run",
    next_action:
      publication === "unconfirmed"
        ? "reconcile_before_retry"
        : publication === "confirmed"
          ? "inspect_exact_commit_checks"
          : "inspect_evidence",
  };
}

export function summaryAllowed(input) {
  keys(input, [
    "current_head",
    "incoming_head",
    "incoming_run",
    "incoming_attempt",
    "previous_run",
    "previous_attempt",
  ]);
  sha(input.current_head, "current_head");
  sha(input.incoming_head, "incoming_head");
  positive(input.incoming_run, "incoming_run");
  positive(input.incoming_attempt, "incoming_attempt");
  if (input.current_head !== input.incoming_head) return { allowed: false };
  if (input.previous_run == null) {
    assert(input.previous_attempt == null, "Previous attempt needs run");
    return { allowed: true };
  }
  positive(input.previous_run, "previous_run");
  positive(input.previous_attempt, "previous_attempt");
  return {
    allowed:
      input.incoming_run > input.previous_run ||
      (input.incoming_run === input.previous_run &&
        input.incoming_attempt >= input.previous_attempt),
  };
}

function bytePrefix(text, limit) {
  const bytes = Buffer.from(text);
  if (bytes.length <= limit) return text;
  let end = limit;
  while (end > 0 && (bytes[end] & 0xc0) === 0x80) end -= 1;
  return bytes.subarray(0, end).toString("utf8");
}

export function safeText(text) {
  return String(text)
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\x00-\x08\x0b-\x1f\x7f]/g, "")
    .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+)\b/g, "[REDACTED]")
    .replace(/\b(authorization\s*[:=]\s*(?:bearer|basic)\s+)\S+/gi, "$1[REDACTED]")
    .replace(/\b((?:token|password|secret|api[_-]?key)\s*[:=]\s*)\S+/gi, "$1[REDACTED]")
    .replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/gi, "https://[REDACTED]@");
}

function escaped(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/@/g, "&#64;")
    .replace(/`/g, "&#96;");
}

export function diagnostics(input) {
  keys(input, ["exit_code", "text"]);
  assert(
    Number.isSafeInteger(input.exit_code) && typeof input.text === "string",
    "Invalid diagnostics",
  );
  if (input.exit_code !== 0) {
    return {
      state: "unavailable",
      chunks: [],
      excerpt: "Diagnostic retrieval failed.",
      original_bytes: 0,
      retained_bytes: 0,
      truncated: false,
    };
  }
  const original_bytes = Buffer.byteLength(input.text);
  const sanitized = safeText(input.text);
  const retained = bytePrefix(sanitized, 1000000);
  const chunks = [];
  let offset = 0;
  while (offset < retained.length) {
    const chunk = bytePrefix(retained.slice(offset), 24000);
    chunks.push(chunk);
    offset += chunk.length;
  }
  return {
    state: original_bytes === 0 ? "empty" : "available",
    chunks,
    excerpt: bytePrefix(escaped(retained), 4000),
    original_bytes,
    retained_bytes: Buffer.byteLength(retained),
    truncated: Buffer.byteLength(sanitized) > Buffer.byteLength(retained),
  };
}

export function render(value) {
  assert(value.version === 1 && ["ai-edit", "ci"].includes(value.kind), "Invalid receipt");
  assert(REPOSITORY.test(value.repository), "Invalid repository");
  const run = positive(value.run_id, "run_id");
  const attempt = positive(value.run_attempt, "run_attempt");
  const commit = value.published_sha ?? value.head_sha ?? value.request_commit;
  sha(commit, "rendered commit");
  const root = `https://github.com/${value.repository}`;
  const body = [
    `<!-- motion5-receipt:${value.kind}:${run}:${attempt} -->`,
    `### ${value.kind === "ci" ? "CI" : "AI edit"} outcome`,
    "",
    `Commit: [${commit}](${root}/commit/${commit}).`,
    `Publication: **${value.publication}**. CI: **${value.ci}**.`,
    `Next action: ${value.next_action}.`,
    "",
    `[Run ${run}, attempt ${attempt}](${root}/actions/runs/${run}/attempts/${attempt})`,
    `[Machine-readable receipt](${root}/blob/ci-logs/${value.evidence_path})`,
  ].join("\n");
  assert(Buffer.byteLength(body) < 8000, "Oversized receipt projection");
  return { body };
}

const commands = { identity, receipt, diagnostics, render, "summary-allowed": summaryAllowed };
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    let raw = "";
    for await (const chunk of process.stdin) {
      raw += chunk;
      assert(Buffer.byteLength(raw) <= 1800000, "Input limit exceeded");
    }
    const command = commands[process.argv[2]];
    assert(typeof command === "function", "Unknown command");
    process.stdout.write(`${JSON.stringify(command(JSON.parse(raw)))}\n`);
  } catch (error) {
    process.stderr.write(`${safeText(error.message)}\n`);
    process.exitCode = 1;
  }
}
