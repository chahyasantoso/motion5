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

  it("applies a zero-context patch and still adjudicates its placement by digest", () => {
    // ADR-100 records the decision behind the apply flags. A zero-context hunk parses, so it has to
    // apply: without the flag the parser blessed a patch the applier then refused, which is the
    // late and opaque failure the design exists to avoid. What the flag leaves unverified is a
    // zero-context pure insertion, carrying neither context nor a removed line, and the second half
    // of this scenario measures that the declared post-image still refuses a misplaced one.
    scenario(String.raw`
      const FIVE = "packages/core/src/five.ts";
      const before = "a" + LF + "b" + LF + "c" + LF + "d" + LF + "e" + LF;
      const after = "a" + LF + "b" + LF + "CHANGED" + LF + "d" + LF + "e" + LF;
      async function zero(context, declaredPost, patchText) {
        const dir = await mkdtemp(path.join(tmpdir(), "motion5-zero-"));
        git(dir, "init", "-q", "-b", "work");
        git(dir, "config", "user.name", "fixture");
        git(dir, "config", "user.email", "fixture@example.invalid");
        await put(dir, FIVE, before);
        await put(dir, ".gitattributes", "* text=auto eol=lf" + LF + "*.diff -text -diff" + LF);
        git(dir, "add", ".");
        git(dir, "commit", "-qm", "base");
        const base = git(dir, "rev-parse", "HEAD");
        let text = patchText;
        if (text === null) {
          await put(dir, FIVE, after);
          git(dir, "add", "-N", ".");
          text = execFileSync("git", ["diff", "HEAD", "--no-renames", context, "--", "."], {
            cwd: dir,
            encoding: "utf8",
            maxBuffer: 20000000,
          });
          git(dir, "checkout", "--", ".");
        }
        const store = ".ai/checkpoints/cp001";
        const value = {
          version: 1,
          checkpoint: "cp001",
          base,
          allow: ["packages/core/src/"],
          patches: [
            {
              seq: 1,
              file: "001-change-line-three.diff",
              sha256: digest(text),
              message: "fix(core): change line three",
              pre: { [FIVE]: blob(before) },
              post: { [FIVE]: declaredPost },
            },
          ],
        };
        await put(dir, store + "/manifest.json", JSON.stringify(value, null, 2) + LF);
        await put(dir, store + "/001-change-line-three.diff", text);
        git(dir, "add", ".");
        git(dir, "commit", "-qm", "chore(checkpoint): prepare cp001");
        return { dir, patch: text };
      }
      // Default context is the control, and zero context is the case the flag exists for.
      const control = await zero("-U3", blob(after), null);
      const prepared3 = await prepareCheckpoint(control.dir, A, process.cwd(), null);
      assert.equal(prepared3.commits.length, 1);
      const narrow = await zero("-U0", blob(after), null);
      assert.ok(/^@@ -3 [+]3 @@/m.test(narrow.patch), narrow.patch);
      const prepared0 = await prepareCheckpoint(narrow.dir, A, process.cwd(), null);
      assert.equal(prepared0.commits.length, 1);
      assert.equal(prepared0.commits[0].files[0].content, after);
      // A zero-context pure insertion has nothing for the applier to match, so the digest is the
      // only gate on where it landed. A declaration the patch does not produce stays refused.
      const insertion =
        "diff --git a/" + FIVE + " b/" + FIVE + LF +
        "--- a/" + FIVE + LF +
        "+++ b/" + FIVE + LF +
        "@@ -3,0 +4 @@" + LF +
        "+INSERTED" + LF;
      const truthful = "a" + LF + "b" + LF + "c" + LF + "INSERTED" + LF + "d" + LF + "e" + LF;
      const misplaced = "a" + LF + "INSERTED" + LF + "b" + LF + "c" + LF + "d" + LF + "e" + LF;
      const lying = await zero("-U0", blob(misplaced), insertion);
      await assert.rejects(
        () => prepareCheckpoint(lying.dir, A, process.cwd(), null),
        /rather than its declared/,
      );
      const honest = await zero("-U0", blob(truthful), insertion);
      const accepted = await prepareCheckpoint(honest.dir, A, process.cwd(), null);
      assert.equal(accepted.commits[0].files[0].content, truthful);
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

/**
 * The credentialed half. Neither the commit topology nor recovery needs a Git repository, because
 * publication writes bytes through the adapter rather than applying a hunk, so both are driven here
 * through a recording writer and a scripted read adapter. Until this block existed the topology the
 * records describe was a specification rather than a measurement.
 */
const PUBLISH_PRELUDE = String.raw`
  import assert from "node:assert/strict";
  const { buildCommits, reconcileCheckpointIntent } = await import(
    "./scripts/automation-checkpoint.mjs"
  );
  const { checkpointDigest } = await import("./scripts/checkpoint-policy.mjs");
  const LF = String.fromCharCode(10);
  const SET = "AI-Checkpoint-Set: ";
  const SRC = "packages/core/src/one.ts";
  const GONE = "packages/core/src/gone.ts";
  const NEW = "packages/core/test/one.test.ts";
  const HEAD = "ae".repeat(20);
  const REQUEST = "e1".repeat(20);
  const SOURCE = "d2".repeat(20);
  const PATCHFILE = ".ai/checkpoints/cp001/001-a.diff";
  /** A writer that records every call and answers with deterministic ids. */
  function recorder() {
    const calls = [];
    let tree = 0;
    let commit = 0;
    return {
      calls,
      request(method, route, body) {
        calls.push({ method, route, body });
        if (route === "/git/trees") {
          tree += 1;
          return Promise.resolve({ sha: "0" + String(tree).padStart(39, "0") });
        }
        if (route === "/git/commits") {
          commit += 1;
          return Promise.resolve({ sha: "c" + String(commit).padStart(39, "0") });
        }
        throw new Error("unexpected route " + route);
      },
    };
  }
  const STORE = [
    ".ai/checkpoints/cp001/manifest.json",
    ".ai/checkpoints/cp001/001-a.diff",
    ".ai/checkpoints/cp001/002-b.diff",
  ];
  function publishState() {
    return {
      checkpoint: "cp001",
      checkpoint_digest: "d".repeat(64),
      directory: ".ai/checkpoints/cp001",
      files: STORE,
      commit: { tree: { sha: "ab".repeat(20) }, committer: { date: "2026-09-21T08:24:14Z" } },
      original: new Map([
        [SRC, { path: SRC, mode: "100644", type: "blob", sha: "a".repeat(40) }],
        [GONE, { path: GONE, mode: "100755", type: "blob", sha: "b".repeat(40) }],
      ]),
    };
  }
  function publishCandidateShape(formatted) {
    return {
      commits: [
        {
          seq: 1,
          message: "fix(core): one owner",
          patch: PATCHFILE,
          patch_sha256: "1".repeat(64),
          files: [
            { path: SRC, content: "export const one = 2;" + LF },
            { path: GONE, content: null },
            { path: NEW, content: "const first = 1;" + LF },
          ],
        },
        {
          seq: 2,
          message: "test(core): red evidence",
          patch: ".ai/checkpoints/cp001/002-b.diff",
          patch_sha256: "2".repeat(64),
          files: [{ path: NEW, content: "const ok = 1;" + LF }],
        },
      ],
      format: formatted
        ? {
            message: "style(checkpoint): normalise cp001 with the pinned formatter",
            files: [{ path: SRC, content: "export const one = 2;" + LF }],
          }
        : null,
    };
  }
  const MANIFEST = {
    version: 1,
    checkpoint: "cp001",
    base: SOURCE,
    allow: ["packages/core/src/"],
    patches: [
      {
        seq: 1,
        file: "001-a.diff",
        sha256: "1".repeat(64),
        message: "fix(core): one owner",
        pre: { [SRC]: "a".repeat(40) },
        post: { [SRC]: "b".repeat(40) },
      },
    ],
  };
  const DIGEST = checkpointDigest(MANIFEST);
  /**
   * A published chain above the request commit. Each knob removes exactly one property recovery
   * requires, so a refusal names which one was missing.
   */
  function world(options) {
    const settings = { length: 2, head: null, dropSet: -1, dropPatch: false, ...options };
    const shas = Array.from({ length: settings.length }, (_, i) => "f" + String(i + 1).padStart(39, "0"));
    const commits = new Map();
    shas.forEach((sha, index) => {
      const first = index === 0;
      const parts = [];
      if (first && !settings.dropPatch) parts.push("AI-Checkpoint: " + PATCHFILE);
      if (index !== settings.dropSet) parts.push(SET + DIGEST);
      commits.set(sha, {
        sha,
        message: "subject " + index + LF + LF + parts.join(LF),
        parents: [{ sha: index === 0 ? REQUEST : shas[index - 1] }],
      });
    });
    commits.set(REQUEST, {
      sha: REQUEST,
      message: "chore(checkpoint): prepare cp001",
      parents: [{ sha: SOURCE }],
    });
    const stored = settings.badBase ? { ...MANIFEST, base: "cc".repeat(20) } : MANIFEST;
    return {
      candidate: shas[shas.length - 1],
      api: {
        head: () => Promise.resolve(settings.head ?? shas[shas.length - 1]),
        request(method, route) {
          if (route.indexOf("/compare/") === 0)
            return Promise.resolve({ status: settings.compare ?? "ahead" });
          const match = /^\/git\/commits\/(.+)$/.exec(route);
          if (match) {
            const commit = commits.get(match[1]);
            if (!commit) return Promise.reject(new Error("no commit " + match[1]));
            return Promise.resolve(commit);
          }
          throw new Error("unexpected route " + route);
        },
        content: () => Promise.resolve({ text: JSON.stringify(stored) }),
      },
    };
  }
  function intent(candidateSha) {
    return {
      kind: "checkpoint",
      repository: "chahyasantoso/motion5",
      run_id: 1,
      run_attempt: 1,
      source_sha: SOURCE,
      request_commit: REQUEST,
      request_digest: DIGEST,
      candidate_sha: candidateSha,
    };
  }
  const RUN = { head_branch: "work", head_sha: REQUEST };
`;

function publishScenario(body: string): void {
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", PUBLISH_PRELUDE + body],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 30000,
      maxBuffer: 4000000,
    },
  );
  expect(result.status, result.stderr).toBe(0);
}

describe("publication writes one commit per patch and never replays a hunk", () => {
  it("builds patch, formatting and consumption commits with the trailers in order", () => {
    publishScenario(String.raw`
      const writer = recorder();
      const state = publishState();
      const candidate = publishCandidateShape(true);
      const head = await buildCommits(writer, { head_sha: HEAD }, state, candidate)();
      const trees = writer.calls.filter((call) => call.route === "/git/trees");
      const commits = writer.calls.filter((call) => call.route === "/git/commits");
      // Two patches, one formatting commit, one consumption commit: patches + 2.
      assert.equal(trees.length, 4);
      assert.equal(commits.length, 4);
      assert.equal(head, "c" + String(4).padStart(39, "0"));
      const messages = commits.map((call) => call.body.message);
      assert.ok(messages[0].indexOf("fix(core): one owner" + LF + LF) === 0);
      assert.ok(messages[1].indexOf("test(core): red evidence" + LF + LF) === 0);
      assert.equal(
        messages[2],
        "style(checkpoint): normalise cp001 with the pinned formatter" + LF + LF + SET + "d".repeat(64),
      );
      assert.equal(
        messages[3],
        "chore(checkpoint): consume cp001" + LF + LF + SET + "d".repeat(64),
      );
      // The three trailers appear on a patch commit in the recorded order.
      const trailers = messages[0].split(LF).slice(-3);
      assert.deepEqual(
        trailers.map((line) => line.split(":")[0]),
        ["AI-Checkpoint", "AI-Checkpoint-Patch", "AI-Checkpoint-Set"],
      );
      assert.equal(trailers[0], "AI-Checkpoint: " + PATCHFILE);
      assert.equal(trailers[1], "AI-Checkpoint-Patch: sha256:" + "1".repeat(64));
      assert.equal(trailers[2], SET + "d".repeat(64));
      // A deletion travels as a null sha and keeps the source mode; content never rides with it.
      const entries = new Map(trees[0].body.tree.map((entry) => [entry.path, entry]));
      assert.equal(entries.get(GONE).sha, null);
      assert.equal(entries.get(GONE).mode, "100755");
      assert.ok(!Object.hasOwn(entries.get(GONE), "content"));
      assert.equal(entries.get(SRC).mode, "100644");
      assert.equal(entries.get(SRC).content, "export const one = 2;" + LF);
      assert.equal(entries.get(NEW).mode, "100644");
      // The consumption commit deletes exactly the store and nothing else.
      const consumed = trees[3].body.tree;
      assert.deepEqual(consumed.map((entry) => entry.path).sort(), STORE.slice().sort());
      assert.ok(consumed.every((entry) => entry.sha === null && entry.mode === "100644"));
      // The chain is linear, rooted at the request commit, authored by the bot at its date.
      assert.equal(commits[0].body.parents[0], HEAD);
      for (let index = 1; index < commits.length; index += 1)
        assert.equal(commits[index].body.parents[0], "c" + String(index).padStart(39, "0"));
      for (const call of commits) {
        assert.equal(call.body.parents.length, 1);
        assert.equal(call.body.author.name, "github-actions[bot]");
        assert.equal(call.body.committer.date, "2026-09-21T08:24:14Z");
      }
      // No ref is advanced here: publishCandidate owns the single non-force update.
      assert.ok(writer.calls.every((call) => call.route.indexOf("/git/refs/") !== 0));
    `);
  });

  it("publishes patches + 1 commits when the formatter changed nothing", () => {
    publishScenario(String.raw`
      const writer = recorder();
      await buildCommits(writer, { head_sha: HEAD }, publishState(), publishCandidateShape(false))();
      const commits = writer.calls.filter((call) => call.route === "/git/commits");
      assert.equal(commits.length, 3);
      const messages = commits.map((call) => call.body.message);
      assert.ok(messages.every((message) => message.indexOf("style(checkpoint)") !== 0));
      assert.ok(messages[2].indexOf("chore(checkpoint): consume cp001") === 0);
    `);
  });

  it("confirms a publication whose response was lost, without replaying a patch", () => {
    publishScenario(String.raw`
      const scripted = world({ length: 2 });
      const outcome = await reconcileCheckpointIntent(scripted.api, RUN, intent(scripted.candidate));
      assert.notEqual(outcome, null);
      assert.equal(outcome.publication, "confirmed");
      assert.equal(outcome.published_sha, scripted.candidate);
      assert.equal(outcome.candidate_sha, scripted.candidate);
      assert.equal(outcome.request_commit, REQUEST);
      assert.equal(outcome.source_sha, SOURCE);
    `);
  });

  it("walks the recorded chain within budget and refuses every missing property", () => {
    publishScenario(String.raw`
      // A twenty-patch stack plus a formatting and a consumption commit is the widest legal chain.
      const inBudget = world({ length: 22 });
      assert.notEqual(
        await reconcileCheckpointIntent(inBudget.api, RUN, intent(inBudget.candidate)),
        null,
      );
      const overBudget = world({ length: 23 });
      assert.equal(
        await reconcileCheckpointIntent(overBudget.api, RUN, intent(overBudget.candidate)),
        null,
      );
      // Every commit in the chain must carry the recorded set trailer.
      const noSet = world({ length: 3, dropSet: 1 });
      await assert.rejects(
        () => reconcileCheckpointIntent(noSet.api, RUN, intent(noSet.candidate)),
        /lost its set trailer/,
      );
      // The first published commit must still name its patch.
      const noPatch = world({ length: 2, dropPatch: true });
      await assert.rejects(
        () => reconcileCheckpointIntent(noPatch.api, RUN, intent(noPatch.candidate)),
        /lost its patch trailer/,
      );
      // The manifest reloaded at the immutable request commit must match what was recorded.
      const moved = world({ length: 2, badBase: true });
      await assert.rejects(
        () => reconcileCheckpointIntent(moved.api, RUN, intent(moved.candidate)),
        /Recorded checkpoint identity mismatch/,
      );
      // An unreachable candidate stays unconfirmed rather than being republished.
      const diverged = world({ length: 2, head: "ab".repeat(20), compare: "diverged" });
      assert.equal(
        await reconcileCheckpointIntent(diverged.api, RUN, intent(diverged.candidate)),
        null,
      );
      // Nothing was recorded, so there is nothing to reconcile.
      const bare = world({ length: 2 });
      const empty = { ...intent(bare.candidate), candidate_sha: null };
      assert.equal(await reconcileCheckpointIntent(bare.api, RUN, empty), null);
    `);
  });
});
