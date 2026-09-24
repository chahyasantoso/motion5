import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  INBOX_STATES,
  OUTCOME_KINDS,
  applyHandover,
  describeOutcome,
  runProcess,
  type HandoverOutcome,
  type RunOptions,
} from "../../../../../scripts/handover-apply.mjs";
import { HandoverRefusal } from "../../../../../scripts/handover-format.mjs";
import { packHandover } from "../../../../../scripts/handover-pack.mjs";

/**
 * The handover pipeline against real archives and real repositories, issue #487 and ADR-112. A
 * fake of `git am` would measure the fake, so every case builds a temporary repository, packs a
 * series with the producer, and applies it with the consumer. The invariant each case holds is
 * the one the owner's comment asked for: the checkout changes only when the whole series landed
 * on its declared bytes, and the inbox is emptied only then.
 */

const REPO = fileURLToPath(new URL("../../../../../", import.meta.url));
const CLI = join(REPO, "scripts/handover.mjs");
const ENV: NodeJS.ProcessEnv = {
  ...process.env,
  GIT_AUTHOR_NAME: "Handover Test",
  GIT_AUTHOR_EMAIL: "handover@test.invalid",
  GIT_COMMITTER_NAME: "Handover Test",
  GIT_COMMITTER_EMAIL: "handover@test.invalid",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
};
const run = (command: string, args: readonly string[], options: RunOptions = {}) =>
  runProcess(command, args, { ...options, env: ENV });

const cleanup: string[] = [];
afterEach(async () => {
  for (const directory of cleanup.splice(0)) await rm(directory, { recursive: true, force: true });
});

async function temporary(prefix: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  cleanup.push(directory);
  return directory;
}

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: ENV });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}

interface Fixture {
  readonly repo: string;
  readonly base: string;
  readonly tip: string;
  readonly work: string;
}

/** A repository with a base commit and a two-commit series on top of it, under `dir`. */
async function fixture(dir = ""): Promise<Fixture> {
  const repo = await temporary("motion5-handover-repo-");
  const work = await temporary("motion5-handover-work-");
  git(repo, "init", "-q", "-b", "main");
  await mkdir(join(repo, dir), { recursive: true });
  await writeFile(join(repo, ".gitignore"), ".handover/\n");
  await writeFile(join(repo, dir, "a.txt"), "one\ntwo\nthree\nfour\nfive\nsix\nseven\n");
  await writeFile(join(repo, dir, "b.txt"), "bee\n");
  git(repo, "add", "-A");
  git(repo, "commit", "-qm", "base");
  const base = git(repo, "rev-parse", "HEAD");
  await writeFile(join(repo, dir, "a.txt"), "ONE\ntwo\nthree\nfour\nfive\nsix\nseven\n");
  git(repo, "commit", "-qam", "feat: first");
  await writeFile(join(repo, dir, "c.txt"), "sea\n");
  git(repo, "rm", "-q", join(dir, "b.txt"));
  git(repo, "add", join(dir, "c.txt"));
  git(repo, "commit", "-qm", "feat: second");
  const tip = git(repo, "rev-parse", "HEAD");
  await writeFile(join(work, "NOTES.md"), "# Notes\n");
  return { repo, base, tip, work };
}

async function pack(
  f: Fixture,
  name = "motion5-487-handover",
  options: Partial<Parameters<typeof packHandover>[0]> = {},
): Promise<string> {
  const built = await packHandover({
    root: f.repo,
    from: f.base,
    to: f.tip,
    issue: 487,
    notes: join(f.work, "NOTES.md"),
    out: join(f.work, `${name}.zip`),
    run,
    ...options,
  });
  return built.out;
}

/** Puts `zip` in the inbox of a checkout reset to the base. */
async function stage(f: Fixture, zip: string): Promise<string> {
  git(f.repo, "reset", "-q", "--hard", f.base);
  const inbox = join(f.repo, ".handover");
  await mkdir(inbox, { recursive: true });
  await cp(zip, join(inbox, "handover.zip"));
  return inbox;
}

