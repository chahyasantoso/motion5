import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The transport half of the checkpoint contract, measured against a real Git repository rather than
 * a mock: a declared stack is applied in a disposable checkout, every touched path is adjudicated
 * against the post-image blob id its manifest declared, and the surviving tip is formatted once.
 *
 * The candidate is then handed to the publisher's own validator, which recomputes the blob id of
 * every byte it was given. That is the load-bearing property of ADR-100: content is believed only
 * because it hashes to a declaration that was reviewed in the patch-set commit.
 */

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

const PRELUDE = String.raw`
  import assert from "node:assert/strict";
  import { execFileSync } from "node:child_process";
  import { createHash } from "node:crypto";
  import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
  import { tmpdir } from "node:os";
  import path from "node:path";
  const { prepareCheckpoint, validateCheckpointCandidate } = await import(
    "./scripts/automation-checkpoint.mjs"
  );
  const { checkpointChain, checkpointDigest } = await import("./scripts/checkpoint-policy.mjs");
  const LF = String.fromCharCode(10);
  const NUL = String.fromCharCode(0);
  const A = "a".repeat(40);
  const DECODE = "packages/core/src/live-write.ts";
  const LEGACY = "packages/core/src/legacy.ts";
  const CASES = "packages/core/test/decode.test.ts";
  const git = (dir, ...args) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8", maxBuffer: 20000000 }).trim();
  const blob = (text) => {
    const bytes = Buffer.from(text);
    return createHash("sha1").update("blob " + bytes.length + NUL).update(bytes).digest("hex");
  };
  const digest = (text) => createHash("sha256").update(Buffer.from(text)).digest("hex");
  async function put(dir, file, text) {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await writeFile(path.join(dir, file), text);
  }
  async function cut(dir, changes) {
    for (const [file, text] of Object.entries(changes)) {
      if (text === null) await rm(path.join(dir, file), { force: true });
      else await put(dir, file, text);
    }
    git(dir, "add", "-N", ".");
    return execFileSync("git", ["diff", "HEAD", "--no-renames", "--", "."], {
      cwd: dir,
      encoding: "utf8",
      maxBuffer: 20000000,
    });
  }
  const source = {
    [DECODE]: "export const decode = (value) => value;" + LF,
    [LEGACY]: "export const gone = 1;" + LF,
    "docs/note.md": "# note" + LF,
  };
  const first = {
    [DECODE]: "export const decode = (value) => value.trim();;" + LF,
    [CASES]: 'import { decode } from "../src/live-write";' + LF,
    [LEGACY]: null,
  };
  const second = {
    [CASES]: 'import { decode } from "../src/live-write";' + LF + 'const ok = decode(" a ");' + LF,
  };
  /** A base commit, a two-patch stack cut against it, and the manifest that declares both. */
  async function stack() {
    const dir = await mkdtemp(path.join(tmpdir(), "motion5-checkpoint-"));
    git(dir, "init", "-q", "-b", "work");
    git(dir, "config", "user.name", "fixture");
    git(dir, "config", "user.email", "fixture@example.invalid");
    for (const [file, text] of Object.entries(source)) await put(dir, file, text);
    await put(dir, ".gitattributes", "* text=auto eol=lf" + LF + "*.diff -text -diff" + LF);
    git(dir, "add", ".");
    git(dir, "commit", "-qm", "base");
    const base = git(dir, "rev-parse", "HEAD");
    const one = await cut(dir, first);
    git(dir, "reset", "-q");
    git(dir, "checkout", "--", ".");
    git(dir, "clean", "-qfd");
    for (const [file, text] of Object.entries(first)) {
      if (text === null) await rm(path.join(dir, file), { force: true });
      else await put(dir, file, text);
    }
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "temporary patch 1 state");
    const two = await cut(dir, second);
    git(dir, "reset", "-q", "--hard", base);
    git(dir, "clean", "-qfd");
    const manifest = {
      version: 1,
      checkpoint: "cp001",
      base,
      allow: ["packages/core/src/", "packages/core/test/"],
      patches: [
        {
          seq: 1,
          file: "001-one-decoder-owner.diff",
          sha256: digest(one),
          message: "fix(core): one live-write decoder owns the channel",
          pre: { [DECODE]: blob(source[DECODE]), [CASES]: null, [LEGACY]: blob(source[LEGACY]) },
          post: { [DECODE]: blob(first[DECODE]), [CASES]: blob(first[CASES]), [LEGACY]: null },
        },
        {
          seq: 2,
          after: 1,
          file: "002-red-evidence-cases.diff",
          sha256: digest(two),
          message: "test(core): red evidence for the decoder",
          pre: { [CASES]: blob(first[CASES]) },
          post: { [CASES]: blob(second[CASES]) },
        },
      ],
    };
    return { dir, base, manifest, patches: { "001-one-decoder-owner.diff": one, "002-red-evidence-cases.diff": two } };
  }
  /** Commit the patch set, optionally after a mutation, and prepare it. */
  async function prepared(mutate) {
    const state = await stack();
    state.extra = {};
    state.moved = {};
    if (mutate) await mutate(state);
    if (Object.keys(state.moved).length > 0) {
      for (const [file, text] of Object.entries(state.moved)) await put(state.dir, file, text);
      git(state.dir, "add", ".");
      git(state.dir, "commit", "-qm", "chore: move the base under the patch set");
      if (state.manifest.base === state.base)
        state.manifest.base = git(state.dir, "rev-parse", "HEAD");
    }
    const directory = ".ai/checkpoints/" + state.manifest.checkpoint;
    await put(state.dir, directory + "/manifest.json", JSON.stringify(state.manifest, null, 2) + LF);
    for (const [name, text] of Object.entries(state.patches))
      await put(state.dir, directory + "/" + name, text);
    for (const [file, text] of Object.entries(state.extra)) await put(state.dir, file, text);
    git(state.dir, "add", ".");
    git(state.dir, "commit", "-qm", "chore(checkpoint): prepare cp001");
    state.requestCommit = git(state.dir, "rev-parse", "HEAD");
    state.candidate = await prepareCheckpoint(state.dir, A, process.cwd(), null);
    return state;
  }
`;

