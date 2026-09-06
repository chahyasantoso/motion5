import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(
  new URL("../../../../../scripts/automation-receipt.mjs", import.meta.url),
);
const A = "a".repeat(40);
const B = "b".repeat(40);
const C = "c".repeat(40);

function invoke(command: string, input: unknown) {
  return spawnSync(process.execPath, [script, command], {
    input: JSON.stringify(input),
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 2000000,
  });
}

function run(command: string, input: unknown) {
  const result = invoke(command, input);
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

function facts(extra: Record<string, unknown> = {}) {
  return {
    repository: "chahyasantoso/motion5",
    kind: "ai-edit",
    run_id: 42,
    run_attempt: 1,
    source_sha: A,
    request_commit: B,
    request_digest: "d".repeat(64),
    phase: "validated",
    ...extra,
  };
}

describe("automation receipt contracts", () => {
  it("AE-48: rendering refuses forged outcomes, destinations and unknown fields", () => {
    const valid = run("receipt", facts());
    expect(run("render", valid).body).toContain("not_attempted");
    for (const extra of [
      { publication: "confirmed" },
      { ci: "success" },
      { next_action: "<script>@everyone</script>" },
      { evidence_path: "../../elsewhere" },
      { surprise: true },
    ])
      expect(invoke("render", { ...valid, ...extra }).status).toBe(1);
  });

  it("AE-49: commit identities cannot appear before a commit or without a source", () => {
    expect(run("receipt", facts({ phase: "publication" })).publication).toBe("unconfirmed");
    for (const extra of [
      { candidate_sha: C },
      { phase: "committed", candidate_sha: C, published_sha: C, source_sha: null },
      { phase: "committed", candidate_sha: C, published_sha: C, request_digest: null },
    ])
      expect(invoke("receipt", facts(extra)).status).toBe(1);
  });

  it("AE-50: diagnostic chunk boundaries preserve complete UTF-8 text", () => {
    const text = "a".repeat(23999) + "🔒é\n".repeat(10000);
    const result = run("diagnostics", { exit_code: 0, text });
    expect(result.chunks.join("")).toBe(text);
    expect(result.chunks.every((chunk: string) => Buffer.byteLength(chunk) <= 24000)).toBe(true);
    expect(result.chunks.join("")).not.toContain("�");
  });

  it("AE-36: canonical identity ignores key order but preserves array order and edits", () => {
    const first = run("identity", { z: 1, edits: [{ b: 2, a: 1 }] });
    const reordered = run("identity", { edits: [{ a: 1, b: 2 }], z: 1 });
    const canonical = '{"edits":[{"a":1,"b":2}],"z":1}';
    expect(first.digest).toBe(createHash("sha256").update(canonical).digest("hex"));
    expect(first).toEqual(reordered);
    expect(run("identity", { edits: [1, 2] })).not.toEqual(run("identity", { edits: [2, 1] }));
    expect(run("identity", { z: 2, edits: [{ b: 2, a: 1 }] })).not.toEqual(first);
  });

  it("AE-37: precommit phase receipts never claim publication or verified CI", () => {
    for (const phase of ["selection", "validated", "applied", "formatted"]) {
      const receipt = run("receipt", facts({ phase }));
      expect(receipt.publication).toBe("not_attempted");
      expect(receipt.published_sha).toBe(null);
      expect(receipt.ci).toBe("not_run");
    }
  });

  it("AE-38: a candidate without confirmed push remains ambiguous rather than absent", () => {
    const receipt = run("receipt", facts({ phase: "committed", candidate_sha: C }));
    expect(receipt.publication).toBe("unconfirmed");
    expect(receipt.candidate_sha).toBe(C);
    expect(receipt.published_sha).toBe(null);
    expect(receipt.next_action).toBe("reconcile_before_retry");
    expect(receipt.ci).toBe("unavailable");
  });

  it("AE-39: rendering confirmed publication preserves its identity and pending CI", () => {
    const receipt = run(
      "receipt",
      facts({
        phase: "committed",
        candidate_sha: C,
        published_sha: C,
      }),
    );
    expect(receipt.publication).toBe("confirmed");
    expect(receipt.ci).toBe("pending");
    expect(receipt.request_commit).toBe(B);
    expect(receipt.source_sha).toBe(A);
    const rendered = run("render", receipt);
    expect(rendered.body).toContain(C);
    expect(rendered.body).toContain("pending");
    expect(rendered.body).not.toContain("CI passed");
  });

  it("AE-40: contradictory commits and malformed identities fail closed", () => {
    expect(run("receipt", facts()).publication).toBe("not_attempted");
    for (const extra of [
      { candidate_sha: C, published_sha: A },
      { published_sha: C },
      { run_id: -1 },
      { run_attempt: 0 },
      { source_sha: "short" },
      { repository: "owner/repo/../../escape" },
      { unexpected: true },
      { ci: "success" },
    ]) {
      const result = invoke("receipt", facts(extra));
      expect(result.status).toBe(1);
      expect(result.stderr).not.toContain("MODULE_NOT_FOUND");
    }
  });

  it("AE-41: reruns have independent durable addresses", () => {
    const first = run("receipt", facts());
    const second = run("receipt", facts({ run_attempt: 2 }));
    expect(first.evidence_path).toBe("receipts/ai-edit/42/1/receipt.json");
    expect(second.evidence_path).toBe("receipts/ai-edit/42/2/receipt.json");
  });

  it("AE-42: an older head or older run cannot replace the current summary", () => {
    const base = { current_head: A, incoming_head: A, incoming_run: 42, incoming_attempt: 2 };
    expect(run("summary-allowed", base).allowed).toBe(true);
    expect(run("summary-allowed", { ...base, incoming_head: B }).allowed).toBe(false);
    expect(run("summary-allowed", { ...base, previous_run: 43, previous_attempt: 1 }).allowed).toBe(
      false,
    );
    expect(run("summary-allowed", { ...base, previous_run: 42, previous_attempt: 3 }).allowed).toBe(
      false,
    );
    expect(run("summary-allowed", { ...base, previous_run: 42, previous_attempt: 1 }).allowed).toBe(
      true,
    );
  });

  it("AE-43: diagnostic fetch failure is unavailable, not captured command-error output", () => {
    const result = run("diagnostics", { exit_code: 1, text: "HTTP 403: forbidden" });
    expect(result.state).toBe("unavailable");
    expect(result.chunks).toEqual([]);
    expect(result.excerpt).toBe("Diagnostic retrieval failed.");
    expect(run("diagnostics", { exit_code: 0, text: "" }).state).toBe("empty");
  });

  it("AE-44: standalone diagnostics are bounded, chunked, escaped and redacted", () => {
    const secret = "ghp_" + "x".repeat(36);
    const text =
      "<script>@everyone</script> \u001b[31m token=" + secret + "\n" + "failure 🔒\n".repeat(20000);
    const result = run("diagnostics", { exit_code: 0, text });
    expect(result.state).toBe("available");
    expect(result.chunks.length).toBeGreaterThan(1);
    expect(result.chunks.every((chunk: string) => Buffer.byteLength(chunk) <= 24000)).toBe(true);
    expect(Buffer.byteLength(result.excerpt)).toBeLessThanOrEqual(4000);
    expect(result.chunks.join("")).not.toContain(secret);
    expect(result.excerpt).not.toContain("<script>");
    expect(result.excerpt).not.toContain("@everyone");
    expect(result.truncated).toBe(false);
  });

  it("AE-45: truncation is explicit rather than misrepresented as complete logs", () => {
    const result = run("diagnostics", { exit_code: 0, text: "x".repeat(1100000) });
    expect(result.truncated).toBe(true);
    expect(result.original_bytes).toBe(1100000);
    expect(result.retained_bytes).toBeLessThanOrEqual(1000000);
    expect(result.chunks.join("").length).toBe(result.retained_bytes);
  });

  it("AE-46: early setup failure remains identifiable without a parsed request", () => {
    const receipt = run(
      "receipt",
      facts({
        source_sha: null,
        request_digest: null,
        phase: "selection",
      }),
    );
    expect(receipt.request_commit).toBe(B);
    expect(receipt.source_sha).toBe(null);
    expect(receipt.publication).toBe("not_attempted");
    expect(receipt.run_id).toBe(42);
  });

  it("AE-47: CI conclusions stay distinct from publication and retain tested identity", () => {
    for (const ci of ["success", "failure", "cancelled", "timed_out", "skipped", "unavailable"]) {
      const receipt = run("receipt", {
        kind: "ci",
        repository: "chahyasantoso/motion5",
        run_id: 42,
        run_attempt: 1,
        head_sha: A,
        tested_sha: B,
        ci,
      });
      expect(receipt.ci).toBe(ci);
      expect(receipt.head_sha).toBe(A);
      expect(receipt.tested_sha).toBe(B);
      expect(receipt.publication).toBe("not_applicable");
    }
  });
});