/** Rebuilds `zip` after `change` edits its extracted root folder. */
async function rezip(zip: string, change: (root: string) => Promise<void>): Promise<string> {
  const scratch = await temporary("motion5-handover-rezip-");
  git(scratch, "init", "-q");
  spawnSync("unzip", ["-qq", zip, "-d", scratch]);
  const [root] = (await readdir(scratch)).filter((entry) => entry !== ".git");
  await change(join(scratch, root!));
  const out = join(scratch, "rebuilt.zip");
  const zipped = spawnSync("zip", ["-q", "-r", "-y", "-X", out, root!], { cwd: scratch });
  if (zipped.status !== 0) throw new Error(String(zipped.stderr));
  return out;
}

function apply(f: Fixture, options: { dryRun?: boolean; keep?: boolean } = {}) {
  return applyHandover({ root: f.repo, run, ...options });
}

function refusalKind(outcome: HandoverOutcome): string {
  if (outcome.kind !== "refused") throw new Error(`expected a refusal, got ${outcome.kind}`);
  return outcome.refusal.kind;
}

async function exists(file: string): Promise<boolean> {
  return stat(file).then(
    () => true,
    () => false,
  );
}

describe("applying a handover (ADR-112)", () => {
  it("HO-15 applies the whole series, lands every declared blob, and empties the inbox", async () => {
    const f = await fixture();
    const zip = await pack(f);
    const inbox = await stage(f, zip);
    const outcome = await apply(f);
    expect(outcome).toMatchObject({
      kind: "applied",
      name: "motion5-487-handover",
      inbox: "emptied",
    });
    if (outcome.kind !== "applied") return;
    expect(outcome.commits.map((commit) => commit.subject)).toEqual([
      "feat: first",
      "feat: second",
    ]);
    expect(outcome.reconciled).toEqual([]);
    expect(git(f.repo, "rev-parse", "HEAD^{tree}")).toBe(
      git(f.repo, "rev-parse", `${f.tip}^{tree}`),
    );
    expect(git(f.repo, "status", "--porcelain")).toBe("");
    expect(await readdir(inbox)).toEqual([]);
    expect(git(f.repo, "worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
  });

  it("HO-16 a dry run proves the same series and changes nothing, and --keep keeps the zip", async () => {
    const f = await fixture();
    const inbox = await stage(f, await pack(f));
    const verified = await apply(f, { dryRun: true });
    expect(verified).toMatchObject({ kind: "verified", reconciled: [] });
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(f.base);
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
    const kept = await apply(f, { keep: true });
    expect(kept).toMatchObject({ kind: "applied", inbox: "kept" });
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
  });

  it("HO-17 a conflict leaves the checkout and the inbox untouched and keeps the series", async () => {
    const f = await fixture();
    const inbox = await stage(f, await pack(f));
    await writeFile(join(f.repo, "a.txt"), "uno\ntwo\nthree\nfour\nfive\nsix\nseven\n");
    git(f.repo, "commit", "-qam", "local: conflicting edit");
    const head = git(f.repo, "rev-parse", "HEAD");
    const outcome = await apply(f);
    expect(outcome).toMatchObject({
      kind: "conflict",
      seq: 1,
      file: "patches/0001-feat-first.patch",
    });
    if (outcome.kind !== "conflict") return;
    cleanup.push(join(outcome.patches[0]!, "../../../.."));
    expect(outcome.paths).toEqual(["a.txt"]);
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(head);
    expect(git(f.repo, "status", "--porcelain")).toBe("");
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
    for (const patch of outcome.patches) expect(await exists(patch)).toBe(true);
    expect(git(f.repo, "worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
    const words = describeOutcome(outcome);
    expect(words.status).toBe(1);
    expect(words.lines.join("\n")).toContain(`git am --3way ${outcome.patches.join(" ")}`);
  });

  it("HO-18 on a newer branch, merged paths are reported for review and the rest are proved", async () => {
    const f = await fixture();
    await stage(f, await pack(f));
    await writeFile(join(f.repo, "a.txt"), "one\ntwo\nthree\nfour\nfive\nsix\nSEVEN\n");
    await writeFile(join(f.repo, "d.txt"), "dee\n");
    git(f.repo, "add", "-A");
    git(f.repo, "commit", "-qm", "local: unrelated and non-conflicting edits");
    const outcome = await apply(f);
    expect(outcome).toMatchObject({ kind: "applied", reconciled: ["a.txt"] });
    expect(await readFile(join(f.repo, "a.txt"), "utf8")).toBe(
      "ONE\ntwo\nthree\nfour\nfive\nsix\nSEVEN\n",
    );
    expect(describeOutcome(outcome).lines.join("\n")).toContain("review them:\n  a.txt");
  });

  it("HO-19 refuses an unfit checkout before reading the archive's patches", async () => {
    const f = await fixture();
    const inbox = await stage(f, await pack(f));
    await writeFile(join(f.repo, "untracked.txt"), "x\n");
    expect(refusalKind(await apply(f))).toBe("dirty-tree");
    await rm(join(f.repo, "untracked.txt"));
    git(f.repo, "checkout", "-q", "--detach");
    expect(refusalKind(await apply(f))).toBe("detached-head");
    git(f.repo, "checkout", "-q", "main");
    await mkdir(join(f.repo, ".git", "rebase-merge"));
    expect(await apply(f)).toMatchObject({
      kind: "refused",
      refusal: { kind: "operation-in-progress", operation: "rebase" },
    });
    await rm(join(f.repo, ".git", "rebase-merge"), { recursive: true });
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(f.base);
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
  });

  it("HO-20 proves an absent base by content, and refuses one HEAD neither holds nor carries", async () => {
    const f = await fixture();
    // A handover stacked on another one names a base commit only its author's sandbox holds.
    const stacked = await pack(f, "stacked", { base: "f".repeat(40) });
    await stage(f, stacked);
    expect(await apply(f)).toMatchObject({ kind: "applied", name: "stacked", reconciled: [] });
    await stage(f, stacked);
    await writeFile(join(f.repo, "a.txt"), "one\ntwo\nthree\nfour\nfive\nsix\nSEVEN\n");
    git(f.repo, "commit", "-qam", "local: moves a.txt off the stacked base's content");
    expect(await apply(f)).toMatchObject({
      kind: "refused",
      refusal: { kind: "base-missing", base: "f".repeat(40), path: "a.txt" },
    });
    await rm(join(f.repo, ".handover"), { recursive: true });
    git(f.repo, "checkout", "-q", "-b", "side", f.tip);
    await writeFile(join(f.repo, "e.txt"), "e\n");
    git(f.repo, "add", "e.txt");
    git(f.repo, "commit", "-qm", "side");
    const side = git(f.repo, "rev-parse", "HEAD");
    const unreachable = await pack({ ...f, base: f.tip, tip: side }, "side-base");
    git(f.repo, "checkout", "-q", "main");
    await stage(f, unreachable);
    expect(refusalKind(await apply(f))).toBe("base-not-ancestor");
    await rm(join(f.repo, ".handover"), { recursive: true });
    git(f.repo, "reset", "-q", "--hard", f.tip);
    const wrong = await pack(f, "wrong-base", { base: git(f.repo, "rev-parse", "HEAD") });
    git(f.repo, "reset", "-q", "--hard", f.tip);
    await mkdir(join(f.repo, ".handover"));
    await cp(wrong, join(f.repo, ".handover", "h.zip"));
    expect(await apply(f)).toMatchObject({
      kind: "refused",
      refusal: { kind: "base-disagrees", path: "a.txt" },
    });
  });

  it("HO-21 refuses a tampered, undeclared, unversioned, or linked archive", async () => {
    const f = await fixture();
    const zip = await pack(f);
    const tampered = await rezip(zip, async (root) => {
      const file = join(root, "patches/0002-feat-second.patch");
      await writeFile(file, `${await readFile(file, "utf8")}\n`);
    });
    await stage(f, tampered);
    expect(refusalKind(await apply(f))).toBe("digest-mismatch");
    const stray = await rezip(zip, (root) => writeFile(join(root, "harness.sum"), "x\n"));
    await stage(f, stray);
    expect(await apply(f)).toMatchObject({
      kind: "refused",
      refusal: { kind: "stray-file", path: "harness.sum" },
    });
    const unversioned = await rezip(zip, (root) => rm(join(root, "handover.json")));
    await stage(f, unversioned);
    expect(refusalKind(await apply(f))).toBe("missing-file");
    const linked = await rezip(zip, (root) => symlink("/etc/passwd", join(root, "link")));
    await stage(f, linked);
    expect(refusalKind(await apply(f))).toBe("unsafe-entry");
    const future = await rezip(zip, async (root) => {
      const file = join(root, "handover.json");
      const value = JSON.parse(await readFile(file, "utf8"));
      await writeFile(file, JSON.stringify({ ...value, version: 2 }));
    });
    await stage(f, future);
    expect(refusalKind(await apply(f))).toBe("unsupported-version");
    await stage(f, zip);
    const smuggling = (command: string, args: readonly string[], options: RunOptions = {}) => {
      const result = run(command, args, options);
      if (command === "unzip" && args[0] === "-qq")
        spawnSync("touch", [join(args[3]!, "motion5-487-handover", "NOTES.md.orig")]);
      return result;
    };
    expect(refusalKind(await applyHandover({ root: f.repo, run: smuggling }))).toBe(
      "unreadable-archive",
    );
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(f.base);
  });

  it("HO-22 refuses a series that applies but lands on bytes it did not declare", async () => {
    const f = await fixture();
    const lying = await rezip(await pack(f), async (root) => {
      const file = join(root, "handover.json");
      const value = JSON.parse(await readFile(file, "utf8"));
      value.patches[1].post["c.txt"] = "9".repeat(40);
      await writeFile(file, JSON.stringify(value));
    });
    await stage(f, lying);
    expect(await apply(f)).toMatchObject({
      kind: "post-mismatch",
      seq: 2,
      path: "c.txt",
      expected: "9".repeat(40),
    });
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(f.base);
    expect(await readdir(join(f.repo, ".handover"))).toEqual(["handover.zip"]);
  });

  it("HO-23 reads the inbox as empty, ambiguous, or foreign before anything else", async () => {
    const f = await fixture();
    expect(await apply(f)).toEqual({ kind: "nothing-to-do" });
    expect(await exists(join(f.repo, ".handover"))).toBe(true);
    const zip = await pack(f);
    const inbox = await stage(f, zip);
    await cp(zip, join(inbox, "second.zip"));
    expect(refusalKind(await apply(f))).toBe("ambiguous-inbox");
    await rm(join(inbox, "second.zip"));
    await mkdir(join(inbox, "extracted"));
    expect(refusalKind(await apply(f))).toBe("foreign-entry");
  });
});

describe("what a handover may not decide (ADR-112)", () => {
  it("HO-28 refuses a patch that changes a path its manifest does not declare", async () => {
    const f = await fixture();
    await writeFile(join(f.repo, "a.txt"), "ONE\ntwo\nthree\nfour\nfive\nsix\nseven\n");
    await writeFile(join(f.repo, "secret.txt"), "smuggled\n");
    git(f.repo, "reset", "-q", "--soft", f.base);
    git(f.repo, "add", "-A");
    git(f.repo, "commit", "-qm", "feat: declares one path and carries two");
    const smuggler = await rezip(
      await pack({ ...f, tip: git(f.repo, "rev-parse", "HEAD") }),
      async (root) => {
        const file = join(root, "handover.json");
        const value = JSON.parse(await readFile(file, "utf8"));
        delete value.patches[0].pre["secret.txt"];
        delete value.patches[0].post["secret.txt"];
        await writeFile(file, JSON.stringify(value));
      },
    );
    await stage(f, smuggler);
    expect(await apply(f)).toEqual({
      kind: "undeclared-change",
      name: "motion5-487-handover",
      seq: 1,
      paths: ["secret.txt"],
    });
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(f.base);
    expect(await exists(join(f.repo, "secret.txt"))).toBe(false);
    expect(await readdir(join(f.repo, ".handover"))).toEqual(["handover.zip"]);
  });

  it("HO-29 runs no repository hook and reads no recipient setting that changes the result", async () => {
    const f = await fixture();
    git(f.repo, "checkout", "-q", "-b", "trailing", f.base);
    await writeFile(join(f.repo, "b.txt"), "bee   \n");
    git(f.repo, "commit", "-qam", "feat: adds trailing whitespace");
    const trailing = git(f.repo, "rev-parse", "HEAD");
    git(f.repo, "checkout", "-q", "main");
    const zip = await pack({ ...f, tip: trailing }, "trailing");
    const hooks = join(f.work, "hooks");
    const marker = join(f.work, "hook-ran");
    await mkdir(hooks);
    for (const hook of [
      "applypatch-msg",
      "pre-applypatch",
      "post-applypatch",
      "post-checkout",
      "post-merge",
      "post-rewrite",
    ])
      await writeFile(join(hooks, hook), `#!/bin/sh\necho ${hook} >> ${marker}\n`, { mode: 0o755 });
    git(f.repo, "config", "core.hooksPath", hooks);
    git(f.repo, "config", "apply.whitespace", "error");
    git(f.repo, "config", "commit.gpgSign", "true");
    git(f.repo, "config", "user.signingKey", "no-such-key");
    await stage(f, zip);
    expect(await apply(f)).toMatchObject({ kind: "applied", name: "trailing" });
    expect(await exists(marker)).toBe(false);
    expect(await readFile(join(f.repo, "b.txt"), "utf8")).toBe("bee   \n");
  });
});

describe("packing a handover (ADR-112)", () => {
  it("HO-30 refuses a range that is not a series on its start, an empty commit, and an in-tree output", async () => {
    const f = await fixture();
    git(f.repo, "checkout", "-q", "-b", "sibling", f.base);
    await writeFile(join(f.repo, "s.txt"), "s\n");
    git(f.repo, "add", "s.txt");
    git(f.repo, "commit", "-qm", "sibling");
    const sibling = git(f.repo, "rev-parse", "HEAD");
    git(f.repo, "commit", "-q", "--allow-empty", "-m", "empty");
    const empty = git(f.repo, "rev-parse", "HEAD");
    git(f.repo, "checkout", "-q", "main");
    const out = join(f.work, "refused.zip");
    await expect(pack({ ...f, base: sibling, tip: f.tip }, "refused")).rejects.toThrow(
      "is not an ancestor of",
    );
    await expect(pack({ ...f, base: f.base, tip: empty }, "refused")).rejects.toThrow(
      "changes nothing",
    );
    expect(await exists(out)).toBe(false);
    await expect(pack(f, "inside", { out: join(f.repo, "inside.zip") })).rejects.toThrow(
      "is inside the checkout",
    );
    expect(await exists(join(f.repo, "inside.zip"))).toBe(false);
    await mkdir(join(f.repo, ".handover"));
    const inbox = await pack(f, "inbox", { out: join(f.repo, ".handover", "inbox.zip") });
    expect(inbox).toBe(join(f.repo, ".handover", "inbox.zip"));
    git(f.repo, "reset", "-q", "--hard", f.base);
    expect(await apply(f)).toMatchObject({ kind: "applied", name: "inbox", inbox: "emptied" });
  });

  it("HO-24 cuts a bundle only from the base, and the bundle it cuts verifies", async () => {
    const f = await fixture();
    await expect(pack(f, "sandbox-base", { base: "f".repeat(40), bundle: true })).rejects.toThrow(
      "would need a commit no one else holds",
    );
    const zip = await pack(f, "with-bundle", { bundle: true });
    expect(git(f.repo, "for-each-ref", "refs/motion5-handover")).toBe("");
    await stage(f, zip);
    expect(await apply(f)).toMatchObject({ kind: "applied", name: "with-bundle" });
  });

  it("HO-25 carries a checkpoint store only when it ends where the series ends", async () => {
    const f = await fixture("docs/");
    const store = join(f.work, "cp001");
    await mkdir(store);
    const diff = "diff bytes the handover route never applies\n";
    await writeFile(join(store, "001-series.diff"), diff);
    const blob = (revision: string, file: string) =>
      git(f.repo, "rev-parse", `${revision}:docs/${file}`);
    const pre = {
      "docs/a.txt": blob(f.base, "a.txt"),
      "docs/b.txt": blob(f.base, "b.txt"),
      "docs/c.txt": null,
    };
    const post = {
      "docs/a.txt": blob(f.tip, "a.txt"),
      "docs/b.txt": null,
      "docs/c.txt": blob(f.tip, "c.txt"),
    };
    const seal = (ends: Record<string, string | null>) =>
      writeFile(
        join(store, "manifest.json"),
        JSON.stringify({
          version: 1,
          checkpoint: "cp001",
          base: f.base,
          allow: ["docs/"],
          patches: [
            {
              seq: 1,
              file: "001-series.diff",
              sha256: createHash("sha256").update(diff).digest("hex"),
              message: "feat: series",
              pre,
              post: ends,
            },
          ],
        }),
      );
    await seal(post);
    const zip = await pack(f, "store", { checkpoint: store });
    await stage(f, zip);
    expect(await apply(f)).toMatchObject({ kind: "applied", name: "store" });
    await seal({ ...post, "docs/c.txt": blob(f.base, "a.txt") });
    const refusal = await pack(f, "store", { checkpoint: store }).catch((error: unknown) => error);
    expect(refusal).toBeInstanceOf(HandoverRefusal);
    expect((refusal as HandoverRefusal).refusal.kind).toBe("checkpoint-disagrees");
  });
});

describe("the outcome and the command line (ADR-112)", () => {
  it("HO-26 words every outcome and inbox state with one exit status and refuses unknowns", () => {
    const applied = (inbox: (typeof INBOX_STATES)[number]): HandoverOutcome => ({
      kind: "applied",
      name: "n",
      commits: [],
      reconciled: ["r"],
      inbox,
    });
    const samples: HandoverOutcome[] = [
      { kind: "nothing-to-do" },
      { kind: "refused", refusal: { kind: "detached-head" } },
      { kind: "conflict", name: "n", seq: 1, file: "f", paths: [], patches: ["p"] },
      { kind: "undeclared-change", name: "n", seq: 1, paths: ["secret.txt"] },
      { kind: "post-mismatch", name: "n", seq: 1, path: "p", expected: null, observed: "o" },
      { kind: "already-applied", name: "n", seq: 1, file: "f" },
      {
        kind: "verified",
        name: "n",
        commits: [{ sha: "a".repeat(40), subject: "s" }],
        reconciled: [],
      },
      applied("emptied"),
    ];
    expect(samples.map((sample) => sample.kind)).toEqual([...OUTCOME_KINDS]);
    expect(samples.map((sample) => describeOutcome(sample).status)).toEqual([
      0, 1, 1, 1, 1, 1, 0, 0,
    ]);
    const words = INBOX_STATES.map((state) => describeOutcome(applied(state)).lines.at(-1));
    expect(new Set(words).size).toBe(INBOX_STATES.length);
    expect(words[2]).toContain("do not apply the zip again");
    expect(() => describeOutcome({ kind: "maybe" } as unknown as HandoverOutcome)).toThrow(
      "Unhandled OUTCOME_KINDS",
    );
    expect(() =>
      describeOutcome(applied("lost" as unknown as (typeof INBOX_STATES)[number])),
    ).toThrow("Unhandled INBOX_STATES");
  });

  it("HO-27 npm run patches is the apply command, and the inbox is ignored by Git", async () => {
    const manifest = JSON.parse(await readFile(join(REPO, "package.json"), "utf8"));
    expect(manifest.scripts.patches).toBe("node scripts/handover.mjs apply");
    expect((await readFile(join(REPO, ".gitignore"), "utf8")).split("\n")).toContain(".handover/");
    const f = await fixture();
    await stage(f, await pack(f));
    const cli = (...args: string[]) =>
      spawnSync(process.execPath, [CLI, ...args], { cwd: f.repo, encoding: "utf8", env: ENV });
    const dry = cli("apply", "--dry-run");
    expect(dry.status).toBe(0);
    expect(dry.stdout).toContain("applies cleanly as 2 commit(s)");
    const applied = cli("apply");
    expect(applied.status).toBe(0);
    expect(applied.stdout).toContain(".handover/ has been emptied.");
    expect(cli("apply").stdout).toContain("Nothing to apply");
    expect(cli("unknown").status).toBe(2);
    expect(cli("apply", "--force").status).toBe(1);
    expect(cli("apply", "typo").status).toBe(1);
  });
});

describe("what the review of #488 found (ADR-112)", () => {
  it("HO-31 a patch already on the branch stops the series by name instead of reading the commit before it", async () => {
    const f = await fixture();
    const zip = await pack(f);
    await stage(f, zip);
    expect(await apply(f, { keep: true })).toMatchObject({ kind: "applied", inbox: "kept" });
    // Applying the kept zip again: the base is an ancestor, every path is reconciled, and
    // `git am --3way` exits zero on each patch without committing anything.
    const head = git(f.repo, "rev-parse", "HEAD");
    const again = await apply(f, { keep: true });
    expect(again).toEqual({
      kind: "already-applied",
      name: "motion5-487-handover",
      seq: 1,
      file: "patches/0001-feat-first.patch",
    });
    expect(describeOutcome(again).status).toBe(1);
    // An unrelated commit on top used to be read back as the patch's undeclared change.
    await writeFile(join(f.repo, "unrelated.txt"), "u\n");
    git(f.repo, "add", "unrelated.txt");
    git(f.repo, "commit", "-qm", "local: unrelated");
    const unrelated = git(f.repo, "rev-parse", "HEAD");
    expect(await apply(f)).toMatchObject({ kind: "already-applied", seq: 1 });
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(unrelated);
    expect(git(f.repo, "status", "--porcelain")).toBe("");
    expect(await readdir(join(f.repo, ".handover"))).toEqual(["handover.zip"]);
    expect(git(f.repo, "rev-list", "--count", `${head}..HEAD`)).toBe("1");
    expect(git(f.repo, "worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
  });

  it("HO-32 pack refuses a gitlink rather than declaring a commit id as a blob", async () => {
    const f = await fixture();
    const sub = await temporary("motion5-handover-sub-");
    git(sub, "init", "-q", "-b", "main");
    await writeFile(join(sub, "s.txt"), "s\n");
    git(sub, "add", "s.txt");
    git(sub, "commit", "-qm", "sub");
    git(f.repo, "checkout", "-q", f.tip);
    git(
      f.repo,
      "update-index",
      "--add",
      "--cacheinfo",
      `160000,${git(sub, "rev-parse", "HEAD")},sub`,
    );
    git(f.repo, "commit", "-qm", "feat: gitlink");
    const gitlink = git(f.repo, "rev-parse", "HEAD");
    git(f.repo, "checkout", "-q", "main");
    const out = join(f.work, "gitlink.zip");
    await expect(pack({ ...f, tip: gitlink }, "gitlink")).rejects.toThrow(
      "changes the submodule sub; a handover carries blobs, not gitlinks",
    );
    expect(await exists(out)).toBe(false);
  });

  it("HO-33 a checkout that moves while the series is proved is refused, and nothing is lost", async () => {
    const f = await fixture();
    const inbox = await stage(f, await pack(f));
    let moved = "";
    // The port commits on the real checkout just before the fast-forward, as a second process would.
    const racing = (command: string, args: readonly string[], options: RunOptions = {}) => {
      if (command === "git" && args.includes("--ff-only") && moved === "") {
        spawnSync(
          "sh",
          ["-c", "echo r > racing.txt && git add racing.txt && git commit -qm racing"],
          {
            cwd: f.repo,
            env: ENV,
          },
        );
        moved = git(f.repo, "rev-parse", "HEAD");
      }
      return run(command, args, options);
    };
    const outcome = await applyHandover({ root: f.repo, run: racing });
    expect(outcome).toEqual({
      kind: "refused",
      refusal: { kind: "head-moved", expected: f.base, observed: moved },
    });
    expect(describeOutcome(outcome).lines[0]).toContain("run the command again");
    expect(git(f.repo, "rev-parse", "HEAD")).toBe(moved);
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
    expect(git(f.repo, "worktree", "list", "--porcelain").match(/^worktree /gm)).toHaveLength(1);
    // A checkout edited in place under the same race is refused as dirty, not thrown.
    git(f.repo, "reset", "-q", "--hard", f.base);
    const editing = (command: string, args: readonly string[], options: RunOptions = {}) => {
      if (command === "git" && args.includes("--ff-only"))
        spawnSync("sh", ["-c", "echo edited > a.txt"], { cwd: f.repo });
      return run(command, args, options);
    };
    expect(await applyHandover({ root: f.repo, run: editing })).toEqual({
      kind: "refused",
      refusal: { kind: "dirty-tree", paths: ["a.txt"] },
    });
    expect(await readdir(inbox)).toEqual(["handover.zip"]);
    // An edit the fast-forward does not touch is the other process's, and Git carries it: the
    // series still lands on its proved tip and the edit survives rather than being rolled back.
    git(f.repo, "checkout", "-q", "--", "a.txt");
    const unrelated = (command: string, args: readonly string[], options: RunOptions = {}) => {
      if (command === "git" && args.includes("--ff-only"))
        spawnSync("sh", ["-c", "echo mine > mine.txt"], { cwd: f.repo });
      return run(command, args, options);
    };
    expect(await applyHandover({ root: f.repo, run: unrelated })).toMatchObject({
      kind: "applied",
    });
    expect(git(f.repo, "rev-parse", "HEAD^{tree}")).not.toBe(
      git(f.repo, "rev-parse", `${f.base}^{tree}`),
    );
    expect(git(f.repo, "diff", "--stat", f.tip, "HEAD")).toBe("");
    expect(await readFile(join(f.repo, "mine.txt"), "utf8")).toBe("mine\n");
  });

  it("HO-34 the first handover applies on a checkout that does not ignore the inbox yet", async () => {
    const f = await fixture();
    const zip = await pack(f);
    // The recipient's branch predates the ignore rule, so the zip is an untracked file.
    await stage(f, zip);
    await writeFile(join(f.repo, ".gitignore"), "");
    git(f.repo, "commit", "-qam", "local: no ignore rule yet");
    expect(git(f.repo, "status", "--porcelain", "--untracked-files=all")).toBe(
      "?? .handover/handover.zip",
    );
    expect(await apply(f)).toMatchObject({ kind: "applied", inbox: "emptied" });
    // Only the inbox is exempt: an untracked file anywhere else is still dirt.
    await mkdir(join(f.repo, ".handover"), { recursive: true });
    await cp(zip, join(f.repo, ".handover", "handover.zip"));
    await writeFile(join(f.repo, "stray.txt"), "s\n");
    expect(await apply(f)).toEqual({
      kind: "refused",
      refusal: { kind: "dirty-tree", paths: ["stray.txt"] },
    });
  });
});