function scenario(body: string): void {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", PRELUDE + body], {
    cwd: root,
    encoding: "utf8",
    timeout: 120000,
    maxBuffer: 4000000,
  });
  expect(result.status, result.stderr).toBe(0);
}

describe("a checkpoint applies in a disposable checkout and publishes what it declared", () => {
  it("gates each patch on its declared post-image and formats only the surviving tip", () => {
    scenario(String.raw`
        const state = await prepared();
        const candidate = state.candidate;
        assert.equal(candidate.kind, "checkpoint");
        assert.equal(candidate.source_sha, state.base);
        assert.equal(candidate.request_commit, state.requestCommit);
        assert.equal(candidate.checkpoint, "cp001");
        assert.equal(candidate.commits.length, 2);
        assert.deepEqual(candidate.commits[0].files.map((file) => file.path), [LEGACY, DECODE, CASES].sort());
        assert.equal(candidate.commits[0].files.find((file) => file.path === LEGACY).content, null);
        assert.equal(candidate.commits[1].files.length, 1);
        assert.equal(candidate.commits[0].patch, ".ai/checkpoints/cp001/001-one-decoder-owner.diff");
        // The intermediate commit keeps the exact declared bytes, so the formatter runs once.
        assert.ok(candidate.commits[0].files.find((file) => file.path === DECODE).content.includes(";;"));
        assert.notEqual(candidate.format, null);
        assert.deepEqual(candidate.format.files.map((file) => file.path), [DECODE]);
        assert.ok(!candidate.format.files[0].content.includes(";;"));
        assert.equal(
          candidate.format.message,
          "style(checkpoint): normalise cp001 with the pinned formatter",
        );
        // The publisher believes the bytes only because they hash to the reviewed declaration.
        const chain = checkpointChain(state.manifest);
        const expected = {
          trusted_sha: A,
          request_commit: state.requestCommit,
          source_sha: state.base,
          checkpoint: "cp001",
          checkpoint_digest: checkpointDigest(state.manifest),
          manifest: state.manifest,
          directory: ".ai/checkpoints/cp001",
          surviving: chain.paths.filter((file) => chain.tip.get(file) !== null),
        };
        validateCheckpointCandidate(candidate, expected);
        const tampered = structuredClone(candidate);
        tampered.commits[0].files.find((file) => file.path === DECODE).content += "// injected" + LF;
        assert.throws(
          () => validateCheckpointCandidate(tampered, expected),
          /declared post-image/,
        );
        const widened = structuredClone(candidate);
        widened.format.files.push({ path: "docs/note.md", content: "# other" + LF });
        assert.throws(() => validateCheckpointCandidate(widened, expected), /does not leave behind/);
      `);
  }, 120000);

  it("refuses a stale base, a moved pre-image, an undeclared path and a wrong post-image", () => {
    scenario(String.raw`
        await assert.rejects(
          prepared((state) => {
            state.manifest.base = "b".repeat(40);
          }),
          /Stale base/,
        );
        await assert.rejects(
          prepared((state) => {
            state.moved[DECODE] = "export const decode = (value) => value.toUpperCase();" + LF;
          }),
          /stale pre-image/,
        );
        await assert.rejects(
          prepared((state) => {
            state.extra["docs/note.md"] = "# changed" + LF;
          }),
          /is not a checkpoint file/,
        );
        await assert.rejects(
          prepared((state) => {
            state.manifest.patches[0].post[DECODE] = "c".repeat(40);
          }),
          /rather than its declared/,
        );
        await assert.rejects(
          prepared((state) => {
            state.manifest.allow = ["packages/core/src/"];
          }),
          /is outside/,
        );
        await assert.rejects(
          prepared((state) => {
            state.patches["001-one-decoder-owner.diff"] += "GIT binary patch" + LF;
          }),
          /declared SHA-256/,
        );
      `);
  }, 120000);

  it("separates candidate preparation from the credentialed publisher", () => {
    scenario(String.raw`
      const { readFile } = await import("node:fs/promises");
      const candidate = await readFile(".github/workflows/ai-checkpoint.yml", "utf8");
      const reporter = await readFile(".github/workflows/archive-ci-logs.yml", "utf8");
      assert.ok(candidate.includes("contents: read"));
      assert.ok(!candidate.includes("contents: write") && !candidate.includes("secrets."));
      assert.ok(candidate.includes("persist-credentials: false"));
      assert.ok(candidate.includes("automation-checkpoint.mjs prepare"));
      assert.ok(candidate.includes('paths: [".ai/checkpoints/**"]'));
      assert.ok(candidate.includes("AI-Checkpoint-Set: "));
      assert.ok(reporter.includes("AI checkpoint"));
      assert.ok(reporter.includes("automation-checkpoint.mjs publish"));
      assert.ok(reporter.includes("automation-checkpoint.mjs recover"));
      assert.ok(reporter.includes("refs/heads/main"));
      assert.ok(!reporter.includes("npm install") && !reporter.includes("npm ci"));
    `);
  });
});
